---
layout: blog
title: Lightning Talk at MVP Summit - Minecraft and JavaScript at CoderDojo
excerpt: Beside my job, I am co-founder and organizer of a local CoderDojo. CoderDojos are programming clubs for kids. At Microsoft's MVP Summit in Redmond I do a lighting talk about how we use Minecraft + JavaScript to get kids motivated to learn coding with JavaScript. In this article I share links for attendees who want to reproduce my demos. 
author: Rainer Stropek
date: 2016-11-07
bannerimage: /content/images/blog/2016/11/minecraft-fireworks-small.png
bannerimagesource: 
lang: en
tags: [CoderDojo,Minecraft,JavaScript]
permalink: /devblog/2016/11/07/minecraft-javascript-mvp-summit
showtoc: false
---

{: .banner-image}
![Screenshot of sample Minecraft mod]({{site.baseurl}}/content/images/blog/2016/11/minecraft-fireworks.png)


## Introduction

Beside my job, I am co-founder and organizer of a [local CoderDojo](http://coderdojo-linz.github.io/). [CoderDojos](https://coderdojo.com/) are worldwide programming clubs for kids. At CoderDojo, we want to introduce kids to programming and show them how fascinating technology can be.

At Microsoft's MVP Summit in Redmond I do a lighting talk about how we use [Minecraft](https://minecraft.net/) + JavaScript to get kids motivated to learn coding with JavaScript. I will show how to build a Minecraft server with the [Scriptcraft](http://scriptcraftjs.org/) plugin enabled in a [Docker](https://www.docker.com/) container. With that, you can spin up multiple Minecraft servers for a group of kids in minutes.

Finally, I will demo some simple (=suitable for kids) Minecraft mods written in JavaScript. Of course I would also be happy to answer any CoderDojo-related questions.


## The Problem

At our CoderDojo, young beginners start with [Scratch](https://scratch.mit.edu/). Scratch is awesome for kids who have never done programming before. Within two hours, a seven your old can create her first browser game and share it with her friends. Here is an example for an exercise that we use for absolut beginners:

* [German version (original)](http://coderdojo-linz.github.io/trainingsanleitungen/scratch/scratch-fang-mich.html)
* [English version (translated with Google Translate)](https://translate.google.com/translate?sl=de&tl=en&js=y&prev=_t&hl=de&ie=UTF-8&u=http%3A%2F%2Fcoderdojo-linz.github.io%2Ftrainingsanleitungen%2Fscratch%2Fscratch-fang-mich.html&edit-text=) 

![Scratch example]({{site.baseurl}}/content/images/blog/2016/11/touch-fish.png)

Kids love Scratch. They can create impressive mini-games without having to learn "boring" prerequisites. They don't need to bother with syntax problems or typing skills.

However, as CoderDojo mentors, we would like that kids over time take the next step and move from a graphical language like Scratch to real coding. How can we motivate them to do that? It turned out that Minecraft is the perfect motivator. Minecraft is huge for kids. Many dream of creating their own mods.

Programming Minecraft mods in Java in CoderDojos is somewhat difficult. Kids often come with quite slow hardware on which we cannot install complex IDEs. Additionally, they have to understand compilers. We need a more lightweight way to create mods.


## The Solution

Our solution to that problem looks like that:

* We use [Scriptcraft](http://scriptcraftjs.org/) to enable writing Minecraft mods in JavaScript.
* We install [Visual Studio Code](https://code.visualstudio.com/) on the kids' machines as Code is free, lightweight, and available on all platforms.
* We run [Spigot Minecraft servers](https://www.spigotmc.org/wiki/about-spigot/) in Docker on a Mentor's (powerful) laptop. Kids who come with powerful laptops can use the Docker containers on their own machines if they want.


## Resources

### Server

We wrote a detailed instruction for setting up Minecraft servers with Spigot and Scriptcraft installed. It also includes samples for Dockerfiles.

* [German version (original)](http://coderdojo-linz.github.io/trainingsanleitungen/minecraft-plugins/07_spigot_scriptcraft_docker.html)
* [English version (translated with Google Translate)](https://translate.google.com/translate?sl=de&tl=en&js=y&prev=_t&hl=de&ie=UTF-8&u=http%3A%2F%2Fcoderdojo-linz.github.io%2Ftrainingsanleitungen%2Fminecraft-plugins%2F07_spigot_scriptcraft_docker.html&edit-text=) 

### Mods

We wrote an introduction exercise for kids who start writing mods in JavaScript. It contains lots of links to further Scriptcraft resources like samples and documentation.

* [German version (original)](http://coderdojo-linz.github.io/trainingsanleitungen/minecraft-plugins/08_scriptcraft_basics.html)
* [English version (translated with Google Translate)](https://translate.google.com/translate?sl=de&tl=en&js=y&prev=_t&hl=de&ie=UTF-8&u=http%3A%2F%2Fcoderdojo-linz.github.io%2Ftrainingsanleitungen%2Fminecraft-plugins%2F08_scriptcraft_basics.html&edit-text=) 
