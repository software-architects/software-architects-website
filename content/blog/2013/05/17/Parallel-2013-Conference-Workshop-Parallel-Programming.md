---
layout: blog
title: Parallel 2013 Conference -  Workshop Parallel Programming
teaser: On May 17th I did a workshop on parallel programming at parallel 2013 conference in Karlsruhe. The attendees asked me to publish some of the live coding samples I did. In this blog you can find the samples.
author: Rainer Stropek
date: 2013-05-17
bannerimage: 
lang: en
tags: [.NET,C#,Visual Studio]
permalink: /blog/2013/05/17/Parallel-2013-Conference-Workshop-Parallel-Programming
---

<p>On May 17th I did a workshop on parallel programming at <a href="http://www.parallel2013.de" target="_blank">parallel 2013</a> conference in Karlsruhe. The attendees asked me to publish some of the live coding samples I did. In this blog you can find the samples.</p><h2>Slides</h2><p>The slides for the workshop were handed out to attendees on memory sticks. However, my slides were quite similar to the slides I have used in my parallel programming workshop at the last <a href="http://www.basta.net" target="_blank">BASTA</a> conference. You can find them on SlideShare:</p><iframe src="http://de.slideshare.net/slideshow/embed_code/15297267?rel=0" width="512" height="421" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen"></iframe><div style="margin-bottom:5px" data-mce-style="margin-bottom: 5px;">
  <strong>
    <a href="http://de.slideshare.net/rstropek/parallel-und-async-basta-at-2012-rainer-stropek" title="Parallel and Async Programming With C#" target="_blank">Parallel and Async Programming With C#</a>
  </strong> from <strong><a href="http://de.slideshare.net/rstropek" target="_blank">Rainer Stropek</a></strong></div><h2>Sample for Introduction for Tasks</h2><p>Here is the sample code that I have developed step by step to describe what a <em>Task</em> is in .NET:</p>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            //var tasks = new Task[10];
            //for (int i = 0; i < tasks.Length; i++)
            //{
            //  tasks[i] = DivideAsync(100, i);
            //}

            //Task.WaitAll(tasks);

            //Task.WaitAll(Enumerable.Range(0, 10)
            //  .Where(i => i % 2 == 0)
            //  .Select(i => DivideAsync(100, i))
            //  .ToArray());

            Task.Run(() => 42)
                .ContinueWith(t =>
                    {
                        Task.Factory.ContinueWhenAll(
                            Enumerable.Range(0, 3)
                                .Select(i => Task.Run(() => { Thread.Sleep(200); return 5; }))
                                .ToArray(),
                                tArray =>
                                {
                                    Thread.Sleep(200);
                                    Console.WriteLine(
                                        tArray.Aggregate<Task<int>, int>(
                                            0,
                                            (agg, current) => agg + current.Result)
                                        );
                                }, TaskContinuationOptions.AttachedToParent);
                    })
                .Wait();
        }

        static Task<int> NullTask = Task.FromResult(0);
        static Task<int> DivideAsync(int x, int y)
        {
            if (y == 0)
            {
                // return NullTask;
                var tcs = new TaskCompletionSource<int>();
                tcs.SetException(new DivideByZeroException());
                return tcs.Task;
            }

            return Task.Run(() =>
                {
                    Thread.Sleep(500);
                    return x / y;
                });
        }
    }
}{% endhighlight %}<h2>Monte Carlo Simulation to Calculate PI</h2><p>This is the serial implementation of the monte carlo simulation example from which we started our discussion about parallel algorithms:</p>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            MonteCarloSerial();
        }

        /// <summary>
        /// Serial implementation of our monte carlo algorithm for calculating PI
        /// </summary>
        /// <remarks>
        /// On my laptop this shows the following results:<br/>
        /// 3,14171336</br>
        /// 32,1411226701302</br>
        /// </remarks>
        public static void MonteCarloSerial()
        {
            var rand = new Random();
            var counterInside = 0;
            var iterations = 350000000;
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            for(int i=0; i<iterations; i++)
            {
                var a = rand.NextDouble();
                var b = rand.NextDouble();
                var c = Math.Sqrt(a * a + b * b);
                if (c <= 1)
                {
                    counterInside++;
                }
            }

            stopwatch.Stop();
            Console.WriteLine(((double)counterInside) / ((double)iterations) * 4);
            Console.WriteLine(iterations / 1000000 / stopwatch.Elapsed.TotalSeconds);
        }
    }
}{% endhighlight %}<p>After a few steps we parallelized the algorithm. Note that it was not our goal to come up with the most optimal algorithm for calculating PI using monte carlo simulation. We have just used the example to discuss various aspects of parallel programming with .NET.</p>{% highlight c# %}private static void MonteCarloAdvancedParallel()
{
    var counterInside = 0;
    var iterations = 350000000;
    var stopwatch = new Stopwatch();
    stopwatch.Start();

    Parallel.For(0, 8, i =>
    {
        if (rand == null)
        {
            rand = new Random();
        }

        var localCounterInside = 0;
        for (var j = 0; j < iterations / 8; j++)
        {
            var a = rand.NextDouble();
            var b = rand.NextDouble();
            var c = a * a + b * b;
            if (c <= 1)
            {
                localCounterInside++;
            }
        }

        Interlocked.Add(ref counterInside, localCounterInside);
    });

    stopwatch.Stop();
    Console.WriteLine(((double)counterInside) / ((double)iterations) * 4);
    Console.WriteLine(iterations / 1000000 / stopwatch.Elapsed.TotalSeconds);
}{% endhighlight %}<h2>Producer/Consumer Pattern</h2><p>In the workshop we discussed various possibilities of implementing producer/consumer problems. The attendees asked me to publish one possible algorithm which makes use of the <em>BlockingCollection&lt;T&gt;</em> class:</p>{% highlight c# %}using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            var queue = new BlockingCollection<int>(5);

            // Alternative: TPL Dataflow Library von .NET 4.5

            // Producer/Consumer oder Pipline-Algorithmen
            var producer = Task.Run(() =>
                {
                    for (int i = 0; i < 100; i++)
                    {
                        Thread.Sleep(100);
                        queue.Add(i);
                    }
                });

            var consumer = Task.Run(() =>
                {
                    foreach (var item in queue.GetConsumingEnumerable())
                    {
                        Console.WriteLine(item);
                    }
                });

            producer.Wait();
            queue.CompleteAdding();
            consumer.Wait();
        }
    }
}{% endhighlight %}