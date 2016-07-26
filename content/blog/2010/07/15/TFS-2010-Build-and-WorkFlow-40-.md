---
layout: blog
title: TFS 2010 Build and WorkFlow 4.0 
teaser: After having released time cockpit 1.0, we decided to finally upgrade to Team Foundation Server 2010. The upgrade seemed to have worked without any problem and day-to-day work continued as normal with checkins, branching and merging working at least as good as before. If you read of the changes between TFS 2008 and TFS 2010 (here) you may have noticed that TFS Build 2010 is based on WorkFlow 4.0 (WF4).
author: Philipp Aumayr
date: 2010-07-15
bannerimage: 
lang: en
tags: [TFS]
permalink: /blog/2010/07/15/TFS-2010-Build-and-WorkFlow-40-
---

<p>After having released time cockpit 1.0, we decided to finally upgrade to Team Foundation Server 2010. The upgrade seemed to have worked without any problem and day-to-day work continued as normal with checkins, branching and merging working at least as good as before. If you read of the changes between TFS 2008 and TFS 2010 (<a title="Video describing new features in TFS 2010" href="http://channel9.msdn.com/pdc2008/TL52/" target="_blank">here</a>) you may have noticed that TFS Build 2010 is based on WorkFlow 4.0 (WF4). While it still works to use our existing MSBuild based automated build system, we do not get all the fresh, exciting features TFS 2010 brings. Since things are quite calm, I decided to take a look at it and port our build system to WF4.</p><p>While MSBuild was based on the notion of tasks and project files inheriting and overloading tasks, WF4 is based on the concept of activities. You can sequence activities, execute them in parallel, etc. One of the very nice things about WF4 is it's type safety and kinda-compilation. With MSBuild I often started a build just to find out that at the end, you mistyped a variable name and it expanded to an empty string. This is ok, if you build a few small projects and your build is short, but here it means half an hour of keeping your fingers crossed. WF4 definitely accelerated this process.</p><p>One of the big annoyances is a bug in the WF editor. If you drop in a ForEach&lt;T&gt; loop as an activity at first everything seems to work fine. You add your within-loop-sequence, try to add some variables, etc. Great. Save the workflow, close the document, open it again, peng: gone. Nothing is saved within. It took me some time with our favourite search engine to stumble over this <a title="articledescribing the problem with the foreach" href="http://blogs.msdn.com/b/tilovell/archive/2009/12/29/the-trouble-with-system-activities-foreach-and-parallelforeach.aspx" target="_blank">blog post</a>. After this I ended up adding some xaml to every ForEach I added.</p><p>So after having added a ForEach loop you usually have something like this in your code:</p>{% highlight xml %}<ForEach x:TypeArguments="x:String" sap:VirtualizedContainerService.HintSize="287,206" 
         Values="[configFiles]"/>{% endhighlight %}<p>What you actually want is this:</p>{% highlight xml %}<ForEach x:TypeArguments="x:String" sap:VirtualizedContainerService.HintSize="287,206" 
         Values="[configFiles]">
  <ActivityAction x:TypeArguments="x:String">
    <ActivityAction.Argument>
      <DelegateInArgument x:TypeArguments="x:String" Name="configFile" />
    </ActivityAction.Argument>
    <Sequence>
     <!-- Do something with configFile available as variable here -->
    </Sequence>
  </ActivityAction>
</ForEach>{% endhighlight %}<p>After having added those lines to your ForEach you can save the file and open it up in the visual workflow editor again. You can also modify the sequence from within the editor and it will work fine.Other than that I do appreciate WF4. The type safety, a graphical overview about what is executed, .NET class types (very nice for formatting). And learning WF has more use cases than just build automation, making my time spent learning WF worth it. Now if they could only get C# instead of VB for those expressions...</p>