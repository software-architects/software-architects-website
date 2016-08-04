---
layout: blog
title: Custom OData Provider Without Underlying DB
excerpt: Today I will do my OData session at BASTA conference in Mainz again. This time I have a bit more time so I will add a demo of creating a custom OData provider without any underlying database. The result is generated based on the OData query on the fly. In this blog article I share the code.
author: Rainer Stropek
date: 2014-09-25
bannerimage: 
bannerimagesource: 
lang: en
tags: [About]
ref: 
permalink: /devblog/2014/09/25/Custom-OData-Provider-Without-Underlying-DB
---

<p>Today I will do my <a href="http://www.software-architects.com/devblog/2014/09/12/10-OData-FAQs" target="_blank">OData session</a> at <a href="http://basta.net/2014/sessions/custom-odata-providers-mit-aspnet-web-api" target="_blank">BASTA conference in Mainz</a>. This time I have a bit more time so I will add a demo of creating a custom OData provider without any underlying database. The result is generated based on the OData query on the fly. In this blog article I share the code.</p><p class="showcase">You can download the entire source code from <a href="https://github.com/rstropek/Samples/tree/master/CustomODataProvider" target="_blank">my GitHub Samples repository</a>.</p><h2>The OData Controller</h2><p>Let's start with the important part of the sample: The <em>ODataController</em>.</p>{% highlight c# %}using Microsoft.OData.Core.UriParser.Semantic;
using Microsoft.OData.Core.UriParser.TreeNodeKinds;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;

namespace CustomODataProvider.Provider.Controller
{
    [ODataRoutePrefix("Customers")]
    public class CustomerController : ODataController
    {
        // Helpers for generating customer names
        private readonly char[] letters1 = "aeiou".ToArray();
        private readonly char[] letters2 = "bcdfgklmnpqrstvw".ToArray();
        private Random random = new Random();

        private const int pageSize = 100;

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.Filter | AllowedQueryOptions.Top | AllowedQueryOptions.Skip | AllowedQueryOptions.OrderBy)]
        [ODataRoute]
        public IHttpActionResult Get(ODataQueryOptions<Customer> options)
        {
            // Calculate number of results based on $top
            var numberOfResults = pageSize;
            if (options.Top != null)
            {
                numberOfResults = options.Top.Value;
            }

            // Analyze $filter
            string equalFilter = null;
            if (options.Filter != null)
            {
                // We only support a single "eq" filter
                var binaryOperator = options.Filter.FilterClause.Expression as BinaryOperatorNode;
                if (binaryOperator == null || binaryOperator.OperatorKind != BinaryOperatorKind.Equal)
                {
                    return InternalServerError();
                }

                // One side has to be a reference to CustomerName property, the other side has to be a constant
                var propertyAccess = binaryOperator.Left as SingleValuePropertyAccessNode ?? binaryOperator.Right as SingleValuePropertyAccessNode;
                var constant = binaryOperator.Left as ConstantNode ?? binaryOperator.Right as ConstantNode;
                if (propertyAccess == null || propertyAccess.Property.Name != "CustomerName" || constant == null)
                {
                    return InternalServerError();
                }

                // Save equal filter value
                equalFilter = constant.Value.ToString();

                // Return between 1 and 2 rows (CustomerName is not a primary key)
                numberOfResults = Math.Min(random.Next(1, 3), numberOfResults);
            }

            // Generate result
            var result = new List<Customer>();
            for (var i = 0; i < numberOfResults; i++)
            {
                result.Add(new Customer() { CustomerID = Guid.NewGuid(), CustomerName = equalFilter ?? GenerateCustomerName() });
            }

            return Ok(result.AsQueryable());
        }

        private string GenerateCustomerName()
        {
            var length = random.Next(5, 8);
            var result = new StringBuilder(length);
            for (var i = 0; i < length; i++)
            {
                var letter = (i % 2 == 0 ? letters1[random.Next(letters1.Length)] : letters2[random.Next(letters2.Length)]).ToString();
                result.Append(i == 0 ? letter.ToUpper() : letter);
            }

            return result.ToString();
        }
    }
}{% endhighlight %}<h2>Configuration the OData Endpoint</h2>{% highlight c# %}using Microsoft.OData.Edm;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using System.Web.OData.Routing.Conventions;

namespace CustomODataProvider.Provider
{
    public static class ODataConfiguration
    {
        public static void RegisterOData(HttpConfiguration config)
        {
            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());

            var routeConventions = ODataRoutingConventions.CreateDefault();
            config.MapODataServiceRoute("odata", "odata", GetModel());
        }

        private static IEdmModel GetModel()
        {
            var modelBuilder = new ODataConventionModelBuilder();
            modelBuilder.EntitySet<Customer>("Customers");
            return modelBuilder.GetEdmModel();
        }
    }
}{% endhighlight %}<h2>The Self Host</h2>{% highlight c# %}using CustomODataProvider.Provider;
using Microsoft.Owin.Hosting;
using Owin;
using System;
using System.Web.Http;

namespace CustomODataProvider.Hosting
{
    class Program
    {
        static void Main(string[] args)
        {
            using (WebApp.Start<Startup>("http://localhost:5000")) 
            { 
                Console.WriteLine( "Server ready... Press Enter to quit."); 
                Console.ReadLine(); 
            }
        }
    }

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            ODataConfiguration.RegisterOData(config);
            app.UseWebApi(config);
        }
    }
}{% endhighlight %}