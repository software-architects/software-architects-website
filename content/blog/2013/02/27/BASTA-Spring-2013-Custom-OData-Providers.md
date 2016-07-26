---
layout: blog
title: BASTA Spring 2013 -  Custom OData Providers
teaser: At the BASTA Spring 2013 conference I had a session about developing custom OData providers. In this blog article I summarize the most important take aways and publish the source code.
author: Rainer Stropek
date: 2013-02-27
bannerimage: 
lang: en
tags: [.NET,Azure,C#]
permalink: /blog/2013/02/27/BASTA-Spring-2013-Custom-OData-Providers
---

<h2>Introduction</h2><p>At the <a href="http://www.basta.net" title="BASTA Homepage" target="_blank">BASTA Spring 2013</a> conference I had a session about developing custom <a href="http://www.odata.org" title="OData Homepage" target="_blank">OData</a> providers. In this blog article I summarize the most important take aways and publish the source code. For completeness here is the abstract of the talk in German:</p><p>
  <em>In seiner OData Session zeigt Rainer Stropek, wie man eigene OData-Provider entwickelt. In einem durchgängigen Beispiel demonstriert er, wie man erst einen LINQ-Provider und darauf aufbauend einen OData-konformen REST Service erstellt und von verschiedenen Programmiersprachen und Tools darauf zugreift. In der Session werden Grundkenntnisse von OData und LINQ vorausgesetzt.</em>
</p><p>Note that I have done multiple talks about custom OData providers in the past. Amongst others I did talks about a concrete application of a custom OData provider: Fan-out queries in Sharding-scenarios. You can read more about it <a href="http://www.software-architects.com/devblog/2011/02/16/Custom-OData-Provider-for-Windows-Azure-" title="Custom OData provider for sharding" target="_blank">in this blog article (2011)</a>.</p><h2>Slides</h2><iframe src="http://de.slideshare.net/slideshow/embed_code/16806795?rel=0" width="512" height="421" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen"></iframe><div style="margin-bottom:5px" data-mce-style="margin-bottom: 5px;">
  <strong>
    <a href="http://de.slideshare.net/rstropek/custom-o-data-providers-rainer-stropek" title="BASTA 2013: Custom OData Provider" target="_blank">BASTA 2013: Custom OData Provider</a>
  </strong> from <strong><a href="http://de.slideshare.net/rstropek" target="_blank">Rainer Stropek</a></strong></div><h2>
  <a href="{{site.baseurl}}/content/images/blog/2013/02/CustomODataService.zip" title="Sourcecode for Custom OData Provider sample" target="_blank">Download Sourcecode</a>
</h2><h2>Introducing OData</h2><p>OData is a great protocol for web-enabling CRUD scenarios. It is a platform-independent standard. You can get client and server libraries for a bunch of different platforms. For more information about the protocol see <a href="http://www.odata.org/" title="OData Homepage" target="_blank">OData</a> homepage. .NET contains support for OData for quite a long time. Recently Microsoft has begun to ship its latest OData implementation using Nuget packges. For our sample you need to get <a href="https://nuget.org/packages/Microsoft.Data.Services" title="WCF Data Services Server on Nuget" target="_blank">WCF Data Services Server</a> and its dependencies.</p><h2>The Basics</h2><p>Most of <a href="http://www.windowsazure.com" title="Windows Azure Homepage" target="_blank">Microsoft's cloud services</a> (e.g. Table Storage) support OData out of the box. You do not need to implement an OData server yourself. Unfortunately SQL Server does not support OData natively - neither on-premise nor in the cloud. However, that's not a big problem in practise. If you have an <a href="https://nuget.org/packages/EntityFramework" title="Entity Framework on Nuget" target="_blank">Entity Framework</a> model, Microsoft's OData SDK can turn it into an OData feed with just a few lines of code. If you want to learn more about it, take a look at this <a href="http://msdn.microsoft.com/en-us/library/vstudio/dd728275.aspx" title="Creating the Data Service - MSDN" target="_blank">how-to chapter in MSDN</a>. We will not go into details on this in this session.</p><p>In our sample we want to start with a simple OData service backed by an in-memory collection of <em>Customer</em> objects. The following code snippets show the <em>Customer</em> class and a helper class used to generate demo data. This code is just infrastructure, it is not specific to OData.</p><p>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="using System;&#xA;using System.Collections.Generic;&#xA;using System.Linq;&#xA;&#xA;namespace CustomLinqProvider&#xA;{&#xA;    public class Customer&#xA;    {&#xA;        public int CustomerID { get; set; }&#xA;        public string CompanyName { get; set; }&#xA;        public string ContactPersonFirstName { get; set; }&#xA;        public string ContactPersonLastName { get; set; }&#xA;&#xA;        public override string ToString()&#xA;        {&#xA;            return string.Format(&quot;{0}, {1} {2}, {3}&quot;, this.CustomerID, this.ContactPersonFirstName, this.ContactPersonLastName, this.CompanyName);&#xA;        }&#xA;&#xA;        public static IReadOnlyList&lt;Customer&gt; GenerateDemoCustomers(int firstCustomerID = 0, int numberOfCustomers = 100)&#xA;        {&#xA;            var rand = new Random();&#xA;            return Enumerable.Range(firstCustomerID, numberOfCustomers)&#xA;                .Select(i =&gt; new Customer()&#xA;                {&#xA;                    CustomerID = i,&#xA;                    ContactPersonLastName = DemoNames.LastNames[rand.Next(DemoNames.LastNames.Count)],&#xA;                    ContactPersonFirstName = DemoNames.FirstNames[rand.Next(DemoNames.FirstNames.Count)],&#xA;                    CompanyName = string.Format(&#xA;                        &quot;{0} {1} {2}&quot;,&#xA;                        DemoNames.CompanyNamesPart1[rand.Next(DemoNames.CompanyNamesPart1.Count)],&#xA;                        DemoNames.CompanyNamesPart2[rand.Next(DemoNames.CompanyNamesPart2.Count)],&#xA;                        DemoNames.CompanyNamesPart3[rand.Next(DemoNames.CompanyNamesPart3.Count)])&#xA;                })&#xA;                .ToArray();&#xA;        }&#xA;    }&#xA;}" />
    <param name="CodeType" value="c#" />
  </function>
  {% highlight javascript %}using System.Collections.Generic;

namespace CustomLinqProvider
{
    /// <summary>
    /// Contains some common names used to generate customer demo data
    /// </summary>
    public static class DemoNames
    {
        public static readonly IReadOnlyList<string> LastNames = new [] {
            "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor" /*, ...*/
        };

        public static readonly IReadOnlyList<string> FirstNames = new[] {
            "Jack", "Lewis", "Riley", "James", "Logan" /*, ...*/
        };

        public static readonly IReadOnlyList<string> CompanyNamesPart1 = new[] { 
            "Corina", "Amelia", "Menno", "Malthe", "Hartwing", "Marlen" /*, ...*/ };
        public static readonly IReadOnlyList<string> CompanyNamesPart2 = new[] { 
            "Construction", "Engineering", "Consulting", "Trading", "Metal Construction", "Publishers"  /*, ...*/ };
        public static readonly IReadOnlyList<string> CompanyNamesPart3 = new[] {
            "Ltd", "Limited", "Corporation", "Limited Company", "Joint Venture", "Ltd.", "Cooperative" };
    }
}{% endhighlight %}
</p><p>Publishing generated customer demo data with OData is really simple. Here is the code you need for it:</p><p>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="&#xA;&#xA;&lt;%@ ServiceHost Language=&quot;C#&quot; Factory=&quot;System.Data.Services.DataServiceHostFactory, Microsoft.Data.Services, Version=5.3.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35&quot; Service=&quot;CustomODataService.CustomerReflectionService&quot; %&gt;" />
    <param name="CodeType" value="xml" />
  </function>
  {% highlight javascript %}using IQToolkit;
using CustomLinqProvider;
using System.Data.Services;
using System.Data.Services.Common;
using System.Linq;
using System.ServiceModel;

namespace CustomODataService
{
    /// <summary>
    /// Implements a context class that contain queryables which we want to expose using OData
    /// </summary>
    public class CustomerReflectionContext 
    {
        public IQueryable<Customer> Customer
        {
            get
            {
                // Generate 1000 customers and return queryable so that user can query the
                // generated data.
                return CustomLinqProvider.Customer
                    .GenerateDemoCustomers(numberOfCustomers: 100)
                    .AsQueryable();
            }
        }
    }
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    public class CustomerReflectionService : DataService<CustomerReflectionContext>
    {
        // This method is called only once to initialize service-wide policies.
        public static void InitializeService(DataServiceConfiguration config)
        {
            // TODO: set rules to indicate which entity sets and service operations are visible, updatable, etc.
            // Examples:
            config.SetEntitySetAccessRule("*", EntitySetRights.AllRead);
            // config.SetServiceOperationAccessRule("MyServiceOperation", ServiceOperationRights.All);
            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V2;
            config.UseVerboseErrors = true;
        }
    }
}{% endhighlight %}
</p><p>You can immediately try your OData service in the browser (click to enlarge the image):</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:3e7d87b1-e2d9-4b08-9d7b-47c3cab2b1c8" />
  <param name="ThumbnailMaxWidth" value="350" />
  <param name="ThumbnailMaxHeight" value="345" />
</function><p>Your OData service will also support JSON. You can try that by specifying an appropriate accept-header in <a href="http://www.fiddler2.com/fiddler2/" title="Fiddler Homepage" target="_blank">Fiddler</a> (click to enlarge the image):</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:70834006-1777-46ad-b8f5-e27517d93399" />
  <param name="ThumbnailMaxWidth" value="350" />
  <param name="ThumbnailMaxHeight" value="259" />
</function><h2>Custom LINQ Provider</h2><p>Did you recognize the problem of the code shown above? The class <em>CustomerReflectionContext</em> <strong>always</strong> generates 100 customer objects. An OData client can specify a <em>$top</em> clause as shown above. However, the server will still generate 100 objects. Somewhere in the OData stack the unwanted 99 customers will be thrown away. Imagine generating the customer objects would be a difficult and time-consuming process. In such a case an architecture that works like the classes shown above would not work.</p><p>A solution to this problem is a custom LINQ provider. A LINQ provider takes an expression tree and has to interpret it. In our case we will just recognize the <em>Take</em> and <em>Skip</em> methods of the expression tree. We will use them to limit the number of customers to generate. Implementing a custom LINQ provider from scratch is hard. Fortunately there are multiple helper libraries available. In my sample I use the <a href="http://iqtoolkit.codeplex.com/" title="IQToolkit on Codeplex" target="_blank">IQToolkit library</a>. With its help, implementing the custom LINQ provider is easy. Here is the code:</p><p>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="using IQToolkit;&#xA;using System;&#xA;using System.Linq;&#xA;using System.Linq.Expressions;&#xA;&#xA;namespace CustomLinqProvider&#xA;{&#xA;    public class DemoCustomerProvider : QueryProvider&#xA;    {&#xA;        public override object Execute(Expression expression)&#xA;        {&#xA;            // Use a visitor to extract demo data generation parameters&#xA;            // (&quot;take&quot; and &quot;skip&quot; clauses)&#xA;            var analyzer = new AnalyzeQueryVisitor();&#xA;            analyzer.Visit(expression);&#xA;&#xA;            // Generate data&#xA;            return Customer.GenerateDemoCustomers(analyzer.Skip, analyzer.Take);&#xA;        }&#xA;&#xA;        public override string GetQueryText(Expression expression)&#xA;        {&#xA;            throw new NotImplementedException();&#xA;        }&#xA;    }&#xA;}" />
    <param name="CodeType" value="c#" />
  </function>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="using System;&#xA;using System.Linq.Expressions;&#xA;using System.Reflection;&#xA;&#xA;namespace CustomLinqProvider&#xA;{&#xA;    /// &lt;summary&gt;&#xA;    /// Simple visitor that extracts &quot;Take&quot; and &quot;Skip&quot; clauses from expression tree&#xA;    /// &lt;/summary&gt;&#xA;    internal class AnalyzeQueryVisitor : ExpressionVisitor&#xA;    {&#xA;        public AnalyzeQueryVisitor()&#xA;        {&#xA;            this.Take = 100;&#xA;            this.Skip = 0;&#xA;        }&#xA;&#xA;        public int Take { get; private set; }&#xA;        public int Skip { get; private set; }&#xA;&#xA;        protected override Expression VisitMethodCall(MethodCallExpression m)&#xA;        {&#xA;            switch (m.Method.Name)&#xA;            {&#xA;                case &quot;Take&quot;:&#xA;                    this.Take = (int)(m.Arguments[1] as ConstantExpression).Value;&#xA;                    break;&#xA;                case &quot;Skip&quot;:&#xA;                    this.Skip = (int)(m.Arguments[1] as ConstantExpression).Value;&#xA;                    break;&#xA;                case &quot;OrderBy&quot;:&#xA;                    // We do not check/consider order by yet.&#xA;                    break;&#xA;                default:&#xA;                    throw new CustomLinqProviderException(&quot;Method not supported!&quot;);&#xA;            }&#xA;&#xA;            return base.VisitMethodCall(m);&#xA;        }&#xA;    }&#xA;}" />
    <param name="CodeType" value="c#" />
  </function>
  {% highlight javascript %}using System;
using System.Runtime.Serialization;

namespace CustomLinqProvider
{
    [Serializable]
    public class CustomLinqProviderException : NotSupportedException
    {
        public CustomLinqProviderException()
            : base()
        {
        }

        public CustomLinqProviderException(string message)
            : base(message)
        {
        }

        protected CustomLinqProviderException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }

        public CustomLinqProviderException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}{% endhighlight %}
</p><p>Of course you do not absolutely need OData to make use of the LINQ provider. You can use it directly in your C# app, too. You can easily try it e.g. in a unit test:</p>{% highlight javascript %}using IQToolkit;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using CustomLinqProvider;
using System.Linq;

namespace CustomODataProvider.Test
{
    [TestClass]
    public class LinqProviderTest
    {
        [TestMethod]
        public void TestSuccessfullQueries()
        {
            var provider = new DemoCustomerProvider();

            var result = new Query<Customer>(provider).ToArray();
            Assert.AreEqual(100, result.Length);
            Assert.AreEqual(0, result[0].CustomerID);

            result = new Query<Customer>(provider).Skip(100).ToArray();
            Assert.AreEqual(100, result.Length);
            Assert.AreEqual(100, result[0].CustomerID);

            result = new Query<Customer>(provider).Skip(100).Take(10).ToArray();
            Assert.AreEqual(10, result.Length);
            Assert.AreEqual(100, result[0].CustomerID);
        }

        [TestMethod]
        public void TestIllegalQuery()
        {
            var provider = new DemoCustomerProvider();
            bool exception = false;
            try
            {
                new Query<Customer>(provider).Where(c => c.CustomerID == 5).ToArray();
            }
            catch (CustomLinqProviderException)
            {
                exception = true;
            }

            Assert.IsTrue(exception);
        }
    }
}{% endhighlight %}<h2>Using the LINQ Provider in OData</h2><p>Now that we have the optimized LINQ provider, we can back our OData service with it:</p>{% highlight javascript %}/// <summary>
/// Implements a context class that contain queryables which we want to expose using OData
/// </summary>
public class CustomerReflectionContext 
{
    //public IQueryable<Customer> Customer
    //{
    //  get
    //  {
    //      // Generate 1000 customers and return queryable so that user can query the
    //      // generated data.
    //      return CustomLinqProvider.Customer
    //          .GenerateDemoCustomers(numberOfCustomers: 100)
    //          .AsQueryable();
    //  }
    //}

    public IQueryable<Customer> Customer
    {
        get
        {
            // Use custom linq provider to generate exactly the number of customers we need
            return new Query<Customer>(new DemoCustomerProvider());
        }
    }
}{% endhighlight %}<p>It you query the OData service with a <em>$top</em> clause now, the service will only generated the request number of customer objects in the background.</p><p>Unfortunately we have lost functionality with our customer LINQ provider, too. If you decide to go for a customer provider, you have to deal with all possible LINQ functions yourself. In our case we only allow <em>$top</em> and <em>$skip</em>. In all other cases we throw an exception (click to enlarge image):</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:1f5b3e71-b0e4-4be5-a77d-6b04231d4bfa" />
  <param name="ThumbnailMaxWidth" value="350" />
  <param name="ThumbnailMaxHeight" value="235" />
</function><h2>Building a Completely Customized OData Provider</h2><p>The example shown above can already dynamically handle parameters specified in OData queries during runtime. However, there are cases in which you might need even more flexibility. Imagine that you do not know the available entities or properties during compile time. Our own SaaS product <a href="http://www.timecockpit.com" title="Time Cockpit Homepage" target="_blank">time cockpit</a> allows power users to customize its data model. Users can add custom entities, add properties, define calculated properties with an easy-to-learn formula language. In such a case, writing a custom LINQ provider and backing an OData service is not sufficient. We have to dive deeper into Microsoft's OData SDK.</p><p>In the sample code shown above we implemented the class <em>CustomerReflectionContext</em> which contains a property of type <em>IQueryable</em>. Our OData service <em>CustomerReflectionService</em> derives from <em>DataService&lt;CustomerReflectionContext&gt;</em>. By specifying the type parameter, Microsoft's OData SDK will look for all <em>IQueryable</em> properties in the specified class. In the custom OData provider sample we want to implement now, we do not know during compile time which <em>IQueryable</em> properties we will have during runtime. Therefore we change from a class that contains a fixed number of properties to a class that can dynamically provide <em>IQueryable</em>s during runtime:</p><p>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="using System;&#xA;using System.Data.Services;&#xA;using System.Data.Services.Common;&#xA;using System.Data.Services.Providers;&#xA;using CustomODataService.CustomDataServiceBase;&#xA;using System.Threading;&#xA;using CustomLinqProvider;&#xA;using System.Reflection;&#xA;using System.Linq;&#xA;using IQToolkit;&#xA;&#xA;namespace CustomODataService&#xA;{&#xA;    public class CustomerServiceDataContext : IGenericDataServiceContext&#xA;    {&#xA;        public IQueryable GetQueryable(ResourceSet set)&#xA;        {&#xA;            if (set.Name == &quot;Customer&quot;)&#xA;            {&#xA;                return new Query&lt;Customer&gt;(new DemoCustomerProvider());&#xA;            }&#xA;&#xA;            return null;&#xA;        }&#xA;    }&#xA;}" />
    <param name="CodeType" value="c#" />
  </function>
  {% highlight javascript %}using System.Data.Services.Providers;
using System.Linq;

namespace CustomODataService.CustomDataServiceBase
{
    /// <summary>
    /// Acts as the interface for data service contexts used for a custom data service
    /// </summary>
    public interface IGenericDataServiceContext
    {
        /// <summary>
        /// Creates a queryable for the specified resource set
        /// </summary>
        /// <param name="set">Resource set for which the queryable should be created</param>
        IQueryable GetQueryable(ResourceSet set);
    }
}{% endhighlight %}
</p><p>Next we have to somehow inform the OData runtime about which types and properties our class can provide. This is done using OData's <em>ResourceSet</em> and <em>ResourceType</em> objects in combination with the interface <em>IDataServiceMetadataProvider</em>. Note that I have kept the following implementation consciously simple. It should demonstrate the concept without you having to worry about use-case-specific implementation details.</p>{% highlight javascript %}using System;
using System.Collections.Generic;
using System.Data.Services.Providers;
using System.Reflection;
using System.Linq;

namespace CustomODataService.CustomDataServiceBase
{
    public class CustomDataServiceMetadataProvider : IDataServiceMetadataProvider
    {
        private Dictionary<string, ResourceType> resourceTypes = new Dictionary<string, ResourceType>();
        private Dictionary<string, ResourceSet> resourceSets = new Dictionary<string, ResourceSet>();

        /// <summary>
        /// Add a resource type
        /// </summary>
        /// <param name="type">Type to add</param>
        public void AddResourceType(ResourceType type)
        {
            type.SetReadOnly();
            resourceTypes.Add(type.FullName, type);
        }

        /// <summary>
        /// Adds the resource set.
        /// </summary>
        /// <param name="set">The set.</param>
        public void AddResourceSet(ResourceSet set)
        {
            set.SetReadOnly();
            resourceSets.Add(set.Name, set);
        }

        public static IDataServiceMetadataProvider BuildDefaultMetadataForClass<TEntity>(string namespaceName)
        {
            // Add resource type for class TEntity
            var productType = new ResourceType(
                typeof(TEntity),
                ResourceTypeKind.EntityType,
                null, // BaseType 
                namespaceName, // Namespace 
                typeof(TEntity).Name,
                false // Abstract? 
            );

            // use reflection to get all primitive properties
            foreach (var property in typeof(TEntity)
                    .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                    .Where(pi => pi.DeclaringType == typeof(TEntity) && (pi.PropertyType.IsPrimitive || pi.PropertyType == typeof(string))))
            {
                var resourceProperty = new ResourceProperty(
                    property.Name,
                    // For simplicity let's assume that the property with postfix ID is the key property
                    ResourcePropertyKind.Primitive | (property.Name.EndsWith("ID") ? ResourcePropertyKind.Key : 0),
                    ResourceType.GetPrimitiveResourceType(property.PropertyType));
                productType.AddProperty(resourceProperty);
            }

            // Build metadata object
            var metadata = new CustomDataServiceMetadataProvider();
            metadata.AddResourceType(productType);
            metadata.AddResourceSet(new ResourceSet(typeof(TEntity).Name, productType));
            return metadata;
        }

        #region Implementation of IDataServiceMetadataProvider
        public string ContainerName
        {
            get { return "Container"; }
        }

        public string ContainerNamespace
        {
            get { return "Namespace"; }
        }

        public IEnumerable<ResourceType> GetDerivedTypes(ResourceType resourceType)
        {
            // We don't support type inheritance yet 
            yield break;
        }

        public ResourceAssociationSet GetResourceAssociationSet(ResourceSet resourceSet, ResourceType resourceType, ResourceProperty resourceProperty)
        {
            throw new NotImplementedException("No relationships.");
        }

        public bool HasDerivedTypes(ResourceType resourceType)
        {
            // We don’t support inheritance yet 
            return false;
        }

        public IEnumerable<ResourceSet> ResourceSets
        {
            get { return this.resourceSets.Values; }
        }

        public IEnumerable<ServiceOperation> ServiceOperations
        {
            // No service operations yet 
            get { yield break; }
        }

        public bool TryResolveResourceSet(string name, out ResourceSet resourceSet)
        {
            return resourceSets.TryGetValue(name, out resourceSet);
        }

        public bool TryResolveResourceType(string name, out ResourceType resourceType)
        {
            return resourceTypes.TryGetValue(name, out resourceType);
        }

        public bool TryResolveServiceOperation(string name, out ServiceOperation serviceOperation)
        {
            // No service operations are supported yet 
            serviceOperation = null;
            return false;
        }

        public IEnumerable<ResourceType> Types
        {
            get { return this.resourceTypes.Values; }
        }
        #endregion
    }
}{% endhighlight %}<p>We are still missing a class that connects our <em>CustomerServiceDataContext</em> class with OData. This is done using OData's <em>IDataServiceQueryProvider</em> interface. It has to be able to generate an <em>IQueryable</em> for every resource set that we have added to our metadata (see above). Our sample implementation of <em>IDataServiceQueryProvider</em> is again kept simple.</p>{% highlight javascript %}using System;
using System.Collections.Generic;
using System.Data.Services.Providers;
using System.Linq;

namespace CustomODataService.CustomDataServiceBase
{
    public class CustomDataServiceProvider : IDataServiceQueryProvider
    {
        private IGenericDataServiceContext currentDataSource;
        private IDataServiceMetadataProvider metadata;

        public CustomDataServiceProvider(IDataServiceMetadataProvider metadata, IGenericDataServiceContext dataSource)
        {
            this.metadata = metadata;
            this.currentDataSource = dataSource;
        }

        public object CurrentDataSource
        {
            get { return currentDataSource; }
            set { currentDataSource = value as IGenericDataServiceContext; }
        }

        public IQueryable GetQueryRootForResourceSet(ResourceSet resourceSet)
        {
            return currentDataSource.GetQueryable(resourceSet);
        }

        public ResourceType GetResourceType(object target)
        {
            var type = target.GetType();
            return metadata.Types.Single(t => t.InstanceType == type);
        }

        #region Implementation of IDataServiceQueryProvider
        public bool IsNullPropagationRequired
        {
            get { return true; }
        }

        public object GetOpenPropertyValue(object target, string propertyName)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<KeyValuePair<string, object>> GetOpenPropertyValues(object target)
        {
            throw new NotImplementedException();
        }

        public object GetPropertyValue(object target, ResourceProperty resourceProperty)
        {
            throw new NotImplementedException();
        }

        public object InvokeServiceOperation(ServiceOperation serviceOperation, object[] parameters)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}{% endhighlight %}<p>That's it. We have all prerequisites to setup our fully customizable OData service. Note how the .NET interface <em>IServiceProvider</em> is used to link our service with the previously created implementations of <em>IDataServiceMetadataProvider</em> and <em><em>IDataServiceQueryProvider</em></em>.</p><p>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="&#xA;&#xA;&lt;%@ ServiceHost Language=&quot;C#&quot; Factory=&quot;System.Data.Services.DataServiceHostFactory, Microsoft.Data.Services, Version=5.3.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35&quot; Service=&quot;CustomODataService.CustomerService&quot; %&gt;&#xA;" />
    <param name="CodeType" value="xml" />
  </function>
  {% highlight javascript %}using System;
using System.Data.Services;
using System.Data.Services.Common;
using System.Data.Services.Providers;
using CustomODataService.CustomDataServiceBase;
using System.Threading;
using CustomLinqProvider;
using System.Reflection;
using System.Linq;
using IQToolkit;

namespace CustomODataService
{
    public class CustomerService : DataService<object>, IServiceProvider
    {
        private readonly IDataServiceMetadataProvider customerMetadata;
        private readonly CustomDataServiceProvider dataSource;

        public CustomerService()
        {
            this.customerMetadata = CustomDataServiceMetadataProvider.BuildDefaultMetadataForClass<Customer>("DefaultNamespace");
            this.dataSource = new CustomDataServiceProvider(this.customerMetadata, new CustomerServiceDataContext());
        }

        public static void InitializeService(DataServiceConfiguration config)
        {
            // Enable read for all entities
            config.SetEntitySetAccessRule("*", EntitySetRights.AllRead);

            // Various other settings
            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V2;
            config.DataServiceBehavior.AcceptProjectionRequests = false;
        }

        public object GetService(Type serviceType)
        {
            if (serviceType == typeof(IDataServiceMetadataProvider))
            {
                return this.customerMetadata;
            }
            else if (serviceType == typeof(IDataServiceQueryProvider))
            {
                return this.dataSource;
            }

            return null;
        }
    }
}{% endhighlight %}
</p><h2>Further Readings</h2><ul>
  <li>Alex D. James: <a href="http://blogs.msdn.com/b/alexj/archive/2010/01/07/data-service-providers-getting-started.aspx" target="_blank">Custom Data Service Providers</a> (Blog)</li>
  <li>MSDN: <a href="http://msdn.microsoft.com/en-us/library/ee960143.aspx" title="Custom Data Service Providers (MSDN)" target="_blank">Custom Data Service Providers</a></li>
</ul>