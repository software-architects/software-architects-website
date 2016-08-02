---
layout: blog
title: Storage Deep Dive @ DevConnections in Karlsruhe 
excerpt: Elasticity is what the world of cloud computing is all about. Do you quickly need more storage because of high load on your systems? No problem, in Windows Azure you can store up to 100 TB with a single account and create new SQL clusters within a few seconds. And the best -  you just pay for what you really use. In this one day workshop Rainer Stropek, MVP for Windows Azure, presents the storage technologies of Windows and SQL Azure. Learn about blob and table storage as well as SQL Azure, Microsoft’s SQL Server in the cloud.
author: Rainer Stropek
date: 2011-06-06
bannerimage: 
bannerimagesource: 
lang: en
tags: [Azure]
permalink: /devblog/2011/06/06/Storage-Deep-Dive--DevConnections-in-Karlsruhe-
---

<p>Tomorrow I will do a full-day workshop about Windows Azure Storage and SQL Azure at <a href="http://www.devconnections.com/germany" target="__blank">DevConnections</a> conference in Karlsruhe (Germany). Here is the abstract of the workshop:</p><p>
  <em>Elasticity is what the world of cloud computing is all about. Do you quickly need more storage because of high load on your systems? No problem, in Windows Azure you can store up to 100 TB with a single account and create new SQL clusters within a few seconds. And the best: you just pay for what you really use. In this one day workshop Rainer Stropek, MVP for Windows Azure, presents the storage technologies of Windows and SQL Azure. Learn about blob and table storage as well as SQL Azure, Microsoft’s SQL Server in the cloud. Rainer will start by comparing the different storage options and giving you advice when to use what. Next you will see all storage systems of the Windows Azure Platform in action. The third part of the workshop dives deeper into SQL Azure. Rainer will cover the underlying architecture of SQL Azure including its security and firewall capabilities. You will see the differences between on-premise SQL Server and SQL Azure and explore performance and cost benefits of the different sharding approaches that are typical for scale-out scenarios in the cloud.</em>
</p><p>Here is what I will cover in the workshop:</p><ul>
  <li>Overview about storage in the Windows Azure Platform</li>
  <li>Windows Azure Storage

<ul><li>General Introduction</li><li>Blob Storage</li><li>Drives</li><li>Tables</li><li>Queues</li></ul></li>
  <li>SQL Azure

<ul><li>Introduction</li><li>OData and SQL Azure</li><li>Scaling with Sharding</li><li>SQL Azure and Sync scenarios</li></ul></li>
</ul><p>Participants and other people who are interested in the topic can <a href="{{site.baseurl}}/content/images/blog/2011/06/Windows and SQL Azure Storage Deep Dive.pdf" target="_blank">download the slides</a>.</p><p class="InfoBox">2011-06-08: At the workshop we created a complete sample with web and worker roles and did some load testing for the sync and the async implementation. You can download the sourcecode <a href="{{site.baseurl}}/content/images/blog/2011/06/Tickets.zip" target="_blank">here</a>.</p>