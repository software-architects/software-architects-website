---
layout: blog
title: Angular2 Training Resources
excerpt: We regularly do Angular trainings. In this blog article I collect important links and demos we typically do during Angular2 trainings.
author: Rainer Stropek
date: 2016-08-04
bannerimage: 
bannerimagesource:
lang: en
tags: [Angular]
permalink: /devblog/2016/08/04/AngularJS-Training
showtoc: false
---

{: .banner-image}
![Screenshot of Angular2 Sample App]({{site.baseurl}}/content/images/blog/2016/08/angular2-samples-app-screenshot.png)

{: .highlight}
Update 2016-10-12: Note that this content is outdated. 
[This article]({{site.baseurl}}/devblog/2016/10/12/Angular-2-Samples-Refresh)
contains the current content.


## Introduction

We regularly do Angular trainings. In this blog article I collect important links and demos we typically do during Angular2 trainings.


## Prerequisites

The prerequisites for Angular trainings are the same as for our [JavaScript/TypeScript trainings]({{site.baseurl}}/devblog/2016/07/31/JavaScript-TypeScript-Training).


## Getting Started

Getting an Angular2 app up and running from the ground up isn't easy for beginners. The Angular2 team has a [quickstart sample](https://github.com/angular/quickstart/blob/master/README.md) on GitHub which is documented [in the Angular2 docs](https://angular.io/docs/ts/latest/quickstart.html). However, in my opinion it is still challenging for people who are quite new to web development.

Therefore, I created a [simplified version of Angular2's quickstart](https://github.com/software-architects/javascript-samples/tree/master/angular2/simple-seed) that I use during trainings. Note that this project is just for learning purposes. It is not for production projects. If you are looking for a more complete seed project that has all you need for non-trivial, real-world projects, you should look at other seed projects like [angular2-seed](https://github.com/mgechev/angular2-seed).


## Sample App

You can find my Angular2 sample app [on GitHub](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples). It is based on the simple seed project mentioned above.

{: .showcase}
The code contains lots of comments with links to further readings in the Angular2 docs.

### The Basics

The [basic samples](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples/app/010-basics) demonstrate the following aspects of Angular2:

* [home.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/010-basics/home.component.ts) shows how to use an external template file.
* [hello-world.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/010-basics/hello-world.component.ts) shows how to use an embedded template with interpolation.
* [template.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/010-basics/template.component.ts) shows various aspects of templates and data binding (e.g. interpolation, two-way data binding, class and style bindings, etc.).

### Directives

The [directive samples](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples/app/020-directives) demonstrate the following aspects of Angular2:

* [ngFor.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/020-directives/ngFor.component.ts) shows how to use `*ngFor` in templates. It also contains simple demos for bindings (e.g. event bindings with `keyup.enter` and `click`, style bindings, etc.).
* [ngIf.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/020-directives/ngIf.component.ts) shows how to use `*ngIf` in templates. It also shows how to bind inputs without having to write TypeScript code.
* [view-encapsulation.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/020-directives/view-encapsulation.component.ts) shows how view encapsulation works.
* [rsTooltip.directive.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/020-directives/rsTooltip.directive.ts) shows how to create a custom attribute directive.
* [upper-lowercase.pipe.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/020-directives/upper-lowercase.pipe.ts) shows how to create a custom pipe.

### Dependency Injection

The [DI sample](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/030-depencency-injection/di.component.ts) demonstrates various aspects of dependency injection in Angular2.

### Forms

The [forms sample](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples/app/040-forms) demonstrates various aspects of defining forms in Angular2. It also contains a custom directive with a custom validator.

### Master Detail

The [master-detail sample](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples/app/050-master-detail) demonstrate the following aspects of Angular2:

* Child routes
* Implementing data access service with Angular's `Http` class
* RxJS basics
* Various template features, in particular binding scenarios

### Routing

Our sample application contains a [sample for routing](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples/app/app.routes.ts). We use the routes to navigate to the samples mentioned above. 