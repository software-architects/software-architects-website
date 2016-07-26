---
layout: blog
title: Custom OData Provider for Windows Azure 
teaser: Beside working on time cockpit I also do some consulting work regarding .NET in general and the Microsoft Windows Azure Platform in particular. In that context I had the chance to work as a coach in an Azure evaluation project at Austria's leading real estate search engine. Based on the research we did in this project I came up with the idea to build a custom OData provider that optimizes the way that real estate search requests are handled. It shows how sharding can be used in Winodws Azure to massively improve performance while raising costs moderately. In this blog post I would like to show you the architecture of the solution. You will see how I have built the provider and how the possibilities of the Windows Azure platform helped me to create an elastic solution that is able to handle high loads.
author: Rainer Stropek
date: 2011-02-16
bannerimage: 
lang: en
tags: [Azure]
permalink: /blog/2011/02/16/Custom-OData-Provider-for-Windows-Azure-
---

<p class="Abstract">Beside working on time cockpit I also do some consulting work regarding .NET in general and the Microsoft Windows Azure Platform in particular. In that context I had the chance to work as a coach in an Azure evaluation project at Austria's leading real estate search engine. Based on the research we did in this project I came up with the idea to build a custom <a href="http://www.odata.org/" target="_blank">OData</a> provider that optimizes the way that real estate search requests are handled. It shows how <a href="http://en.wikipedia.org/wiki/Shard_(database_architecture)" target="_blank">sharding</a> can be used in Winodws Azure to massively improve performance while raising costs moderately. In this blog post I would like to show you the architecture of the solution. You will see how I have built the provider and how the possibilities of the Windows Azure platform helped me to create an elastic solution that is able to handle high loads.</p><h2>The Session</h2><p>The content of this blog article has been presented at the conference <a href="http://www.vsone.de/" target="_blank">VSOne 2011</a> in Munich in Feburary 2011. Here is the German and English abstract of the session:</p><p>
  <em>Mit ODATA hat Microsoft ein Datenaustauschformat vorgestellt, das sich immer mehr zum Quasistandard vorarbeitet. ODATA = SOA ohne dem Overhead von SOAP. Es stehen mittlerweile Implementierungen auf verschiedenen Plattformen zur Verfügung. In dieser Session zeigt Rainer Stropek die Entwicklung individueller ODATA Provider, über die man eigene Datenstrukturen im ODATA Format zugänglich machen kann.
<br /><br />
 With ODATA Microsoft offers a data access format that has becomes an industriy standard more and more. ODATA = SOA without the overhead of SOAP. Today Microsoft and other vendors offer implementations of ODATA on various platforms. In this session Rainer Stropek demonstrates how to implement a custom ODATA provider that is tailored to specific needs.</em>
</p><p>
  <a href="{{site.baseurl}}/content/images/blog/2011/02/VSOne - Custom OData Provider V2.pdf" target="_blank">Download slides</a>
</p><p>
  <a href="{{site.baseurl}}/content/images/blog/2011/02/CustomODataLinqProvider.zip" target="_blank">Download starting solution</a>
</p><h2>Hands-On Lab</h2><h3>Preparation</h3><ol>
  <li>
    <p>Prerequisites:</p>
    <ul>
      <li>Visual Studio 2010</li>
      <li>Locally installed SQL Server 2008 R2 (Express Edition is ok)</li>
      <li>Windows Azure SDK 1.3 with Windows Azure Tools for Visual Studio 1.3</li>
      <li>Create at least three databases locally (<span class="InlineCode">PerfTest</span>, <span class="InlineCode">PerfTest01</span>, <span class="InlineCode">PerfTest02</span>, etc.). The first one should be at least 10 GB for data and 5 GB for log; the other ones should be at least 1 GB for data and 1 GB for log.</li>
      <li>Create at least three databases in SQL Azure (<span class="InlineCode">HighVolumeServiceTest</span>, <span class="InlineCode">HighVolumeServiceTest01</span>, <span class="InlineCode">HighVolumeServiceTest02</span>, etc.). The first one should be at least 10 GB; the other ones should be at least 1 GB.</li>
    </ul>
  </li>
  <li>
    <p>Copy the solution <span class="InlineCode">CustomODataSample.sln</span> from directory <span class="InlineCode">Begin</span> into a working directory. Start Visual Studio as administrator and open the solution from there.</p>
  </li>
  <li>
    <p>Adjust connection settings in the following config files according to your specific setup (see above):</p>
    <ul>
      <li>
        <span class="InlineCode">CustomODataService/Web.config</span>
      </li>
      <li>
        <span class="InlineCode">CustomODataProvider.Test/App.config</span>
      </li>
      <li>
        <span class="InlineCode">DemoDataGenerator/App.config</span>
      </li>
      <li>
        <span class="InlineCode">CustomODataService.Cloud/ServiceConfiguration.cscfg</span>
      </li>
    </ul>
  </li>
  <li>
    <p>Use the sample tool <span class="InlineCode">DemoDataGenerator</span> to fill your databases (local and cloud) with demo data. With these two T-SQL statements you can check the number of rows and the size of your demo databases:</p>
    {% highlight javascript %}select count(*) from dbo.RealEstate 
SELECT SUM(reserved_page_count)*8.0/1024 + SUM(lob_reserved_page_count)*8.0/1024 FROM sys.dm_db_partition_stats{% endhighlight %}
    <p> Your large demo database in the cloud should contain approx. 12.4 million rows.</p>
  </li>
</ol><h3>Add Default OData Service</h3><ol>
  <li>
    <p>Add a <em>WCF Data Service</em> to the service project <span class="InlineCode">CustomODataService</span>:</p>
    <ul>
      <li>
        <p>Select <em>Add new item/WCF Data Service</em> and call it <span class="InlineCode">DefaultRealEstateService</span>.</p>
        <img src="{{site.baseurl}}/content/images/blog/2011/02/Screenshot_DefaultRealEstateService.png" class="                   " />
      </li>
      <li>
        <p>This is how the implementation should look like:</p>
        {% highlight javascript %}using System.Data.Services; 
using System.Data.Services.Common; 
using System.ServiceModel; 
using CustomODataService.Data; 

namespace CustomODataService 
{ 
  [ServiceBehavior(IncludeExceptionDetailInFaults = true)] 
  public class DefaultRealEstateService : DataService<RealEstateEntities> 
  { 
    public static void InitializeService(DataServiceConfiguration config) 
    { 
      config.SetEntitySetAccessRule("*", EntitySetRights.AllRead); 
      config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V2; 
    } 
  } 

  protected override RealEstateEntities CreateDataSource() 
  { 
    return RealEstateEntities.Create(); 
  } 
}{% endhighlight %}
      </li>
      <li>
        <p>Right-click <span class="InlineCode">DefaultRealEstateService.svc</span> and select <em>View in browser</em>. You should see the list of resource types that the service support (<span class="InlineCode">RealEstate</span>). Now try to do a query using e.g. the following URL: <span class="InlineCode">http://localhost:&lt;YourPort&gt;/DefaultRealEstateService.svc/RealEstate?$top=25&amp;$filter=SizeOfParcel ge 200 and SizeOfParcel lt 1000 and HasBalcony eq true&amp;$orderby=SizeOfBuildingArea desc</span>.</p>
        <p>
          <img src="{{site.baseurl}}/content/images/blog/2011/02/Screenshot_SampleQuery01.png" />
        </p>
        <p>Try the same for your local database and for your cloud database (change connection strings in your config files).</p>
      </li>
    </ul>
  </li>
</ol><h3>Add Custom Provider</h3><ol>
  <li>
    <p>The first step to create a custom OData service is to implement a custom context object. The sample solution contains a base class that makes it easier to implement such a context object: <span class="InlineCode">CustomDataServiceContext</span>. In the session I have discussed this base class in more details (see also slide deck; link at the beginning of this article). This is how the implementation could look like (notice that the only job of the context object is to provide a queryable that the OData service can operate on):</p>
    <function name="Composite.Web.Html.SyntaxHighlighter">
      <param name="SourceCode" value="using System; &#xA;using System.Data.Services.Providers; &#xA;using System.Linq; &#xA;using CustomODataService.CustomDataServiceBase; &#xA;using CustomODataService.Data; &#xA;&#xA;namespace CustomODataService &#xA;{ &#xA;    public class RealEstateContext : CustomDataServiceContext &#xA;    { &#xA;        static RealEstateContext() &#xA;        { &#xA;        } &#xA;&#xA;        public override IQueryable GetQueryable(ResourceSet set) &#xA;        { &#xA;            if (set.Name == &quot;RealEstate&quot;) &#xA;            { &#xA;                return RealEstateEntities.Create().RealEstate; &#xA;            } &#xA;&#xA;            throw new NotSupportedException(string.Format(&quot;{0} not found&quot;, set.Name)); &#xA;        } &#xA;    } &#xA;}" />
      <param name="CodeType" value="c#" />
    </function>
  </li>
  <li>
    <p>The second step is the creation of the custom provider. The sample solution contains a base class that makes it easier to implement the custom provider: <span class="InlineCode">CustomDataService&lt;T&gt;</span>. In the session I have discussed this base class in more details (see also slide deck; link at the beginning of this article). This is how the implementation could look like:</p>
    <function name="Composite.Web.Html.SyntaxHighlighter">
      <param name="SourceCode" value="using System; &#xA;using System.Data.Services; &#xA;using System.Data.Services.Common; &#xA;using System.Data.Services.Providers; &#xA;using System.ServiceModel; &#xA;using CustomODataService.CustomDataServiceBase; &#xA;using CustomODataService.Data; &#xA;&#xA;namespace CustomODataService &#xA;{ &#xA;    [ServiceBehavior(IncludeExceptionDetailInFaults = true)] &#xA;    public class CustomRealEstateDataService : CustomDataService&lt;RealEstateContext&gt; &#xA;    { &#xA;        public static void InitializeService(DataServiceConfiguration config) &#xA;        { &#xA;            config.SetEntitySetAccessRule(&quot;*&quot;, EntitySetRights.AllRead); &#xA;            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V2; &#xA;        } &#xA;&#xA;        public override IDataServiceMetadataProvider GetMetadataProvider(Type dataSourceType) &#xA;        { &#xA;            return BuildMetadataForEntityFrameworkEntity&lt;RealEstate&gt;(&quot;Namespace&quot;); &#xA;        } &#xA;&#xA;        public override IDataServiceQueryProvider GetQueryProvider(IDataServiceMetadataProvider metadata) &#xA;        { &#xA;            return new CustomDataServiceProvider&lt;RealEstateContext&gt;(metadata); &#xA;        } &#xA;&#xA;        protected override RealEstateContext CreateDataSource() &#xA;        { &#xA;            return new RealEstateContext(); &#xA;        } &#xA;    } &#xA;}" />
      <param name="CodeType" value="c#" />
    </function>
    <p> As you can see the custom provider metadata is built using the helper function <span class="InlineCode">BuildMetadataForEntityFrameworkEntity&lt;T&gt;</span>. This function uses reflection to inspect the given type and generates all the necessary OData resource sets and types. In practise you could add addition intelligence here (e.g. provide different metadata for different use cases, generate metadata manually if you do not implement a stronly typed provider).</p>
    {% highlight javascript %}/// <summary> 
/// Helper function that generates service metadata for entity framework entities based on reflection 
/// </summary> 
/// <typeparam name="TEntity">Entity framework entity type</typeparam> 
/// <param name="namespaceName">Name of the namespace to which the entity type should be assigned</param> 
public static IDataServiceMetadataProvider BuildMetadataForEntityFrameworkEntity<TEntity>(string namespaceName) 
{ 
    var productType = new ResourceType( 
        typeof(TEntity), 
        ResourceTypeKind.EntityType, 
        null, // BaseType 
        namespaceName, // Namespace 
        typeof(TEntity).Name, 
        false // Abstract? 
    ); 

    // use reflection to get all properties (except entity framework specific ones) 
    typeof(TEntity) 
        .GetProperties(BindingFlags.Public | BindingFlags.Instance) 
        .Where(pi => pi.DeclaringType == typeof(TEntity)) 
        .Select(pi => new ResourceProperty( 
            pi.Name, 
            (Attribute.GetCustomAttributes(pi).OfType<EdmScalarPropertyAttribute>().Where(ea => ea.EntityKeyProperty).Count() == 1) 
                ? ResourcePropertyKind.Primitive | ResourcePropertyKind.Key 
                : ResourcePropertyKind.Primitive, 
            ResourceType.GetPrimitiveResourceType(pi.PropertyType))) 
        .ToList() 
        .ForEach(prop => productType.AddProperty(prop)); 

    var metadata = new CustomDataServiceMetadataProvider(); 
    metadata.AddResourceType(productType); 
    metadata.AddResourceSet(new ResourceSet(typeof(TEntity).Name, productType)); 
    return metadata; 
}{% endhighlight %}
  </li>
</ol><p>Is that it? We have created a custom read-only provider and we could add additional features like ability to write, support for relations, etc. If you are interested in these things I recommend reading this excellent blog post series: <a href="http://blogs.msdn.com/b/alexj/archive/2010/01/07/data-service-providers-getting-started.aspx">Custom Data Service Providers</a> by Alex James, a Program Manager working on the Data Services team at Microsoft. I will not repeat his descriptions here. As described in the slides (see top of this blog article) my goal is to create a custom implementation to <span class="InlineCode">IQueryable</span> and use it in the OData service. The <span class="InlineCode">IQueryable</span> implemenation should hide all the complexity of sharding.</p><h3>Performance Evaluation</h3><p>In order to see how the implemented OData providers perform I used <a href="http://www.loadstorm.com/">LoadStorm</a> to simulate some loads. I defined three reference queries and let 10 to 50 concurrent users (step-up load testing scenario; each of them firing six queries per minute) do some queries. The result has been as expected: Because of the large database on the single SQL Azure server the solution does not really scale. The first chart shows the number of users and the throughput. In the second chart you can see that from a certain number of concurrent users the response time gets greater then 35 seconds; as a result we see a lot of HTTP errors.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2011/02/Default OData Provider Load Test Results 2011-02-13 - Part 1.png" class="  " />
  <br />
  <img src="{{site.baseurl}}/content/images/blog/2011/02/Default OData Provider Load Test Results 2011-02-13 - Part 2.png" class="  " />
  <br />
  <img src="{{site.baseurl}}/content/images/blog/2011/02/Default OData Provider Load Test Results 2011-02-13 - Part 5.png" class="  " />
</p><p>The poor performance does not come from OData. I also created a unit test that runs a Linq-to-Entities query - same results:</p>{% highlight javascript %}[TestMethod] 
public void TestLocalQuery() 
{ 
  using (var context = RealEstateEntities.Create()) 
  { 
    var result = context.RealEstate.Take(25).Where(re => re.Location == "Wien" && re.HasBalcony.Value).OrderBy(re => re.SizeOfGarden).ToArray(); 
  } 
}{% endhighlight %}<h3>Custom LINQ Provider - First Steps</h3><p>If you want to implement <span class="InlineCode">IQueryable</span> you should really consider using the <a href="http://iqtoolkit.codeplex.com/">IQToolkit</a>.  If offers a base class <span class="InlineCode">QueryProvider</span>. You can derive your custom <span class="InlineCode">IQueryable</span> from that class. In our case we will implement the class <span class="InlineCode">ShardingProvider</span>. It should be able to send a single Linq-to-Entities query to mulitple database in parallel and consolidate the partly results after that. The declaration of our new class looks like this:</p>{% highlight javascript %}public class ShardingProvider<TContext, TEntity> 
    : QueryProvider 
    where TContext : ObjectContext 
    where TEntity : EntityObject 
{ 
    private ContextCreatorDelegate ContextCreator { get; set; } 
    private EntityProviderDelegate EntityProvider { get; set; } 
    private string[] ConnectionStrings { get; set; } 

    public delegate TContext ContextCreatorDelegate(string connectionString); 
    public delegate IQueryable<TEntity> EntityProviderDelegate(TContext context); 

    public ShardingProvider(ContextCreatorDelegate contextCreator, EntityProviderDelegate entityProvider, params string[] connectionStrings) 
    { 
        if (contextCreator == null) 
        { 
            throw new ArgumentNullException("contextCreator"); 
        } 

        if (entityProvider == null) 
        { 
            throw new ArgumentNullException("entityProvider"); 
        } 

        if (connectionStrings == null) 
        { 
            throw new ArgumentNullException("connectionStrings"); 
        } 

        this.ContextCreator = contextCreator; 
        this.EntityProvider = entityProvider; 
        this.ConnectionStrings = connectionStrings; 
    } 

    public override object Execute(Expression expression) 
    { 
        throw new NotImplementedException();  
    } 

    public override string GetQueryText(Expression expression) 
    { 
        throw new NotImplementedException(); 
    } 
}{% endhighlight %}<p>To try our custom LINQ provider we can add a second unit test. This time the target queryable is <span class="InlineCode">Query&lt;T&gt;</span> (part of IQToolkit). <span class="InlineCode">Query&lt;T&gt;</span> needs a Linq provider - our custom <span class="InlineCode">ShardingProvider</span>. As you can see the LINQ query to Entity Framework and to our sharding provider are identical. The only additional code that is necessary is the code for building the connection strings to our sharding databases. Here is the code you have to add to <span class="InlineCode">LinqProviderTest.cs</span> in order to be able to try the custom LINQ provider:</p>{% highlight javascript %}[TestMethod] 
public void TestMethod2() 
{ 
    var queryable = CreateQueryableRoot(); 
    var result = queryable.Take(25).Where(re => re.Location == "Wien" && re.HasBalcony.Value).OrderBy(re => re.SizeOfGarden).ToArray(); 
} 

private static Query<RealEstate> CreateQueryableRoot() 
{ 
    string shardingConnectingString = ConfigurationManager.AppSettings["ShardingDatabaseConnection"]; 
    int numberOfShardingDatabases = Int32.Parse(ConfigurationManager.AppSettings["NumberOfShardingDatabases"]); 

    var connectionStrings = Enumerable.Range(1, numberOfShardingDatabases) 
        .Select(i => string.Format(shardingConnectingString, i)) 
        .ToArray(); 

    var queryable = new Query<RealEstate>( 
        new ShardingProvider<RealEstateEntities, RealEstate>( 
            (s) => new RealEstateEntities(new EntityConnectionStringBuilder() 
            { 
                Metadata = "res://*/RealEstateModel.csdl|res://*/RealEstateModel.ssdl|res://*/RealEstateModel.msl", 
                Provider = "System.Data.SqlClient", 
                ProviderConnectionString = s 
            }.ConnectionString), 
            (ctx) => ctx.RealEstate, 
            connectionStrings.ToArray())); 
    return queryable; 
}{% endhighlight %}<p>Before we finish our Linq provider we want to link our custom OData service with the custom Linq provider. The only thing we have to do to achieve this is to use the code shown above (creates Query&lt;T&gt; instance) with the existing <span class="InlineCode">RealEstateContext</span>. Here is the new code for <span class="InlineCode">RealEstateContext.cs</span> (notice that GetQueryable now returns <span class="InlineCode">Query&lt;T&gt;</span>):</p>{% highlight javascript %}using System; 
using System.Configuration; 
using System.Data.EntityClient; 
using System.Data.Services.Providers; 
using System.Linq; 
using CustomODataService.CustomDataServiceBase; 
using CustomODataService.Data; 
using IQToolkit; 
using Microsoft.WindowsAzure.ServiceRuntime; 
using ShardingProvider; 

namespace CustomODataService 
{ 
    public class RealEstateContext : CustomDataServiceContext 
    { 
        private static int numberOfShardingDatabases = 10; 

        static RealEstateContext() 
        { 
            if (RoleEnvironment.IsAvailable) 
            { 
                numberOfShardingDatabases = Int32.Parse(RoleEnvironment.GetConfigurationSettingValue("NumberOfShardingDatabases")); 
            } 
            else 
            { 
                numberOfShardingDatabases = Int32.Parse(ConfigurationManager.AppSettings["NumberOfShardingDatabases"]); 
            } 
        } 

        public override IQueryable GetQueryable(ResourceSet set) 
        { 
            if (set.Name == "RealEstate") 
            { 
                return CreateQueryable(); 
            } 

            throw new NotSupportedException(string.Format("{0} not found", set.Name)); 
        } 

        protected static IQueryable<RealEstate> CreateQueryable() 
        { 
            string shardingConnectingString; 
            if (RoleEnvironment.IsAvailable) 
            { 
                shardingConnectingString = RoleEnvironment.GetConfigurationSettingValue("ShardingDatabaseConnection"); 
            } 
            else 
            { 
                shardingConnectingString = ConfigurationManager.AppSettings["ShardingDatabaseConnection"]; 
            } 

            var connectionStrings = Enumerable.Range(1, numberOfShardingDatabases) 
                .Select(i => string.Format(shardingConnectingString, i)) 
                .ToArray(); 

            return new Query<RealEstate>(new ShardingProvider<RealEstateEntities, RealEstate>( 
                (s) => new RealEstateEntities(new EntityConnectionStringBuilder() 
                { 
                    Metadata = "res://*/RealEstateModel.csdl|res://*/RealEstateModel.ssdl|res://*/RealEstateModel.msl", 
                    Provider = "System.Data.SqlClient", 
                    ProviderConnectionString = s 
                }.ConnectionString), 
                (context) => context.RealEstate, 
                connectionStrings.ToArray())); 
        } 
    } 
}{% endhighlight %}<p>You want to see it work? Set a break point to <span class="InlineCode">ShardingProvider.Execute</span> and run an OData query against <span class="InlineCode">CustomRealEstateDataService.svc</span>. You will see the query's expression tree received by the execute method. The following two images show this. The first one shows the query in the browser. The second one shows the resulting expression tree in the Linq provider.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2011/02/Screenshot_ExpressionTreeInVS_3.png" class="      " />
  <br />
  <img src="{{site.baseurl}}/content/images/blog/2011/02/Screenshot_ExpressionTreeInVS_2.png" class="        " />
</p><h3>Implementing The Custom LINQ Provider</h3><p>The implementation of the custom LINQ provider has to perform the following two steps:</p><ol>
  <li>Make sure that the query is ok (e.g. must be sorted, must contain top-clause, etc.; business rules defined by the customer in the project mentioned at the beginning of this blog article)</li>
  <li>Parallel loop over all connections to sharding databases

<ol><li>Open entity framework connection to sharding database</li><li>Replace <span class="InlineCode">Query&lt;T&gt;</span> in expression tree by connection to sharding database</li><li>Execute query and return partial result</li></ol></li>
  <li>Combine partial results by sorting them and applying the top-clause</li>
</ol><p>Here is the implementation of the ShardingProvider class that does this (notice that I do not include the visitor classes here; they are in the sample code download):</p>{% highlight javascript %}using System; 
using System.Collections.Generic; 
using System.Data.Objects; 
using System.Data.Objects.DataClasses; 
using System.Linq; 
using System.Linq.Expressions; 
using System.Reflection; 
using System.Threading; 
using IQToolkit; 

namespace ShardingProvider 
{ 
    /// <summary> 
    /// Implements a query provider that takes a query (i.e. an expression tree) using Entity Framework and sends it 
    /// to multiple underlying databases in parallel (sharding). 
    /// </summary> 
    /// <typeparam name="TContext">Entity Framework object context type</typeparam> 
    /// <typeparam name="TEntity">Entity framework entity type</typeparam> 
    public class ShardingProvider<TContext, TEntity> 
        : QueryProvider 
        where TContext : ObjectContext 
        where TEntity : EntityObject 
    { 
        private ContextCreatorDelegate ContextCreator { get; set; } 
        private EntityProviderDelegate EntityProvider { get; set; } 
        private string[] ConnectionStrings { get; set; } 
        private static PropertyInfo KeyProperty { get; set; } 

        /// <summary> 
        /// Looks up the key property of the underlying entity framework entity type 
        /// </summary> 
        static ShardingProvider() 
        { 
            var keyProperties = typeof(TEntity) 
                .GetProperties() 
                .Where(p => Attribute 
                    .GetCustomAttributes(p) 
                    .OfType<EdmScalarPropertyAttribute>() 
                    .Where(ea => ea.EntityKeyProperty) 
                    .Count() == 1) 
                .ToArray(); 
            if (keyProperties.Count() != 1) 
            { 
                throw new ArgumentException("TEntity has to have a key consisting of a single property (EdmScalarPropertyAttribute.EntityKeyProperty)", "TEntity"); 
            } 

            KeyProperty = keyProperties.First(); 
        } 

        public delegate TContext ContextCreatorDelegate(string connectionString); 
        public delegate IQueryable<TEntity> EntityProviderDelegate(TContext context); 

        /// <summary> 
        /// Initializes a new instance of the ShardingProvider class 
        /// </summary> 
        /// <param name="contextCreator">Function that can be used to create an underlying entity framework context object</param> 
        /// <param name="entityProvider">Function that returns the IQueryable from the underlying entity framework context object</param> 
        /// <param name="connectionStrings">SQL connection string to sharding databases</param> 
        public ShardingProvider(ContextCreatorDelegate contextCreator, EntityProviderDelegate entityProvider, params string[] connectionStrings) 
        { 
            if (contextCreator == null) 
            { 
                throw new ArgumentNullException("contextCreator"); 
            } 

            if (entityProvider == null) 
            { 
                throw new ArgumentNullException("entityProvider"); 
            } 

            if (connectionStrings == null) 
            { 
                throw new ArgumentNullException("connectionStrings"); 
            } 

            this.ContextCreator = contextCreator; 
            this.EntityProvider = entityProvider; 
            this.ConnectionStrings = connectionStrings; 
        } 

        public override object Execute(Expression expression) 
        { 
            var verifyer = new VerifyingVistor<TEntity>(); 
            var methodInfoExpr = verifyer.Visit(expression) as MethodCallExpression; 
            if (!verifyer.IsValid) 
            { 
                throw new ShardingProviderException("Linq query is not valid"); 
            } 

            // Send query to all sharding databases in parallel 
            var result = this.ConnectionStrings 
                .AsParallel() 
                .WithDegreeOfParallelism(this.ConnectionStrings.Length) 
                .SelectMany(connectionString => 
                { 
                    using (var context = this.ContextCreator(connectionString)) 
                    { 
                        context.CommandTimeout = 300; 
                        var rewriter = new SwitchQueryable<TEntity>(Expression.Constant(this.EntityProvider(context))); 
                        var ex2 = 
                            Expression.Lambda<Func<IEnumerable<TEntity>>>( 
                                    Expression.Call( 
                                        methodInfoExpr.Method, 
                                        rewriter.Visit(methodInfoExpr.Arguments[0]), 
                                        methodInfoExpr.Arguments[1])); 
                        return ex2.Compile()().ToArray(); 
                    } 
                }) 
                .ToArray(); 

            // Combine partial results by ordering them and applying top operator 
            ParameterExpression param2; 
            Expression<Func<IEnumerable<TEntity>>> ex3; 
            return (ex3 = Expression.Lambda<Func<IEnumerable<TEntity>>>( 
                Expression.Call( 
                    typeof(Enumerable), 
                    "Take", 
                    new[] { typeof(TEntity) }, 
                    Expression.Call( 
                        typeof(Enumerable), 
                        "ThenBy", 
                        new[] { typeof(TEntity), KeyProperty.PropertyType }, 
                        Expression.Call( 
                            typeof(Enumerable), 
                            verifyer.Ascending ? "OrderBy" : "OrderByDescending", 
                            new[] { typeof(TEntity), ((PropertyInfo)verifyer.OrderByLambdaBody.Member).PropertyType }, 
                            Expression.Constant(result), 
                            verifyer.OrderByLambda), 
                        Expression.Lambda( 
                            Expression.MakeMemberAccess( 
                                param2 = Expression.Parameter(typeof(TEntity), "src"), 
                                KeyProperty), 
                            param2)), 
                    verifyer.TakeExpression))) 
                .Compile()().ToArray(); 
        } 

        public override string GetQueryText(Expression expression) 
        { 
            throw new NotImplementedException(); 
        } 
    } 
}{% endhighlight %}<h3>Tip: Don't forget to set minimum threads in thread pools to enable full potential of PLINQ with async database IO</h3>{% highlight javascript %}static CustomRealEstateDataService() 
{ 
    int minThreads, completionPortThreads; 
    ThreadPool.GetMinThreads(out minThreads, out completionPortThreads); 
    ThreadPool.SetMinThreads( 
        Math.Max(minThreads, 11), 
        Math.Max(completionPortThreads, 11)); 
}{% endhighlight %}<h3>Performance Evaluation</h3><p>Now that our sharding provider is completely implemented I used <a href="http://www.loadstorm.com/"><span>LoadStorm</span></a> again to simulate the same load as shown before with the standard OData provider.The results look very different - of course. No errors and an average response time of approx. 3 seconds instead of more than 10 :-)</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2011/02/Custom OData Provider Load Test Results 2011-02-13 - Part 1.png" class="  " />
  <br />
  <img src="{{site.baseurl}}/content/images/blog/2011/02/Custom OData Provider Load Test Results 2011-02-13 - Part 2.png" class="  " />
  <br />
  <img src="{{site.baseurl}}/content/images/blog/2011/02/Custom OData Provider Load Test Results 2011-02-13 - Part 5.png" />
</p>