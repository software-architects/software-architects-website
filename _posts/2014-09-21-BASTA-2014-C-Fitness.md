---
layout: blog
title: BASTA 2014 -  C# Fitness
excerpt: Tomorrow I will do a full-day workshop about C# at BASTA Germany. Over the years, the workshop has become a tradition and I am really looking forward to it. In this blog article I publish slides, code samples, and important links for attendees.
author: Rainer Stropek
date: 2014-09-21
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET,Azure,C#]
ref: 
permalink: /devblog/2014/09/21/BASTA-2014-C-Fitness
---

<p>Tomorrow I will do a full-day workshop about <a href="http://basta.net/2014/sessions/c-fitness" target="_blank">C# at BASTA Germany</a>. Over the years, the workshop has become a tradition and I am really looking forward to it. In this blog article I publish slides, code samples, and important links for attendees. Here is the workshop's abstract (German):</p><div style="margin-left: 2em">
  <p>
    <em>Mit einem Alter von über 12 Jahren kann man in der kurzlebigen IT Branche bei C# ohne weiteres bereits von einem Klassiker sprechen. Die Programmiersprache hat allerdings nichts von ihrer Aktualität eingebüßt. Ganz im Gegenteil, durch Dinge wie async/await hat sich C# an die Spitze der führenden Programmiersprachen katapultiert.</em>
  </p>
  <p>
    <em>Rainer Stropek gestaltet seit vielen Jahren auf der BASTA Workshop über C#. Ein ganzer Tag, der nur der Frage gewidmet ist, wie man noch besseres C# schreiben und von welchen Neuerungen man profitieren kann. Fix auf der Agenda des Workshops finden sich diesmal folgende Themen:</em>
  </p>
  <ul>
    <li>
      <em>Performanceoptimierung in C# Anwendungen (z.B. Profiler, Tipps und Tricks rund um JITer, Garbage Collector &amp; Co)</em>
    </li>
    <li>
      <em>Parallele und asynchrone Programmierung in C#</em>
    </li>
    <li>
      <em>Aspekte der funktionalen Programmierung in C#</em>
    </li>
    <li>
      <em>Modularisierung mit NuGet und Portable Class Libraries (PCL)</em>
    </li>
    <li>
      <em>Neuerungen in Visual Studio</em>
    </li>
  </ul>
  <p>
    <em>Natürlich ergänzt Rainer die Tagesordnung wie immer kurzfristig um ganz aktuelle Themen rund um Visual Studio vNext, Projekt Roslyn, etc.</em>
  </p>
  <p>
    <em>Machen Sie sich bereit für einen Tag mit vielen praktischen Tipps und jeder Menge Codebeispiele. Rainer setzt im Workshop Basiswissen über C# (mindestens Version 2, idealerweise Version 3) voraus. Ein eigener Laptop ist im Workshop nicht unbedingt Voraussetzung.</em>
  </p>
</div><h2>Optimizing Performance of C# Applications</h2><h3>Content</h3><p>Optimizing performance of C# application will be the prime topic of the morning during the workshop. I will cover multiple scenarios:</p><ol>
  <li>Identifying and removing performance problems in DB-related applications</li>
</ol><p class="showcase">I have summarized the sample I will use for DB-related application profiling in <a href="http://www.software-architects.com/devblog/2014/09/22/Profiling-of-DB-Related-C-Applications" target="_blank">this separate blog article</a>.</p><ol>
  <li>Finding performance killers in parallel and async CPU-bound algorithms</li>
</ol><p class="showcase">I have summarized the sample I will use for parallel and async in <a href="http://www.software-architects.com/devblog/2014/09/22/C-Parallel-and-Async-Programming" target="_blank">this separate blog article</a>.</p><ol>
  <li>Hunting memory leaks</li>
</ol><h3>Tools</h3><p>During the workshop I will use multiple tools inside and outside of Visual Studio. Here are the links:</p><ul>
  <li>You can analyze performance in Visual Studio with the <a href="http://msdn.microsoft.com/en-us/library/z9z62c29.aspx" target="_blank">Visual Studio Performance Explorer</a></li>
  <li>If you need to dig deeper, <a href="http://www.microsoft.com/en-us/download/details.aspx?id=28567" target="_blank">PerfView</a> will be of great help</li>
  <li>As an example of a commercial 3rd party profiling tool, I will use <a href="http://www.red-gate.com/products/dotnet-development/dotnet-developer-bundle/" target="_blank">Red Gate's ANTS Profilers</a></li>
  <li>To analyze SQL-related issues, I use Microsoft SQL Server's Management Studio (if you don't have it, it comes for free with the <a href="http://www.microsoft.com/en-us/server-cloud/products/sql-server-editions/sql-server-express.aspx" target="_blank">SQL Express Edition</a>)</li>
</ul><h3>Source Code</h3><p class="showcase">You can download the source code I use during the workshop in <a href="https://github.com/rstropek/Samples" target="_blank">my GitHub repository</a>:</p><ul>
  <li>
    <a href="https://github.com/rstropek/Samples/tree/master/ProfilingWorkshop/AdoNetPerfProfiling" target="_blank">Code for DB-related sample</a>
  </li>
  <li>
    <a href="https://github.com/rstropek/Samples/tree/master/ProfilingWorkshop/WebLoadTest" target="_blank">Web and load test for DB-related sample</a>
  </li>
  <li>
    <a href="https://github.com/rstropek/Samples/tree/master/ProfilingWorkshop/PiWithMonteCarlo/PiWithMonteCarlo" target="_blank">Sample for parallel and sync programming as well as profiling of CPU-bound algorithms</a>
  </li>
  <li>
    <a href="https://github.com/rstropek/Samples/tree/master/ProfilingWorkshop/PiWithMonteCarlo.TestDriver" target="_blank">Command line</a> and <a href="https://github.com/rstropek/Samples/tree/master/ProfilingWorkshop/PiWithMonteCarloUI" target="_blank">WPF test drivers</a> for previous sample</li>
  <li>Memory leak hunting sample <a href="https://github.com/rstropek/Samples/tree/master/WpfMemoryLeakHunting/SampleWithLeaks" target="_blank">with leaks</a> and <a href="https://github.com/rstropek/Samples/tree/master/WpfMemoryLeakHunting/SampleWithoutLeaks" target="_blank">without leaks</a></li>
</ul><h2>NuGet</h2><p class="showcase">Here you can <a href="{{site.baseurl}}/content/images/blog/2014/09/NuGet.pdf" target="_blank">download the NuGet slide deck</a> I use during the workshop.</p>