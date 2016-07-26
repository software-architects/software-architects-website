---
layout: blog
title: Hands-On Labs Visual Studio IDE
teaser: This week I will be one of the speakers at BASTA On Tour in Munich. One of the topics I am going to speak about is the Managed Extensibility Framework (MEF). In this blog post I want to share my slides and summarize the hands-on labs that I am going to go through with the participants.
author: Rainer Stropek
date: 2010-12-07
bannerimage: 
lang: en
tags: [.NET]
permalink: /blog/2010/12/07/Hands-On-Labs-Visual-Studio-IDE
---

<p>This week I will be one of the speakers at <a href="http://basta-on-tour.de/csharp2010/" target="_blank"><span>BASTA On Tour</span></a> in Munich. One of the topics I am going to speak about is the Managed Extensibility Framework (MEF). In this blog post I want to share my slides and summarize the hands-on labs that I am going to go through with the participants.</p><ul>
  <li>
    <a href="{{site.baseurl}}/content/images/blog/2010/12/Visual Studio 2010 IDE.pdf" target="_blank">Download Slides</a> (PDF)</li>
</ul><h2>Hands-On Lab 1: Directory Catalog Sample</h2><p>Prerequisites:</p><ul>
  <li>Visual Studio 2010</li>
  <li>Download and install the latest version of the <a href="http://www.microsoft.com/downloads/en/details.aspx?familyid=752CB725-969B-4732-A383-ED5740F02E93&amp;displaylang=en" target="_blank">Visual Studio 2010 and .NET Framework 4 Training Kit</a></li>
</ul><p>Lab step by step description:</p><ul>
  <li>Open <span class="InlineCode">ContosoAutomotive.sln</span>. You can find this solution in the installation folder for the training kit under <span class="InlineCode">Demos\ContosoAutomotive\Source\C#</span>.</li>
  <li>Run the application to get familiar with it's functionality.</li>
  <li>Solution and projects:

<ul><li>Take a look at the soluction's project structure using the <em>Solution Explorer</em>.</li><li>Open the solution file in a text editor and take a look at it's structure.</li><li>Unload the project <span class="InlineCode">ContosoAutomotive.Common</span> using the <em>Solution Explorer</em>.</li><li>Launch editor for <span class="InlineCode">ContosoAutomotive.Common.csproj</span> using the <em>Solution Explorer</em> and take a look at it's structure.</li><li>Reload the project <span class="InlineCode">ContosoAutomotive.Common</span> using the <em>Solution Explorer</em>.</li></ul></li>
  <li>Navigation:

<ul><li>Use the <em>Navigate To</em> feature to open the definition for class <span class="InlineCode">CohoQuery</span><ul><li>Try the different features of <em>Navigate To</em> (e.g. case insensitive search, pascal casing, search for file names, etc.)</li></ul></li><li>Try <em>outlining features</em> using mouse and keyboard commands.</li><li>Use the <em>Find in files</em> feature to look for <span class="InlineCode">ICarQuery</span>.

<ul><li>Try the different navigation features available for search results (e.g. F8, Ctrl + "-", etc.)</li></ul></li><li>Open <span class="InlineCode">ICarQuery.cs</span>, put the cursor on the interface's name, try the <em>Find Symbol Result</em> feature (Shift + F12)</li><li>Use the <em>Find in files</em> feature to find all files (file names) that contain the word <span class="InlineCode">Query</span>.</li><li>Open <span class="InlineCode">CohoQuery.cs</span>, put the cursor on the class's base class (<span class="InlineCode">CarQueryBase</span>), try the <em>Go To Definition</em> feature (F12)</li><li>Use the <em>Go To Definition</em> feature for a class defined in the .NET class library (e.g. <span class="InlineCode">INotifyPropertyChanged</span>).</li><li>Try at least one of the find scenarios from above using the <em>Find/Command Box</em>.</li><li>Use the <em>Navigate To</em> feature to open the definition for the method <span class="InlineCode">Generate</span></li><li>Try the <em>Call Hierarchy</em> feature for this method (Ctrl+K, R)</li><li>Open the <em>Code Definition Window</em>, put the cursor on different variables, class names, etc. and watch how the Code Definition Windows changes.</li><li>Add a <span class="InlineCode">//TODO:</span> comment and see if the comment appears in the task list.</li><li>Open <span class="InlineCode">CashMaker.xaml</span> and try the <em>Document Outline</em> feature inside the XAML file.</li></ul></li>
</ul><h2>Hands-On Lab 2: IntelliSense</h2><p>Prerequisites:</p><ul>
  <li>Visual Studio 2010</li>
</ul><p>Lab step by step description:</p><ul>
  <li>Open the existing code snippet for the C# <span class="InlineCode">for</span> statement (<span class="InlineCode">C:\Program Files (x86)\Microsoft Visual Studio 10.0\VC#\Snippets\1033\Visual C#\for.snippet</span>)

<ul><li>You can find out the location of the snippet file using the <em>Code Snippets Manager</em> feature.</li></ul></li>
  <li>Take a look at how the snippet is implemented.</li>
  <li>Create an empty solution <span class="InlineCode">IntelliSenseDemo</span>.</li>
  <li>Add a new <em>class library</em> project <span class="InlineCode">Utilities</span>.</li>
  <li>Rename <span class="InlineCode">class1.cs</span> to <span class="InlineCode">MathUtilities.cs</span>.</li>
  <li>Change the <span class="InlineCode">MathUtilities</span> class to <span class="InlineCode">static</span>.</li>
  <li>Add a new <em>test project</em><span class="InlineCode">UtilitiesTest</span> to your solution.</li>
  <li>Add a reference to the <span class="InlineCode">Utilities</span> class library project to the newly created test project.</li>
  <li>Change the name of the generated test method <span class="InlineCode">TestMethod1</span> to <span class="InlineCode">TestIsEven</span>.</li>
  <li>Implement the method <span class="InlineCode">TestIsEven</span>as follows:

<ul><li>Tip: Use <span class="InlineCode">for</span> snippet to generate the loop's code.</li></ul></li>
</ul>{% highlight javascript %}[TestMethod]
public void TestIsEven()
{
 for (int i = 0; i < 10; i++)
 {
  bool isEven = MathUtilities.IsEven(i);
  Assert.AreEqual(i % 2 == 0, isEven);
 }
}{% endhighlight %}<ul>
  <li>Resolve the missing <span class="InlineCode">using</span> statement by setting the cursor on <span class="InlineCode">MathUtilities</span> and pressing Ctrl + .</li>
  <li>Generate the code for <span class="InlineCode">IsEven</span> by setting the cursor on <span class="InlineCode">IsEven</span> and pressing Ctrl + .</li>
  <li>Navigate to the generated code by using the <em>Go To Definition</em> feature (F12).</li>
  <li>Implement the IsEven method: <span class="InlineCode">return i % 2 == 0;</span></li>
  <li>Remove unused usings and sort usings (Visual Studio can do that for you).</li>
  <li>Run unit tests and see if you get a green check in the test result window.

<ul><li><em>Test / Debug / All Tests in solution</em></li></ul></li>
  <li>Try to add additional method / test methods and test the differences between IntelliSense <em>completion</em> and <em>suggestion</em> mode.</li>
  <li>Optional (if you are fast): Try to add and use you own custom snippet file. </li>
</ul>