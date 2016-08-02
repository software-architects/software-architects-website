---
layout: blog
title: BASTA 2011 -  Workshop About Software Factories
excerpt: Ok, I feel ashamed. Already more than three weeks have passed since BASTA 2011 has ended - and I did not publish my slides and samples yet. However, today I finally found the time to write this blog post.
author: Rainer Stropek
date: 2011-10-24
bannerimage: 
bannerimagesource: 
lang: en
tags: [Presentations]
permalink: /devblog/2011/10/24/BASTA-2011-Workshop-About-Software-Factories
---

<p>Ok, I feel ashamed. Already more than three weeks have passed since BASTA 2011 has ended - and I did not publish my slides and samples yet. However, today I finally found the time to write this blog post.</p><p>My BASTA week started with a full-day workshop about software factories. I covered the following topics:</p><ol>
  <li>Introduction to software factories</li>
  <li>How to design class libraries that will be used in you software factory

<ol><li>Scenario Driven Design</li><li>Framework Design Guidelines for .NET and C#</li><li>Enable domain-specific modelling using a XAML-enabled class library</li><li>Using StyleCop and Visual Studio Code Analysis for automated code quality assurance</li></ol></li>
  <li>Visual Studio Extensibility (especially VS Templates)</li>
  <li>T4 Templates

<ol><li>Compile-time</li><li>Runtime</li></ol></li>
  <li>Domain-specific languages (DSLs)

<ol><li>Graphical DSLs</li><li>Textual DSLs</li><li>Implementing a DSL with ANTLR</li></ol></li>
  <li>Managed Extensibility Framework (MEF)</li>
  <li>Scripting with Dynamic Language Runtime (DLR)</li>
  <li>Generating professional documentation with Sandcastle</li>
</ol><p>In the workshop I demonstrated the use of the technologies mentioned above in a single continuous example. It enabled domain-specific modelling using XAML. The application used the model to offer a WPF-based user interface that is extensible using modules (using MEF). Additionally it is scripting-enabled (Python). On the level of source-code the sample follows the framework design guidelines of Microsoft (completely StyleCop and Code Analysis warning free).</p><p>
  <a href="{{site.baseurl}}/content/images/blog/2011/10/BASTA 2011 - Der Weg zur CSharp-Softwarefabrik.pdf">Download the slides</a> for the workshop (German). You can also download the complete <a href="{{site.baseurl}}/content/images/blog/2011/10/SoftwareFactoryFinishedSample.zip">sample code</a> that I developed during the workshop.</p>