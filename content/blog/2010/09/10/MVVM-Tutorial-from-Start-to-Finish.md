---
layout: blog
title: MVVM Tutorial from Start to Finish
teaser: Today I am at the NRWConf, a community event of Microsoft-oriented software developers in the Börse in Wuppertal.Beside presenting our product time cockpit I also do a session about MVVM (Model-View-ViewModel) and data binding with WPF and Silverlight. Because I do the session code-only (no slides!) I have recorded the content last night to enable all participants to repeat the shown sample.
author: Rainer Stropek
date: 2010-09-10
bannerimage: 
lang: en
tags: [Silverlight,WPF]
permalink: /blog/2010/09/10/MVVM-Tutorial-from-Start-to-Finish
---

<p>Today I am at the <a href="http://www.nrwconf.de/" target="_blank">NRWConf</a>, a community event of Microsoft-oriented software developers in the <a href="http://www.bing.com/maps/explore/#/0zbk83yqkkz421zk" target="_blank">Börse in Wuppertal</a>. Beside presenting our product time cockpit I also do a session about MVVM (Model-View-ViewModel) and data binding with WPF and Silverlight. Because I do the session code-only (no slides!) I have recorded the content last night to enable all participants to repeat the shown sample.</p><p>Due to popular demand I packed the sample code into a ZIP-file which you can download <a target="__blank" href="{{site.baseurl}}/content/images/blog/2010/09/SkiResultSample.zip">here</a>.</p><h2>Introduction</h2><p>Separation of UI and logic – obvious goal but how can it be achieved in practise? In this article I want to show a small database application written in C# using Entity Framework, WCF, WPF and Silverlight that uses MVVM to encapsulate the view of the UI, the logic behind the UI and finally model plus business logic.</p><p>Why separation should bother you? Here are only three of the most important things that you get if you clearly separate the tasks in your applications into different layers:</p><ol>
  <li>
    <strong>Enhanced code reuse</strong> – as you will see MVVM enables you to reuse nearly all the code even if the markup code that makes up your UI differs between full client (WPF) and thin client (Silverlight).</li>
  <li>
    <strong>Testability</strong> – UI testing using UI automation tools or libraries is hard. It is much easier to test class libraries. With MVVM you can encapsulate large parts of the logic behind your UI into such a library and test it using plain vanilla unit testing.</li>
  <li>
    <strong>Easier to maintain</strong> – if you have to change something (and this will happen over time, believe me) you know exactly where to look.</li>
</ol><h2>Requirements</h2><p>Our goal is to write a simple data entry application. We want to enable users to maintain sport results. I am Austrian and if there is one sport that we are really good in it is skiing! Therefore our application can be used to maintain results of ski races.  </p><p>At the end the application is a demo program and probably you can think of hundred ways to enhance it. However, we want to keep the requirements really simple. The user should be able to select an event using the combo box at the top of the screen. Then he sees all the sportsmen and women participating in the race. For each competitor the user should be able to enter the time in which she managed to finish. To make it more interesting from a software development perspective we define some additional requirements:</p><ol>
  <li>The application should be available as a <strong>full client and as a web client</strong> (Silverlight)</li>
  <li>Data access has to be done using <strong>Entity Framework</strong></li>
  <li>There has to be a <strong>WCF service layer</strong> between data access and application (even for the full client)</li>
  <li>We will not do automated UI testing (will be the topic for a separate article) but we have to <strong>automatically test as much of the UI logic as possible</strong></li>
</ol><h2>Part 1 - Building the model</h2><p>
  <object height="385" width="480">
    <embed src="https://www.youtube.com/v/g53__vPihFY?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="385" width="480"></embed>
  </object>
</p><h2>Part 2 - Building the WCF-based data access service</h2><p>
  <object height="385" width="480">
    <embed src="https://www.youtube.com/v/xLLfBU_1jOA?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="385" width="480"></embed>
  </object>
</p><h2>Part 3 - Building the basic UI</h2><p>
  <object height="385" width="480">
    <embed src="https://www.youtube.com/v/64hl8leiz2E?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="385" width="480"></embed>
  </object>
</p><h2>Part 4 - Adding more binding logic using a WPF DataGrid</h2><p>
  <object height="385" width="480">
    <embed src="https://www.youtube.com/v/2Pl0pmzJXM0?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="385" width="480"></embed>
  </object>
</p><h2>Part 5 - Automated test for UI-logic (ViewModel)</h2><p>
  <object height="385" width="480">
    <embed src="https://www.youtube.com/v/LgUaMw6EfUc?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="385" width="480"></embed>
  </object>
</p><h2>Part 6 - Adding a detail area</h2><p>
  <object height="385" width="480">
    <embed src="https://www.youtube.com/v/j6VQKZzhmoM?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="385" width="480"></embed>
  </object>
</p><h2>Part 7 - Binding a button command to the ViewModel</h2><p>
  <object height="385" width="480">
    <embed src="https://www.youtube.com/v/ffQhICl6T2U?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="385" width="480"></embed>
  </object>
</p><h2>Part 8 - Showing how to share WPF ViewModel with Silverlight client</h2><p>
  <object height="385" width="480">
    <embed src="https://www.youtube.com/v/UzspXWg4qQY?fs=1&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="385" width="480"></embed>
  </object>
</p>