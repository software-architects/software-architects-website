---
layout: blog
title: Customizing Build Workflows in Visual Studio Online
excerpt: At TechEd 2013 I did a talk about build in the cloud. For ALM Days next week, Microsoft invited me to do an updated version of this session. So I brought my samples up-to-date and switched to Git. In this blog post I describe what I will demo during the session.
author: Rainer Stropek
date: 2014-02-21
bannerimage: 
bannerimagesource: 
lang: en
tags: [Azure,TFS,Visual Studio]
permalink: /devblog/2014/02/21/Customizing-Build-Workflows-in-Visual-Studio-Online
---

<p>At Microsoft TechEd 2013 I did a session about continuous delivery in the cloud with Team Foundation Services. If you are interested you can watch a video and download the session material in <a href="http://www.software-architects.com/devblog/2013/06/26/MS-TechEd-2013-Talk-Continuous-Integration-with-Team-Foundation-Services-and-Windows-Azure-Websites" target="_blank">this blog post</a>. However, some time has gone by and things have developed. TFServices is now <a href="http://www.visualstudio.com/" target="_blank">Visual Studio Online</a>. Visual Studio 2013 is RTM. <a href="http://git-scm.com/" target="_blank">Git</a> is now a first class citizen in the TFS and Visual Studio family. And last but not least <a href="http://www.windowsazure.com/en-us/services/web-sites/" target="_blank">Windows Azure Websites</a> has shown tremendous progress.</p><p>For next week I am invited to do an updated version of last year's TechEd talk at <a href="http://alm-days.de/" target="_blank">ALM Days</a> in Germany. The session will be in German so I only have a German abstract:</p><div style="margin-left: 2em">
  <p>
    <em>Team Foundation Services in der Cloud sind eine bequeme Sache. Keine Sorgen mehr mit der Hardwarewartung oder mit Softwareupdates. Buildserver inklusive. Aber ist die Lösung auch flexibel an die jeweiligen Projektbedürfnisse anpassbar? In dieser Session stellt Azure MVP Rainer Stropek Build in TFServices anhand eines durchgängigen Beispiels vor. Wir bleiben aber nicht beim Standardworkflow. Rainer zeigt, wie man auch in der Cloud den Buildworkflow anpassen und sogar um eigene Build-Activities erweitern kann.</em>
  </p>
</div><p>In this blog post I summarize what has changed since my session in summer last year at TechEd.</p><p class="showcase">If you want to play with the sample, feel free to download it from my <a href="https://github.com/rstropek/Samples/tree/master/BeeInMyGarden" target="_blank"><em>Samples</em> project on GitHub</a>.</p><h2>Git</h2><p>If you start with Visual Studio Online today, I recommend using Git as your version control system. The integration in TFS is great and the tooling in Visual Studio 2013 is awesome.</p><p class="showcase">If you are not familiary with Git, I recommend reading <a href="http://git-scm.com/book/en" target="_blank">Scott Chacon' Pro Git book</a>. It is a great introduction to Git's underlying ideas and concepts and it is free.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/VSOnlineGit.png" />
</p><p>Once you have created your project in Visual Studio online, you can use Git tooling in Visual Studio 2013 or the Git command line tools to connect with your project. All you need is the url of the Git repo in the cloud:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/GitUrl.png" />
</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/ConnectTfs.png?mw=650" />
</p><h2>Windows Azure Websites (WAWS)</h2><p>Now that we have TFS, we can create our WAWS. If you haven't checked out WAWS yet or your last contact with WAWS is quite a while ago, take the time to check out the latest WAWS features Microsoft launched. In my opinion WAWS is by far the greatest cloud offering from Microsoft for developers today - and it is still getting a lot of love from the developers from Redmond so we can even expect much more in the future.</p><p>For my sample you will need to create a website and a Windows Azure SQL Database.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/Waws.png?mw=650" />
</p><p>In my demo scenario I will create two different database: One for development and one for production. The connection string to the development environment will be part of the application's config file. Therefore they will be check in into Git. You should never check in production credentials. I recommend linking your WAWS with your production database instead:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/LinkDb.png?mw=650" />
</p><p>This will add a connection string configuration setting to your WAWS instance:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/ConnectionString.png?mw=650" />
</p><p>Note that this does not change your <em>web.config</em> file. It overrides the config setting at runtime. BTW - during the session I will show the <a href="http://www.thenextdoorgeek.com/post/Editing-Windows-Azure-Web-Sites-online-with-the-new-shiny-Monaco" target="_blank">"Monaco" preview of WAWS</a> to verify that our <em>web.config</em> has not been changed. If you follow along, you have to be patient for a few more moments. We have not deployed our code yet.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/webconfig.png?mw=650" />
</p><p>Last but not least we have to link WAWS with TFS. This is done in the Windows Azure management portal. You will have to enter the url of your Visual Studio online account and enter your Microsoft Account credentials. That's it. It will be done in a few seconds.</p><h2>Manual Deployment</h2><p>Now that we have set up TFS and WAWS, we can start coding. As a starting point you can grab the code for my sample from <a href="https://github.com/rstropek/Samples/tree/master/BeeInMyGarden">GitHub</a> and copy it into the directory into which you have cloned your TFS Git repository.<br /></p><p>Next, I recommend to try the sample locally. Open it in Visual Studio 2013 and build it manually. If you succeed, try to run it locally (don't forget to update connection string in the config files; they should point to the development database). If this works, too, try to deploy the application to WAWS manually (just click <em>Deploy</em> in the context menu of the web project and follow the instructions on the screen). Does ist work?</p><h2>Automated Build</h2><p>Connecting your WAWS with TFS automatically created a build definition for you. By default, the build will be triggered whenever you check something in.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/BuildDef.png?mw=650" />
</p><p>You can already try the automated build. Check in my sample and watch the build process in Visual Studio of in the Visual Studio Online portal. The sample does not only contain the website, it also contains tests and a class library. The web project will only be deployed to WAWS if the tests succeed.</p><h2>Customize the Build</h2><p>Build in Visual Studio Online is not a black box. You can examine the build workflow and also modify it. You can download the build process template in the build definition:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/DownloadBuildXaml.png" />
</p><p class="showcase">It is recommended to not edit the build process XAML without a solution. You should create an empty workflow project <a href="http://msdn.microsoft.com/en-us/library/dd647551.aspx" target="_blank">as described in this MSDN article</a>. Create a copy of the downloaded build process XAML and add it to the workflow project.</p><p>In my demo scenario, I would like to auto-generate a <em>version.cs</em> file so that all assemblies contain an auto-generated version number. The calculation of the version number is done in a custom build component. It is part of my demo code (solution <em>GenerateVersionFile.sln</em>). Open and build it. Go back to the workflow project created before and add the build component to your toolbox:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/ChooseItems.png" />
</p><p>Here is a step-by-step description of the scenario I demonstrate during the session:</p><ul>
  <li>Get the <em>Microsoft.TeamFoundation.Build.Activities.Extensions.WellKnownEnvironmentVariables.<strong>SourcesDirectory</strong></em> workflow property using the <em>GetEnvironmentVariable</em> activity:
<br /><img src="{{site.baseurl}}/content/images/blog/2014/02/GetSourcesDirectory.png?mw=650" /><br /></li>
  <li>Use the <em>CreateDirectory</em> activity to create a <em>Generated</em> helper directory: <em>System.IO.Path.Combine(SourcesDirectory, "Generated")</em></li>
  <li>Next, add the custom <em>GenerateVersionDirectory</em> activity. It will generate a version file in the <em>Generated</em> directory.
<br /><img src="{{site.baseurl}}/content/images/blog/2014/02/GenerateVersionFile.png" /></li>
  <li>Last but not least you have to change the command line arguments for MSBuild:
<br /><em>String.Format("/p:SkipInvalidConfigurations=true {0} <strong>/p:VersionFile=""{1}""</strong>", AdvancedBuildSettings.GetValue(Of String)("MSBuildArguments", String.Empty), <strong>System.IO.Path.Combine(SourcesDirectory, "Generated", "Version.cs")</strong>)
<br /><img src="{{site.baseurl}}/content/images/blog/2014/02/CommandLineArgs.png?mw=650" /></em><br /></li>
</ul><h2>Publishing the Build Configuration</h2><p>Now that we have set up the build locally, we have to make it available to Visual Studio Online:</p><ul>
  <li>First you have to check in the DLL containing the custom build activity (<em>GenerateVersionFileActivity.dll</em>) in Git. Remember the directory into which you put the DLL.</li>
  <li>Next you have to tell Visual Studio Online where to look for custom build activities (click to enlarge):
<br /></li>
</ul><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:a4238ec0-5cdd-4b56-8933-95be0d7d3ea4" />
  <param name="ThumbnailMaxWidth" value="650" />
  <param name="ImageMaxWidth" value="1920" />
  <param name="ImageMaxHeight" value="1280" />
</function><ul>
  <li>Next you have to check in the XAML file with the custom build workflow.</li>
  <li>Last but not least you have to change your build configuration so that it executes your custom build workflow instead of the standard one:
<br /><img src="{{site.baseurl}}/content/images/blog/2014/02/CustomBuildWorkflow.png?mw=650" /><br /></li>
</ul><p>That's it. Trigger a new build and watch it progress. When it is done, you can download the drop location and check whether the DLL version has been set correctly:<br /></p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/02/DropLocation.png" />
</p>