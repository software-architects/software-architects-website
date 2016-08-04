---
layout: blog
title: Angular + Cloud Services = Dream Team for Small Projects
excerpt: For one of my private hobbies (keeping honey bees), I recently needed a simple registration form. It should just ask for a few data items, use a captcha to protect from spam, save the registrations in a DB, and send me notification emails. Within a few hours everything was up and running. In this blog post I share the code and describe the cloud components you can use to rapidly solve such a requirement.
author: Rainer Stropek
date: 2015-03-12
bannerimage: /content/images/blog/2015/03/RegisterThumb.jpg
bannerimagesource: 
lang: en
tags: [AngularJS,Azure]
ref: 
permalink: /devblog/2015/03/12/Angular--Cloud-Services--Dream-Team-for-Small-Projects
---

<p>For one of my private hobbies (keeping honey bees), I recently needed a simple registration form. It should just ask for a few data items, use a <a href="http://en.wikipedia.org/wiki/CAPTCHA" target="_blank">CAPTCHA</a> to protect from spam, save the registrations in a DB, and send me a notification email. Within a few hours everything was up and running. In this blog post I share the code and describe the cloud components you can use to rapidly solve such a requirement.</p><h2>Necessary Components</h2><p>First, I made a list of components I would need to solve this problem.</p><ul>
  <li>A nice <strong>URI</strong><br />
 I would need a domain name that is easy to remember.</li>
  <li>A <strong>web server</strong><br />
 A web server is necessary to serve the HTML/JavaScript/CSS files.</li>
  <li>Platform for <strong>backend logic</strong><br />
 I need a bit of server-side logic (e.g. persistantly store registrations, send email notification, check CAPTCHA, etc.).</li>
  <li>A JavaScript framework for some <strong>client-side logic</strong><br />
 Although the client-side logic is minimal, I still need a few things (e.g. mandatory fields, communitation with backend, etc.).</li>
  <li>A <strong>development environment</strong> for client- and server-side code
<br />
 I need to write, build, and deploy the code somehow.</li>
  <li>A <strong>CAPTCHA</strong> service
<br />
 This seems necessary to protected from unwanted spam.</li>
  <li>Persistent <strong>storage</strong><br />
 I want to persistently store registrations in some kind of database.</li>
  <li>Component for <strong>sending mails</strong><br />
 Whenever someone registers, I want to receive a notification email.</li>
</ul><p class="showcase">Important parameter: The project budget in terms of time and money is minimal, nearly nothing. It most not cost more than a few Euros and take a few hours to setup, implement, and put into production.</p><h2>My Component Setup</h2><p>The cloud is perfect for such projects. No need to setup server, buy expensive software, install heavy-weight IDEs, etc. The browser is all you need. Here are the components I used for my mini web app:</p><ul>
  <li>
    <strong>Domain</strong>
    <br />
 The web is full of hosting providers who offer domains for just a few Euros. In my case I picked an <em>.at</em>-domain at the local hosting provider <a href="https://www.world4you.at/" target="_blank">World4You</a>. PS.: I really hope that <a href="http://azure.microsoft.com" target="_blank">Azure</a> will add DNS in the future.</li>
  <li>
    <strong>Web hosting</strong>
    <br />
    <a href="http://azure.microsoft.com/en-us/services/websites/" target="_blank">Azure Websites</a>, what else? In my opinion the greatest PaaS offering for web sites and apps on the planet.</li>
  <li>
    <strong>Server-side logic</strong>
    <br />
 I am a big fan of ASP.NET and C#. However, for such small projects I really like <a href="https://nodejs.org/" target="_blank">Node.js</a> = JavaScript on the server. Node.js works perfectly fine with Azure Websites (see previous point).</li>
  <li>
    <strong>Client-side logic</strong>
    <br />
    <a href="https://angularjs.org/" target="_blank">AngularJS</a> is my framework of choice. It makes developing of the client logic a piece of cake.</li>
  <li>
    <strong>Development environment</strong>
    <br />
 Again, Azure Websites rulez. It comes with a feature-rich IDE for client- and server-side web development built in (<a href="http://www.software-architects.com/devblog/2014/03/12/End-to-end-sample-for-Visual-Studio-Online-Monaco-with-TypeScript-and-AngularJS" target="_blank">VSO "Monaco"</a>). All I need is the browser.</li>
  <li>
    <strong>CAPTCHA service</strong>
    <br />
 No need to build one yourself. Google is offering <a href="https://www.google.com/recaptcha/intro/index.html" target="_blank">reCAPTCHA</a> for free.</li>
  <li>
    <strong>Storage</strong>
    <br />
 There are dozens of options for persistent storage in the cloud. I decided to use Azure's new NoSQL option <a href="http://azure.microsoft.com/en-us/services/documentdb/" target="_blank">DocumentDB</a>. It is fully managed. Therefore I do not have to waste time to install and configure servers.</li>
  <li>
    <strong>Mail service</strong>
    <br />
 For our <a href="http://www.timecockpit.com" target="_blank">time cockpit</a> product we have been using <a href="https://mandrill.com/" target="_blank">Mandrill</a> for years. Its the perfect tool for the job.</li>
</ul><p>That's the beauty of the cloud. No setting up servers, no installing software. Focus on the real problem, in my case the registration web app.</p><p>We are all set, let's start coding.</p><p class="showcase">Note that the entire code can be downloaded from my <a href="https://github.com/rstropek/Samples" target="_blank">GitHub Samples repository</a>.</p><h2>Client-Side Code</h2><p>The client-side consists of the following pieces:</p><ul>
  <li>HTML (see <em><a href="https://github.com/rstropek/Samples/blob/master/AngularDocumentDBSample/site/index.html" target="_blank">index.html</a></em>)
<br />
 Note that I did not include the frameworks (e.g. <a href="http://getbootstrap.com/css/" target="_blank">Bootstrap</a>, <a href="http://jquery.com/" target="_blank">jQuery</a>, <a href="https://angularjs.org/" target="_blank">AngularJS</a>, etc.) in my project. I am getting the necessary files from various <em>Content Deliver Networks</em> (CDN) like <a href="https://developers.google.com/speed/libraries/devguide" target="_blank">Google Hosted Libraries</a>.</li>
  <li>CSS (see <em><a href="https://github.com/rstropek/Samples/blob/master/AngularDocumentDBSample/site/index.css" target="_blank">index.css</a></em>)
<br />
 Nothing special here.</li>
  <li>JavaScript
<br />
 The project is so small that I included client-side JavaScript directly into the <em><a href="https://github.com/rstropek/Samples/blob/master/AngularDocumentDBSample/site/index.html">index.html</a></em> file. The JavaScript code is quite simple. The only thing that is worth while mentioning is the combination of AngularJS and Google's reCAPTCHA.</li>
</ul><h2>Server-Side Code</h2><p>The server-side is also written in JavaScript using Node.js. In Node.js, you compose your application from various components using the <a href="https://www.npmjs.com/" target="_blank">Node Package Manager</a> (NPM). My example uses the following packages (for code see also <em><a href="https://github.com/rstropek/Samples/blob/master/AngularDocumentDBSample/package.json" target="_blank">package.json</a></em>):</p><ul>
  <li>
    <a href="https://www.npmjs.com/package/express" target="_blank">Express.js</a> for handling web requests (i.e. the registration requests coming from the client) with <a href="https://www.npmjs.com/package/body-parser" target="_blank">body-parser</a> for handling JSON in HTTP requests.</li>
  <li>
    <a href="https://www.npmjs.com/package/documentdb" target="_blank">Node client SDK for Azure's DocumentDB</a> which makes it really simple to write data into DocumentDB from Node.js.</li>
  <li>
    <a href="https://www.npmjs.com/package/needle" target="_blank">Needle</a> for making HTTP requests from Node.js (necessary to communicate with <a href="https://developers.google.com/recaptcha/docs/verify" target="_blank">Google's web API for reCAPTCHA</a>).</li>
  <li>Node client for the <a href="https://www.npmjs.com/package/mandrill-api" target="_blank">Mandrill mail service</a>.</li>
</ul><p>With that components, writing the server-side code was not complex. If you are interested, you find the code in <em><a href="https://github.com/rstropek/Samples/blob/master/AngularDocumentDBSample/server.js" target="_blank">server.js</a></em> plus some configuration data in <em><a href="https://github.com/rstropek/Samples/blob/master/AngularDocumentDBSample/config.js" target="_blank">config.js</a></em>.</p><h2>Development Process</h2><p>I created a skeleton for my app locally (using a text editor I have on my machine) and used <a href="http://git-scm.com/" target="_blank">Git</a> to deploy it to Azure Websites.</p><p class="showcase">If you are not familiar with this process, check <a href="http://azure.microsoft.com/en-us/documentation/articles/web-sites-nodejs-develop-deploy-mac/" target="_blank">this walkthrough in Azure's Node Developer Center</a>.</p><p>Once I had the skeleton app in Azure Websites, I switched into the browser and used <a href="http://www.software-architects.com/devblog/2014/03/12/End-to-end-sample-for-Visual-Studio-Online-Monaco-with-TypeScript-and-AngularJS" target="_blank">Visual Studio Online "Monaco"</a> for the rest of the development work. Once you enabled VSO for your website, you can connect to it using the URL <em>https://your-websites-name.scm.azurewebsites.net/dev/wwwroot/</em>. Here is a screenshot of how it looks like (click to enlarge):</p><p>
  <function name="Composite.Media.ImageGallery.Slimbox2">
    <param name="MediaImage" value="MediaArchive:53979e5f-7455-4704-94d6-c6b2934743b0" />
    <param name="ThumbnailMaxWidth" value="800" />
    <param name="ThumbnailMaxHeight" value="800" />
    <param name="ImageMaxWidth" value="1280" />
    <param name="ImageMaxHeight" value="1024" />
  </function>Monaco really works great for small web development projects. You have a nice editor with IntelliSense (not as good as Visual Studio but still ok), a console, output window, Git integration, auto-save, etc.</p><h2>Summary</h2><p>Granted, this example has very limited functionality. However, sometimes especially such small projects are a challenge. You don't have a large budget, it has to be in production within a few hours, no server resources, maybe even not your usual developer workstation. This sample should demonstrate that the cloud shines in such situations. Nearly all of the systems mentioned above offer free tiers for low-volume websites like mine. But still you get world-class services and a professional level of security.</p>