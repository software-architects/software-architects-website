---
layout: blog
title: Refresh of Angular 2 Samples
excerpt: For a recent web development training I have refreshed a lot of my Angular 2 samples. They are now based on the Angular CLI and Lint warning free. Additionally, I restructured our JavaScript training slides and created new hands-on labs for JavaScript introduction. All the code samples and the slides are available on GitHub.
author: Rainer Stropek
date: 2016-10-12
bannerimage: /content/images/blog/2016/10/angular.png
bannerimagesource: 
lang: en
tags: [Angular,JavaScript,ECMAScript]
permalink: /devblog/2016/10/12/Angular-2-Samples-Refresh
showtoc: true
---

{: .banner-image}
![Screenshot of Angular2 Sample App]({{site.baseurl}}/content/images/blog/2016/08/angular2-samples-app-screenshot.png)


## Introduction

For a recent web development training I have refreshed a lot of my Angular 2
samples. They are now based on the Angular CLI and Lint warning free. 
Additionally, I restructured our JavaScript training slides and created
new hands-on labs for JavaScript introduction. All the code samples and the slides
are available on GitHub.


## Angular 2

You can find my Angular2 sample app [on GitHub](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples2). It has been created with the [Angular CLI](https://cli.angular.io). Therefore,
you can use all the `ng` tools like `serve`, `lint`, etc. with it.


### The Basics

The [basic samples](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples2/src/app/010-basics) demonstrate the following aspects of Angular2:

* [home.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/010-basics/home.component.ts) shows how to use an external template file.
* [hello-world.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/010-basics/hello-world.component.ts) shows how to use an embedded template with interpolation.
* [template.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/010-basics/template.component.ts) shows various aspects of templates and data binding (e.g. interpolation, two-way data binding, class and style bindings, etc.).
* [input-output.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/010-basics/input-output.component.ts) shows how to use `@Input`
and `@Output` to connect components.

### Directives

The [directive samples](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples2/src/app/020-directives) demonstrate the following aspects of Angular2:

* [ngFor.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/020-directives/ngFor.component.ts) shows how to use `*ngFor` in templates. It also contains simple demos for bindings (e.g. event bindings with `keyup.enter` and `click`, style bindings, etc.).
* [ngIf.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/020-directives/ngIf.component.ts) shows how to use `*ngIf` in templates. It also shows how to bind inputs without having to write TypeScript code.
* [view-encapsulation.component.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/020-directives/view-encapsulation.component.ts) shows how view encapsulation works (*emulated* and *native*).
* [rsTooltip.directive.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/020-directives/rsTooltip.directive.ts) shows how to create a custom attribute directive.
* [upper-lowercase.pipe.ts](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/020-directives/upper-lowercase.pipe.ts) shows how to create a custom pipe.

### Dependency Injection

The [DI sample](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/030-depencency-injection/di.component.ts) demonstrates various aspects of dependency injection in Angular2.

### Forms

The [forms sample](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples2/src/app/040-forms) demonstrates various aspects of defining forms in Angular2. It also contains a *custom directive* with a *custom validator*.

### Master Detail

The [master-detail sample](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples2/src/app/050-master-detail) demonstrate the following aspects of Angular2:

* Child routes ([app.routes.ts](https://github.com/software-architects/javascript-samples/tree/master/angular2/samples2/src/app/app.routes.ts))
* Route parameters
* Implementing a data access service with Angular's `Http` class
* RxJS basics
* Various template features, in particular binding scenarios

### Routing

Our sample application contains a [sample for routing](https://github.com/software-architects/javascript-samples/blob/master/angular2/samples2/src/app/app.routes.ts). We use the routes to navigate to the samples mentioned above. 


## JavaScript

* [Our GitHub repository](https://github.com/software-architects/javascript-samples/blob/master/javascript) contains a large number of small JavaScript samples that we use (slightly modified depending on the existing knowledge and special interests of attendees) during JavaScript trainings.

* The [hands-on-labs](https://github.com/software-architects/javascript-samples/blob/master/javascript/labs) are small samples that attendees can create during a training. Depending on the attendees, we often build ad hoc variants (e.g. Angular version, ECMAScript 2015 version, etc.) of these labs during trainings.

* The repository also contains some [slides](https://github.com/software-architects/javascript-samples/blob/master/slides). However, I recommend sticking to the content mentioned above. The slides are just a summary of it.
