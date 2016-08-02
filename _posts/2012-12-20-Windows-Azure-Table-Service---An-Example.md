---
layout: blog
title: Windows Azure Table Service - An Example
excerpt: In September 2012 I did  a session on Microsoft Windows Azure's Table Storage at the Professional .NET 2012 Community Conference in Vienna. In this blog post I would like to publish the video of the talk as well as the sample code I presented during the session.
author: Rainer Stropek
date: 2012-12-20
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET,Azure,C#]
permalink: /devblog/2012/12/20/Windows-Azure-Table-Service---An-Example
---

<h2>Introduction</h2><p>In September 2012 I did a session on Microsoft Windows Azure's Table Storage at the <a href="http://pronet2012.dotnet-austria.at/" target="_blank">Professional .NET 2012 Community Conference</a> in Vienna. In this blog post I would like to publish the video and sample code I presented during the session.</p><h2>Video (German)</h2><iframe width="853" height="480" src="https://www.youtube.com/embed/TjRM4L5JKzM?rel=0" frameborder="0" allowfullscreen="allowfullscreen"></iframe><h2>Important Links</h2><ul>
  <li>
    <a href="http://www.windowsazure.com/" target="_blank">Windows Azure Portal</a> - includes access to trial accounts, pricing calculator, how-to descriptions, links to the documentation, SDK downloads, etc.</li>
  <li>Some basics: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd179338.aspx" target="_blank">Understanding the Table Service data model</a> .</li>
  <li>Excellent <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx" target="_blank">white paper</a> about the internals of Azure's Table Service. Not absolutely necessary to know programming with Table Services but very interesting to read.</li>
  <li>
    <a href="https://github.com/WindowsAzure/azure-sdk-for-net" target="_blank">Windows Azure SDK</a> on github (sometimes it is not enough to download the latest bits from the Azure portal; to get the latest features that are still under development you might need to pull the Azure SDK sources from github)</li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/hh680934(v=pandp.50)" target="_blank">Transient Fault Handling Block</a> - implementation of retry strategies for Azure Storage created by Microsoft's Patterns &amp; Practices team.</li>
  <li>Blog post by Azure's storage team introducing <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-table-sas-shared-access-signature-queue-sas-and-update-to-blob-sas.aspx" target="_blank">shared access signature in Table Services</a>.</li>
</ul><h2>Azure SDK From github</h2><p>In my session I demonstrated the use of shared access signatures (SAS) with table storage. This security feature has been available for blobs from the first day on. Microsoft introduced it for table services in the latest service release for the Azure storage platform. When I did my session in September 2012 the stable version of the .NET SDK for table services (1.7.0) did not support SAS for table services. Therefore you needed to download the latest preview (1.7.1) from github and compile it yourself. Today this is not necessary any more. However, I will add a checklist for getting and building the Azure SDK just in case you will have to do it for any reason:</p><ul>
  <li>Get github client (e.g. for <a href="http://windows.github.com/" target="_blank">windows</a>)</li>
  <li>Start the git shell</li>
  <li>Initialize your git repository (if you do not already have one): <em>git init</em></li>
  <li>Pull the Azure SDK branch you need for the Azure SDK. Example: <em>git pull https://github.com/WindowsAzure/azure-sdk-for-net.git sdk_1.7.1</em></li>
  <li>Open <em>StorageClient.csproj</em> in Visual Studio and compile it</li>
  <li>Add a reference to the generated DLL in your project</li>
</ul><h2>Sample Code</h2><p>Here is the sample code that I will use during my session. It demonstrates the following aspects of table storage:</p><ul>
  <li>Authentication with account name/key</li>
  <li>Synchronous write and query operations</li>
  <li>Batching (entity group transactions) - I will use Fiddler to show what is going on in the background.</li>
  <li>Continuation tokens</li>
  <li>Asynchronous write and query operations using .NET's new task programming model (async/await)</li>
  <li>Access to table services without schema (i.e. consuming table data in XML format)</li>
  <li>Shared access signatures for table services</li>
</ul>{% highlight c# %}using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.Data.Services.Client;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace ConsoleApplication1
{
    public class LogEntry : TableServiceEntity
    {
        public string Message { get; set; }
    }

    public class DynamicEntry : TableServiceEntity
    {
        internal Dictionary<string,> values = new Dictionary<string,>();
    }

    public class Program
    {
        private static AutoResetEvent signal = new AutoResetEvent(false);

        private static readonly XNamespace AtomNamespace = "http://www.w3.org/2005/Atom";
        private static readonly XNamespace AstoriaDataNamespace = "http://schemas.microsoft.com/ado/2007/08/dataservices";
        private static readonly XNamespace AstoriaMetadataNamespace = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

        static void Main(string[] args)
        {
            var prog = new Program();
            
            var tableClient = prog.CreateClientWithNameAndKey();
            prog.SimpleWriteSample(tableClient);
            prog.SimpleWriteSampleAsync(tableClient);
            signal.WaitOne();

            tableClient = prog.CreateClientWithSas();
            prog.SasAccessSample(tableClient);

            prog.SchemalessAccess(tableClient);

            Console.ReadKey();
        }

        private CloudTableClient CreateClientWithNameAndKey()
        {
            var account = new CloudStorageAccount(
                new StorageCredentialsAccountAndKey("prodotnetvie", "ENTER YOUR KEY HERE"), true);
            return account.CreateCloudTableClient();
        }

        private CloudTableClient CreateClientWithSas()
        {
            var serverClient = this.CreateClientWithNameAndKey();

            SharedAccessTablePolicy policy = new SharedAccessTablePolicy()
            {
                SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(30),
                Permissions = SharedAccessTablePermissions.Add
                    | SharedAccessTablePermissions.Query
                    | SharedAccessTablePermissions.Update
                    | SharedAccessTablePermissions.Delete
            };

            var table = serverClient.GetTableReference("SyncTable");

            // Generate the SAS token. No access policy identifier is used which
            // makes it a non-revocable token
            // limiting the table SAS access to only the request a specific partition
            string sasToken = table.GetSharedAccessSignature(
                policy   /* access policy */,
                null     /* access policy identifier */,
                "X" /* start partition key */,
                "1"     /* start row key */,
                "X" /* end partition key */,
                "2"     /* end row key */);

            // You will need at least version 1.7.1 of the Azure sdk
            var sasCredentials = new StorageCredentialsSharedAccessSignature(sasToken);
            // Create the CloudTableClient using the shared access signature as the credentials
            return new CloudTableClient(serverClient.BaseUri, sasCredentials);
        }

        private void SimpleWriteSample(CloudTableClient tableClient)
        {
            var context = tableClient.GetDataServiceContext();
            if (tableClient.CreateTableIfNotExist("SyncTable"))
            {
                // Add some demo data
                for (int i = 0; i < 2000; i++)
                {
                    context.AddObject("SyncTable", new LogEntry() { PartitionKey = "X", RowKey = i.ToString(), Message = string.Format("Message {0}", i) });
                    if ((i + 1) % 100 == 0)
                    {
                        context.SaveChangesWithRetries(SaveChangesOptions.Batch);
                    }
                }
            }

            // Note that the following line would NOT return all rows because of
            // continuation logic of table storage.
            // var logs = context
            //  .CreateQuery<logentry>("SyncTable")
            //  .Where(l => l.PartitionKey == "X")
            //  .ToArray();

            // You have to use CloudTableQuery instead.
            var logQuery = context
                .CreateQuery<logentry>("SyncTable")
                .Where(l => l.PartitionKey == "X")
                .AsTableServiceQuery();
            var logs = logQuery.Execute();
            Console.WriteLine(logs.Count());
        }

        private async void SimpleWriteSampleAsync(CloudTableClient tableClient)
        {
            var context = tableClient.GetDataServiceContext();
            if (await Task.Factory.FromAsync<string,>(
                tableClient.BeginCreateTableIfNotExist,
                tableClient.EndCreateTableIfNotExist,
                "SyncTable2",
                null))
            {
                for (int i = 0; i < 2000; i++)
                {
                    context.AddObject("SyncTable2", new LogEntry() { PartitionKey = "X", RowKey = i.ToString(), Message = string.Format("Message {0}", i) });
                    if ((i + 1) % 100 == 0)
                    {
                        await Task.Factory.FromAsync<savechangesoptions,>(
                            context.BeginSaveChangesWithRetries,
                            context.EndSaveChangesWithRetries,
                            SaveChangesOptions.Batch,
                            null);
                    }
                }
            }

            var q = context
                .CreateQuery<logentry>("SyncTable2")
                .Where(l => l.PartitionKey == "X")
                .AsTableServiceQuery();
            var segment = await Task.Factory.FromAsync<resultsegment<logentry>>(
                q.BeginExecuteSegmented,
                q.EndExecuteSegmented,
                null);
            do
            {
                Console.WriteLine(segment.Results.Count());

                if (segment.ContinuationToken != null)
                {
                    segment = await Task.Factory.FromAsync<resultsegment<logentry>>(
                        segment.BeginGetNext,
                        segment.EndGetNext,
                        null);
                }
                else
                {
                    break;
                }
            }
            while (true);

            signal.Set();
        }

        private void SchemalessAccess(CloudTableClient tableClient)
        {
            var context = tableClient.GetDataServiceContext();
            context.ReadingEntity += (s, e) =>
            {
                var entity = e.Entity as DynamicEntry;
                if (entity != null)
                {
                    e.Data
                     .Element(AtomNamespace + "content")
                     .Element(AstoriaMetadataNamespace + "properties")
                     .Elements()
                     .Select(p =>
                      new
                      {
                          Name = p.Name.LocalName,
                          p.Value
                      })
                     .ToList()
                     .ForEach(column => entity.values[column.Name] = column.Value);
                }
            };

            var log = context
                .CreateQuery<dynamicentry>("SyncTable")
                .Where(l => l.PartitionKey == "X" && l.RowKey == "1")
                .First();

            Console.WriteLine(log.values["Message"]);
        }

        private void SasAccessSample(CloudTableClient tableClient)
        {
            var context = tableClient.GetDataServiceContext();

            // Access correct table
            var logQuery = context
                .CreateQuery<logentry>("SyncTable")
                .Where(l => l.PartitionKey == "X" && l.RowKey == "1")
                .AsTableServiceQuery();
            var logs = logQuery.Execute();
            Console.WriteLine(logs.Count());

            try
            {
                logQuery = context
                    .CreateQuery<logentry>("SyncTable")
                    .Where(l => l.PartitionKey == "X" && l.RowKey == "3")
                    .AsTableServiceQuery();
                logs = logQuery.Execute();
                Console.WriteLine(logs.Count());
            }
            catch
            {
                Console.WriteLine("Exception while accessing table");
            }
        }
    }
}{% endhighlight %}