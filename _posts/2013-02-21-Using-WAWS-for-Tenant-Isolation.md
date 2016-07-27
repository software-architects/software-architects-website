---
layout: blog
title: Using WAWS for Tenant Isolation
excerpt: I had the chance to do two sessions at Microsoft MVP Summit 2013 in Redmond/Bellevue. In this blog article I share the thoughts + code of my second talk about Windows Azure Websites.
author: Rainer Stropek
date: 2013-02-21
bannerimage: 
lang: en
tags: [Azure]
permalink: /devblog/2013/02/21/Using-WAWS-for-Tenant-Isolation
---

<h2>Introduction</h2><p>In my second talk at Microsoft MVP Summit 2013 in Redmond/Bellevue I was speaking about a characteristic of <a href="http://www.windowsazure.com/en-us/home/scenarios/mobile-services/" title="Windows Azure Websites Homepage" target="_blank">Windows Azure Mobile Services</a> (WAMS): The way that WAMS uses the infrastructure of <a href="http://www.windowsazure.com/en-us/home/scenarios/web-sites/" title="Windows Azure Websites Homepage" target="_blank">Windows Azure Websites</a> (WAWS) for tenant isolation. As people asked me to share the content of my talk, I summarize the most important take-aways in this article. <strong>Please note that all the code in this blog post is POC code. It should demonstrate the ideas and is by far not production ready (e.g. no error handling, no async programming, no good names, etc.).</strong></p><h2>Slides</h2><p>Here are the slides that I have used during the talk. Only a few slides - I spent most of the time in Visual Studio showing/writing code:</p><iframe src="http://de.slideshare.net/slideshow/embed_code/16657467" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen"></iframe><div style="margin-bottom:5px" data-mce-style="margin-bottom: 5px;">
  <strong>
    <a href="http://de.slideshare.net/rstropek/mvp-summit-2013-windows-azure-websites-for-tenant-isolation" title="MVP Summit 2013 - Windows Azure Websites for Tenant Isolation" target="_blank">MVP Summit 2013 - Windows Azure Websites for Tenant Isolation</a>
  </strong> from <strong><a href="http://de.slideshare.net/rstropek" target="_blank">Rainer Stropek</a></strong></div><h2>The Problem</h2><p>If you are a developer writing a mobile application (e.g. a Windows Store app) you might need to store some data in the cloud (e.g. settings, high scores, devices for push notifications, etc.). Windows Azure gives you <a href="http://www.windowsazure.com/en-us/home/features/data-management/" title="Data Management in Windows Azure" target="_blank">multiple types of data stores</a> you could use. The problem is that you might run into problems trying to access these data stores directly from your mobile app. Here are just some examples:</p><ol>
  <li>You cannot directly access a SQL database in Azure from your Windows Store app simply because ADO.NET is not available.</li>
  <li>Table Storage, the NoSQL option for Azure, offers you a REST-based API. However, where should you store the credentials?</li>
</ol><p>In each of these cases you will need to create, deploy, and maintain a service in the cloud. Your mobile app will use the service and the service accesses the underlying data store. The problem is that you might not want to be responsible for such a service. The solution that Microsoft offers for this problem is a ready-made service provided by Microsoft that all mobile app vendors can use. Such services with a shared infrastructure are called <a href="http://en.wikipedia.org/wiki/Multitenancy" title="Multitenancy on Wikipedia" target="_blank">multi-tenant services</a>.</p><p>Multi-tenant services like WAMS have a special problem when it comes to user-provided code (e.g. scripts): Running the code in the shared infrastructure is not possible because the risk of a script from tenant A doing bad things to tenant B is too high. There has to be some kind of sandbox in which non- or semi-trusted code can run. It turns out that the WAMS developers did not invent their own sandbox. They decided to use an existing one: The sandbox that comes with Windows Azure Websites (WAWS).</p><h2>Windows Azure Websites as an Isolation Mechanism</h2><p>Although the name Windows Azure <em>Websites</em> indicates that this service has been built only for <em>websites</em>. In fact WAWS is much more versatile. You can run nearly everything that you can run in IIS including Web APIs. This leads to the core question of my session: Can't we use WAWS in customizable, multi-tenant line-of-business (LOB) SaaS solutions for tenant isolation similar to WAMS does? We can.</p><p>For my session at MS MVP Summit I have created a small POC scenario. Here is the setup that I have shown:</p><ol>
  <li>Demo web application representing the website on which new customers can subscribe to the fictitious SaaS solution (of course this website also ran in WAWS).</li>
  <li>A worker responsible for provisioning new tenants. In my demo it was a <a href="http://www.windowsazure.com/en-us/home/scenarios/virtual-machines/" title="Virtual Machines in Azure" target="_blank">persisted VM role in Azure</a>; in practice I would recommend an <a href="http://www.windowsazure.com/en-us/home/scenarios/cloud-services/" title="Cloud Services in Azure" target="_blank">Azure Cloud Service</a>.</li>
  <li>A simple .NET-based API that can be used by power users for scripting. In my example I used the existing scripting technology in .NET (<em>Dynamic Language Runtime</em>, DLR) with a Python implementation built  on top of it (<a href="http://ironpython.net/" title="IronPython Homepage" target="_blank">IronPython</a>). We have been using IronPython in our own SaaS offering <a href="http://www.timecockpit.com" title="Time Cockpit Homepage" target="_blank">time cockpit</a> for quite a long time and are very happy with it.</li>
  <li>A sample full-client (WPF) representing e.g. a powerful ERP client for the SaaS offering.</li>
  <li>A template implementation for a Web API that is capable of running user-provided scripts. My example uses <a href="http://www.asp.net/web-api" title="ASP.NET Web API" target="_blank">ASP.NET's Web API</a>.</li>
</ol><p>The following diagram shows an overview how the different components play together. I will go into more details about what goes on in the sample.</p><p>
  <function name="Composite.Media.ImageGallery.Slimbox2">
    <param name="MediaImage" value="MediaArchive:438d73df-94f2-42d0-b68d-1cfd73546704" />
    <param name="ThumbnailMaxWidth" value="350" />
    <param name="ThumbnailMaxHeight" value="189" />
  </function> Architecture Diagram (click to enlarge)</p><h2>Code Walkthrough</h2><p>When a user subscribes to our service, the website queues a tenant creation request using <a href="http://www.windowsazure.com/en-us/home/features/messaging/" title="Azure Service Bus" target="_blank">Azure's Service Bus</a>. This service makes communicating between servers in the cloud a piece of cake. Just as an example, here is the code I used in the sample to enqueue a tenant creation request.</p>{% highlight c# %}protected void LinkButton1_Click(object sender, EventArgs e)
{
    var tenant = string.Format("tenant{0}", DateTime.Now.Ticks);

    var queueClient = QueueClient.Create(
        "createtenant",
        ReceiveMode.ReceiveAndDelete);
    var bm = new BrokeredMessage();
    bm.Properties["Tenant"] = tenant;
    queueClient.Send(bm);
}{% endhighlight %}<p>Here is the code for the worker waiting for tenant creation request. I share this code because it demonstrates how you can use e.g. <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/" title="WAWS Command Line Tools" target="_blank">WAWS's command line tools</a> to automate the creation of websites in Azure.</p>{% highlight c# %}class Program
{
    static void Main(string[] args)
    {
        // Create queue if it does not exist already
        var nsm = NamespaceManager.Create();
        if (!nsm.QueueExists("createtenant"))
        {
            var queue = nsm.CreateQueue(new QueueDescription("createtenant")
            {
                DefaultMessageTimeToLive = TimeSpan.FromHours(1.0),
                EnableBatchedOperations = false,
                EnableDeadLetteringOnMessageExpiration = false,
                IsAnonymousAccessible = false,
                MaxSizeInMegabytes = 1,
                MaxDeliveryCount = 2,
                RequiresDuplicateDetection = false,
                RequiresSession = false
            });
        }

        var queueClient = QueueClient.Create("createtenant", ReceiveMode.ReceiveAndDelete);
        while (true)
        {
            // Wait for a tenant creation message
            var msg = queueClient.Receive(TimeSpan.FromSeconds(60));
            if (msg != null)
                if (true)
                {
                    // Get tenant ID from message
                    var tenant = msg.Properties["Tenant"].ToString();

                    // Create the tenant's database by copying a template
                    CreateTenantDatabase(tenant);

                    // Create and configure a website using the command line tool for WAWS
                    RunProcessAsync("azure", string.Format("site create {0} --git --location \"West US\" < c:\\temp\\CanBeDeleted\\Empty.txt", tenant)).Wait();
                    RunProcessAsync("azure", string.Format("site config add tenant={0} {0}", tenant)).Wait();

                    // Copy the website template using git
                    RunProcessAsync("git", "init", @"C:\temp\CanBeDeleted\template").Wait();
                    RunProcessAsync("git", "pull https://myuser@erptenantisolationtemplate.scm.azurewebsites.net/ErpTenantIsolationTemplate.git", @"C:\temp\CanBeDeleted\template").Wait();
                    RunProcessAsync("git", string.Format("remote add azure https://myuser@{0}.scm.azurewebsites.net/{0}.git", tenant), @"C:\temp\CanBeDeleted\template").Wait();
                    RunProcessAsync("git", "push azure master", @"C:\temp\CanBeDeleted\template").Wait();

                    // Cleanup
                    RunProcessAsync("cmd", "/C rd . /s /q", @"C:\temp\CanBeDeleted\template").Wait();
                }
                else
                {
                    Trace.WriteLine("No tenant creation request, waiting...");
                }
        }
    }

    private static void CreateTenantDatabase(string tenant)
    {
        using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["ErpDatabase"].ConnectionString))
        {
            conn.Open();
            using (var cmd = conn.CreateCommand())
            {
                // Create a transactionally consistant copy of the template database
                cmd.CommandText = string.Format("CREATE DATABASE {0} AS COPY OF northwind", tenant);
                cmd.ExecuteNonQuery();
            }
        }
    }

    /// <summary>
    /// Simple helper that executes a process async
    /// </summary>
    private static Task RunProcessAsync(string command, string commandline, string workingDirectory = null)
    {
        var result = new TaskCompletionSource<object>();
        var psi = new ProcessStartInfo(command, commandline);
        if (workingDirectory != null)
        {
            psi.WorkingDirectory = workingDirectory;
        }
        var p = Process.Start(psi);
        p.EnableRaisingEvents = true;
        p.Exited += (_, __) =>
        {
            result.SetResult(null);
        };
        return result.Task;
    }
}{% endhighlight %}<h2>Scripting</h2><p>Adding script capabilities to a .NET program is quite simple. The .NET Framework contains the Dynamic Language Runtime (DLR). Multiple dynamic languages have been implemented on top of the DLR. Here are some examples:</p><ul>
  <li>
    <a href="http://ironpython.net/" title="IronPython Website" target="_blank">IronPython</a>
  </li>
  <li>
    <a href="http://www.ironruby.net/" title="IronRuby Website" target="_blank">IronRuby</a>
  </li>
  <li>
    <a href="https://github.com/fholm/IronJS" title="IronJS on github" target="_blank">IronJS</a>
  </li>
</ul><p>In my opinion IronPython is the most mature implementation of a dynamic language on the DLR. If you want to play with it, I encourage you to install the following components:</p><ul>
  <li>
    <a href="http://ironpython.net/" title="IronPython Website" target="_blank">IronPython</a>
  </li>
  <li>
    <a href="http://pytools.codeplex.com/" title="Python Tools for VS Website" target="_blank">Python Tools for Visual Studio</a> (you will even get debugging capabilities for your scripts; Simon Opelt, a colleague of mine has written <a href="~/blog/2012/12/17/Debugging-and-Interactive-Development-of-Time-Cockpit-Python-Scripts" title="Simon's blog" target="_blank">a blog article about it</a>)</li>
  <li>Add the <a href="http://nuget.org/packages/IronPython/" title="IronPython on nuget.org" target="_blank">IronPython Nuget package</a> to the .NET projects in which you want to use it</li>
</ul><p>The following code snippet demonstrates how the isolated WAWS website loads a Python script from the tenant's database and executes it. Be aware that in practice you would have to invest some time in making this code more robust (e.g. collect console output from script, special handling of syntax errors, etc.). However, you do not have to care about sandboxing. WAWS will take care of that.</p><div>
  {% highlight c# %}public class ScriptController : ApiController
{
    // GET api/<controller>/5
    public HttpResponseMessage Get(HttpRequestMessage request, string id)
    {
        // Use the ERP's API to connect to the tenant's datbase
        var context = new DataContext();
        context.Open(ConfigurationManager.ConnectionStrings["ErpDatabase"].ConnectionString);
            
        // Load the script from the tenant's database
        var scriptSource = context.GetScriptSource(id);
        if (scriptSource == null)
        {
            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }

        try
        {
            // Execute the script and give it access the the ERP's API
            var engine = Python.CreateEngine();
            var scope = engine.CreateScope();
            scope.SetVariable("Context", context);
            var script = engine.CreateScriptSourceFromString(scriptSource);
            script.Execute(scope);

            return request.CreateResponse(HttpStatusCode.OK, "Success");
        }
        catch (Exception ex)
        {
            return request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
        }
    }
}{% endhighlight %}
</div><h2>Summary and Critical Evaluation</h2><p>Technically it is possible to use WAWS as a tenant isolation mechanism for multi-tenant SaaS solutions. However, the solution does not scale for solutions with thousands and thousands of tenants because the number of websites per Azure subscription is limited today. In my experience this approach is feasible for SaaS offerings with a small to medium number of tenants.</p>