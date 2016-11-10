---
layout: blog
title: Docker Image and ARM Template for Minecraft Modding with .NET Core
excerpt: Currently, I am at Microsoft's MVP Summit in Redmond. Today is hackathon day. I decided to join the group dealing with Minecraft modding in .NET Core and C#. I created a Docker image and an ARM template to make it super simple to spin up a Minecraft server fully configured to be programmed with .NET. This article describes the code and contains all links.   
author: Rainer Stropek
date: 2016-11-10
bannerimage: /content/images/blog/2016/11/minecraft-server-docker-azure-small.png
bannerimagesource: 
lang: en
tags: [CSharp,Minecraft,DotNet]
permalink: /devblog/2016/11/10/minecraft-server-for-dotnet-csharp-modding
showtoc: false
---

{: .banner-image}
![Minecraft Server with Docker and Azure]({{site.baseurl}}/content/images/blog/2016/11/minecraft-server-docker-azure.png)


## Introduction

Learning .NET Core and C# does not have to be boring. A funny way is for instance writing [Minecraft](https://minecraft.net/) mods in .NET core. [Bertrand Le Roy](https://github.com/bleroy) from Microsoft is working on a [.NET client for Minecraft](https://github.com/bleroy/minecraft.client).

Currently, I am at Microsoft's MVP Summit in Redmond. Today is hackathon day. I decided to join the group dealing with Minecraft modding in .NET Core and C#. I created a Docker image and an ARM template to make it super simple to spin up a Minecraft server fully configured to be programmed with .NET.


## Minecraft Server in Docker

If you want to program with the [Decent .NET client for Minecraft](https://github.com/bleroy/minecraft.client), you could install the necessary mod in your local Minecraft or you could run a Minecraft server locally. However, I try to keep my machine as clean as possible. So I thought it would be a good idea to use Docker to automate and isolate the Minecraft server with all the necessary mods installed.

### Dockerfile

One result of my work today is the following *Dockerfile* (you can find the latest version of it in my [GitHub repository](https://github.com/rstropek/RaspberryJamModDocker/blob/master/Dockerfile)):

```
FROM openjdk:8u111-jre

# Update packages and install prerequisites
RUN apt-get -y update \
    && apt-get -y install unzip

# Download and install Minecraft Forge
RUN mkdir /bin/forge \
    && cd /bin/forge \
    && curl http://files.minecraftforge.net/maven/net/minecraftforge/forge/1.10.2-12.18.2.2099/forge-1.10.2-12.18.2.2099-installer.jar -o forge-1.10.2-12.18.2.2099-installer.jar \
    && java -jar forge-1.10.2-12.18.2.2099-installer.jar --installServer \ 
    && printf "#%s\neula=true" "$(date)" > /bin/forge/eula.txt 

WORKDIR /bin/forge

# Download and install Raspberry Jam
RUN mkdir /tmp/RaspberryJamMod \
    && cd /tmp/RaspberryJamMod \
    && curl -L https://github.com/arpruss/raspberryjammod/releases/download/0.82.2/mods.zip -o /tmp/RaspberryJamMod/mods.zip \
    && unzip /tmp/RaspberryJamMod/mods.zip -d /tmp/RaspberryJamMod \
    && mkdir /bin/forge/mods \
    && cp ./1.10.2/*.jar /bin/forge/mods/

EXPOSE 25565 4711 

CMD ["java", "-jar", "forge-1.10.2-12.18.2.2099-universal.jar"]
```
 
### Automated Build

One nice thing of Docker is its capability for automating the build process of images. Connecting GitHub with Docker Hub is simple. You can find a detailed description in [Docker's documentation](https://docs.docker.com/docker-hub/builds/). Once you connected the two systems, Docker Hub will build your image whenever a checkin happens in GitHub.

![Docker automated build]({{site.baseurl}}/content/images/blog/2016/11/docker-automated-build.png)


## Microsoft Azure

If multiple people want to share one Minecraft server or if you do not have Docker installed locally, you will need a central server. [Microsoft Azure](https://azure.microsoft.com) is a great cloud to run Docker hosts. To make it super simple to run the Docker container with the configured Minecraft server in Azure, I created an ARM template for it. You can find it in [my GitHub repository](https://github.com/rstropek/RaspberryJamModDocker/tree/master/ARM-Template).

Microsoft offers a very handy service for adding a *Deploy to Azure* button to ARM templates in GitHub. You can find more information and a sample about it [here](https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/sample-README.md).

![Deploy to Azure]({{site.baseurl}}/content/imagesOriginal/blog/2016/11/deploy-to-azure.png)


## Start Modding

Once you have your Minecraft server running locally or in Azure, you can use Bertrand's [.NET client for Minecraft](https://github.com/bleroy/minecraft.client) to program Minecraft with .NET Core.

Have fun!
