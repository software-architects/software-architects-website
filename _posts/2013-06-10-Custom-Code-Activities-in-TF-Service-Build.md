---
layout: blog
title: Custom Code Activities in TF Service Build
excerpt: Recently, Microsoft launched their hosted Team Foundation Service which includes the ability to use customized workflows including custom code activities. Last week, I gave the feature a spin and here’s a few things that I tripped over.
author: Philipp Aumayr
date: 2013-06-10
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET,Azure,C#,TFS]
ref: 
permalink: /devblog/2013/06/10/Custom-Code-Activities-in-TF-Service-Build
---

<p>
  <strong>We have started to play with Microsoft's <a href="http://tfs.visualstudio.com" target="_blank">Team Foundation Services</a> quite a while ago. Last year we did our first talks about TFServices + Windows Azure and started to write articles about it. If you are new to this topic, take a look at the <a href="http://www.software-architects.com/devblog/2012/11/28/Continuous-Integration-With-Windows-Azure-Websites-and-Team-Foundation-Services" target="_blank">blog article</a> Rainer wrote in November last year. At upcoming <a href="http://channel9.msdn.com/Events/TechEd/Europe/2013/WAD-B302" target="_blank">TechEd Europe</a>, Rainer will have a presentation on continuous integration with TFServices and <a href="http://www.windowsazure.com/en-us/services/web-sites/" target="_blank">Windows Azure Websites (WAWS)</a>. In the presentation Rainer will not only demo the basics. He also wants to show how to customize the build workflow and extend it with a custom build task while still using TFServices ability to build a project in the cloud. For this blog post I want to summarize all steps that you have to go through in such a scenario.</strong>
</p><p>My goal for this sample was to build a task that creates a version number based on the current date+time and writes a C# file with the assembly information in it. We also do this in our own product <a href="http://www.timecockpit.com" target="_blank">time cockpit</a> for all of our assemblies (using a counted build number instead of a version number based on date+time). The sample application then includes the generated file (called “Version.cs”) instead of a default file containing version number “0.0.0.0” for desktop builds. Please note that in this article I assume that you have some knowledge concerning build workflows in TFS. If this is new to you, I recommend reading the <a href="http://msdn.microsoft.com/en-us/library/vstudio/ms400688.aspx" target="_blank">corresponding chapter in MSDN</a>.</p><h2>Create a new build definition and copy build template</h2><p>I first opened up the <em>Team Explorer -&gt; Builds</em> and clicked on <em>New Build Definition</em>. Next navigate to the <em>Process</em> tab and hit <em>Show Details</em>. Click “New” and chose to copy to a new build template. By default, this will create a new build process template xaml file in the <em>BuildProcessTemplates</em> folder.</p><p>Opening up the newly created file reveals the build process, which is very similar to the on premise variant. You could directly edit the workflow here, but for adding custom activities, especially custom code activities, you need to specify additional references. Therefore I created a new solution with two C# projects, one for the workflow itself and one for the custom code activities.</p><h2>Create a solution with a C# project for development</h2><p>I added the build template that was generated for me <strong>as a reference</strong> in order to not create another copy of it. If the file is opened from that project, the workflow editor will look for the references in the C# project. I therefore added a few references to the <em>Microsoft.TeamFoundation</em> assemblies to make the workflow editor happy. The project for the workflow should look similar to the following screenshot:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2013/06/tfservice-build-definition-references-to-tfs-api.png" alt="Project structure for the build definition containing the customized workflow for the TF Service build." title="Project structure for the build definition." />
</p><p>Ignore the <em>MyCustomBuildActivities</em> for now, as this is the reference to the second project containing the custom code activity.</p><h2>Create a second project in the same solution for custom activities</h2><p>The second project contains a single class for the custom code activity. All of this is identical to on premise WF, but I tripped over the missing <em><a href="http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.build.client.buildactivityattribute.aspx" target="_blank">BuildActivity</a></em> attribute, which will produce a <em>TF215097: An error occurred while initializing a build for build definition</em> error message, stating that it is unable to find your custom activity. The <em>BuildActivity</em> attribute can be found in the <em>Microsoft.TeamFoundation.Build.Client</em> assembly.</p><p>The code activity I wrote for generating the version file reads a template and then uses “string.Format” to fill in the <em>Version</em> and <em>Configuration</em> properties:</p>{% highlight c# %}namespace MyCustomBuildActivities
{
    using System;
    using System.Activities;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using Microsoft.TeamFoundation.Build.Client;

    [BuildActivity(HostEnvironmentOption.All)]
    public class GenerateVersionFile : CodeActivity
    {
        public InArgument<DateTime> InputDate { get; set; }

        public InArgument<string> Configuration { get; set; }

        public InArgument<string> FilePath { get; set; }

        public InArgument<string> TemplatePath { get; set; }

        protected override void Execute(CodeActivityContext context)
        {
            var timestamp = this.InputDate.Get(context);
            var configuration = this.Configuration.Get(context);

            var version = new Version(timestamp.Year, timestamp.Month * 100 + timestamp.Day, timestamp.Hour * 100 + timestamp.Minute, timestamp.Second);

            var filePath = this.FilePath.Get(context);
            var versionFileTemplate = this.TemplatePath.Get(context);

            File.WriteAllText(filePath, string.Format(File.ReadAllText(versionFileTemplate), version.ToString(4), configuration));
        }
    }
}{% endhighlight %}<h2>Set the version control path to custom assemblies</h2><p>Since you cannot just copy the assemblies to the build machine (it runs in the cloud and is not under your control) you have to check-in a compiled version of the build activity assembly. I created a new folder and added the debug assembly. To be on the safe side, check that your code is compiled to <em>AnyCPU</em>.</p><p>You then have to configure the build controller to pick up the assemblies located in that directory. To do this, click <em>Actions</em> on the <em>Build</em> page of the Team Explorer and select <em>Manage Build Controllers</em>:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2013/06/tfservice-manage-build-controllers.png" alt="Manage Build Controllers from Build Tab in Team Explorer" title="Manage Build Controllers..." />
</p><p>You can tell from the screenshot above that it took me a few iterations to get this working ;). Select the <em>Hosted Build Controller</em>, and click <em>Properties…</em>. In that dialog, set the path of the <em>Version control path to custom assemblies</em> to the path that you checked in the custom assembly at.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2013/06/tfservice-version-control-path.png" alt="Specify the path where the compiled code of the custom build assembly are located." title="Version control path for custom assemblies" />
</p><p>Note that you can only select a single directory per controller. For TFService, this means that you can only have a single directory for the assemblies. When I customized the build process for time cockpit, I wished that I could branch that folder and set that per build definition, but once you have the build running, you do not want to change those activities on a day per day basis anyhow.</p><h2>Place the custom code activity in the workflow</h2><p>To place the activity in the workflow, open up the <em>Visual Studio Toolbox</em> (Ctrl+Alt+X per default) and add a new Tab. In this new tab, select <em>choose items</em> from the context menu and point it to the checked-in assembly. You should see your code activity appear in the toolbox. You can then grab that item and drop it into the sequence of the workflow.</p><p>In my case I created a new sequence after the <em>Initialize Workspace</em> sequence in section <em>Process &gt; Sequence &gt; Run On Agent</em>. In the sequence I first placed a <em>CreateDirectory</em> activity that creates a directory named <em>Generated</em> in the source directory (variable <em>SourcesDirectory</em>). After that I placed my custom code activity, <em>GenerateVersionFile</em> that reads a template from a file which I also checked in.</p><p>The sequence looks similar to this:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2013/06/tfservice-generate-version-file-sequence.png" alt="Sequence creating a directory and calling the custom code activity from within the TFService workflow" title="Sequence for creating a custom directory and calling the custom code activity." />
</p><h2>Queue a build to check that the custom code activity is executed</h2><p>In order to verify that your custom code activity is executed, trigger a new build. Once it is done, open the log and search for the name of your activity: You should find something similar to this:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2013/06/tfservice-custom-code-activity-log-entry.png" alt="Log entry of the custom code activity in diagnostic mode display all parameter values" title="Log entry of the custom code activity" />
</p><p>Note that I turned the log verbosity to “Diagnostic” in order diagnose the issue of the missing <em>BuildActivity</em> attribute.</p><h2>Pitfalls</h2><p>While the variables available in the build are similar to the ones found in the on premise template, their values are quite different (and a lot shorter ;). This means that the binaries directory is not called <em>Binaries</em> (that’s what it is in TFS 2010 at least) but <em>bin</em>. Therefore, be sure to always concatenate the values of the variable names and not assume any directory names. The relative structure, as far as I have seen though, is identical.</p><p>As mentioned above, be sure to supply the <em>BuildActivity</em> attribute (<a href="http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.build.client.buildactivityattribute.aspx">http://msdn.microsoft.com/en-us/library/microsoft.teamfoundation.build.client.buildactivityattribute.aspx</a>), otherwise you will get the <em>TF215097: An error occurred while initializing a build for build definition</em> build error. If TFService Build would be charged per triggered build, that one would have cost me a fortune.</p><p>While I have not run into this limitation, be sure that your build time stays below an hour, since that seems to be the maximum time out. For more information on the hosted TFBuild Service, be sure to check this page as well: <a href="http://tfs.visualstudio.com/en-us/learn/hosted-build-controller-in-vs.aspx">http://tfs.visualstudio.com/en-us/learn/hosted-build-controller-in-vs.aspx</a> I got a lot of info from there. It also features a checklist weather your build requirements can be met by the Hosted Build Controller Infrastructure. If not, you can always add an on premise build machine or run your build server in a Windows Azure VM.</p>