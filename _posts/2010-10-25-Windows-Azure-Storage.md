---
layout: blog
title: Windows Azure Storage
excerpt: The Windows Azure platform offers different mechanisms to store data permanently. In this article I would like to introduce the storage types of Windows Azure and demonstrate their use by showing an example application.
author: Rainer Stropek
date: 2010-10-25
bannerimage: 
bannerimagesource: 
lang: en
tags: [Azure]
ref: 
permalink: /devblog/2010/10/25/Windows-Azure-Storage
---

<p class="sf_postTitle">The Windows Azure platform offers different mechanisms to store data permanently. In this article I would like to introduce the storage types of Windows Azure and demonstrate their use by showing an example application.</p><div class="sf_postContent" id="ctl00_ctl00_ContentArea_Content_BlogPosts1_ctl00_ctl00_pnlContent">
  <p class="InfoBox">If you prefer watching the tutorial in form of videos you should also take a look at this webcast: <a href="~/Blog/2010/10/25/Windows-Azure-Storage" target="__blank">Windows Azure Storage</a>. I recorded this webcast for those of you who do not like reading long blog posts.</p>
  <h2>Storage Types In Windows Azure</h2>
  <p>If you want to store data in Windows Azure you can choose from four different data stores:</p>
  <ol>
    <li>Queues</li>
    <li>SQL Azure</li>
    <li>Blob Storage</li>
    <li>Table Storage</li>
  </ol>
  <h3>Windows Azure Queues</h3>
  <p>The first one is easy to explain. I am sure that every developer is used to the concept of FiFo queues. Azure queues can be used to communicate between different applications or application roles. Additionally Azure queues offer some quite unique features that are extremely handy whenever you use them to hand off work from an Azure web role to an Azure worker role. I want to point your attention especially to the following two ones:</p>
  <ul>
    <li>
      <strong>Auto-reappearance of messages</strong>
      <br />
If a receiver takes out a message from the queue and crashes when handling it, it is likely that the receiver will not be able to reschedule the work before dying. To handle such situations Azure queues let you specify a time span when getting an element out of the queue. If you do not delete the received message within that time span Azure will automatically add the message to the queue again so that another instance can pick it up.</li>
    <li>
      <strong>Dequeue counter</strong>
      <br />
The dequeue count is closely related to the previously mentioned auto-reappearance feature. It can help detecting "poisoned" messages. Imagine an invalid message that kills the process that has received it. Because of auto-reappearance another instance will pick up the message - and will also be killed. After some time all your workers will be busy dying and restarting. The dequeue counter tells you how often the message has already been taken out of the queue. If it exceeds a certain number you could remove the message without further processing (maybe logging would be a good idea in such a situation).</li>
  </ul>
  <p>Before we move to the next type of storage mechanism in Azure let me give you some tips &amp; tricks concerning queues:</p>
  <ul>
    <li>Azure queues have not been built to transport large messages (message size must not be larger than 8KB). Therefore you should not include the messages' payload in the queue messages. Store the payload in any of the other storages (see below) and use the queue to pass a reference.</li>
    <li>Write application that are tolorant to system failures and therefore make your message processing idempotent.</li>
    <li>Do not rely on a certain message delivery order.</li>
    <li>If you need really high throughput package multiple logical messages (e.g. tasks) into a single physical Azure queue message or use multiple queues in parallel.</li>
    <li>Add poisoned message handling (see description above)</li>
    <li>If you use your Azure queues to pass work from your web roles to your worker roles write some monitoring code that checks the queue length. If it gets to long you could implement a mechanism to automatically start new worker instances. Similarly you can shut down instances if your queue remains emtpy or short for a longer period of time.</li>
  </ul>
  <h3>SQL Azure</h3>
  <p>Yes, SQL Azure is a SQL Server in the cloud. No, SQL Azure is not <em>just another</em> SQL Server in the cloud. With inventing SQL Azure Microsoft did much more than buying some server, put Hyper-V on them and let the virtual machines run SQL Server 2008 R2. It is correct that behind the scenes SQL Server is doing the heavy lifting deep down in the dark corners of Azure's data centers. However, a lot of things are happening before you get access to your server.</p>
  <p>The first important thing to note is that SQL Azure comes with a <strong>firewall/load balancer</strong> that you can configure e.g. through Azure's management portal. You can configure which IP addresses should be able to establish a connection to your SQL Azure instance.</p>
  <p>If you have passed the first firewall you get connected with SQL Azure's Gateway Layer. I will not go into all details about the gateways because this is not a SQL Azure deep dive. The gateway layer is on the one hand a proxy (find the SQL Server nodes that are dedicated to your SQL Azure account) and on the other hand a stateful firewall. "Stateful firewall" means that the gateway understands TDS (<em>Tabular Data Stream</em>, SQL Server native communication language) and checks TDS packages <strong>before</strong> they hit the underlying SQL Servers. Only if the gateway layer finds everything ok with the TDS packages (e.g. right order, user and password ok, encrypted, etc.) your requests are handed over the the SQL Servers.</p>
  <p>The beauty of SQL Azure is that you as a developer can work with SQL Azure just like you work with your SQL Server that stands in your own data center. SQL Azure supports the majority of programming features that you you are used to. You can access it using ADO.NET, Entity Framework or any other data access technology that you like. However, there are some limitations to SQL Azure because of security and scalability reasons. Please check MSDN for details about the restrictions.</p>
  <p>Again some tips &amp; tricks that could help when you start working with SQL Azure:</p>
  <ul>
    <li>Use SQL Server Management Studio 2008 <strong>R2</strong> in order to be able to manage our SQL Azure instances in your Object Explorer.</li>
    <li>Never forget that SQL Azure <em>always</em> is a database cluster behind the scenes (you get three nodes for every database). Therefore you have to follow all Microsoft guidelines for working with database clusters (e.g. implement auto-reconnect in case of failures, auto-retry, etc.; check MSDN for details).</li>
    <li>Don't forget to estimate costs for SQL Azure before you start to use it. SQL Azure can be extremely cost-efficient for your applications. There are situations (especially if you have very <em>large</em> databases or <em>a lot of very small</em> ones) in which SQL Azure can get expensive.</li>
  </ul>
  <h3>Windows Azure Blob Storage</h3>
  <p>Windows Azure has been built to scale. Therefore typical Azure applications consist of many instances (e.g. web farm, farm of worker machines, etc.). As a consequence there is a need for a kind of file system that can be shared by all computers participating in a certain system (clients and servers!). Azure Blob Storage is the solution for that.</p>
  <p>Natively Azure Blob Storage speaks a REST-based protocol. If you want to read or write data from and to blobs you have to send http requests. Don't worry, you do not have to deal with all the nasty REST details. The Windows Azure SDK hides them from you.</p>
  <p>Similarly to SQL Azure I will not go into all details of Azure Blob Storage here. You will see how to access blobs in the example shown below. Let me just give you the following tips &amp; tricks about what you can do with Azure Blobs:</p>
  <ul>
    <li>Azure Blob Storage has been built to store massive amounts of data. Don't be afraid of storing terabytes in your blob store if you need to. Even a single blob can hold up to 1TB (page blobs).</li>
    <li>Azure differs between <em>block blobs</em> (streaming + commit-based writes) and <em>page blobs</em> (random read/write). Maybe I should write a blog post about the differences... Until then please check MSDN for details.</li>
    <li>Blobs are organized into <em>containers</em>. All the blobs in a container can be structured in a kind of directory system similar to the directory system that you know from your on-premise disk storage. You can specify access permissions on container and blob level.</li>
    <li>You can programatically ask for a <em>shared access signature</em> (i.e. signed URL) for any blob in your Azure Blob store. With this URL a user can direcly access the blob's content (if necessary you can restrict the time until when the URL will be valid). Therefore you can e.g. generate a confirmation document, put it into blob store and send the user a direct link to it without having to write a single line of code for providing it's content (btw - this means also less load on your web roles).</li>
  </ul>
  <h3>Windows Azure Table Storage</h3>
  <p>Azure Table Storage is not your father's database. It is a <em>No SQL</em> data store. Just like with Azure Blob Storage you have to use REST to access Azure tables (if you use the Windows Azure SDK you use <em>WCF Data Services</em> to access Table Storage).</p>
  <p>Every row in an Azure table consists of the following parts:</p>
  <ol>
    <li>
      <strong>Partition Key</strong>
      <br />
The partition key is similar to the table name in a RDBMS like SQL Server. However, every record can consist of a different set of properties even if the records have the same partition key (i.e. no fixed schema, just storing key/value pairs).</li>
    <li>
      <strong>Row Key</strong>
      <br />
The row key identifies a single row inside a partition. Partition key + row key have to be unique throughout your whole Table Storage service.</li>
    <li>
      <strong>Timestamp</strong>
      <br />
Used to implement optimistic locking.</li>
  </ol>
  <p>At the time of writing this article Azure Table Storage supports the following data types: <span class="InlineCode">String</span>, <span class="InlineCode">binary</span>, <span class="InlineCode">bool</span>, <span class="InlineCode">DateTime</span>, <span class="InlineCode">GUID</span>, <span class="InlineCode">int</span>, <span class="InlineCode">int64</span> and <span class="InlineCode">double</span>.</p>
  <p>So when to use what - SQL Azure or Azure Tables?? Here are some guidelines that could help you to choose what's right for your application:</p>
  <ul>
    <li>In SQL Azure storage is quite expensive while transactions are free. In Azure tables storage is very cheap but you have to pay for every single transaction. So if you have small data that is frequently accessed use SQL Azure, if you have large amounts of data that has to be stored but that is seldom access used Azure tables. If you find both scenarios in your application you could combine both storage technologies (this is what we do in our program <a href="http://www.timecockpit.com/" target="__blank"><span>time cockpit</span></a>.</li>
    <li>At the time of writing SQL Azure does only offer a single (rather small) machine size for databases. Because of this SQL Azure does not really scale. If you need more performance you have to build your own scaling mechanisms (e.g. distribute data accross multiple SQL Azure databases using for instance SyncFramework). This is different for Azure tables. They scale very well. Azure will store different partitions (remember the partition key I mentioned before) on different servers in case of heavy load. This is done automatically! If you need and want automatic scaling you should prefer Azure tables over SQL Azure.</li>
    <li>Azure Table Storage is not good when it comes to complex queries. If you need and want all the great features that T-SQL offers you, you should stick to SQL Azure instead of Azure tables.</li>
    <li>The amount of data you can store in SQL Azure is limited whereas Azure tables have been built to store terabytes of data.</li>
  </ul>
  <h2>Azure Storage In Action</h2>
  <h3>First Solution: Very Simple (Too Simple?)</h3>
  <p>Enough theory, let's build an example that uses all the different types of storage. Our sample scenario looks like this:</p>
  <p class="Code">We have to write a website that can be used to upload customer orders in the form of CSV files. Every file can contain multiple orders.</p>
  <p>Let's think about what Azure storage technology we should use in this case. The first one is easy: At the end of the import process it makes sense to store the resulting orders in SQL Azure in order to be able to do e.g. reporting. I want to keep the noise-ratio low and therefore we just use plain old ADO.NET + a stored proc for database access. In practise it is likely that you add a data access layer based on e.g. Entity Framework.</p>
  <p>So here is the T-SQL script that we use to create the order table and the stored proc that creates orders in the table. Note that our order table is very simple and small. To make runtime results a little more realistic I added a <span class="InlineCode">WAITFOR DELAY</span> statement to the procedure. You can take this T-SQL code and run it against your personal SQL Azure database.</p>

{% highlight sql %}
CREATE TABLE StorageDemo_CustomerOrder (
 OrderID UNIQUEIDENTIFIER PRIMARY KEY,
 OrderDate DATE NOT NULL,
 CustomerName NVARCHAR(200) NOT NULL,
 Amount DECIMAL(18,6) NOT NULL
);
GO

CREATE PROCEDURE StorageDemo_AddCustomerOrder(
 @OrderDate DATE,
 @CustomerName NVARCHAR(200),
 @Amount DECIMAL(18,6))
AS
 SET NOCOUNT ON;
 WAITFOR DELAY '00:00:00.1';
 
 IF @CustomerName LIKE '%FAIL%'
  RAISERROR('Illegal customer order.', 18, 1);
 ELSE
  INSERT INTO StorageDemo_CustomerOrder (OrderID, OrderDate, CustomerName, Amount)
  VALUES (NEWID(), @OrderDate, @CustomerName, @Amount);
GO
{% endhighlight %}

  <p>Next we have to set up our solution. We need an Azure project with a single web role. To create the solution perform the following steps:</p>
  <ul>
    <li>Create a new <em>Cloud</em> project in Visual Studio (you have to have Windows Azure SDK installed for that)</li>
    <li>Do <em>not</em> create a web role during the creation of the cloud project</li>
    <li>Add an <em>empty ASP.NET web application</em> project to your solution</li>
    <li>Add the ASP.NET application to the cloud project. You can add the ASP.NET project to your cloud project by right-clicking on the <em>Roles</em> folder in the cloud-project.</li>
  </ul>
  <p>Now we can implement the website that can be used to upload customer orders. The HTML part is extremely simple (<span class="InlineCode">FileUploadPage.aspx</span>):</p>
 
  {% highlight xml %}<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FileUploadPage.aspx.cs" Inherits="Azure.StorageDemo.Web.FileUploadPage" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
      <h1>Windows Azure Storage Demo</h1>
      <asp:FileUpload ID="OrderFileUpload" runat="server" />
      <asp:Button OnClick="OnFileUploadClick" runat="server" Text="Upload Orders" />
    </div>
    </form>
</body>
</html>{% endhighlight %}

  <p>Here is the implementation of the upload page (<span class="InlineCode">FileUploadPage.aspx.cs</span>). Note that you have to add references to <span class="InlineCode">Microsoft.WindowsAzure.ServiceRuntime</span> and <span class="InlineCode">Microsoft.WindowsAzure.StorageClient</span> in order to be able to build the solution. You can find this assemblies in the installation folder of the Windows Azure SDK (usually <span class="InlineCode">C:\Program Files\Windows Azure SDK\v1.2\ref</span>).</p>
 
    {% highlight c# %}using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace Azure.StorageDemo.Web
{
 public partial class FileUploadPage : System.Web.UI.Page
 {
  protected void OnFileUploadClick(object sender, EventArgs e)
  {
   var fileContent = Encoding.UTF8.GetString(this.OrderFileUpload.FileBytes);

   using (var conn = new SqlConnection(
    RoleEnvironment.GetConfigurationSettingValue("OrderDatabaseConnectionString")))
   {
    conn.Open();
    using (var command = conn.CreateCommand())
    {
     command.CommandText = "StorageDemo_AddCustomerOrder";
     command.CommandType = CommandType.StoredProcedure;
     command.Parameters.Add("@OrderDate", SqlDbType.Date);
     command.Parameters.Add("@CustomerName", SqlDbType.NVarChar, 200);
     command.Parameters.Add(new SqlParameter()
     {
      ParameterName = "@Amount",
      SqlDbType = SqlDbType.Decimal,
      Precision = 18,
      Scale = 6
     });
     command.Prepare();

     // In practise you have to add some checking code here
     foreach (var fileRows in fileContent.Split('\n'))
     {
      var columns = fileRows.Split(';');
      if (columns.Length == 3)
      {
       command.Parameters[0].Value = DateTime.Parse(columns[0]);
       command.Parameters[1].Value = columns[1];
       command.Parameters[2].Value = Decimal.Parse(columns[2]);
       command.ExecuteNonQuery();
      }
     }
    }
   }
  }
 }
}{% endhighlight %}


  <p>Last but not least you have to add the connection string to your Azure configuration files (<span class="InlineCode">ServiceConfiguration.csdef</span> and <span class="InlineCode">ServiceConfiguration.cscfg</span>):</p>

  {% highlight xml %}<?xml version="1.0" encoding="utf-8"?>
<ServiceDefinition name="Azure.StorageDemo.Cloud" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition">
 <WebRole name="Azure.StorageDemo.Web">
  <InputEndpoints>
   <InputEndpoint name="HttpIn" protocol="http" port="80" />
  </InputEndpoints>
  <ConfigurationSettings>
   <Setting name="DiagnosticsConnectionString" />
   <Setting name="OrderDatabaseConnectionString"/>
  </ConfigurationSettings>
 </WebRole>
</ServiceDefinition>

<?xml version="1.0"?>
<ServiceConfiguration serviceName="Azure.StorageDemo.Cloud" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration">
 <Role name="Azure.StorageDemo.Web">
  <Instances count="1" />
  <ConfigurationSettings>
   <Setting name="DiagnosticsConnectionString" value="UseDevelopmentStorage=true" />
   <Setting name="OrderDatabaseConnectionString" value="Server=.;Database=AzureStorageDemo;Integrated Security=true"/>
  </ConfigurationSettings>
 </Role>
</ServiceConfiguration>{% endhighlight %}

  <p>You can try your program by just hitting F5. You will see the Windows Azure Development Fabrik come up and you can debug the application. Here is a sample .CSV file that you can use to test the program:</p>

   {% highlight text %}2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000
2010-01-01;Testcustomer;1000{% endhighlight %}
  <p>If you like you can also change the connection string in your configuration file so that they point to your SQL Azure database. Because SQL Azure speaks TDS you do not have to change a single line of code to cloud-enable the ADO.NET code. If you have a Windows Azure computing account you can also try this version of the program running in a Windows Azure web role.</p>
  <p>Note that you can use SQL Azure although your application runs locally on your computer. Often I get asked whether it is possible to use just parts of Windows Azure. The answer is of course yes. This is especially true for Azure storage.</p>
  <h3>Second Solution: Ready To Scale</h3>
  <p>If you test the application with a large .CSV file you will notice that the http request for <span class="inlineCode">FileUploadPage.aspx</span> takes quite a while. What could we do to make our application more scalable? We want to be able to accept uploads as fast as possible and process them in the background. In Azure you typically implement such a pattern by separating work into a web role and a <em>worker role</em> (this separation enables scalability but does not guarantee it; we will get back on this later). Both roles communicate using a queue. In our case a customer order is so small that we could write the whole order into the queue. However, in practise you have to deal with larger amounts of data and therefore our sample separates the queue message (ID of order) from payload (customer data, amount, etc.). We could write the order payload directly to SQL Azure but this would not lead to a smart solution. The problem is that - as mentioned before - SQL Azure does not scale very good in case of high loads. Table storage is a much better option. So we end up with the following architecture:</p>
  <ul>
    <li>Web role accepts web request, writes request data into table store and adds message to the queue.</li>
    <li>Worker role listens to the queue, pulls payload from table store and processes the order request.</li>
  </ul>
  <p>To handle the connection to Windows Azure Storage we write a small helper class that cares for authentication (<span class="InlineCode">CloudStorageConnection</span>). Note that is is quite easy to establish a connection to Azure Storage. All you need to do is to provide a method that fetches the storage connection string from the configuration file and call <span class="InlineCode">CloudStorageAccount.FromConfigurationSetting</span>.</p>

  {% highlight c# %}using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace Azure.StorageDemo.Web
{
 public class CloudStorageConnection
 {
  public const string OrderQueueName = "orderqueue";
  public const string OrderTableName = "orderpayload";
  public CloudStorageConnection()
  {
   // Helper method to retrieve configuration data (just a wrapper around Azure's configuration
   // logic because our code will run just in Azure)
   CloudStorageAccount.SetConfigurationSettingPublisher((configName, configSetter) =>
   {
    configSetter(RoleEnvironment.GetConfigurationSettingValue(configName));
   });

   // Read account data from config file and create clients for tables, queues and blobs
   var cloudStorageAccount = CloudStorageAccount.FromConfigurationSetting("StorageConnectionString");
   this.TableClient = cloudStorageAccount.CreateCloudTableClient();
   this.QueueClient = cloudStorageAccount.CreateCloudQueueClient();
   this.BlobClient = cloudStorageAccount.CreateCloudBlobClient();

   var queue = this.QueueClient.GetQueueReference(CloudStorageConnection.OrderQueueName);
   queue.CreateIfNotExist();
   this.OrderQueue = queue;

   var table = this.TableClient.CreateTableIfNotExist(CloudStorageConnection.OrderTableName);
  }

  public CloudTableClient TableClient { get; private set; }
  public CloudQueueClient QueueClient { get; private set; }
  public CloudBlobClient BlobClient { get; private set; }
  public CloudQueue OrderQueue { get; private set; }
 }
}{% endhighlight %}

  <p>The code shown above reads the Azure Storage connection string using <span class="InlineCode">RoleEnvironment.GetConfigurationSettingValue</span>. Therefore we need the connection string in our Azure configuration files (<span class="InlineCode">ServiceConfiguration.csdef</span> and <span class="InlineCode">ServiceConfiguration.cscfg</span>):</p>
 
 {% highlight xml %}<?xml version="1.0" encoding="utf-8"?>
<ServiceDefinition name="Azure.StorageDemo.Cloud" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition">
  <WebRole name="Azure.StorageDemo.Web">
    <InputEndpoints>
      <InputEndpoint name="HttpIn" protocol="http" port="80" />
    </InputEndpoints>
    <ConfigurationSettings>
      <Setting name="DiagnosticsConnectionString" />
      <Setting name="OrderDatabaseConnectionString" />
      <Setting name="StorageConnectionString" />
    </ConfigurationSettings>
  </WebRole>
</ServiceDefinition>

<?xml version="1.0"?>
<ServiceConfiguration serviceName="Azure.StorageDemo.Cloud" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration">
  <Role name="Azure.StorageDemo.Web">
    <Instances count="1" />
    <ConfigurationSettings>
      <Setting name="DiagnosticsConnectionString" value="UseDevelopmentStorage=true" />
      <Setting name="OrderDatabaseConnectionString" value="Server=.;Database=AzureStorageDemo;Integrated Security=true" />
      <Setting name="StorageConnectionString" value="UseDevelopmentStorage=true" />
    </ConfigurationSettings>
  </Role>
</ServiceConfiguration>{% endhighlight %}

  <p>In order to be able to write to our Azure table we need one additional class. This class acts as the "data model" for our table (<span class="InlineCode">Order.cs</span>). Please pay close attention to the comments in the following implementation! If you change only one name of the first three properties you will end up spending hours and hours looking for strange http errors.</p>

  {% highlight c# %}using System;
using System.Data.Services.Common;

namespace Azure.StorageDemo.Web
{
 // WCF Data Services need the DataServiceKey attribute to identify 
 // the primary key of the class
 [DataServiceKey("PartitionKey", "RowKey")]
 public class Order
 {
  // The first three properties have to be present in order to
  // be able to store objects to table storage (do not change
  // their names!)
  public string PartitionKey { get; set; }
  public string RowKey { get; set; }
  public DateTime Timestamp { get; set; }  // for optimistic concurrency

  public DateTime OrderDate { get; set; }
  public string CustomerName { get; set; }
  public double Amount { get; set; }
 }
}{% endhighlight %}

  <p>Now we are ready to change the implementation of our website. We can throw away the access to SQL Azure and replace it with the insert operation to the Azure table and the code necessary to add the message to the queue:</p>

  {% highlight c# %}using System;
using System.Text;
using Microsoft.WindowsAzure.StorageClient;

namespace Azure.StorageDemo.Web
{
 public partial class FileUploadPage : System.Web.UI.Page
 {
  protected void OnFileUploadClick(object sender, EventArgs e)
  {
   var fileContent = Encoding.UTF8.GetString(this.OrderFileUpload.FileBytes);

   var connection = new CloudStorageConnection();
   var context = connection.TableClient.GetDataServiceContext();
   var queue = connection.QueueClient.GetQueueReference(CloudStorageConnection.OrderQueueName);

   // In practise you have to add some checking code here
   foreach (var fileRows in fileContent.Split('\n'))
   {
    var columns = fileRows.Split(';');
    if (columns.Length == 3)
    {
     var orderId = Guid.NewGuid();
     var orderPayload = new Order()
     {
      PartitionKey = CloudStorageConnection.OrderTableName,
      RowKey = orderId.ToString(),
      Timestamp = DateTime.Now,
      OrderDate = DateTime.Parse(columns[0]),
      CustomerName = columns[1],
      Amount = double.Parse(columns[2])
     };
     context.AddObject(CloudStorageConnection.OrderTableName, orderPayload);
     context.SaveChangesWithRetries();

     queue.AddMessage(new CloudQueueMessage(orderId.ToString()));
    }
   }
  }
 }
}{% endhighlight %}

  <p>The application is ready to be tested. You can either use Development Storage or - if you have your own Windows Azure account - you can change the connection strings so that they point into the cloud. If you run this version of the program it will add all orders to a table and a queue. I recommend that you get one of the numerous explorer tools with which you can look into Azure tables, queues and blob stores. I personally prefer cerebrata's <em>Cloud Storage Studio</em>; is is worth every single Dollar it costs. If you don't want to spend money for cerebrata you can also use Visual Studio's explorer tools (new in the Windows Azure SDK 1.2; see <em>Server Explorer</em> in Visual Studio). At the time of writing this article Visual Studio tools could not be compared with the toolset that cerebrata provides.</p>
  <p>Our current application version has a slight problem: It sends messages but no one cares. Therefore the next step is to write a worker role that monitors the queue and does the work. You can add a worker to your Azure project by right-clicking on the <em>Roles</em> folder in the cloud-project. The following steps are necessary to get ready to implement the worker:</p>
  <ol>
    <li>Add references to the Azure SDK assemblies <span class="InlineCode">Microsoft.WindowsAzure.ServiceRuntime</span> and <span class="InlineCode">Microsoft.WindowsAzure.StorageClient</span>.</li>
    <li>Add links to the files <span class="InlineCode">CloudStorageConnection.cs</span> and <span class="InlineCode">Order.cs</span> (you find them in the web role; details see above).</li>
    <li>Last but not least we have to copy the configuration settings in <span class="InlineCode">ServiceConfiguration.csdef</span> and <span class="InlineCode">ServiceConfiguration.cscfg</span> because the worker role needs the same connection strings as the web role:</li>
  </ol>

  {% highlight xml %}<?xml version="1.0" encoding="utf-8"?>
<ServiceDefinition name="Azure.StorageDemo.Cloud" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition">
  <WebRole name="Azure.StorageDemo.Web">
    <InputEndpoints>
      <InputEndpoint name="HttpIn" protocol="http" port="80" />
    </InputEndpoints>
    <ConfigurationSettings>
      <Setting name="DiagnosticsConnectionString" />
      <Setting name="OrderDatabaseConnectionString" />
      <Setting name="StorageConnectionString" />
    </ConfigurationSettings>
  </WebRole>
  <WorkerRole name="Azure.StorageDemo.Worker">
   <ConfigurationSettings>
    <Setting name="DiagnosticsConnectionString" />
    <Setting name="OrderDatabaseConnectionString" />
    <Setting name="StorageConnectionString" />
   </ConfigurationSettings>
  </WorkerRole>
</ServiceDefinition>{% endhighlight %}

{% highlight xml %}<?xml version="1.0"?>
<ServiceConfiguration serviceName="Azure.StorageDemo.Cloud" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration">
  <Role name="Azure.StorageDemo.Web">
    <Instances count="1" />
    <ConfigurationSettings>
      <Setting name="DiagnosticsConnectionString" value="UseDevelopmentStorage=true" />
      <Setting name="OrderDatabaseConnectionString" value="Server=.;Database=AzureStorageDemo;Integrated Security=true" />
      <Setting name="StorageConnectionString" value="UseDevelopmentStorage=true" />
    </ConfigurationSettings>
  </Role>
  <Role name="Azure.StorageDemo.Worker">
    <Instances count="1" />
   <ConfigurationSettings>
    <Setting name="DiagnosticsConnectionString" value="UseDevelopmentStorage=true" />
    <Setting name="OrderDatabaseConnectionString" value="Server=.;Database=AzureStorageDemo;Integrated Security=true" />
    <Setting name="StorageConnectionString" value="UseDevelopmentStorage=true" />
   </ConfigurationSettings>
  </Role>
</ServiceConfiguration>{% endhighlight %}

   <p>That's it, we are ready to write the worker. Here is a sample implementation. You will find yourself familiar with most of the concepts because we already used them when implementing the web role. The new part is the query that retrieves data from our Azure table. As you can see you use <em>WCF Data Services</em>; if you are already familiar with that technology Azure tables will not be something new for you.</p>

{% highlight c# %}using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading;
using Azure.StorageDemo.Web;
using Microsoft.WindowsAzure.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace Azure.StorageDemo.Worker
{
 public class WorkerRole : RoleEntryPoint
 {
  public override void Run()
  {
   // This is a sample worker implementation. Replace with your logic.
   Trace.WriteLine("Azure.StorageDemo.Worker entry point called", "Information");

   var connection = new CloudStorageConnection();
   var context = connection.TableClient.GetDataServiceContext();
   var queue = connection.QueueClient.GetQueueReference(CloudStorageConnection.OrderQueueName);

   while (true)
   {
    // Retrieve message from queue
    var msg = queue.GetMessage(TimeSpan.FromSeconds(15));
    if (msg != null)
    {
     try
     {
      Trace.WriteLine(string.Format("Handling message '{0}'", msg.AsString));

      var messagePayload = context.CreateQuery<Order>(CloudStorageConnection.OrderTableName)
       .Where(o => o.PartitionKey == CloudStorageConnection.OrderTableName && o.RowKey == msg.AsString)
       .AsTableServiceQuery<Order>()
       .SingleOrDefault();

      if (messagePayload != null)
      {
       this.ProcessOrder(messagePayload);
       queue.DeleteMessage(msg);
       context.DeleteObject(messagePayload);
       context.SaveChangesWithRetries();
      }
      else
      {
       // Could not read payload from storage. Maybe we are too fast? Let's retry it one time.
       if (msg.DequeueCount > 1)
       {
        // After retry still no payload in storage -> remove message
        queue.DeleteMessage(msg);
       }
      }
     }
     catch
     {
      // Error while processing message
      if (msg.DequeueCount > 1)
      {
       // Remove poisened message
       queue.DeleteMessage(msg);
      }
     }
    }
    else
    {
     Trace.WriteLine("No message, waiting...");
     Thread.Sleep(1000);
    }
   }
  }

  private void ProcessOrder(Order messagePayload)
  {
   using (var conn = new SqlConnection(RoleEnvironment.GetConfigurationSettingValue("OrderDatabaseConnectionString")))
   {
    conn.Open();
    using (var command = conn.CreateCommand())
    {
     command.CommandText = "StorageDemo_AddCustomerOrder";
     command.CommandType = CommandType.StoredProcedure;
     command.Parameters.Add("@OrderDate", SqlDbType.Date);
     command.Parameters.Add("@CustomerName", SqlDbType.NVarChar, 200);
     command.Parameters.Add(new SqlParameter()
     {
      ParameterName = "@Amount",
      SqlDbType = SqlDbType.Decimal,
      Precision = 18,
      Scale = 6
     });
     command.Prepare();

     command.Parameters[0].Value = messagePayload.OrderDate;
     command.Parameters[1].Value = messagePayload.CustomerName;
     command.Parameters[2].Value = messagePayload.Amount;
     command.ExecuteNonQuery();
    }
   }
  }

  public override bool OnStart()
  {
   // Set the maximum number of concurrent connections 
   ServicePointManager.DefaultConnectionLimit = 12;
   DiagnosticMonitor.Start("DiagnosticsConnectionString");
   // For information on handling configuration changes
   // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.
   RoleEnvironment.Changing += RoleEnvironmentChanging;
   return base.OnStart();
  }

  private void RoleEnvironmentChanging(object sender, RoleEnvironmentChangingEventArgs e)
  {
   // If a configuration setting is changing
   if (e.Changes.Any(change => change is RoleEnvironmentConfigurationSettingChange))
   {
    // Set e.Cancel to true to restart this role instance
    e.Cancel = true;
   }
  }
 }
}{% endhighlight %}

  <p>Hit F5 and watch how your worker picks up messages from the queue, reads order payload from your Azure table and generates rows in the SQL Azure database.</p>
  <h3>Third Step: Using Windows Azure Blob Store</h3>
  <p>In order to demonstrate all different storage mechanism of the Windows Azure Platform we have to include blob storage. In our sample a good application for blob storage could be a confirmation function. After we have successfully processed an order we could send the user a confirmation document. To keep it simple we are just going to create a simple text file (i.e. blob) that says <em>Order xxx accepted</em>. We just have to extend our helper class <span class="InlineCode">CloudStorageConnection</span> a little bit:</p>
  
   {% highlight c# %}using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace Azure.StorageDemo.Web
{
 public class CloudStorageConnection
 {
  public const string OrderQueueName = "orderqueue";
  public const string OrderTableName = "orderpayload";
  public const string ConfirmationContainerName = "confirmations";

  public CloudStorageConnection()
  {
   // Helper method to retrieve configuration data (just a wrapper around Azure's configuration
   // logic because our code will run just in Azure)
   CloudStorageAccount.SetConfigurationSettingPublisher((configName, configSetter) =>
   {
    configSetter(RoleEnvironment.GetConfigurationSettingValue(configName));
   });

   // Read account data from config file and create clients for tables, queues and blobs
   var cloudStorageAccount = CloudStorageAccount.FromConfigurationSetting("StorageConnectionString");
   this.TableClient = cloudStorageAccount.CreateCloudTableClient();
   this.QueueClient = cloudStorageAccount.CreateCloudQueueClient();
   this.BlobClient = cloudStorageAccount.CreateCloudBlobClient();

   var queue = this.QueueClient.GetQueueReference(CloudStorageConnection.OrderQueueName);
   queue.CreateIfNotExist();
   this.OrderQueue = queue;

   var table = this.TableClient.CreateTableIfNotExist(CloudStorageConnection.OrderTableName);

   this.ConfirmationContainer = this.BlobClient.GetContainerReference(CloudStorageConnection.ConfirmationContainerName);
   this.ConfirmationContainer.CreateIfNotExist();
  }

  public CloudTableClient TableClient { get; private set; }
  public CloudQueueClient QueueClient { get; private set; }
  public CloudBlobClient BlobClient { get; private set; }

  public CloudQueue OrderQueue { get; private set; }
  public CloudBlobContainer ConfirmationContainer { get; private set; }
 }
}{% endhighlight %}
  <p>With these changes we have a reference to the Azure blob container that should receive our blobs and we can create the blob inside our worker process (I will not repeat the whole worker class here, just the necessary lines for creating the blob):</p>
  {% highlight c# %}CloudBlob blob;
(blob = connection.ConfirmationContainer
 .GetBlobReference(messagePayload.RowKey))
 .UploadText(string.Format("Order {0} accepted!", messagePayload.RowKey));
// In practise we would retrieve a shared access signature (i.e. URL) for the blob here
// using blob.GetSharedAccessSignature and send the URL to the customer. {% endhighlight %}
  <h2>Recap And Summary</h2>
  <p>The sample showed how to build an application that uses all parts of Windows Azure Storage. The application itself can run in Azure but it needs not.</p>
  <p>We used a queue and table storage to separate order processing (worker) from receiving orders (web). This scales better than doing all the work in the web role. However, do we really get the most from what Azure is offering in terms of scalability and performance? No, our sample just scraches the surface. Here are a few tips for you if you want to make our sample even more scalable (possible I will create another blog post about that some times later):</p>
  <ol>
    <li>Currently we just use one single partition key in table storage. In order to enable automatic distribution or work accross multiple table storage servers we would have to distribute order data accress multiple partitions (i.e. partition keys). The same is true for queues; you could use mulitple queue names, too.</li>
    <li>The bottleneck for both worker and web role is not the CPU in our current implementation. It is quite likely that the web role will spend most of the time waiting for queues and table storage. The worker role will mainly wait for the database. If you want to get the maximum out of your Azure roles you should parallelize the algorithms in both web and worker role.</li>
  </ol>
  <p>Enjoy playing with the sample, please send me feedback and don't forget to check out our product <a href="http://www.timecockpit.com/"><span>time cockpit</span></a>.</p>
</div>