---
layout: blog
title: DevOps Sessions at Container Conf
excerpt: Today, I will do two sessions at the Continous Lifecycle and Container Conference in Germany. As usual, my sessions will be very much cloud related. My firsts session is about container technology in the Microsoft universe. My second one covers Nano Server, the cloud-optimized version of Windows. In this blog post I share my slides and samples.
author: Rainer Stropek
date: 2016-11-15
bannerimage: /content/images/blog/2016/11/container-conf-thumb.png
bannerimagesource: 
lang: en
tags: [DevOps,Windows,Docker]
permalink: /devblog/2016/11/15/Docker-Windows-Nano-Server-Continuous-Lifecycle
showtoc: false
---

{: .banner-image}
![Docker Logo]({{site.baseurl}}/content/images/blog/2016/11/container-conf.png)


## Introduction

Today, I will do two sessions at the [Continous Lifecycle and Container Conference](https://www.continuouslifecycle.de/) in Germany. As usual, my sessions will be very much cloud related. My firsts session is about container technology in the Microsoft universe. My second one covers Nano Server, the cloud-optimized version of Windows. In this blog post I share my slides and samples.

{: .showcase}
You can find the slides (PPTX and PDF) and the sample code in [GitHub repository](https://github.com/rstropek/DockerVS2015Intro/blob/master/). Feel free to clone, fork and send me pull requests if you make enhancements.


## Containers in the Microsoft universe

Microsoft has fallen in love with containers and Docker. The goal of my session is to give an overview of how you can use containers and Docker as a Microsoft-oriented DevOps team. My session is structured as follows:

* Overview - what's available?
* Running Linux containers on Windows - Docker for Windows
* Running Windows containers on Windows
    * Docker on Windows Server (full server and Nano Server)
    * Dockerfiles for Windows containers
* Docker client on Windows
    * In Windows shell
    * In Bash Shell on Windows
* Docker on Azure
    * Docker in ARM (Azure Resource Manager)
    * Azure-Driver for Docker Machine
    * Azure Container Services
* Developer tools for Docker
    * Docker Tools for Visual Studio
    * VSTS/TFS integration of Docker

You can find my slides on [Speaker Deck](https://speakerdeck.com/rstropek/containers-and-docker-in-the-microsoft-universe):

<div class="videoWrapper">
    <script async class="speakerdeck-embed" data-id="2b259a3f6da5405f9ab2a23164eba956" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>
</div>

If you prefer PDF (with working links), here are the slides [on GitHub to download](https://github.com/rstropek/DockerVS2015Intro/blob/master/slides/Containers-Microsoft-Universe.pdf).


## Introduction to Windows Nano Server

Nano Server is the cloud-optimized version of Windows. The new version of Windows has been published by Microsoft with Windows Server 2016. It uses significantly less space (memory and disk) and can therefore offer much higher hosting density. My session is structured as follows:

* Overview - why Nano Server?
* Installation and deployment of Nano Server
* Managing Nano Server
* Nano Server, Containers and Docker

You can find my slides on [Speaker Deck](https://speakerdeck.com/rstropek/introduction-to-windows-nano-server):

<div class="videoWrapper">
    <script async class="speakerdeck-embed" data-id="3e3ed7287c6641e1a26271598b69c76f" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>
</div>

If you prefer PDF (with working links), here are the slides [on GitHub to download](https://github.com/rstropek/DockerVS2015Intro/blob/master/slides/Nano-Server-Introduction.pdf).
