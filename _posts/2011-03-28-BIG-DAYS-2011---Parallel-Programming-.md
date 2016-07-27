---
layout: blog
title: BIG DAYS 2011 - Parallel Programming 
excerpt: At the BIGDAYS 2011, the largest roadshow of Microsoft in Austria with approx. 1,700 visitors, I do a session about parallel programming together with Andreas Schabus. In the session we start with the basics of parallel programming in .NET 4 and C# 4. Based on that we discuss the importance of parallel programming in Windows Azure and do demos for scaling out compute tasks into the cloud as well as a demo for parallel querying using the concept of horizontal sharding in the SQL Azure database layer.
author: Rainer Stropek
date: 2011-03-28
bannerimage: 
lang: en
tags: [.NET]
permalink: /devblog/2011/03/28/BIG-DAYS-2011---Parallel-Programming-
---

<p>At the BIG&gt;DAYS 2011, the largest roadshow of Microsoft in Austria with approx. 1,700 visitors, I do a session about parallel programming together with Andreas Schabus. In the session we start with the basics of parallel programming in .NET 4 and C# 4. Based on that we discuss the importance of parallel programming in Windows Azure and do demos for scaling out compute tasks into the cloud as well as a demo for parallel querying using the concept of horizontal sharding in the SQL Azure database layer.</p><p>If you are interested in the slides, <a href="{{site.baseurl}}/content/images/blog/2011/03/BigDays 2011_Parallel Data Processing On Premise und in der Cloud FINAL.pdf" target="_blank">here they are</a> (unfortunately only available in German; however, samples are international by nature).</p><p>Today I found the time to record the introductory demo of the talk (my cat forced me to keep sitting in front of my computer by laying down on my lap so I had some minutes of "spare" time). If you are interested here is the video of the demo. If you are wondering what's the difference between tasks and threads in .NET 4 or you just want to get into parallel programming it could help.</p><iframe width="480" height="390" title="YouTube video player" src="https://www.youtube.com/embed/r1FbKiHYHcw" frameborder="0"></iframe><h2>Step 1 - Performing a task in background</h2>{% highlight c# %}Action<Action> measure = (body) =>{ 
  var startTime = DateTime.Now; 
  body(); 
  Console.WriteLine("{0} {1}", Thread.CurrentThread.ManagedThreadId, DateTime.Now - startTime); 
}; 

Action calcProcess = () => { for (int i = 0; i < 350000000; i++);}; 

measure(() =>{ 
  var tasks = new[] { 
    Task.Factory.StartNew(() => measure(calcProcess)), 
    […] 
    Task.Factory.StartNew(() => measure(calcProcess)) 
  }; 

  Task.WaitAll(tasks); 
}); {% endhighlight %}<p>You can write the last line of code much cleaner:</p>{% highlight c# %}measure(() => { 
  Task.WaitAll(Enumerable.Range(0, 10) 
  .Select(_ => Task.Factory.StartNew(() => measure(calcProcess))) 
  .ToArray()); 
});{% endhighlight %}<p>Still a lot of code. It is much easier like this:</p>{% highlight c# %}Parallel.For(0, 10, _ => { measure(calcProcess); });{% endhighlight %}<h2>Step 2 - Perform IO-bound tasks instead of parallel calculations</h2><p>Take the first sample and simulate IO bound tasks instead of parallel calculations. You will see that TPL behaves differently (see videos for details):</p>{% highlight c# %}Action<Action> measure = (body) =>{ 
  var startTime = DateTime.Now; 
  body(); 
  Console.WriteLine("{0} {1}", Thread.CurrentThread.ManagedThreadId, 
  DateTime.Now - startTime); 
}; 

Action calcProcess = () => { for (int i = 0; i < 350000000; i++);}; 
Action ioProcess = () => { Thread.Sleep(1000); }; 

measure(() =>{ 
  Task.WaitAll(Enumerable.Range(0, 10) 
  .Select(_ => Task.Factory.StartNew(() => measure(ioProcess))) 
  .ToArray()); 
});{% endhighlight %}<p>Behind the scenes tasks are still using the good old thread pool. You can see that if you play around with the thread pool size (be very careful with that in real projects; think about writing your own scheduler if you really full control):</p>{% highlight c# %}ThreadPool.SetMinThreads(5, 5); 
measure(() =>{ 
  Task.WaitAll(Enumerable.Range(0, 10) 
  .Select(_ => Task.Factory.StartNew(() => measure(ioProcess))) 
  .ToArray()); 
});{% endhighlight %}<h2>Step 3 - Use PLINQ instead of TPL</h2><p>PLINQ makes parallel programming sometimes easier. Check out how you could use it in the previous sample:</p>{% highlight c# %}measure(() => Enumerable.Range(0, 10)
  .AsParallel() 
  .ForAll(_ => measure(ioProcess)));{% endhighlight %}<p>Note that you can write this much shorter:</p>{% highlight c# %}measure(() => ParallelEnumerable.Range(0, 10) 
  .ForAll(_ => measure(ioProcess)));{% endhighlight %}<p>You can also control the degree of parallelism:</p>{% highlight c# %}measure(() => ParallelEnumerable.Range(0, 10) 
  .WithDegreeOfParallelism(5) 
  .ForAll(_ => measure(ioProcess)));{% endhighlight %}<h2>Step 4 - Data structures for parallel programming</h2><p>Note that the following implementation of a producer/consumer pattern is TOTALLY WRONG because the old collections are not thread safe (there are many more mistakes in the following code so do not use it!!).</p>{% highlight c# %}var queue = new Queue<int>(100); 

var producers = Enumerable.Range(1, 5) 
  .Select(i => Task.Factory.StartNew(() => 
  { 
    var rand = new Random(); 
    for (int counter = 0; counter < 100; counter++) 
    { 
      queue.Enqueue(rand.Next(1000000)); // WRONG because queue is not thread safe
      Thread.Sleep(100); 
    } 
  })) 
  .ToArray(); 

var consumers = Enumerable.Range(1, 3) 
  .Select(i => Task.Factory.StartNew(() => 
  { 
    while(true) 
    { 
      while (queue.Count == 0) 
      { 
        Thread.Sleep(100); 
      } 
      Console.WriteLine(queue.Dequeue()); // WRONG because queue is not thread safe
    } 
  })) 
  .ToArray(); 

Task.WaitAll(producers.Concat(consumers).ToArray());{% endhighlight %}<p>With the new concurrent data structures from .NET 4 implementing producer/consumer patterns in parallel is a piece of cake:</p>{% highlight c# %}var queue = new BlockingCollection<int>(100); 

var producers = Enumerable.Range(1, 5) 
  .Select(i => Task.Factory.StartNew(() => 
  { 
    var rand = new Random(); 
    for (int counter = 0; counter < 100; counter++) 
    { 
      queue.Add(rand.Next(1000000)); 
      Thread.Sleep(100); 
    } 
  })) 
  .ToArray(); 

var consumers = Enumerable.Range(1, 3) 
  .Select(i => Task.Factory.StartNew(() => 
  {  
    foreach(var item in queue.GetConsumingEnumerable()) 
    { 
      Console.WriteLine(item); 
    } 
  })) 
  .ToArray(); 

Task.WaitAll(producers); 
queue.CompleteAdding(); 
Task.WaitAll(consumers); {% endhighlight %}