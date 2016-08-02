---
layout: blog
title: SQLPASS Session about Windows Azure Table Storage
excerpt: Today I will do a session in a SQLPASS community meeting in Vienna about Windows Azure Table Storage. The audience mainly consists of SQL experts and I have been invited to describe similarities and differences of SQL Azure and Table Storage. In this article I want to summarize important links that people who are interested in the details could use.
author: Rainer Stropek
date: 2013-09-19
bannerimage: 
bannerimagesource: 
lang: en
tags: [Azure,SQL]
permalink: /devblog/2013/09/19/SQLPASS-Session-about-Windows-Azure-Table-Storage
---

<p>Today I will do a session in a <a href="http://www.sqlpass.org" target="_blank">SQLPASS</a> community <a href="http://austria.sqlpass.org/" target="_blank">meeting in Vienna</a> about Windows Azure Table Storage. The audience mainly consists of SQL experts and I have been invited to describe similarities and differences of SQL Azure and Table Storage. In this article I want to summarize important links that people who are interested in the details could use. Additionally I publish the source code of the sample that I am going to show.</p><p>Note that the sample is built with the hot and new 2.1 release of Azure's .NET Storage Client. Therefore it can use nice features like async API, building queries with IQueryable, Shared Access Signatures for table storage, etc.</p><p>Here are some photos from the event (click to enlarge). You can view the photos in full resolution <a href="http://www.flickr.com/photos/rainerstropek/" target="_blank">in my Flickr album</a>.</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaFolder" value="MediaArchive:66f02333-7931-4f09-8c07-1d83a71a7531" />
  <param name="ThumbnailMaxHeight" value="75" />
</function><h2>The Basics</h2><ul>
  <li>
    <a href="http://www.windowsazure.com/en-us/services/data-management/" target="_blank">Introduction about data management offerings in Windows Azure</a> covering SQL Databases and Table Storage</li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx" target="_blank">Introduction to Blobs, Tables, and Queues</a> in MSDN</li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd179338.aspx" target="_blank">The Table Storage Data Model</a> in MSDN</li>
  <li>
    <a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/table-services/" target="_blank">How to use Table Storage Service in .NET</a> in MSDN</li>
  <li>
    <a href="http://www.nuget.org/packages/WindowsAzure.Storage/" target="_blank">Windows Azure Storage Client Library</a> on NuGet</li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn261237.aspx" target="_blank">Windows Azure Storage Client Library Reference</a> in MSDN</li>
  <li>Video: Session about table storage I did at a .NET user group meeting last year <iframe width="640" height="360" src="//www.youtube.com/embed/TjRM4L5JKzM?rel=0" frameborder="0" allowfullscreen="allowfullscreen"></iframe></li>
  <li>Windows Azure Training Kit

<ul><li><a href="http://www.microsoft.com/en-us/download/details.aspx?id=8396" target="_blank">Download the Training Kit</a></li><li><a href="http://windowsazure-trainingkit.github.io/labs.htm" target="_blank">Browse the Training Kit online</a></li></ul></li>
</ul><h2>Pricing</h2><ul>
  <li>
    <a href="http://www.windowsazure.com/en-us/pricing/details/storage/" target="_blank">Windows Azure Storage Pricing</a>
  </li>
  <li>
    <a href="http://www.windowsazure.com/en-us/pricing/details/sql-database/" target="_blank">SQL Database Pricing</a>
  </li>
  <li>
    <a href="http://www.windowsazure.com/en-us/pricing/details/virtual-machines/#service-sql-server" target="_blank">SQL Server Virtual Machine Pricing</a>
  </li>
  <li>
    <a href="http://www.windowsazure.com/en-us/pricing/calculator/?scenario=data-management" target="_blank">Windows Azure Pricing Calculator - Storage</a>
  </li>
</ul><h2>Deep Dive Content</h2><ul>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd179355.aspx" target="_blank">Windows Azure Storage Services REST API Reference</a> in MSDN</li>
  <li>
    <a href="https://github.com/WindowsAzure/azure-sdk-for-net" target="_blank">Sourcecode of .NET Storage Client Library</a> on github</li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj554330.aspx" target="_blank">Windows Azure Powershell Cmdlets Reference</a> in MSDN - interesting resource for IT Pros who want to manage tables with Powershell</li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh343270.aspx" target="_blank">Azure Storage Analytics</a> in MSDN</li>
  <li>
    <a href="http://sigops.org/sosp/sosp11/current/2011-Cascais/printable/11-calder.pdf" target="_blank">Paper describing the internal details of Windows Azure Storage</a>
  </li>
  <li>
    <a href="http://www.youtube.com/watch?v=QnYdbQO0yj4" target="_blank">Video</a> relating to the paper mentioned above</li>
  <li>
    <a href="http://blogs.msdn.com/b/windowsazure/archive/2012/11/02/windows-azure-s-flat-network-storage-and-2012-scalability-targets.aspx" target="_blank">Article about Windows's Azure Flat Network Storage and 2012 Scalability Targets</a> in Azure Team Blog</li>
  <li>
    <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2012/07/20/windows-azure-storage-4-trillion-objects-and-counting.aspx" target="_blank">Article about data volume and transaction count in Windows Azure</a> in Storage Team Blog</li>
  <li>
    <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2013/09/07/announcing-storage-client-library-2-1-rtm.aspx" target="_blank">What's new in Storage Client Library 2.1</a> in Storage Team Blog</li>
  <li>
    <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2013/06/28/windows-azure-storage-build-talk-what-s-coming-best-practices-and-internals.aspx" target="_blank">What's coming in CY13</a> in Storage Team Blog</li>
</ul><h2>Important 3rd Party Tools</h2><ul>
  <li>
    <a href="http://azurestorageexplorer.codeplex.com/" target="_blank">Azure Storage Explorer</a> on Codeplex - a free tool to interactively manage your Azure Storage Account including tables</li>
  <li>Cerebrata's <a href="http://www.cerebrata.com/" target="_blank">Azure Management Studio</a> - my personal favorite for Azure management</li>
</ul><h2>Other Related Links</h2><ul>
  <li>
    <a href="http://www.windowsazure.com/" target="_blank">Windows Azure Homepage</a> - this is where you can get your free trial subscription if you want to start playing with it</li>
  <li>
    <a href="https://manage.windowsazure.com" target="_blank">Windows Azure Management Portal</a>
  </li>
  <li>
    <a href="http://www.windowsazure.com/en-us/support/trust-center/" target="_blank">Windows Azure Trust Center</a> - the number one source if you want detailed information about data security and privacy in Windows Azure</li>
</ul><h2>Source Code of the Sample</h2>{% highlight c# %}using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage.Table.Queryable;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace SqlPassTableStorageSample
{
    public class Order : TableEntity
    {
        public Order()
        {
            this.OrderDateTimeUtc = DateTimeOffset.UtcNow;
        }

        public Order(string partitionKey, string rowKey, DateTimeOffset timestamp, IDictionary<string, EntityProperty> props, string etag)
            : this()
        {
            this.PartitionKey = partitionKey;
            this.RowKey = rowKey;
            this.Timestamp = timestamp;
            this.ETag = etag;
            this.ReadEntity(props, null);
        }

        public string CustomerCode { get { return this.PartitionKey; } }
        public DateTimeOffset OrderDateTimeUtc { get; set; }
        public int TotalPrice { get; set; }
        public string EntityType { get { return this.RowKey.Substring(0, 1); } }

        public static string BuildRowKey(string orderId)
        {
            // Note that the generated row key for order header starts with the char "O".
            // Therefore we can easily filter for all order headers by checking the first
            // letter of the row key.
            return string.Format("O{0}_H", orderId);
        }
    }

    public class OrderLine : TableEntity
    {
        public OrderLine()
        {
        }

        public OrderLine(string partitionKey, string rowKey, DateTimeOffset timestamp, IDictionary<string, EntityProperty> props, string etag)
            : this()
        {
            this.PartitionKey = partitionKey;
            this.RowKey = rowKey;
            this.Timestamp = timestamp;
            this.ETag = etag;
            this.ReadEntity(props, null);
        }

        public string Product { get; set; }
        public int Amount { get; set; }
        public int ItemPrice { get; set; }
        public int TotalPrice { get; set; }
        public string EntityType { get { return this.RowKey.Substring(0, 1); } }

        public static string BuildRowKey(string orderId, int lineNumber)
        {
            // Note that the generated row key for order header starts with the char "L".
            // Therefore we can easily filter for all order lines by checking the first
            // letter of the row key.
            return string.Format("L{0}_{1:0000}", orderId, lineNumber);
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // Use the following code to connect to dev storage WITHOUT Fiddler.
            ////var account = CloudStorageAccount.DevelopmentStorageAccount;

            // Use the following code to connect to dev storage WITH Fiddler.
            var account = new CloudStorageAccount(
                new StorageCredentials("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="),
                new Uri("http://ipv4.fiddler:10000/devstoreaccount1/", UriKind.Absolute),
                new Uri("http://ipv4.fiddler:10001/devstoreaccount1/", UriKind.Absolute),
                new Uri("http://ipv4.fiddler:10002/devstoreaccount1/", UriKind.Absolute));

            // Use the following code to connect to storage account in the cloud
            // and read credentials from app.config.
            ////var credentials = new StorageCredentials(
            ////    ConfigurationManager.AppSettings["AccountName"],
            ////    ConfigurationManager.AppSettings["AccountPassword"]);
            ////var account = new CloudStorageAccount(credentials, true);
            
            // Create and configure table client 
            var tableClient = account.CreateCloudTableClient();
            tableClient.RetryPolicy = new ExponentialRetry(TimeSpan.FromSeconds(1), 5);

            // Run demo scenarios
            ////DropTableAsync(tableClient).Wait();
            ////CreateTableWithBasicDataManipulationAsync(tableClient).Wait();
            ////CreateTableWithBatchOperationsAsync(tableClient).Wait();
            ////QueryScenariosAsync(tableClient).Wait();
            SharedAccessSignature(tableClient);

            // And now we are done
            Console.WriteLine("Done!");
            Console.ReadKey();
        }

        public static async Task DropTableAsync(CloudTableClient tableClient)
        {
            Console.WriteLine("\nScenario: Drop table");

            var table = tableClient.GetTableReference("Orders");
            if (await table.DeleteIfExistsAsync())
            {
                Console.WriteLine("Table deleted");
            }
        }

        public static async Task CreateTableWithBasicDataManipulationAsync(CloudTableClient tableClient)
        {
            Console.WriteLine("\nScenario: Create table with basic data manipulation");

            // Create a table.
            var table = tableClient.GetTableReference("Orders");
            await table.CreateIfNotExistsAsync();

            // Set some demo values
            var customerCode = "Rainer";
            var orderId = Guid.NewGuid().ToString();

            // Add a row with sample data
            var order = new Order()
            {
                PartitionKey = customerCode,                // we partition by customer
                RowKey = Order.BuildRowKey(orderId),    // guid order number
                TotalPrice = 100
            };
            await table.ExecuteAsync(TableOperation.Insert(order));
            Console.WriteLine("New order has been created");

            // Retrieve a specific row by partition key and row key
            var result = await table.ExecuteAsync(
                TableOperation.Retrieve<Order>(customerCode, Order.BuildRowKey(orderId)));
            var readOrder = (Order)result.Result;           // remember retrieved order, we will 
                                                            // need it later again
            Console.WriteLine("Retrieve successful; Order ID = {0}", readOrder.RowKey);

            // Update a row (this works)
            order.TotalPrice += 10;
            await table.ExecuteAsync(TableOperation.Replace(order));
            Console.WriteLine("Order has been updated");

            // Update a row (only works if ETag is specified as shown).
            // This demos optimistic concurrency. If you do not specify the etag *,
            // table storage will throw an exception as the underlying data row has
            // been altered since reading the order in readOrder.
            readOrder.TotalPrice += 20;
            readOrder.ETag = order.ETag = "*";
            await table.ExecuteAsync(TableOperation.Replace(readOrder));

            // Delete a row
            await table.ExecuteAsync(TableOperation.Delete(order));
            Console.WriteLine("Order has been deleted");
        }

        public static async Task CreateTableWithBatchOperationsAsync(CloudTableClient tableClient)
        {
            Console.WriteLine("\nScenario: Create table and execute a batch operation");

            // Create a table.
            // Note that we store order headers and order lines in the SAME table.
            // We even store all order data (headers and lines) or a customer in the
            // same partition. This makes it fast and easy to retrieve all order data
            // (headers and lines) of a single customer. Remember: Designing a NoSQL
            // database is all about designing for certain data access scenarios. Here
            // we design for a scenario in which it is common to read all order data
            // for a single customer knowing the customer's code (=partition key).
            var table = tableClient.GetTableReference("Orders");
            await table.CreateIfNotExistsAsync();

            // Set some demo values
            var customerCode = "Rainer";
            var orderId = Guid.NewGuid().ToString();
            var totalPrice = 0;

            // Add some order lines. Note that the order lines are not written to the 
            // table immediately. They are collected in a batch operation instead.
            // Later we can transfer the entire batch in a single REST request to
            // table storage. That saves money (lower number of transactions) and leads
            // to better performance (lower latency).
            var batch = new TableBatchOperation();
            for (int lineCount = 1; lineCount <= 10; totalPrice += lineCount * 5, lineCount++)
            {
                batch.Insert(new OrderLine()
                {
                    Product = "Bike",
                    Amount = lineCount,
                    ItemPrice = 5,
                    TotalPrice = lineCount * 5,
                    PartitionKey = customerCode,            // we partition by customer
                    RowKey = OrderLine.BuildRowKey(orderId, lineCount)
                                                            // build row key from order id and line number
                });
            }

            // Add order header
            batch.Insert(new Order()
            {
                TotalPrice = totalPrice,
                PartitionKey = customerCode,
                RowKey = Order.BuildRowKey(orderId)
            });

            // Note that the batch is executed in an atomic transaction
            await table.ExecuteBatchAsync(batch);

            Console.WriteLine("New order with order lines has been created");
        }

        public static async Task QueryScenariosAsync(CloudTableClient tableClient)
        {
            Console.WriteLine("\nScenario: Querying data (with new IQueryable feature from storage library 2.1)");

            // Check if table exists
            var table = tableClient.GetTableReference("Orders");
            if (!await table.ExistsAsync())
            {
                return;
            }

            // Create and execute a simple Linq query. Try running Fiddler to see the
            // REST requests resulting from that query. You will see that filtering is
            // done on the server, not on the client. Note that it does NOT
            // use async API. It blocks the calling thread.
            (from ol in table.CreateQuery<OrderLine>()
             where ol.PartitionKey == "Rainer" 
                && ol.RowKey.CompareTo("L") > 0 && ol.RowKey.CompareTo("LZ") < 0
             select ol)
                .AsTableQuery()
                .Execute()
                .ToList()
                .ForEach(ol => Console.WriteLine("Order Line {0} (Product: '{1}')", ol.RowKey, ol.Product));

            #region Async segmented query 
            // The following Linq query is executed in segments (i.e. result is delivered in
            // segments if result set is large). Segmented queries support async execution.
            var orderQuery = (from o in table.CreateQuery<Order>()
                              where o.PartitionKey == "Rainer"
                                && o.RowKey.CompareTo("O") > 0 && o.RowKey.CompareTo("OZ") < 0
                              select o).AsTableQuery();

            // Loop over all segments
            var continuationToken = new TableContinuationToken();
            do
            {
                // Get the next segment
                var segment = await orderQuery.ExecuteSegmentedAsync(continuationToken);

                // Iterate over all items in current segment
                foreach (var item in segment)
                {
                    Console.WriteLine("Order {0} (Customer: {1})", item.RowKey, item.CustomerCode);
                }

                // Store continuation token for retrieving the next segment
                continuationToken = segment.ContinuationToken;
            }
            while (continuationToken != null);
            #endregion

            // The following query is a dynamic query. It retrieves all order data
            // (order header and lines) of a customer. The helper function 
            // IterateResultAsync analyzes the result and generates Order or OrderLine
            // objects depending on the type of entity.
            var query = table.CreateQuery<DynamicTableEntity>()
                .Where(e => e.PartitionKey == "Rainer")
                .AsTableQuery();
            foreach (var item in await IterateResultAsync(query))
            {
                Console.WriteLine("Entity: {0}, CLR Type: {1}", item.RowKey, item.GetType().Name);
            }
        }

        private static async Task<IEnumerable<ITableEntity>> IterateResultAsync(TableQuery<DynamicTableEntity> query)
        {
            var result = new List<ITableEntity>();
            var continuationToken = new TableContinuationToken();

            // Add resolver to query in order to dynamically resolve result type
            var newQuery = query
                    .Resolve<DynamicTableEntity, ITableEntity>((pk, rk, ts, props, etag) =>
                    {
                        if (rk.StartsWith("L"))
                        {
                            // Generate order line entity
                            return new OrderLine(pk, rk, ts, props, etag);
                        }
                        else
                        {
                            // Generate order entity
                            return new Order(pk, rk, ts, props, etag);
                        }
                    });

            // Loop over all segments
            do
            {
                // Get the next segment
                var segment = await newQuery.ExecuteSegmentedAsync(continuationToken);
                
                // Iterate over all items in current segment
                foreach (var item in segment)
                {
                    result.Add(item);
                }

                // Store continuation token for retrieving the next segment
                continuationToken = segment.ContinuationToken;
            }
            while (continuationToken != null);

            return result;
        }

        public static void SharedAccessSignature(CloudTableClient tableClient)
        {
            Console.WriteLine("\nScenario: Querying data (with new IQueryable feature from storage library 2.1)");

            // Check if table exists
            var table = tableClient.GetTableReference("Orders");
            if (!table.Exists())
            {
                return;
            }

            // Setup a policy that allows querying in the next minute
            var policy = new SharedAccessTablePolicy()
            {
                SharedAccessStartTime = DateTimeOffset.UtcNow,
                SharedAccessExpiryTime = DateTimeOffset.UtcNow.AddMinutes(1),
                Permissions = SharedAccessTablePermissions.Query
            };

            // Limit access to order (not order lines) for customer Rainer
            var token = table.GetSharedAccessSignature(policy, null, "Rainer", "O", "Rainer", "OZ");
            Console.WriteLine("Token: {0}", token);

            // Read all order data for customer Rainer -> order lines must not be returned
            var restrictedClient = new CloudTableClient(
                tableClient.BaseUri,
                new StorageCredentials(token));
            var restrictedTable = restrictedClient.GetTableReference("Orders");
            foreach (var item in restrictedTable.ExecuteQuery(new TableQuery<DynamicTableEntity>())
                .GroupBy(e => e.RowKey.Substring(0, 1)))
            {
                Console.WriteLine("Type: {0}, Number of items: {1}", item.Key, item.Count());
            }
        }
    }
}{% endhighlight %}