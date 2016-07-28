---
layout: blog
title: Profiling of DB-Related C# Applications
excerpt: At BASTA 2014 I will do a full-day C# workshop. One of the topics will be profiling. In this blog article I share the code of my demo and describe the scenario I will cover.
author: Rainer Stropek
date: 2014-09-22
bannerimage: 
lang: en
tags: [.NET,Azure,C#]
permalink: /devblog/2014/09/22/Profiling-of-DB-Related-C-Applications
---

<p>At BASTA 2014 I will do a <a href="http://www.software-architects.com/devblog/2014/09/21/BASTA-2014-C-Fitness" target="_blank">full-day C# workshop</a>. One of the topics will be profiling. In this blog article I share the code of my demo and describe the scenario I will cover.</p><p class="showcase">You can download the entire sample from <a href="https://github.com/rstropek/Samples/tree/master/ProfilingWorkshop" target="_blank">my GitHub Samples Repository</a>.</p><h2>The Scenario</h2><p>We want to develop a simple REST web API for searching customers in <a href="http://msftdbprodsamples.codeplex.com/" target="_blank">Microsoft's Adventure Works DB</a>. Imagine we first prototyped the underlying query in SQL Management Studio:</p>{% highlight sql %}DECLARE @customerName NVARCHAR(50)
SET @customername = 'Smith'
 
DECLARE @AddressTypeID INT
SELECT @AddressTypeID = AddressTypeID FROM Person.AddressType WHERE Name = 'Main Office';

PRINT 'Execution start time: ' + CAST(GETDATE() AS VARCHAR(50));

SELECT    p.LastName, p.FirstName, a.AddressLine1, a.AddressLine2, a.City, cr.Name as CountryRegionName
FROM    Person.Person p
        INNER JOIN Person.BusinessEntityContact bec on p.BusinessEntityID = bec.PersonID
        INNER JOIN Person.BusinessEntity be on bec.BusinessEntityID = be.BusinessEntityID
        LEFT JOIN Person.BusinessEntityAddress bea on bea.BusinessEntityID = be.BusinessEntityID
            AND bea.AddressTypeID = @AddressTypeID
        LEFT JOIN Person.Address a on bea.AddressID = a.AddressID
        LEFT JOIN Person.StateProvince sp on a.StateProvinceID = sp.StateProvinceID
        LEFT JOIN Person.CountryRegion cr on sp.CountryRegionCode = cr.CountryRegionCode
WHERE    p.FirstName LIKE '%' + @customerName + '%' OR p.LastName LIKE '%' + @customerName + '%' AND
        5000 < (
            SELECT    SUM(sod.OrderQty * sod.UnitPrice * (1 - sod.UnitPriceDiscount)) AS Revenue
            FROM    Sales.Customer c
                    INNER JOIN Sales.SalesOrderHeader soh on c.CustomerID = soh.CustomerID
                    INNER JOIN Sales.SalesOrderDetail sod on soh.SalesOrderID = sod.SalesOrderID
            WHERE    c.PersonID = p.BusinessEntityID)
ORDER BY p.LastName, p.FirstName, cr.Name, a.City;

PRINT 'Execution start time: ' + CAST(GETDATE() AS VARCHAR(50));{% endhighlight %}<p>As you can see, the query isn't trivial. For test purposes, I installed the Adventure Works sample DB in the smallest <a href="http://azure.microsoft.com/en-us/pricing/details/sql-database/" target="_blank">Microsoft Azure SQL Database</a> (<em>Basic</em> pricing tier).</p><p class="showcase">
  <a href="http://azure.microsoft.com" target="_blank">Microsoft Azure</a> is an awesome platform for testing your applications. You can get ready-made VMs with latest releases of Visual Studio (including VS14 CTP). Just use your MSDN account and your Visual Studio in the cloud is even correctly licensed. During the workshop, I will do all of my demos based on Azure VMs and Azure SQL Databases.</p><p>The web API should be running in a self-hosted command line EXE using Owin/Katana. Customer searches are performed with URLs like <em>http://localhost:12345/api/BasicSearch?customerName=Lee</em>.</p><h2>Basic Implementation</h2><p>If you want to follow along, start by creating a command line EXE with the following NuGet packages:</p><ul>
  <li>Microsoft.AspNet.WebApi.Owin</li>
  <li>Microsoft.Owin.Host.HttpListener</li>
  <li>Microsoft.Owin.Hosting</li>
  <li>Dapper (we will need that one later)</li>
</ul><p>Next, create the startup code:</p>{% highlight c# %}using AdoNetPerfProfiling.Controller;
using Microsoft.Owin.Hosting;
using Owin;
using System;
using System.IO;
using System.Reflection;
using System.Web.Http;

namespace AdoNetPerfProfiling
{
    class Program
    {
        static void Main(string[] args)
        {
            using (WebApp.Start<Startup>("http://localhost:12345"))
            {
                Console.WriteLine("Listening on port 12345. Press any key to quit.");
                Console.ReadLine();
            }
        }
    }

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Setup routes
            var config = new HttpConfiguration();

            // Removing XML formatter, we just want to support JSON
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            Startup.SetupWebApiRoutes(config);
            app.UseWebApi(config);
        }

        private static void SetupWebApiRoutes(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "webapi",
                routeTemplate: "api/{controller}",
                defaults: new { customerName = RouteParameter.Optional }
            );
        }
    }
}{% endhighlight %}<p>With that, we are ready to go. So let's create a very basic implementation:</p>{% highlight c# %}using AdoNetPerfProfiling.DataAccess;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;

namespace AdoNetPerfProfiling.Controller
{
    /// <summary>
    /// Trivial implementation of for a customer search service
    /// </summary>
    public class BasicSearchController : ApiController
    {
        /// <summary>
        /// HTTP Getter
        /// </summary>
        /// <remarks>
        /// Note that this is a very trivial implementation with lots of problems. One of the most important ones is
        /// that the function is sync. We will have to make it async later.
        /// </remarks>
        [HttpGet]
        public IHttpActionResult Get([FromUri]string customerName)
        {
            try
            {
                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["AdventureWorks"].ConnectionString))
                {
                    connection.Open();

                    var addressTypePrimary = BasicSearchController.FetchMainOfficeAddressTypeID(connection);

                    var result = new DataTable();
                    BasicSearchController.QueryCustomers(connection, customerName, addressTypePrimary, true, result);

                    var jsonResult = BasicSearchController.ConvertToJson(result.Rows.Cast<DataRow>());
                    return Ok(jsonResult);
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Helper function to get address type ID of 'Main Office'
        /// </summary>
        internal static int FetchMainOfficeAddressTypeID(SqlConnection connection)
        {
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "SELECT AddressTypeID FROM Person.AddressType WHERE Name = 'Main Office'";
                return (int)command.ExecuteScalar();
            }
        }

        /// <summary>
        /// Helper function to read all customers and put them into a data table
        /// </summary>
        internal static void QueryCustomers(SqlConnection connection, string customerName, int addressTypeID, bool includeNameFilter,  DataTable result)
        {
            using (var command = connection.CreateCommand())
            {
                // Note that we use T4 to generate SQL
                command.CommandText = new SelectBuilder() { IncludeNameFilter = includeNameFilter }.TransformText();
                command.CommandTimeout = 600;

                // The following line is a problem. It does not specify size for NVARCHAR -> SQL Server cannot reuse exec plan.
                command.Parameters.AddWithValue("@customerName", customerName);
                // command.Parameters.Add("@customerName", SqlDbType.NVarChar, 50).Value = customerName;

                command.Parameters.AddWithValue("@AddressTypeID", addressTypeID);
                using (var adapter = new SqlDataAdapter(command))
                {
                    adapter.Fill(result);
                }
            }
        }

        /// <summary>
        /// Helper function to convert a collection of data rows into JSON result
        /// </summary>
        /// <remarks>
        /// Note that this implementation isn't very clever. It has a dependency on DataRow although it's core
        /// logic does only use a very tiny bit of DataRow's functionality. Bad design. We have to re-think this later.
        /// </remarks>
        private static JToken ConvertToJson(IEnumerable<DataRow> rows)
        {
            var jsonResult = new JArray();
            foreach (var row in rows)
            {
                var jsonRow = new JObject(
                    new JProperty("LastName", row["LastName"]),
                    new JProperty("FirstName", row["FirstName"]),
                    new JProperty("AddressLine1", row["AddressLine1"]),
                    new JProperty("AddressLine2", row["AddressLine2"]),
                    new JProperty("City", row["City"]),
                    new JProperty("CountryRegionName", row["CountryRegionName"]));
                jsonResult.Add(jsonRow);
            }

            return jsonResult;
        }
    }
}{% endhighlight %}<p>Note that the algorithm shown above uses a T4 template to generate the SQL SELECT statement:</p>{% highlight sql %}<#@ template language="C#" #>

-- The following line is a problem. It changes during every SQL execution. Therefore, SQL Server
-- cannot do proper exec plan caching.
PRINT 'Execution start time: <#= DateTime.UtcNow.ToString("O") #>';

SELECT    p.LastName, p.FirstName, a.AddressLine1, a.AddressLine2, a.City, cr.Name as CountryRegionName
        -- UPPER(p.LastName) AS UpperLastName, UPPER(p.FirstName) AS UpperFirstName
FROM    Person.Person p
        INNER JOIN Person.BusinessEntityContact bec on p.BusinessEntityID = bec.PersonID
        INNER JOIN Person.BusinessEntity be on bec.BusinessEntityID = be.BusinessEntityID
        LEFT JOIN Person.BusinessEntityAddress bea on bea.BusinessEntityID = be.BusinessEntityID
            AND bea.AddressTypeID = @AddressTypeID
        LEFT JOIN Person.Address a on bea.AddressID = a.AddressID
        LEFT JOIN Person.StateProvince sp on a.StateProvinceID = sp.StateProvinceID
        LEFT JOIN Person.CountryRegion cr on sp.CountryRegionCode = cr.CountryRegionCode
WHERE    <# if (this.IncludeNameFilter) { #>p.FirstName LIKE '%' + @customerName + '%' OR p.LastName LIKE '%' + @customerName + '%' AND <# } #>
        5000 < (
            SELECT    SUM(sod.OrderQty * sod.UnitPrice * (1 - sod.UnitPriceDiscount)) AS Revenue
            FROM    Sales.Customer c
                    INNER JOIN Sales.SalesOrderHeader soh on c.CustomerID = soh.CustomerID
                    INNER JOIN Sales.SalesOrderDetail sod on soh.SalesOrderID = sod.SalesOrderID
            WHERE    c.PersonID = p.BusinessEntityID)
ORDER BY p.LastName, p.FirstName, cr.Name, a.City;

PRINT 'Execution start time: <#= DateTime.UtcNow.ToString("O") #>';{% endhighlight %}<p>Take a second and review our first implementation. Do you find flaws? Do you think you have ideas for enhancing the algorithm? During the workshop I demo the following topics. I encourage you to do the same when working through this article.</p><ol>
  <li>Create a Visual Studio Web and Load test to generate a standardized usage scenario (the test is in my GitHub repo, too)</li>
  <li>Run the load test while profiling CPU in Visual Studio. Do we have a CPU problem?</li>
  <li>Collect a SQL statement with Visual Studio IntelliTrace, run it in SQL Management Studio and analyze it (how long does it take? How does the execution plan look like?)</li>
  <li>Check if SQL Server is properly caching execution plans. Here is the query with which you can do that:</li>
</ol>{% highlight sql %}-- Analyze performance of last queries
-- Based on http://msdn.microsoft.com/en-us/library/ff394114.aspx
SELECT top 1000 last_execution_time, execution_count, total_worker_time, last_worker_time, total_rows, statement_text
FROM 
    (SELECT QS.*, SUBSTRING(ST.text, (QS.statement_start_offset/2) + 1, 
        ((CASE statement_end_offset 
            WHEN -1 THEN DATALENGTH(st.text) 
            ELSE QS.statement_end_offset 
          END - QS.statement_start_offset)/2) + 1) AS statement_text
     FROM sys.dm_exec_query_stats AS QS
     CROSS APPLY sys.dm_exec_sql_text(QS.sql_handle) as ST) as query_stats
order by last_execution_time desc{% endhighlight %}<p>You will probably find out that we do not have a CPU problem at all. The DB query is simply too slow. Additionally, the execution plan is not cached. So change the T4 template and the algorithm to make it cache execution plans. That solves our perf problem to a certain degree.</p><h2>Caching</h2><p>In our scenario we assume that we cannot make the DB faster (in practice it would only take a few mouse clicks thanks to Microsoft Azure SQL Database different pricing tiers). So we have to re-think our approach. Let's just cache the result and look for customers in memory. Our first approach uses ADO.NET's <em>DataView</em> mechanism:</p><p>
  {% highlight c# %}using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;

namespace AdoNetPerfProfiling.Controller
{
    /// <summary>
    /// Trying to enhance performance by caching query result
    /// </summary>
    public class CachingSearchController : ApiController
    {
        private static DataTable customerCache = null;
        private static object cacheLockObject = new object();

        [HttpGet]
        public IHttpActionResult Get([FromUri]string customerName)
        {
            // Note double null-checking here. Reason: null-check is much faster than locking.
            if (customerCache == null)
            {
                lock (cacheLockObject)
                {
                    if (customerCache == null)
                    {
                        using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["AdventureWorks"].ConnectionString))
                        {
                            connection.Open();

                            var addressTypePrimary = BasicSearchController.FetchMainOfficeAddressTypeID(connection);

                            CachingSearchController.customerCache = new DataTable();
                            BasicSearchController.QueryCustomers(connection, customerName, addressTypePrimary, false, customerCache);
                        }
                    }
                }
            }

            // This approach uses an ADO.NET DataView to query the cache.
            var view = new DataView(CachingSearchController.customerCache);
            view.RowFilter = "LastName LIKE '%" + customerName + "%' OR FirstName LIKE '%" + customerName + "%'";
            return Ok(CachingSearchController.ConvertToJson(view.Cast<DataRowView>(), (row, colName) => row[colName]));

            // This approach replaces ADO.NET DataView with (stupid) LINQ.
            //var rows = CachingSearchController.customerCache.Rows.Cast<DataRow>().ToArray();
            //var tempResult = rows.Where(
            //    r => r["LastName"].ToString().ToUpper().Contains(customerName.ToUpper())
            //        || r["FirstName"].ToString().ToUpper().Contains(customerName.ToUpper())).ToArray();
            //return Ok(CachingSearchController.ConvertToJson(tempResult, (row, col) => row[col]));

            // And now with less stupid LINQ.
            //var customerNameUppercase = customerName.ToUpper();
            //var lastNameOrdinal = CachingSearchController.customerCache.Columns.IndexOf("UpperLastName");
            //var firstNameOrdinal = CachingSearchController.customerCache.Columns.IndexOf("UpperFirstName");
            //var tempResult = CachingSearchController.customerCache
            //    .Rows
            //    .Cast<DataRow>()
            //    .Where(r => r[lastNameOrdinal].ToString().Contains(customerNameUppercase)
            //            || r[firstNameOrdinal].ToString().Contains(customerNameUppercase));
            //return Ok(CachingSearchController.ConvertToJson(tempResult, (row, col) => row[col]));
        }

        /// <summary>
        /// Helper function to convert a collection of data rows into JSON result
        /// </summary>
        /// <remarks>
        /// Much better implementation than in BasicSearch. Uses functional program to make algorithm general.
        /// </remarks>
        internal static JToken ConvertToJson<T>(IEnumerable<T> rows, Func<T, string, object> getColumn)
        {
            var jsonResult = new JArray();
            foreach (var row in rows)
            {
                var jsonRow = new JObject(
                    new JProperty("LastName", getColumn(row, "LastName")),
                    new JProperty("FirstName", getColumn(row, "FirstName")),
                    new JProperty("AddressLine1", getColumn(row, "AddressLine1")),
                    new JProperty("AddressLine2", getColumn(row, "AddressLine2")),
                    new JProperty("City", getColumn(row, "City")),
                    new JProperty("CountryRegionName", getColumn(row, "CountryRegionName")));
                jsonResult.Add(jsonRow);
            }

            return jsonResult;
        }
    }
}{% endhighlight %}Before you start profiling, ask yourself whether you think that the new approach will be faster? Does it still have flaws?</p><p>During the workshop I demo the following topics:</p><ol>
  <li>CPU profiling in Visual Studio</li>
  <li>CPU profiling with PerfView</li>
  <li>CPU profiling with Red Gate's <a href="http://www.red-gate.com/products/dotnet-development/ants-performance-profiler/" target="_blank">ANTS Performance Profiler</a></li>
</ol><p>Seems that <em>DataView</em> is a performance problem, right? So let's replace it with LINQ. Experiment with the different search algorithms in the sample shown above (line 42 and following). During the workshop I use them for the following discussions:</p><ol>
  <li>How can you destroy LINQ's performance with poor programming?</li>
  <li>Garbage Collector profiling with PerfView</li>
  <li>Profiling Windows system calls with PerfView</li>
</ol><h2>POCO Approach</h2><p>Seems that caching ADO.NET data isn't very efficient, right? So let's change that to POCOs. Note the use of the light-weight OR mapper <a href="https://github.com/StackExchange/dapper-dot-net" target="_blank"><em>Dapper</em></a>:</p>{% highlight c# %}using AdoNetPerfProfiling.DataAccess;
using Dapper;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;

namespace AdoNetPerfProfiling.Controller
{
    /// <summary>
    /// Trying to enhance performance by caching query result
    /// </summary>
    public class CachingPocoSearchController : ApiController
    {
        internal class CustomerResult
        {
            public string LastName { get; set; }
            public string FirstName { get; set; }
            public string AddressLine1 { get; set; }
            public string AddressLine2 { get; set; }
            public string City { get; set; }
            public string CountryRegionName { get; set; }
            public string UpperLastName { get; set; }
            public string UpperFirstName { get; set; }
        }

        private static CustomerResult[] customerCache = null;
        private static object cacheLockObject = new object();

        [HttpGet]
        public IHttpActionResult Get([FromUri]string customerName)
        {
            if (customerCache == null)
            {
                lock (cacheLockObject)
                {
                    if (customerCache == null)
                    {
                        using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["AdventureWorks"].ConnectionString))
                        {
                            connection.Open();

                            var addressTypePrimary = BasicSearchController.FetchMainOfficeAddressTypeID(connection);

                            CachingPocoSearchController.customerCache = connection.Query<CustomerResult>(
                                new SelectBuilder() { IncludeNameFilter = false }.TransformText(),
                                new { AddressTypeID = addressTypePrimary })
                                .ToArray();
                        }
                    }
                }
            }

            var customerNameUppercase = customerName.ToUpper();
            var tempResult = CachingPocoSearchController.customerCache
                .Where(r => r.UpperFirstName.Contains(customerNameUppercase) || r.UpperLastName.Contains(customerNameUppercase));
            return Ok(tempResult);
        }
    }
}{% endhighlight %}<p>Wow, the code looks much cleaner now and it is shorter. But is it faster? Try it our yourself using the load test and a profiler of your choice.</p><p>Have fun!</p>