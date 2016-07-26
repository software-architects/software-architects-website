---
layout: blog
title: OOP 2015 -  ALM in the Cloud with Visual Studio Online and Azure
teaser: At OOP 2015 conference, I will do a session about ALM in the cloud. As always I try to show mostly practical samples instead of boring slides. In this blog post I summarize the talk and reference important resources that I will mention.
author: Rainer Stropek
date: 2015-01-27
bannerimage: 
lang: en
tags: [Azure,Project Management,Visual Studio]
permalink: /blog/2015/01/27/OOP-2015-ALM-in-the-Cloud-with-Visual-Studio-Online-and-Azure
---

<p>At <a href="http://www.oop-konferenz.de/oop2015/startseite-englisch/conference.html" target="_blank">OOP 2015 conference</a>, I will do a session about <em><a href="https://en.wikipedia.org/wiki/Application_lifecycle_management" target="_blank">Application Lifecycle Management</a> (ALM)</em> in the cloud (<a href="http://www.oop-konferenz.de/nc/oop2015/konferenz/konferenzprogramm/conference-detail/erfahrungsbericht-alm-in-der-cloud.html" target="_blank">link to German abstract</a>). As always, I try to show mostly practical samples instead of boring slides. In this blog post I summarize the talk and reference important resources that I will mention during my session.</p><h2>Video</h2><p>The video is available on <a href="http://channel9.msdn.com/Series/Visual-Studio-Germany/ALM-in-the-Cloud-with-Visual-Studio-Online-and-Azure" target="_blank">Channel9</a>. Here it is:</p><iframe src="//channel9.msdn.com/Series/Visual-Studio-Germany/ALM-in-the-Cloud-with-Visual-Studio-Online-and-Azure/player" width="800" height="450" allowFullScreen="allowFullScreen" frameBorder="0"></iframe><h2>Code</h2><p class="showcase">All the code that I use in my session can be found in my <a href="https://github.com/rstropek/Samples/tree/master/SimpleOwinDatabaseSample" target="_blank">GitHub samples repository</a>.</p><h2>Motivation</h2><p>Our company <em>software architects</em> was "born in the cloud". We have been running our production infrastructure in <a href="http://azure.microsoft.com" target="_blank">Microsoft Azure</a> from the first day on. However, until some months ago, our ALM and test infrastructure was running on-premise. We watched closely what Microsoft did in terms of offering <em>Team Foudation Server</em> (TFS) in the cloud (aka <a href="http://www.visualstudio.com/products/what-is-visual-studio-online-vs" target="_blank">Visual Studio Online</a> or VSO). Moving our ALM system into the cloud seemed like the logical next step in our cloud strategy.</p><p>Here are the most important reasons why we had been eagerly waiting for VSO:</p><ol>
  <li>
    <strong>Reduce or ideally remove the need for on-premise infrastructure</strong>
    <br />
 We are by far no experts in data center operations. Microsoft's ISO-certified data centers would offer us a much more professional and secure environment for our ALM system.</li>
  <li>
    <strong>Reduce maintenance costs</strong>
    <br />
 Keeping the on-premise TFS plus its underlying infrastructure up to date is a time-consuming task. Our job is writing software, not maintaining TFS.</li>
  <li>
    <strong>Make us more agile</strong>
    <br />
 Our team grows. Projects are started and stopped every now and then. Our need for infrastructure (e.g. build) is not static, it fluctuates. Using an auto-scaling service in the cloud supports our agile approach of working.</li>
</ol><p class="showcase">At the end, everything boils down to: <strong>focus</strong>. We want to <strong>focus</strong> on building our SaaS offering <a href="http://www.timecockpit.com" target="_blank">time cockpit</a> and related software products and remove distractions like maintaining infrastructure.</p><h2 class="showcase">What is ALM to us?</h2><p>ALM means different things for different teams. For us, ALM has to cover the following major aspects:</p><ol>
  <li>
    <strong>Source Code Control
<br /></strong> This is the most important topic. We need a robust and secure code repository.</li>
  <li>
    <strong>Automated Build (including execution of Unit Tests)
<br /></strong> We never hand out software to customers that has been built on developer workstations. Our build processes are fully automated to minimize the risk of human mistakes and guarantee constantly high quality.</li>
  <li>
    <strong>Continuous Delivery
<br /></strong> We deploy code to our test and production systems frequently (many times per week). Doing that manually would be too time consuming and error prone. Deployment has to be an integral part of our build and test infrastructure.</li>
  <li>
    <strong>Project and Requirements Management
<br /></strong> We work based on <a href="http://www.timecockpit.com/blog/2014/12/31/Why-We-Don%E2%80%99t-Do-Scrum-for-Time-Cockpit" target="_blank">Kanban</a>. Our ALM system has to support this agile approach (e.g. backlog management, Kanban board, etc.).</li>
  <li>
    <strong>Customer Service
<br /></strong> We need a tool for customer service (trouble ticket management). It has to be integrated with project management so that we can create work items based on tickets e.g. in case of bugs or important feature requests.</li>
  <li>
    <strong>Team Communication
<br /></strong> Of course we use email and Skype for team communication. However, both systems have drawbacks. Email is too heavy for short, informal notes and discussions. Skype is great for that but does not offer appropriate history and search. We need a tool integrated with our Customer Service and Project Management system that supports related discussions and notes.</li>
  <li>
    <strong>Time Tracking and Financial Project Controlling
<br /></strong> This aspect is very important for us. We need a system for managing billable hours in case of customer projects (e.g. implementation of time cockpit at a customer, consulting projects, etc.) and for tracking our internal development effort (e.g. for managing our internal time budget per sub-project or work item).</li>
</ol><h2>What to Consider?</h2><p>Before you decide whether cloud-based ALM is right for you, you should consider the following questions:</p><ol>
  <li>
    <strong>Security</strong>
    <br />
 Going into the cloud does <em>not</em> necessarily mean less security. In our case, cloud means a more secure system. We simply cannot/don't want to run a professional, high-secure, and high-available ALM infrastructure on-premise. Visual Studio Online for instance is available in Europe, has <a href="http://blogs.msdn.com/b/bharry/archive/2015/01/15/visual-studio-online-iso-27001-certification-and-european-model-clauses.aspx" target="_blank">ISO 27001 certification</a>, and includes <em>European Model Clauses</em> into its contracts. However, internal policies or legal restrictions might stop you from putting your ALM systems in the cloud.</li>
  <li>
    <p>
      <strong>Costs</strong>
      <br />
      <span lang="EN-US">The cost structure of ALM in the cloud is entirely different from what you might be used to. No single, big, upfront investment. You have to pay based on the number of users and/or your usage (e.g. build hours) instead.</span> You have to invest some time in calculating the costs related to the ALM services you want to use. VSO for instance has <a href="http://www.visualstudio.com/pricing/visual-studio-online-pricing-vs" target="_blank">detailed pricing information</a> and an <a href="http://azure.microsoft.com/en-us/pricing/calculator/?scenario=full#meter45" target="_blank">online calculator</a> for that.</p>
    <p class="showcase">If you develop software based on Microsoft technology, you should definitely check out the benefits that you get from <a href="http://partner.microsoft.com" target="_blank">Microsoft's Partner Program</a> and its related certification. It can save you lots of money as you could get ALM resources for free.</p>
  </li>
  <li>
    <strong>Internet connection</strong>
    <br />
 You will still have on-premise components (e.g. your development workstations). Therefore, ALM in the cloud means that you have to have a powerful and reliable internet connection. We even moved to a new office location in order to get better internet.</li>
  <li>
    <strong>Limited customization</strong>
    <br />
 SaaS solutions like VSO are <a href="https://en.wikipedia.org/wiki/Multitenancy" target="_blank">multi-tenant</a>. A single server (farm) handles lots of different tenants. As a result, many providers limit the degree to which you can tailor the system to your needs. In VSO for instance you still cannot customize e.g. work items, workflows, etc. the way you are used to from your on-premise TFS (<span lang="EN-US">Microsoft has informally (in blog comments) said that <a href="http://blogs.msdn.com/b/bharry/archive/2014/09/23/visual-studio-online-update-sept-23th.aspx" target="_blank">enabling customization is a goal for Q1 2015</a>)</span>. <span lang="EN-US">If you use Jira, not all the 3<sup>rd</sup> party plugins you use might support Atlassian’s Cloud already. </span> You have to verify that the cloud ALM system of your choice offers all the features you need. You must not assume that the cloud counterpart of the ALM system you use on-premise offers exactly the same feature set.</li>
  <li>
    <strong>Migration
<br /></strong> You have to consider a migration project. We took the opportunity of starting a big sub-project (we are <a href="http://www.timecockpit.com/blog/2014/12/15/Opening-HTML5-Client-for-Public-Preview" target="_blank">switching from WPF/Silverlight to HTML5</a> for our client). We started development of this new component in VSO from the very beginning. We decided not to migrate TFS history. Instead, we will keep our existing on-premise TFS alive for some time for maintaining legacy code and old change history. However, we have reduced maintenance to an absolute minimum.</li>
</ol><h2>Single, Integrated Solution or Best of Breed</h2><p>On-premise, companies often prefer integrated solutions over a best-of-breed approach. The reasons are maintenance and infrastructure costs. Imagine you want to combine three different systems for requirements management, source code control plus build, and bug tracking. Each of them might use different technology stacks (e.g. .NET, Java, PHP). Maintaining the underlying infrastructure would be costly and time-consuming.</p><p>That changes in the cloud entirely. You do not have to care about infrastructure. As long as you tools of choice support appropriate, platform-independent standards for webservices (e.g. REST, OAuth2, OData, webhooks, etc.), integrating them isn't magic.</p><p class="showcase">So best-of-breed is much easier in the cloud than it is on-premise. <span lang="EN-US">However, cross-tool integration is never a free lunch.</span></p><h2>Our Current Toolset</h2><p>This is the toolset we currently use for our own ALM:</p><ul>
  <li>
    <a href="https://www.atlassian.com/software#cloud-products" target="_blank">Jira in the Atlassian Cloud</a> for agile project management (Kanban)</li>
  <li>
    <a href="https://www.zendesk.com/" target="_blank">Zendesk</a> for customer service - it offers a Jira-cloud-integration out of the box</li>
  <li>
    <a href="http://www.visualstudio.com/products/what-is-visual-studio-online-vs" target="_blank">Visual Studio Online</a> for source code control (Git), build, and continuous integration</li>
  <li>
    <a href="https://slack.com/" target="_blank">Slack</a> for informal team communication - it offers e.g. Zendesk-integration out of the box</li>
  <li>
    <a href="http://www.timecockpit.com" target="_blank">Time cockpit</a> for time tracking, project controlling, and billing -<span lang="EN-US"> offers integrations to Jira, Zendesk, and VSO</span></li>
</ul><p>All of these products run in the cloud and all of them support platform-independent web services. Therefore, it was quite simple to integrate them. The following image shows the integration of the different tools:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2015/01/ALMIntegration.png?mw=800" />
</p><p class="showcase">Read more about how we build and run our brand new web client for time cockpit <a href="http://www.timecockpit.com/blog/2014/12/30/How-We-Build-and-Run-Time-Cockpit-Web-Preview" target="_blank">in this blog article</a>.</p><h2>Demo</h2><p>During my session at OOP I will demonstrate setting up an ALM system with most parts of our current toolset. It will cover:</p><ul>
  <li>Creation of a new VSO project environment for source code control, project management, and automated build</li>
  <li>Integration of the VSO project with Microsoft Azure for continuous delivery</li>
  <li>Integration of Jira with VSO using webhooks and REST webservices</li>
</ul><p class="showcase">I have created a small sample demonstrating how easy it is to integrate Jira and VSO via webservice. You can use <a href="https://developer.atlassian.com/display/JIRADEV/JIRA+Webhooks+Overview" target="_blank">Jira's webhooks</a> to get a message whenever an issue is created. Inside of the webhook you can use <a href="http://www.visualstudio.com/en-us/integrate/reference/reference-vso-overview-vsi" target="_blank">TFS' REST API</a> to create e.g. VSO backlog items. You can find the sample code in my <a href="https://github.com/rstropek/Samples/tree/master/SimpleOwinDatabaseSample/JiraWebhook" target="_blank">GitHub samples repository</a>.</p><h2>Next Steps</h2><p>Over time, we plan to replace Jira with VSO because of the following two reasons:</p><ul>
  <li>
    <strong>Cost reduction</strong>
    <br />
 As Microsoft partners, we do not have to pay (or at least pay less) for VSO. Additionally, VSO offers <a href="http://blogs.msdn.com/b/somasegar/archive/2014/08/27/visual-studio-online-stakeholder-license.aspx" target="_blank">free accounts for stakeholders</a> who just use VSO for project and requirements management.</li>
  <li>
    <strong>Customization is coming</strong>
    <br />
 One of the major reasons why we are using Jira is that VSO does not support customizations in the cloud. This will hopefully change in the next few months.</li>
</ul>