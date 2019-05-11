---
layout: blog
title: Container on Azure and CSharp Spans at dotnet Cologne
excerpt: Yesterday, I was at dotnet Cologne speaking about Container on Azure and Spans in CSharp. As every year, it was a great conference. Impressive, what community can do. In this post I publish links to the material I used in my sessions.
author: Rainer Stropek
date: 2019-05-11
bannerimage: /content/images/blog/2019/dotnet-cologne-19-small.jpg
lang: en
tags: [Docker, CSharp]
permalink: /devblog/2019/05/docker-azure-csharp-dotnet-cologne
showtoc: true
---

{: .banner-image}
![Intro Logo]({{site.baseurl}}/content/images/blog/2019/dotnet-cologne-19.jpg)

## Introduction

Yesterday, I was at dotnet Cologne speaking about Container on Azure and Spans in CSharp. As every year, it was a great conference. Impressive, what community can do. In this post I publish links to the material I used in my sessions.

I had my video equipment with me to record the sessions. Unfortunately, I did a stupid mistake. I didn't recognized a SD card running rull during my presentation. Therefore, I cannot publish yesterday's videos here. However, in my [YouTube channel](https://www.youtube.com/user/rainerstropek/) you can find other videos on the topics I did at dotnet Cologne.

## Container-as-a-Service in Azure

Im my session about Container-as-a-Service, I showed *Azure Container Registry*, *Azure Container Instances*, *Web Apps for Containers*, and *Azure Kubernetes Service*. The basis of my talk was an Azure CLI script. It is [available on GitHub](https://github.com/rstropek/DockerVS2015Intro/blob/master/dockerDemos/12-azure-caas/workshop/demo-workshop.azcli).

## CSharp *Span of T*

My second topic was `Span<T>` in C#. We did a deep dive and looked behind the scenes to understand what it does, how it is implemented, and what it's pros and cons are. Again, I did not do slides. Instead, I described `Span<T>` based on sample code I wrote. It is also [available on GitHub](https://github.com/rstropek/Samples/tree/master/CSharp7/Span).
