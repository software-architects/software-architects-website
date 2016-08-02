---
layout: blog
title: BASTA Spring 2013 -  C# Powerworkshop
excerpt: Auf der BASTA 2013 Spring Konferenz habe ich einen ganztägigen Workshop zum Thema C# mit Schwerpunkt auf parallele und asynchrone Programmierung gehalten. In diesem Blogartikel gibt es die Slides und Samples zum Download.
author: Rainer Stropek
date: 2013-02-25
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET,C#]
permalink: /devblog/2013/02/25/BASTA-Spring-2013-C-Powerworkshop
---

<p>Auf der <a href="http://www.basta.net" title="BASTA Homepage" target="_blank">BASTA 2013 Spring Konferenz</a> habe ich einen ganztägigen Workshop zum Thema C# mit Schwerpunkt auf parallele und asynchrone Programmierung gehalten. In diesem Blogartikel gibt es die Slides und Samples zum Download.</p><h2>Abstract</h2><p>Hier der Vollständigkeit halber nochmals der Abstract für den Workshop:</p><p>
  <em>
    <span>Die fünfte Version von C# ist da. Zeit, sich intensiv damit auseinanderzusetzen und einen Blick in die Zukunft zu werfen. Rainer Stropek bietet auch dieses Jahr wieder geballtes C#-Wissen in diesem ganztägigen Workshop an. Der Schwerpunkt sind die Neuerungen von C# 5 hinsichtlich asynchroner und paralleler Programmierung. Rainer wiederholt zu Beginn die Grundlagen der parallelen Programmierung mit .NET (und wird dabei viele nützliche Tipps weitergeben). Danach geht er auf die Anwendung dieser Basics in C# 5 mit async/await ein. Wir kratzen nicht nur an der Oberfläche, sondern gehen wirklich ins Detail. Am Nachmittag wird Rainer einen Ausblick auf die Zukunft von C# geben und zeigen, was Projekte wie "Roslyn" an Änderungen für C#-Entwickler bringen werden.</span>
  </em>
</p><h2>Slides</h2><p>Hier gibt es die <a href="{{site.baseurl}}/content/images/blog/2013/02/CSharp Powerworkshop BASTA Spring 2013 - Rainer Stropek.pdf" title="Slides als PDF Datei" target="_blank">Slides als PDF Datei zum Download</a>.</p><h2>Samples</h2><p>Im Workshop haben wir live eine ganze Reihe von Samples erarbeitet. Die gesamte Sammlung an Samples gibt es <a href="{{site.baseurl}}/content/images/blog/2013/02/BastaCSharpWorkshopSamples.zip" title="Samples als ZIP Datei" target="_blank">hier zum Download</a>. Falls jemand nur ein Code Snippet sucht und nicht alle Samples herunterladen möchte, füge ich unten die wichtigsten Sourcen direkt in den Text dieses Blogartikels ein.</p><h3>Task Basics</h3>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TaskBasics
{
    class Program
    {
        static void Main(string[] args)
        {
            Action<Action> measure = (subTask) =>
                {
                    var watch = new Stopwatch();
                    watch.Start();
                    subTask();
                    Console.WriteLine(
                        "Thread ID: {0}\t{1}",
                        Thread.CurrentThread.ManagedThreadId,
                        watch.Elapsed);
                };

            Action calculationTask = () =>
            {
                for (int i = 0; i < 500000000; i++) ;
            };
            Action waitTask = () =>
            {
                Thread.Sleep(1000);
            };

            ThreadPool.SetMinThreads(50, 50);

            measure(() =>
                {
                    var tArray = new Task[200];
                    for (var i = 0; i < tArray.Length; i++)
                    {
                        tArray[i] = Task.Factory.StartNew(()=> measure(waitTask));
                    }

                    Task.WaitAll(tArray);
                });
        }
    }
}{% endhighlight %}<h3>Task Continuations</h3>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace TaskContinuations
{
    class Program
    {
        static void Main(string[] args)
        {
            var are = new AutoResetEvent(false);

            var tDatabase = new Task<int>[2];
            tDatabase[0] = Task<int>.Factory.StartNew(GetValueFromDatabase);
            tDatabase[1] = Task<int>.Factory.StartNew(GetValueFromDatabase);
            Task.Factory.ContinueWhenAll(
                    tDatabase,
                    tDatabaseResult => Add(tDatabaseResult[0].Result, tDatabaseResult[1].Result))
                .ContinueWith(tAddResult =>
                {
                    // Simulate writing the result in a log file
                    Task.Factory.StartNew(() =>
                        {
                            Thread.Sleep(200);
                            Print(tAddResult.Result);
                        },
                        TaskCreationOptions.AttachedToParent);
                })
                .ContinueWith(_ => are.Set());

            Console.WriteLine("Do something interesting on UI thread");

            are.WaitOne();
        }

        private static int GetValueFromDatabase()
        {
            var rand = new Random();
            return rand.Next(100);
        }

        private static int Add(int x, int y)
        {
            return x + y;
        }

        private static void Print(int x)
        {
            Console.WriteLine(x);
        }
    }
}{% endhighlight %}<h3>Parallel-Class, PLINQ, ThreadStatic</h3>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace PiWithMonteCarlo
{
    public class ThreadSafeRandom
    {
        private static Random _global = new Random();

        [ThreadStatic]
        private static Random _local;

        public static double NextDouble()
        {
            var inst = _local;
            if (inst == null)
            {
                int seed;
                lock (_global) seed = _global.Next();
                _local = inst = new Random(seed);
            }

            return inst.NextDouble();
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            //ImplementationOne();
            ImplementationTwo();
        }

        private static void ImplementationTwo()
        {
            Console.WriteLine(
                (double)ParallelEnumerable.Range(0, 30000000)
                    .Select(_ => new { X = ThreadSafeRandom.NextDouble(), Y = ThreadSafeRandom.NextDouble() })
                    .Count(pt => Math.Sqrt(pt.X * pt.X + pt.Y * pt.Y) <= 1)
                    * 4 / 30000000);
        }

        private static void ImplementationOne()
        {
            var startDateTime = DateTime.Now;

            long numberOfCalculations = 0;
            long numberOfValuesInside = 0;
            object counterLockObject = new Object();
            while (true)
            {
                Parallel.For(0, 100000, _ =>
                {
                    var rand = new Random();
                    long localNumberOfCalculations = 0;
                    long localNumberOfValuesInside = 0;
                    for (int i = 0; i < 1000; i++)
                    {
                        // Do monte carlo simulation
                        var a = rand.NextDouble();
                        var b = rand.NextDouble();
                        var c = Math.Sqrt(a * a + b * b);

                        if (c <= 1)
                        {
                            localNumberOfValuesInside++;
                        }

                        localNumberOfCalculations++;
                    }

                    lock (counterLockObject)
                    {
                        numberOfValuesInside += localNumberOfValuesInside;
                        numberOfCalculations += localNumberOfCalculations;

                        if (numberOfCalculations % 10000000 == 0)
                        {
                            Console.WriteLine("{0}\t{1}",
                                numberOfCalculations / 1000 / (DateTime.Now - startDateTime).TotalSeconds,
                                (double)numberOfValuesInside / numberOfCalculations * 4);
                        }
                    }
                });
            }
        }
    }
}{% endhighlight %}<h3>TaskCompletionSource</h3>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Diagnostics;

namespace TasksAdvancedTips
{
    class Program
    {
        static void Main(string[] args)
        {
            ExecuteProcessAsync("cmd", "/C echo done").Wait();
        }

        static Task ExecuteProcessAsync(string commandLine, string arguments)
        {
            var taskCompletionSource = new TaskCompletionSource<object>();
            var p = Process.Start(commandLine, arguments);
            p.EnableRaisingEvents = true;
            p.Exited += (_, __) =>
                {
                    // Process is done!
                    taskCompletionSource.SetResult(null);
                };
            p.Start();
            return taskCompletionSource.Task;
        }

        /// <summary>
        /// Ineffizient!
        /// </summary>
        static Task<int> DivideInefficientAsync(int x, int y)
        {
            return Task.Factory.StartNew(() =>
                {
                    if (y == 0)
                    {
                        return 0;
                    }
                    else
                    {
                        Thread.Sleep(1000);
                        return x / y;
                    }
                });
        }

        static Task<int> NullTask = Task.FromResult(0);
        static Task<int> DivideAsync(int x, int y)
        {
            if (y == 0)
            {
                return NullTask;
            }
            return Task.Factory.StartNew(() =>
            {
                Thread.Sleep(1000);
                return x / y;
            });
        }
    }
}{% endhighlight %}<h3>Producer/Consumer, BlockingCollection</h3>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace ProducerConsumer
{
    class Program
    {
        static void Main(string[] args)
        {
            var q = new BlockingCollection<int>(10);

            var tProducers = new Task[10];
            for (var i = 0; i < tProducers.Length; i++)
            {
                tProducers[i] = Task.Factory.StartNew(() => Producer(q));
            }
            var tConsumer = Task.Factory.StartNew(() => Consumer(q));

            Task.WaitAll(tProducers);
            q.CompleteAdding();

            tConsumer.Wait();
        }

        static void Producer(BlockingCollection<int> q)
        {
            var rand = new Random();
            for (int i = 0; i < 100; i++)
            {
                Thread.Sleep(10);
                q.Add(rand.Next(100));
            }
        }

        static void Consumer(BlockingCollection<int> q)
        {
            foreach (var item in q.GetConsumingEnumerable())
            {
                Console.WriteLine(item);
            }
        }
    }
}{% endhighlight %}<h3>ViewModel with async/await</h3>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Windows.Input;
using System.Data.SqlClient;
using Microsoft.Practices.Prism.Commands;
using Microsoft.Practices.Prism.ViewModel;

namespace FastAndFluidUI
{
    public class MainWindowViewModel : NotificationObject
    {
        public MainWindowViewModel()
        {
            this.Customers = new ObservableCollection<Customer>();

            this.RefreshButton = new DelegateCommand(
                DoRefreshDataAsync,
                () => !this.IsLoading);
        }

        public ObservableCollection<Customer> Customers { get; private set; }

        public DelegateCommand RefreshButton { get; private set; }

        public bool IsLoading { get; private set; }

        private async void DoRefreshDataAsync()
        {
            this.IsLoading = true;
            this.RaisePropertyChanged(() => this.IsLoading);
            this.RefreshButton.RaiseCanExecuteChanged();

            //var cts = new CancellationTokenSource();
            //cts.CancelAfter(200);
            await this.RefreshDataAsync(CancellationToken.None);

            this.IsLoading = false;
            this.RaisePropertyChanged(() => this.IsLoading);
            this.RefreshButton.RaiseCanExecuteChanged();
        }

        private async Task RefreshDataAsync(CancellationToken token)
        {
            using (var conn = new SqlConnection("Server=mydb.database.windows.net;Database=BastaWorkshop;User=BastaWorkshop;Password=P@ssW0rd!"))
            {
                await conn.OpenAsync(token);
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
WAITFOR DELAY '0:0:5';
SELECT * FROM Customers;
";
                    using (var reader = await cmd.ExecuteReaderAsync(token))
                    {
                        while (reader.Read())
                        {
                            var c = new Customer()
                                {
                                    CustomerId = reader.GetInt32(0),
                                    CustomerName = reader.GetString(1),
                                    CustomerValue = reader.GetString(2)
                                };
                            this.Customers.Add(c);
                        }
                    }
                }
            }
        }
    }
}{% endhighlight %}<h3>Expression Trees, DLR Scripting (Into to Roslyn)</h3>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;
using IronPython.Hosting;
using IronPython.Runtime;
using Microsoft.Scripting;
using Microsoft.Scripting.Hosting; 

namespace RoslynAndExpressionTrees
{
    public class Person
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            var a = 5;
            var b = 7;
            var c = 3;

            Func<int, int, int, bool> f = (x, y, z) =>
                x==5 && ( y==7 || z==3 || y==5 );

            Expression<Func<int, int, int, bool>> ex = (x, y, z) =>
                x == 5 && (y == 7 || z == 3 || y == 5);

            var p1 = Expression.Parameter(typeof(int), "x");
            var p2 = Expression.Parameter(typeof(int), "y");
            Expression<Func<int, int, int>> ex2 =
                Expression.Lambda<Func<int, int, int>>(
                    Expression.Add(
                        p1,
                        p2),
                    new[] { p1, p2 });
            Func<int, int, int> resultFunc = ex2.Compile();

            var engine = Python.CreateEngine();
            var scope = engine.CreateScope();
            var p = new Person() { FirstName = "Mad", LastName = "Max" };
            scope.SetVariable("p", p);
            var script = engine.CreateScriptSourceFromString("p.FirstName=\"Rainer\"");
            script.Execute(scope);

            Console.WriteLine(p.FirstName);
        }
    }
}{% endhighlight %}