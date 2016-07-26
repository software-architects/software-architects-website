---
layout: blog
title: Powerworkshop C# 4 at BASTA Spring 2011
teaser:  Tomorrow I will do a power workshop about C# 4 at BASTA Spring 2011 in Darmstadt.
author: Rainer Stropek
date: 2011-02-20
bannerimage: 
lang: en
tags: [.NET]
permalink: /blog/2011/02/20/Powerworkshop-C-4-at-BASTA-Spring-2011
---

<p>Tomorrow I will do a power workshop about C# 4 at <a href="http://www.basta.net/" target="_blank">BASTA Spring 2011</a> in Darmstadt. Here is the abstract of the workshop as shown in the conference guide (German):</p><p>
  <em>C# 4 steckt für viele Entwickler immer noch voller Geheimnisse und Überraschungen. Wussten Sie, dass sich fast alle foreach-Schleifen durch LINQ ersetzen lassen? Dass der Zugriff auf Office und generell COM-Bibliotheken mit C# 4 zum Kinderspiel wurde? Dass C# 4 voller Möglichkeiten steckt, Ihre Programme zu parallelisieren?</em>
</p><p>
  <em>Wenn in Ihrer täglichen Arbeit die Vorteile der aktuellen C#-Version noch nicht in Fleisch und Blut übergegangen sind, sind Sie in diesem Workshop richtig. Ihr Trainer, Rainer Stropek, konzentriert sich auf praktische Beispiele, Tipps und Tricks, die Ihnen während des Workshops auch zum Mitmachen zur Verfügung stehen.</em>
</p><p> In the workshop I will cover the following topics:</p><ol>
  <li>What's new in the Microsoft Visual Studio 2010 C# IDE for developers?</li>
  <li>What's new for COM and Office Interop in C# 4?</li>
  <li>Parallel computing with TPL and PLINQ</li>
  <li>The <span class="InlineCode">dynamic</span> keyword and the Dynamic Language Runtime</li>
  <li>Managed Extensibility Framework (MEF)</li>
</ol><p>You can <a href="{{site.baseurl}}/content/images/blog/2011/02/CSharp Workshop BASTA Spring 2011.pdf" target="_blank">download the slide deck of the workshop as a PDF file</a>.</p><h2>What's new in the Microsoft Visual Studio 2010 C# IDE for developers?</h2><p>A few weeks ago I did a half-day workshop for C# developers about the <a href="http://www.timecockpit.com/en/blogs/10-12-07/Hands-On_Labs_Visual_Studio_IDE.aspx" target="_blank">Visual Studio 2010 IDE</a> in Munich. This workshop has been especially for people who are new with development in Visual Studio. As the power workshop at BASTA will be for experienced developers who want to get up to date with C# 4 I will just do parts of the workshop from Munich (only the new things that came with VS2010). During the workshop I will demo the following new features of VS2010:</p><ol>
  <li>Some small nice details like the new project dialog, async. reference dialog, etc.</li>
  <li>Editor news like ad hoc code blocks, zooming, etc.</li>
  <li>Navigate To</li>
  <li>Call Hierarchy</li>
  <li>Code Definition Window</li>
  <li>New IntelliSense suggestion mode</li>
  <li>Generate from usage</li>
  <li>New windowing functions</li>
  <li>Data tips</li>
  <li>DLR support in the debugger</li>
  <li>IntelliTrace</li>
</ol><p>For the demos I will use sample code from the <a href="http://www.microsoft.com/downloads/en/details.aspx?FamilyID=752cb725-969b-4732-a383-ed5740f02e93&amp;displaylang=en" target="_blank">Visual Studio 2010 and .NET Framework 4 Training Kit</a>.</p><h2>What's new for COM and Office Interop in C# 4?</h2><p>The second part of the workshop will be dedicated to features regarding to COM interop. They are especially useful if you want to write interop code for Microsoft Office. I will speak about and demo the following functions of the C# 4 compiler:</p><ol>
  <li>Embedded interop types</li>
  <li>Named and optional parameters</li>
</ol><p>During the workshop I will use the following example project: <a href="{{site.baseurl}}/content/images/blog/2011/02/OfficeInterop.zip" target="_blank">OfficeInterop</a></p><h2>Parallel computing with TPL and PLINQ</h2><p>One of the big new things in C# 4 is the enhanced support for parallel computing. In the workshop I will cover the following aspects of parallel programming in C# 4:</p><ol>
  <li>Task Parallel Library (TPL)

<ol><li><span class="InlineCode">Task</span> and <span class="InlineCode">Parallel</span> class</li><li>Collections for parallel programming</li></ol></li>
  <li>Parallel LINQ (PLINQ)</li>
</ol><p>Because of the importance of the topic I will not only speak about TPL and PLINQ in theory. I will show quite a few small live-coded samples. Additionally we will take a look at the new possibilities in a large practical hands-on sample. If you want to participate you will need the following things:</p><ol>
  <li>Download and extract geo data about Berlin from the <a href="http://www.openstreetmap.org/" target="_blank">Open Street Map</a> project (<a href="http://download.geofabrik.de/osm/europe/germany/" target="_blank">http://download.geofabrik.de/osm/europe/germany/</a>).</li>
  <li>Get a server with &gt;=4 cores (if you don't have a physical one use e.g. a trial account for <a href="http://www.microsoft.com/windowsazure" target="_blank">Windows Azure</a> to get your hands on one; I will do that during the workshop in Darmstadt).</li>
  <li>
    <p>Create a SQL Server database with the following script (if you don't have a powerful SQL Server on your laptop you could e.g. use also Windows Azure):</p>
    {% highlight javascript %}CREATE TABLE [dbo].[Highway](
 [HighwayID] [int] NOT NULL,
 [HighwayGeo] [geography] NULL,
 [HighwayType] [nvarchar](100) NULL,
 [StartingNodeID] [int] NULL,
 [EndNodeID] [int] NULL,
 PRIMARY KEY CLUSTERED ( [HighwayID] ASC )
){% endhighlight %}
  </li>
  <li>Get my sample solution <a href="{{site.baseurl}}/content/images/blog/2011/02/AzureDynamicLoaderCommon.zip" target="_blank">AzureDynamicLoaderCommon</a>.</li>
  <li>Follow the steps that I show during the workshop.</li>
</ol><p>During the workshop I might use some of my simple parallel programming demos that you can find in the sample solution <a href="{{site.baseurl}}/content/images/blog/2011/02/ParallelProgramming.Samples.zip" target="_blank">ParallelProgramming.Samples</a>.</p><p>
  <strong>Note:</strong> It would not be possible to deploy many different versions of the sample (e.g. with TPL, with LINQ, with PLINQ) multiple times. In Azure this would take me 15 minutes for each deployment. Therefore I have written a generic Azure worker role that is able to load an assembly from blob store and execute it. With this I just have to deploy a single app; the different algorithms are started by uploading the corresponding assembly into blob store and starting it using a message in an Azure queue (e.g. with <a href="http://azurestorageexplorer.codeplex.com/" target="_blank">Azure Storage Explorer</a> or <a href="http://www.cerebrata.com/products/cloudstoragestudio/" target="_blank">Cerebrata Cloud Storage Studio</a>). Just in case you are interested - here is the code of the two main classes that perform this "deployment magic":</p><p>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="using System;&#xA;using System.Net;&#xA;using System.Threading;&#xA;using AzureDynamicLoader.Common;&#xA;using Microsoft.WindowsAzure.ServiceRuntime;&#xA;&#xA;namespace ADL.Wrk&#xA;{&#xA;    public class WorkerRole : RoleEntryPoint&#xA;    {&#xA;        public override void Run()&#xA;        {&#xA;            // Local helper variables&#xA;            var exeAssembly = typeof(Bootstrapper).Assembly.FullName;&#xA;            AppDomain subDomain = null;&#xA;&#xA;            #region Setup storage&#xA;            var account = CloudStorageHelper.GetCloudStorageAccount();&#xA;            &#xA;            var tableClient = CloudStorageHelper.GetCloudTableClient(account);&#xA;            tableClient.CreateTableIfNotExist(ConfigurationCache.Current.LogTableName);&#xA;            var logContext = tableClient.GetDataServiceContext();&#xA;&#xA;            var queueClient = CloudStorageHelper.GetCloudQueueClient(account);&#xA;            var enablerQueue = queueClient.GetQueueReference(ConfigurationCache.Current.EnablerQueueName);&#xA;            enablerQueue.CreateIfNotExist();&#xA;            var disablerQueue = queueClient.GetQueueReference(ConfigurationCache.Current.DisablerQueueName);&#xA;            disablerQueue.CreateIfNotExist();&#xA;            #endregion&#xA;&#xA;            while (true)&#xA;            {&#xA;                try&#xA;                {&#xA;                    if (subDomain == null)&#xA;                    {&#xA;                        #region Wait for enabler message&#xA;                        var enableMsg = enablerQueue.GetMessage();&#xA;                        if (enableMsg != null)&#xA;                        {&#xA;                            var assemblyName = enableMsg.AsString;&#xA;                            enablerQueue.DeleteMessage(enableMsg);&#xA;&#xA;                            subDomain = AppDomain.CreateDomain(&#xA;                                &quot;Subdomain&quot;,&#xA;                                null,&#xA;                                new AppDomainSetup() { ApplicationBase = System.Environment.CurrentDirectory });&#xA;                            var bootstrapper = (Bootstrapper)subDomain.CreateInstanceAndUnwrap(&#xA;                                exeAssembly,&#xA;                                typeof(Bootstrapper).FullName);&#xA;                            if (!bootstrapper.TryStartup(assemblyName))&#xA;                            {&#xA;                                AppDomain.Unload(subDomain);&#xA;                                subDomain = null;&#xA;                            }&#xA;                        }&#xA;                        #endregion&#xA;                    }&#xA;                    else&#xA;                    {&#xA;                        #region Wait for disabler message&#xA;                        var disableMsg = disablerQueue.GetMessage();&#xA;                        if (disableMsg != null)&#xA;                        {&#xA;                            disablerQueue.DeleteMessage(disableMsg);&#xA;                            try&#xA;                            {&#xA;                                AppDomain.Unload(subDomain);&#xA;                            }&#xA;                            finally&#xA;                            {&#xA;                                subDomain = null;&#xA;                            }&#xA;                        }&#xA;                        #endregion&#xA;                    }&#xA;&#xA;                    Thread.Sleep(10000);&#xA;                }&#xA;                catch (Exception ex)&#xA;                {&#xA;                    CloudStorageHelper.WriteLog(logContext, ex);&#xA;                }&#xA;            }&#xA;        }&#xA;&#xA;        public override bool OnStart()&#xA;        {&#xA;            // Set the maximum number of concurrent connections &#xA;            ServicePointManager.DefaultConnectionLimit = 12;&#xA;&#xA;            // For information on handling configuration changes&#xA;            // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.&#xA;&#xA;            return base.OnStart();&#xA;        }&#xA;    }&#xA;}" />
    <param name="CodeType" value="c#" />
  </function>
  {% highlight javascript %}using System;
using System.Collections.Concurrent;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using AzureDynamicLoader.Common;

namespace ADL.Wrk
{
    internal class Bootstrapper : MarshalByRefObject
    {
        public bool TryStartup(string assemblyName)
        {
            var account = CloudStorageHelper.GetCloudStorageAccount();
            var logContext = CloudStorageHelper.GetCloudTableClient(account).GetDataServiceContext();

            try
            {
                // Check if assembly name also contains a type name
                var typeName = string.Empty;
                if (assemblyName.Contains(';'))
                {
                    var nameParts = assemblyName.Split(';');
                    assemblyName = nameParts[0];
                    typeName = nameParts[1];
                }

                // Get assembly from blob store
                CloudStorageHelper.WriteLog(logContext, string.Format("Trying to load {0} from blob store", assemblyName));
                var blobClient = CloudStorageHelper.GetCloudBlobClient(account);
                var assemblyBlob = blobClient
                    .GetContainerReference(ConfigurationCache.Current.ContainerName)
                    .GetBlobReference(assemblyName);
                var binaryAssembly = assemblyBlob.DownloadByteArray();

                // Load assembly needed for geo operations (SQL Server Feature Pack)
                Assembly.LoadFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Microsoft.SqlServer.Types.dll"));
                Assembly.Load(typeof(IObserver<,>).Assembly.FullName);
                Assembly.Load(typeof(ObservableExtensions).Assembly.FullName);
                Assembly.Load(typeof(EnumerableEx).Assembly.FullName);
                var assembly = Assembly.Load(binaryAssembly);

                // Look for startup type (has to implement IStartup)
                CloudStorageHelper.WriteLog(logContext, "Looking for type in dynamically loaded assembly");
                var startupType = assembly.GetTypes().Where(t => (typeName.Length == 0 || t.Name == typeName) && typeof(IStartup).IsAssignableFrom(t)).FirstOrDefault();
                if (startupType != null)
                {
                    CloudStorageHelper.WriteLog(logContext, string.Format("Found type {0}", startupType.FullName));

                    // Setup logging queue
                    var logQueue = new BlockingCollection<string>(5000);
                    Task.Factory.StartNew(() =>
                        {
                            foreach (var logItem in logQueue.GetConsumingEnumerable())
                            {
                                CloudStorageHelper.WriteLog(logContext, logItem);
                            }
                        });

                    // Create instance of startup type and start Run method in a separate thread
                    var startupObject = Activator.CreateInstance(startupType) as IStartup;
                    CloudStorageHelper.WriteLog(logContext, "Starting dynamically loaded component async.");
                    Task.Factory.StartNew(() =>
                        {
                            try
                            {
                                startupObject.Run(
                                    s => logQueue.Add(s),
                                    ex => logQueue.Add(CloudStorageHelper.GetExceptionText(ex)));
                            }
                            catch (Exception ex)
                            {
                                CloudStorageHelper.WriteLog(CloudStorageHelper.GetCloudTableClient().GetDataServiceContext(), ex);
                            }
                        });
                    CloudStorageHelper.WriteLog(logContext, "Launched dynamically loaded component async.");

                    // Return true to indicate that worker thread has been started successfully
                    return true;
                }
                else
                {
                    CloudStorageHelper.WriteLog(logContext, "Did not find a type that implements IStartup");
                }
            }
            catch (Exception ex)
            {
                CloudStorageHelper.WriteLog(logContext, ex);
            }

            // Return false to indicate that there has been an error
            return false;
        }
    }
}{% endhighlight %}
</p><h2>The <span class="InlineCode">dynamic</span> keyword and the Dynamic Language Runtime</h2><p>The support of the DLR in general and the <span class="InlineCode">dynamic</span> keyword in particular will be the next part of the workshop. <span class="InlineCode">dynamic</span> is especially useful when working with dynamic type systems (e.g. COM, HTML DOM, Python, etc.). In the workshop I will firstly describe the basics of the DLR (e.g. expression trees, call sites, etc.). Step by step we will implement our own tiny little version of <span class="InlineCode">ExpandoObject</span>. Last but not least I will show practical applications of the DLR together with IronPython in a WPF application.</p><p>Here is the source code of our own demo implementation of <span class="InlineCode">IDynamicMetaObjectProvider</span>:</p>{% highlight javascript %}using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq.Expressions;

namespace DynamicPropertyBag
{
    public class PropertyBag : IDynamicMetaObjectProvider
    {
        private Dictionary<string, dynamic> values = new Dictionary<string, dynamic>();

        public PropertyBag()
        {
        }

        protected PropertyBag(IEnumerable<KeyValuePair<object, object>> properties)
            : this()
        {
            foreach (var prop in properties)
            {
                this.SetMember(prop.Key.ToString(), prop.Value);
            }
        }

        public dynamic GetMember(string name)
        {
            return this.values[name];
        }

        public void SetMember(string name, dynamic value)
        {
            this.values[name] = value;
        }

        public DynamicMetaObject GetMetaObject(Expression parameter)
        {
            return new DynamicGetSetMetaObject<PropertyBag>(this, parameter);
        }

        private class DynamicGetSetMetaObject<T> : System.Dynamic.DynamicMetaObject
        {
            public DynamicGetSetMetaObject(T v, Expression e)
                : base(e, BindingRestrictions.Empty, v)
            {
            }

            public override DynamicMetaObject BindGetMember(GetMemberBinder info)
            {
                var x = this.Expression;
                var test = Expression.TypeIs(x, typeof(T));
                var target = Expression.Call(
                                  Expression.Convert(x, typeof(T)),
                                  typeof(T).GetMethod("GetMember"),
                                  Expression.Constant(info.Name));
                return new System.Dynamic.DynamicMetaObject(target, BindingRestrictions.GetExpressionRestriction(test));
            }

            public override DynamicMetaObject BindSetMember(SetMemberBinder info, DynamicMetaObject value)
            {
                var expression = Expression.TypeIs(this.Expression, typeof(T));
                var target = Expression.Block(
                    Expression.Call(
                        Expression.Convert(this.Expression, typeof(T)),
                        typeof(T).GetMethod("SetMember"),
                        Expression.Constant(info.Name),
                        Expression.Convert(value.Expression, typeof(object))),
                    Expression.Convert(value.Expression, typeof(object)));
                return new System.Dynamic.DynamicMetaObject(target, BindingRestrictions.GetExpressionRestriction(expression));
            }
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            dynamic myObj = new PropertyBag();
            myObj.FirstName = "Rainer";
            myObj.LastName = "Stropek";

            Console.WriteLine(myObj.LastName);
        }
    }
}{% endhighlight %}<p>The DLR + IronPython sample that brings everything together demonstrates the following features:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2011/02/IronPythonDemoScreenshot.png" class="    mceC1Focused mceC1Focused mceC1Focused" />
</p><ol>
  <li>Execute Python scripts from a C# application</li>
  <li>Dynamic UI using WPF and Python</li>
  <li>Adding custom business logic to an existing app using Python and data binding</li>
  <li>Python-based WPF converter</li>
  <li>Adding Excel export functions to a WPF application using Python</li>
</ol><p>Interested in the source code. Everything is in the slides (see top of this article). You can also <a href="{{site.baseurl}}/content/images/blog/2011/02/DLR and Python.zip" target="_blank">download the Visual Studio solution</a> and try it.</p><h2>Managed Extensibility Framework (MEF)</h2><p>Depending on the time and the interest of the participants I will close the workshop with a (more or less deep) introduction of MEF. This part of the C# 4 workshop will be similar to what I showed in Munich. You can find the sample code and hands on labs in the <a href="/blog/2010/12/07/Hands-On-Labs-Visual-Studio-IDE">corresponding blog article</a>.</p>