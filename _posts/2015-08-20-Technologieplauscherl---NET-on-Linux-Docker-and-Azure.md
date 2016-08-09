---
layout: blog
title: Technologieplauscherl - .NET on Linux, Docker, and Azure
excerpt: Today I will do a session at a local user group called Technologieplauscherl. It is an informal meeting of people interested in technology. The topic I am going to speak about is Microsoft .NET and its new relationship with Linux, open source, and Docker.
author: Rainer Stropek
date: 2015-08-20
bannerimage: /content/images/blog/2015/08/techplauscherl-00-yeoman.png
bannerimagesource: 
lang: en
tags: [.NET,Azure,C#]
ref: 
permalink: /devblog/2015/08/20/Technologieplauscherl---NET-on-Linux-Docker-and-Azure
---

<h2>Introduction</h2><p>Today I will do a session at a local user group called <em><a href="http://technologieplauscherl.at/" target="_blank">Technologieplauscherl</a></em>. It is an informal meeting of people interested in technology. The topic I am going to speak about is Microsoft .NET and its new relationship with Linux, open source, and Docker. In this blog article I provide important links and the sample code I am going to show so that the attendees can follow along or play with .NET on Linux at home using this article as a starting point.</p><h2>Microsoft .NET and Linux - What has Changed?</h2><p>I have been working with .NET for decades. Until recently, .NET has meant you had to use Windows. With the rise of the cloud (in particular Microsoft's <a href="http://azure.microsoft.com" target="_blank">Azure</a> cloud), Microsoft started to really embrace the idea of open source. Additionally, Microsoft started to fall in love with the idea of platform independence. Some people thought that this is just an episode - but in the last months, Microsoft has proven that they are serious. Here are some examples:</p><ul>
  <li>Microsoft is developing an open source and platform-independent version of their .NET Framework (<em>CoreCLR</em>).</li>
  <li>More and more parts of the .NET Framework follow (e.g. <em>Entity Framework</em>, <em>ASP.NET</em>, etc.), they are now open source projects on Github.</li>
  <li>Microsoft rewrote their entire C# and VB.NET compiler platform (codname <em>Roslyn</em>) and made it open source and platform independent.</li>
  <li>Each and every SDK for <em>Microsoft Azure</em> is open source.</li>
  <li>All the projects mentioned above are accepting commits from the community.</li>
  <li>...</li>
</ul><p>If you want to dive deeper into C#, .NET &amp; Co., here are some important links:</p><h3>CoreCLR</h3><p>Visit the <a href="https://github.com/dotnet/coreclr" target="_blank">Github site of the CoreCLR</a>. You will find links and installation instructions there. Note that at the time of writing, the CoreCLR is still not stable yet. You should not use it for production yet. Also note that you will need to install <em>Mono</em> to play with the CoreCLR. This is a temporary requirement that will disapear in the future.</p><h3>ASP.NET 5</h3><p>At <em>Technologieplauscherl</em>, I will demo ASP.NET web applications, too. If you want to learn more about ASP.NET 5, the first open source and platform-independent version of ASP.NET, visit its <a href="https://github.com/aspnet/home" target="_blank">Github repository</a>.</p><h2>Visual Studio Code</h2><p>Microsoft has not only made the runtime, framework, and compilers platform-independent, they also created a light version of its development environment <em>Visual Studio</em> available on all platforms (MacOS, Linux and Windows). They called it <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a>. <em>Code</em> is not only an editor. It uses <a href="http://www.omnisharp.net/" target="_blank">Omnisharp</a> to provide IntelliSense, syntax highlighting, refactoring, etc. At <em>Technologieplauscherl</em>, I use <em>Code</em> for developing my C# demos on Ubuntu.</p><h2>Demo 1 - .NET Basics</h2><p>My first demo demonstrates the basics. I prepared the following setup:</p><ul>
  <li>Current Ubuntu VM in Hyper-V on my Windows box</li>
  <li>Installed <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a></li>
  <li>Installed CoreCLR and ASP.NET 5 as described <a href="https://github.com/aspnet/home" target="_blank">here</a></li>
  <li>Installed <a href="http://nodejs.org" target="_blank">Node.js</a></li>
  <li>Installed <a href="http://yeoman.io" target="_blank">Yeoman</a> and the related <a href="http://blogs.msdn.com/b/webdev/archive/2014/12/17/yeoman-generators-for-asp-net-vnext.aspx" target="_blank">generator for ASP.NET</a>.</li>
</ul><p>If you want to try the sample I show at <em>Technologieplauscherl</em>, here is my story book for the demo:</p><ul>
  <li>Open a terminal window on your Linux box.</li>
  <li>Use <em>dnvm</em>, the .NET version manager, to install the .NET runtime you would like to use. For my demos I will use Mono as the CoreCLR is still too unstable. If you read that in a few months, you will probably be able to use the CoreCLR version already.
<br /><img src="{{site.baseurl}}/content/images/blog/2015/08/techplauscherl-01-dnvm.png" /></li>
  <li>Run <em>yo aspnet</em> and create a console application.
<br /><img src="{{site.baseurl}}/content/images/blog/2015/08/techplauscherl-02-yeoman.png" /></li>
  <li>Use <em>Code</em> to open the folder with the console app and make yourself familiar with the code.</li>
  <li>Run <em>dnu restore</em> in the folder with the console app to restore the library that the app depends on.</li>
  <li>Run <em>dnx . run</em> to execute your console app. You should see <em>Hello World</em>.
<br /><img src="{{site.baseurl}}/content/images/blog/2015/08/techplauscherl-03-dnu-dnx.png" /></li>
</ul><p>Voila, .NET on Linux :-)</p><h2>Demo 2 - Web Application</h2><p>Next, we want to try a more complex program, an ASP.NET web application with server- and client-side code:</p><ul>
  <li>Run <em>yo aspnet</em> and create a <em>Web Application Basic</em>.</li>
  <li>Use <em>Code</em> to open the folder with the console app and make yourself familiar with the code.</li>
  <li>Run <em>dnu restore</em> in the folder with the console app to restore the library that the app depends on.</li>
  <li>Run <em>dnx . kestrel</em> (<em>kestrel</em> is the name of the web server we are using) to execute the server-part of the app.</li>
  <li>Use your web browser to open <em>http://localhost:5000/</em>. You should see the ASP.NET web application</li>
</ul><h2>Demo 3 - Using Docker on Azure</h2><p>If you tried the samples shown above yourself, you have seen that setting up your Linux box to run ASP.NET is not super simple. You can use <a href="https://docker.com" target="_blank">Docker</a> to make your life easier.</p><p class="showcase">If you are not familiar with Docker, take a look at my <a href="https://channel9.msdn.com/Series/Visual-Studio-Germany/How-to-Run-ASPNET-vNext-in-Azure-Using-Docker-Containers" target="_blank">intro video on Channel9</a>.</p><p>Microsoft has a partnership with Docker and offers a <a href="https://hub.docker.com/r/microsoft/aspnet/" target="_blank">ready-made image for running ASP.NET applications</a>. You don't even have to setup Docker on your machine. In <a href="http://azure.microsoft.com" target="_blank">Azure</a>, Microsoft provides a ready-made Linux image with Docker installed and configured.</p>

<a data-lightbox="techplauscherl-03" href="{{site.baseurl}}/content/images/blog/2015/08/techplauscherl-03-azure.png"><img src="{{site.baseurl}}/content/images/blog/2015/08/techplauscherl-03-azure.png" /></a>

<ul>
  <li>Create an Ubuntu VM with Docker in Azure.</li>
  <li>Connect to the VM (on Windows, I use <em>PuTTY</em> for that).</li>
  <li>Try if Docker is ready to use by running <em>docker info</em>.</li>
  <li>Compress the web app you created on your local Linux box before using <em>tar cfzv web.tar *</em>.</li>
  <li>Use <em>scp</em> to copy the tar-file to your VM in the cloud (you have to change the following command according to your username, machine name, and paths): <em>scp web.tar rstropek@technologieplauscherl-01234567.cloudapp.net:~/src</em>.</li>
  <li>Extract the web app on your VM in the cloud using <em>tar xfv web.tar</em>.</li>
  <li>Start a Docker container for ASP.NET using Microsoft's pre-built Docker image: <em>docker run -v ~/src:/src -p 5000:5000 -it microsoft/aspnet</em>. Note that this command mounts the local web app in the Docker container's <em>/src</em> folder.</li>
  <li>As shown above, run <em>dnu restore</em> and <em>dnx . kestrel</em> to restore dependencies and start the web server.</li>
  <li>Use the <a href="https://portal.azure.com" target="_blank">Azure portal</a> to map your cloud VM's port 5000 to the public port 80. With that, you can try your ASP.NET 5 web app running on Linux in a Docker container over the internet (don't forget to change the following adress according to your machine name): <em>http://techplauscherl-01234567.cloudapp.net</em>.</li>
</ul><h2>Did it work?</h2><p>Did you like my session? Did you successfully replayed my demo using the code in this article? I would love to hear your feedback.</p>