---
layout: blog
title: Create Dump of MongoDB on Windows using Docker Machine
excerpt: Recently, I have been doing some programming work using the MEAN stack (Mongo, Express, Angular, Node). I use a Windows PC as my dev box and host my Mongo databases on Mongo Labs (mLabs) in Azure. Therefore, I need to create dumps as backups. In this blog article I summarize how I do that with Docker Machine.
author: Rainer Stropek
date: 2016-04-10
bannerimage: /content/images/blog/2016/04/filezilla-docker-machine.png
lang: en
tags: [About]
permalink: /devblog/2016/04/10/Create-Dump-of-MongoDB-on-Windows-using-Docker-Machine
---

<p>Recently, I have been doing some programming work using the MEAN stack (Mongo, Express, Angular, Node). I use a Windows 10 PC as my dev box and host my Mongo databases on Mongo Labs (mLabs) in Azure. I need to create dumps as backups. In this blog article I summarize how I do that with Docker Machine.</p><h2>Docker Machine</h2><p>First, get Docker onto your Windows box by using <a href="https://docs.docker.com/machine/overview/" target="_blank">Docker Machine</a>. At the day of writing, Virtual Box comes with Docker Machine automatically. I uninstall it after installing Docker Machine as I prefer to use my local Hyper-V instead.</p><p>Once you got Docker Machine, you can create your first docker host. As mentioned, I use Hyper-V for that. Therefore, I used the <a href="https://docs.docker.com/machine/drivers/hyper-v/" target="_blank">Hyper-V driver of Docker Machine</a>. So the command looks something like this:</p>{% highlight text %}docker-machine create --driver hyperv default{% endhighlight %}<p>Verify that everything is up and running using <em>docker info</em> and <em>docker pull mongo</em> (pulls down the <a href="https://hub.docker.com/_/mongo/" target="_blank">MongoDB image from Docker Hub</a>).</p><h2>Run mongodump in Docker Container</h2><p>Now we can use <em>mongodump</em> inside a Docker Container to create our dump:</p><p>
  {% highlight text %}docker run --rm -v /opt/backup:/opt/backup mongo mongodump --host ds999999.mlab.com --port 42898 --db yourDb --username your_user --password y0urP@ssw0rd! --out /opt/backup/mongo-backup{% endhighlight %}Note that the command uses a <a href="https://docs.docker.com/engine/userguide/containers/dockervolumes/#mount-a-host-directory-as-a-data-volume" target="_blank">Docker Volume Mapping</a> to store the Mongo dump in the host's <em>/opt/backup/</em> folder.</p><h2>Use FileZilla to transfer the dump</h2><p>Last but not least you can use FileZilla to transfer the dump from your Docker Host to your Windows box. Here are the settings you need:</p><ul>
  <li>Server: Get the IP address by using the command <em>docker-machine ls</em></li>
  <li>Protocol: <em>SFTP - SSH File Transfer Protocol</em></li>
  <li>User: <em>docker</em></li>
  <li>Logon Type: <em>Key file</em></li>
  <li>Key File: <em>C:\Users\your.user\.docker\machine\machines\default\id_rsa</em></li>
</ul><p>That's it. Three simple steps and you have your Mongo dump on your Windows dev box.</p>