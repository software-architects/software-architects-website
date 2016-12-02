---
layout: blog
title: Resources for Learning TypeScript and Angular
excerpt: I regularly do trainings and workshops about web development with TypeScript and Angular. This week, I worked with a group of developers who have a non-web development background. They asked me to summarize the most important readings for learning about modern web development. Their problem isn't a lack of information. The amount of information on the internet is overwhelming and they asked for the really important resources. Here is my best-of-list. 
author: Rainer Stropek
date: 2016-12-02
bannerimage: /content/images/blog/2016/12/typescript-logo.png
bannerimagesource: 
lang: en
tags: [TypeScript,Angular]
permalink: /devblog/2016/12/02/TypeScript-Angular-Resources
showtoc: false
---

{: .banner-image}
![Rainer on Stage]({{site.baseurl}}/content/images/blog/2016/12/rainer.png)


## Introduction

I regularly do trainings and workshops about web development with TypeScript and Angular. This week, I worked with a group of developers who have a non-web development background. They asked me to summarize the most important readings for learning about modern web development. Their problem isn't a lack of information. The amount of information on the internet is overwhelming and they asked for the really important resources. Here is my best-of-list.


## Setting up your machine

This is what I recommend installing if you want to make your machine ready for modern web development. Note that I just recommend *free* and *cross-platform* tools here. Of course there are great commercial tools on the market, too.

* Editor: [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:
  * Debugger for Chrome
  * HTML Snippets
  * TSLint
  * Angular 2 TypeScript Snippets
  * JavaScript (ES6) code snippets
  * npm
  * Docker Support
* Chrome or Chromium browser
* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com/)
* [TypeScript](http://www.typescriptlang.org/index.html#download-links)
* [Webpack](https://webpack.js.org/guides/installation/)
* [Angular CLI](https://github.com/angular/angular-cli#installation) 
* [Angular Augury](https://augury.angular.io/)


## The Basics

### HTML5

If you are completely new to web development or you did your last web projects many years ago, you have to refresh your knowledge about the basics. [MDN > Learn web development](https://developer.mozilla.org/en-US/docs/Learn) is a great starting point.

{: .showcase}
My own samples and notes that I typically use in my JavaScript trainings are [on GitHub](https://github.com/software-architects/javascript-samples/tree/master/javascript). They also include some [labs](https://github.com/software-architects/javascript-samples/tree/master/javascript/labs).

### Tools: Git and Node.js

Most tools for modern web development are based on [Node.js](https://nodejs.org/en/). Even if you do not plan to develop with Node.js yourself, you will need to have some basic understanding. The same is true for Git. All the tools you will use live on [GitHub](https://github.com/). Even if you use another source code management system, you will need Git basics to survive.

[Nodeschool workshops](https://nodeschool.io/#workshoppers) are a good starting point. If you just want to understand the basics, focus on the following workshops:

* [Git-it](https://github.com/jlord/git-it)
* [How to npm](https://github.com/workshopper/how-to-npm)

### CSS-Frameworks: Make your samples shine

If you are new to web development, you will struggle with making your samples or prototypes look nice. Fortunately, there are many CSS frameworks out there that can help if your design skills are not great. Here are two examples that I regularly use for my own samples:

* [Bootstrap](http://getbootstrap.com/getting-started/)
* [Material Design Lite](https://getmdl.io/)

{: .showcase}
Although I am not a CSS expert, I sometimes need to teach some CSS basics in my trainings. My samples and notes for that are [on GitHub](https://github.com/software-architects/javascript-samples/tree/master/css).


## TypeScript

The TypeScript documentation is great. If you want to learn the language, work trough TypeScript's [Handbook](http://www.typescriptlang.org/docs/handbook/basic-types.html). If you are familiar with other languages like C++, C#, or JavaScript, the Handbook is exactly the level of detail you need to get up to speed with TypeScript.

{: .showcase}
My own samples and notes that I typically use in my TypeScript trainings are [on GitHub](https://github.com/software-architects/javascript-samples/tree/master/typescript). They also include some [labs](https://github.com/software-architects/javascript-samples/tree/master/typescript/labs).


## Tools: System.js and Webpack

In preparation for using Angular, you need to learn a bit about two tools.

### System.js

You can learn the basics about System.js in its [documentation](https://github.com/systemjs/systemjs). Don't forget to read the section about using [System.js with TypeScript](https://github.com/frankwallis/plugin-typescript). You will need it because Angular uses it in their samples. 

### Webpack

In real world Angular applications, you are probably going to use [Webpack](https://webpack.github.io/) to bundle your web app. It has a nice [getting started](https://webpack.js.org/get-started/) guide that I recommend to work through.

Make sure to take a look at the [TypeScript loader for webpack](https://github.com/TypeStrong/ts-loader). You will need it for working with Angular.

## Angular

Last but not least: Angular. If you are going to start with Angular now, I encourage you to skip the "old" Angular 1.x and go directly to [Angular 2](https://angular.io/).

Angular's [documentation](https://angular.io/docs/ts/latest/) is good. My advice: Work trough Angular's [tutorial](https://angular.io/docs/ts/latest/tutorial/). It provides a great overview over Angular's functionality.

If you want to start your own Angular projects, I recommend using [Angular CLI](https://cli.angular.io/) to setup your project. Setting it up by hand is not an easy task. Angular CLI gets you up and running within minutes instead of hours or days.

{: .showcase}
My own samples and notes that I typically use in my Angular trainings are [on GitHub](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples2).

## Other Resources

I could go on and on with resources about modern web development. The web is full of high-quality video tutorials, blogs, eBooks, etc. However, content and tools mentioned above are free and a great way to get started. Have fun! 