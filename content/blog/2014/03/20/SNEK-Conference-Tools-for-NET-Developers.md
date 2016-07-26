---
layout: blog
title: SNEK Conference -  Tools for .NET Developers
teaser: Next weekend I will be speaker at the SQL Server and .NET Developer Conference (SNEK) in Nürnberg (Germany). One of the talks will be focused on tools for .NET developers. In this blog article I summarize what I am going to show.
author: Rainer Stropek
date: 2014-03-20
bannerimage: 
lang: en
tags: [.NET,C#,Visual Studio]
permalink: /blog/2014/03/20/SNEK-Conference-Tools-for-NET-Developers
---

<p>Next weekend I will be speaker at the <a href="http://www.donkarl.com/SNEK/" target="_blank">SQL Server and .NET Developer Conference (SNEK)</a> in Nürnberg (Germany). One of the talks will be focused on <em>tools for .NET developers</em>. In this blog article I summarize what I am going to show. Here is the (German) abstract of the talk:</p><div style="margin-left: 2em">
  <p>
    <em>Griff in die Trickkiste - Tools, die .NET-Entwicklung erleichtern</em>
    <br />
    <em>Rainer Stropek (MVP, www.software-architects.com)</em>
    <br />
  </p>
  <p>
    <em>Nicht nur die Effizienz der entwickelten Software ist wichtig sondern auch die Effizienz von uns Softwareentwicklern während des Entwicklungsprozesses, denn sie bestimmt maßgeblich den Preis und damit unsere Wettbewerbsfähigkeit.</em>
    <br />
  </p>
  <ul>
    <li>
      <em>wichtige Tools, die in keinem Werkzeuggürtel fehlen dürfen</em>
    </li>
    <li>
      <em>Kniffe und Tricks von Visual Studio 2013, die noch nicht jeder entdeckt hat</em>
    </li>
    <li>
      <em>wie man Performancekillern mit Profiler-Tools auf die Schliche kommt</em>
    </li>
    <li>
      <em>Code-Generatortools in und rund um Visual Studio</em>
    </li>
    <li>
      <em>automatisches Generieren von Dokumentationen</em>
    </li>
    <li>
      <em>Tools zur statischen Codeanalyse</em>
    </li>
    <li>
      <em>und vieles mehr … keine Slides, sondern 100% Demonstration</em>
    </li>
  </ul>
</div><p class="showcase">You can view and/or download my sample code <a href="https://github.com/rstropek/Samples/tree/master/SnekToolsSample" target="_blank">in my GitHub repository</a>.</p><h2>Getting the Tools with Chocolatey</h2><p>Are you tired of manually downloading your favorite set of small development tools? Turns out that most of them are already on <a href="https://chocolatey.org" target="_blank">chocolatey</a>. Chocolatey is like NuGet but for applications. You should definitively give it a try.</p><h2>Visual Studio</h2><p>The most important tool for .NET developers is - of course - <a href="http://www.visualstudio.com/" target="_blank">Microsoft Visual Studio</a>. Knowing it well means becoming more productive. During the SNEK session I will demo different IDE features of Visual Studio that can help mastering everyday work as a developer. I picked two topics that I will place a special focus on:</p><ol>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/dd193245.aspx" target="_blank">Data-tier Applications</a>
  </li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/hh549175.aspx" target="_blank">Microsoft Fakes</a> (Shims and Stubs)</li>
</ol><p>One focus of the Visual Studio 2013-related part of the talk will be new features of the lastest version:</p><ol>
  <li>Cloud integration with <a href="http://www.visualstudio.com/en-us/products/visual-studio-online-overview-vs" target="_blank">Visual Studio online</a><ol><li>TFS in the cloud</li><li><a href="http://www.visualstudio.com/get-started/share-your-code-in-git-vs" target="_blank">New Git integration</a><br /></li><li><a href="http://www.visualstudio.com/en-us/get-started/build-your-apps-vs.aspx" target="_blank">Build in the cloud</a></li><li>Sneak peek into what's coming: <a href="http://channel9.msdn.com/Series/Visual-Studio-Online-Monaco" target="_blank">Visual Studio Online "Monaco"</a></li></ol></li>
  <li>Editor enhancements like 

<ol><li><a href="http://blogs.msdn.com/b/mvpawardprogram/archive/2013/10/29/viewing-your-code-through-visual-studio-s-codelens.aspx" target="_blank">Code Lenses</a>, </li><li><a href="http://msdn.microsoft.com/en-us/library/dn160178.aspx" target="_blank">Peek Definition</a>, and</li><li><a href="http://blogs.msdn.com/b/visualstudio/archive/2013/08/09/xaml-editor-improvements-in-visual-studio-2013.aspx" target="_blank">XAML IntelliSense</a></li></ol></li>
</ol><h2>Important Visual Studio Extensions</h2><p>Microsoft regularly published productivity enhancements for Visual Studio in their <em>Productivity Power Tools</em> addon. You can find the latest version compatible with Visual Studio 2013 in the <a href="http://visualstudiogallery.msdn.microsoft.com/dbcb8670-889e-4a54-a226-a48a15e4cace" target="_blank">Visual Studio Gallery</a>. The website also contains a detailed description of what the power tools will add to VS. Take a look at it and decide whether you want to have these extensions. At SNEK I will not demo the power tools live.</p><p>If you are planning to customize your Team Foundation Server, be sure to install <a href="http://visualstudiogallery.msdn.microsoft.com/f017b10c-02b4-4d6d-9845-58a06545627f" target="_blank">TFS 2013 Power Tools</a>. They make configuring TFS much simpler. TFS customizing is not a relevant topic for most SNEK attendees. Therefore I will not cover this topic there.</p><h2>Visual Studio Alternatives and Editors</h2><p>In my opinion, Visual Studio is one of the best IDEs of the world. However, some people prefer to use free tools. It turns out that there are some free alternatives:</p><ol>
  <li>
    <a href="http://www.visualstudio.com/products/visual-studio-express-vs" target="_blank">Visual Studio Express Editions</a> - free with reduced feature set but still very useful if you have a limited budget.</li>
  <li>
    <a href="http://www.icsharpcode.net/OpenSource/SD/" target="_blank">SharpDevelop</a>
  </li>
</ol><p>Sometimes all you need is a good editor. A full IDE would be too much. Which editor a developer uses is nearly a religious question. I personally use <a href="http://notepad-plus-plus.org/" target="_blank">Notepad++</a> beside Visual Studio. If you try it, make sure you already check out <a href="http://sourceforge.net/projects/npp-plugins/files/" target="_blank">Notepad++'s great plugins</a>.</p><h2>NuGet</h2><p>NuGet has become the primary development vehicle for libraries. Even new parts of .NET's Base Class Library (BCL) are only shipped via NuGet anymore. If you have not become familiar with NuGet already, it is time to start. At SNEK I will show some tools that can help with NuGet:</p><ol>
  <li>
    <a href="http://npe.codeplex.com/" target="_blank">NuGet Package Explorer</a> - tool for exploring and building NuGet packages interactively.</li>
  <li>Website <a href="http://www.nuget.org/" target="_blank">http://www.nuget.org/</a> - the number one place to look for libraries and/or to publish libraries that should be available to everybody. You can also get <a href="https://nuget.codeplex.com/releases" target="_blank">NuGet.exe</a> from there. This tool enables you to automate the creation of NuGet packages.</li>
  <li>Website <a href="http://www.myget.org/" target="_blank">http://www.myget.org/</a> - very useful if you want to publish your libraries to a closed group of users. MyGet saves you from having to run your own NuGet server. You can easily set up password-protected, private feeds and grant e.g. only your customers access to it.</li>
</ol><h2>Coding Best Practices</h2><p>Observing best and avoiding worst practices for C# is easier said than done. Which practices are important for you? Do you know all of them? Why are they relevant? Microsoft and 3rd party providers offer a set of tools that can help you with best and worst practices. During the session I will demo the following tools:</p><ol>
  <li>
    <a href="http://stylecop.codeplex.com/" target="_blank">StyleCop</a> - analyzes C# source code to enforce a set of style and consistency rules.</li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/3z0aeatx.aspx" target="_blank">Code Analysis</a> - warns you in case of violations of the programming and design rules set forth in the <a href="http://www.amazon.de/gp/product/0321545613/ref=as_li_ss_tl?ie=UTF8&amp;camp=1638&amp;creative=19454&amp;creativeASIN=0321545613&amp;linkCode=as2&amp;tag=timecockpit-21" target="_blank">Microsoft .NET Framework Design Guidelines</a>.</li>
</ol><h2>Code Generation and Refactoring Tools</h2><p>What's better than writing code efficiently? Not having to write it at all. Tools that can generate code for you can help with that. During my SNEK session I will talk about the following tools:</p><ol>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/bb126445.aspx" target="_blank">T4</a> - Microsoft's templating engine integrated in Visual Studio (if you plan to use T4 more, you should check out <a href="http://t4-editor.tangible-engineering.com/T4-Editor-Visual-T4-Editing.html" target="_blank">tangible's T4 editor</a>).</li>
  <li>
    <a href="http://submain.com/products/ghostdoc.aspx" target="_blank">GhostDoc</a> - generates rundimentary C# code documentation.</li>
  <li>
    <a href="http://msdn.microsoft.com/en-us/library/43f44291.aspx" target="_blank">Visual Studio IntelliSense</a> and <a href="http://msdn.microsoft.com/en-us/library/cdbwbc30.aspx" target="_blank">automatic code generation</a></li>
  <li>Example for commercial tool: <a href="http://www.jetbrains.com/resharper/" target="_blank">JetBrains' ReSharper</a></li>
</ol><h2>Debugging and Profiling Tools</h2><p>There is no way to 100% avoid bugs. Debuggers are used to hunt down functional bugs. Profilers are used to find code fragments with poor performance or memory leaks. At SNEK I will talk about the following tools (and demonstrate some of them depending on the time I have):</p><ol>
  <li>Less known but very useful Visual Studio debugging features (e.g. data tips, make object ID, viewing return values in the <em>Autos</em> window, mixed mode debugging, etc.).</li>
  <li>
    <a href="http://msdn.microsoft.com/library/windows/hardware/ff551063(v=vs.85).aspx" target="_blank">WinDbg</a> - a low-level debugger that can help in environments where you cannot install Visual Studio or in mixed-mode scenarios (native code/managed code).</li>
  <li>
    <a href="http://www.telerik.com/fiddler" target="_blank">Fiddler</a> - a web debugger that can help you debugging multi-tier applications with web services.</li>
  <li>
    <a href="http://www.wireshark.org/" target="_blank">WireShark</a> - a tool which lets you analyze network traffic. In contrast to Fiddler, WireShark can analyze any kind of network traffic, including SQL Server's TDS protocol.</li>
  <li>
    <a href="https://snoopwpf.codeplex.com/" target="_blank">Snoop</a> - a free WPF spy utility (consider <a href="http://xamlspy.com/" target="_blank">XAMLSpy</a> if you prefer a commercial WPF spy utility).</li>
  <li>
    <a href="http://channel9.msdn.com/Series/PerfView-Tutorial" target="_blank">PerfView</a> - a free, low-level profiler from Microsoft that can also be used in production environments. Be prepared: PerfView is very powerful but not easy to use.</li>
  <li>Example for commercial tool: <a href="http://www.red-gate.com/products/dotnet-development/ants-performance-profiler/" target="_blank">Red-Gate ANTS Profiler</a>.</li>
</ol><p>One essential toolset I will not show at SNEK because of time limits are the <a href="http://technet.microsoft.com/en-us/sysinternals/bb545021.aspx" target="_blank">sysinternals</a> tools. They are indispensible when hunting for bugs on stubborn computers.</p><h2>Documentation Tools</h2><p>Documentation is an important part of software. Sometimes you need to document an API for a reusable class library, sometimes you have to create documentation for end users. Here are some tools that can help you creating professional documentation:</p><ol>
  <li>
    <a href="https://shfb.codeplex.com/" target="_blank">Sandcastle Help File Builder</a> (aka SHFB) - used to create help files for managed class libraries containing both conceptual and API reference topics.</li>
  <li>
    <a href="http://getgreenshot.org/" target="_blank">Greenshot</a> - a great free tool for creating screenshots. Very useful for everyday work even when not creating a documentation.</li>
  <li>Example for commercial tool: SnagIt and Camtasia from <a href="http://www.techsmith.de/" target="_blank">TechSmith</a> - great tools for creating screenshots and screen videos.</li>
</ol><p>If you create images for documentation, you will probably need to edit them. Here are my favorite free tools for that. I am not going to demo them in my SNEK talk. However, here are the links:</p><ol>
  <li>
    <a href="http://www.gimp.org/" target="_blank">Gimp</a> (bitmap-based) and</li>
  <li>
    <a href="http://www.inkscape.org/" target="_blank">Inkscape</a> (vector-based) - image manipulation and drawing programs.</li>
</ol><h2>Tools for Organizing Your Work</h2><p>Efficient programmers do not only have technical tools. They also have tools for organizing their work and time. Here is the tool chain that we have been successfully using for years. I will describe our way of working in my SNEK talk, too. Of course all tools are SaaS tools. We avoid having to setup and run our own server infrastructure.</p><ol>
  <li>Make use of the power of TFS to structure your work into work packages (e.g. backlog items, tasks, bugs, etc.).</li>
  <li>For managing our agile development workflow the Kanban-way, we prefer <a href="https://www.atlassian.com/de/software/ondemand/overview" target="_blank">Jira</a> over TFS. We especially love Jira Agile (aka GreenHopper) and its ability to being customizable even when running in the cloud. However, we have written some internal tools to sync Jira and TFS.</li>
  <li>Great support makes happy customers. Managing support cases in our inbox or in an Excel sheet is definitively not enough. We have learned to love <a href="http://www.zendesk.com/beautifully-simple" target="_blank">Zendesk</a>. It integrates nicely with Jira and allows to tranform support cases into bugs whenever necessary.</li>
  <li>Last but not least - of course - we use our own product <a href="http://www.timecockpit.com" target="_blank">time cockpit</a> for time tracking, planning, and invoicing. By default, time cockpit integrates with Outlook and TFS. It is quite simple to setup some scripts to integrate time cockpit with Zendesk and/or Jira to enable booking times on tickets.</li>
</ol><h2>Various Other Tools</h2><p>There is a myriade of tools for developers available on the internet. I decided to add here some of the tools that I personally like and use. Hope you find them useful. First let us start with the tools that I am going to show at SNEK:</p><ol>
  <li>
    <a href="https://www.linqpad.net/" target="_blank">LINQPad</a> - lets you query databases, OData web services, and other data sources using LINQ, C#'s query language. My second talk at SNEK will be about OData. I will demo LINQPad in this talk.</li>
  <li>Example for a commercial tool: <a href="http://www.red-gate.com/products/dotnet-development/reflector/" target="_blank">Reflector</a> - If you wonder what's going on in the background, it is sometimes useful to decompile .NET's intermediate language. With this you could e.g. find out how C# async/await is implemented. Reflector is a great tool for getting C# code from IL.</li>
</ol><p>Secondly, here are some additional tools that I am not going to show at SNEK because of time restrictions:</p><ol>
  <li>
    <a href="http://www.brianapps.net/sizer/" target="_blank">Sizer</a> - small tool that lets you resize windows so you can test your application for different window/screen sizes.</li>
  <li>There are many different diffing and merging tools on the web. I personally use <a href="http://winmerge.org/" target="_blank">WinMerge</a>.</li>
  <li>As a developer you are typically subscribed to dozens of services and personalized websites. You end up having countless credentials. In practice, you either use the same credentials everywhere (highly unrecommended because very unsafe) or you have to use a password manager. I have been using <a href="http://keepass.info/" target="_blank">KeePass</a> for years.</li>
  <li>Need to store or transfer sensitive production data? Consider using a <a href="http://www.truecrypt.org/" target="_blank">TrueCrypt</a> encrypted disk for that.</li>
  <li>If you are a heavy user of remote connections, you could try <a href="http://www.royalts.com/main/home/win.aspx" target="_blank">Royal TS</a> instead of Microsoft's terminal services client.</li>
  <li>Solid State Disks (SSDs) are a great tool for speeding up your development environment. However, they have one problem: They are rather small and expensive. Therefore disk space could be an issue. My most important tool for keeping track of my disk space is <a href="https://windirstat.info/" target="_blank">WinDirStat</a>. With this tool you will easily find unnecessary large files and/or folders.</li>
  <li>In times where DevOps is becoming more and more popular, developers become admins and admins become developers to a certain extent. Therefore developers sometimes need a powerful scripting environment. Windows brings its own solution: <a href="http://technet.microsoft.com/en-us/scriptcenter/powershell.aspx" target="_blank">PowerShell</a>. If you are a .NET developer and you don't want to learn a new language for scripting, you could give <a href="http://scriptcs.net/" target="_blank">ScriptCS</a> a try.</li>
</ol>