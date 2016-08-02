---
layout: blog
title: AngularJS Provider in TypeScript
excerpt: AngularJS samples written in TypeScript are not that common on the internet. I get frequently asked how to write an AngularJS provider in TypeScript. Here is a "Hello World" sample.
author: Rainer Stropek
date: 2014-10-24
bannerimage: 
bannerimagesource: 
lang: en
tags: [TypeScript]
permalink: /devblog/2014/10/24/AngularJS-Provider-in-TypeScript
---

<p>AngularJS samples written in TypeScript are not that common on the internet. I get frequently asked how to write an <a href="https://docs.angularjs.org/guide/providers" target="_blank">AngularJS provider</a> in TypeScript. Here is a "Hello World" sample.</p>{% highlight javascript %}// Interface describing the members that the provider's service offers
interface IGreetingService {
    getGreeting(): string;
}

// The following class represents the provider
class GreetingService implements ng.IServiceProvider {
    private greeting = "Hello World!";

    // Configuration function
    public setGreeting(greeting: string) {
        this.greeting = greeting;
    }

    // Provider's factory function
    public $get() : IGreetingService {
        return {
            getGreeting: () => { return this.greeting; }
        };
    }
}

// Define a controller depending our provider
class ControllerNeedingProvider {
    constructor($scope, GreetingService: IGreetingService) {
        $scope.Greeting = GreetingService.getGreeting();
    }
}

angular.module("ProviderApp", [])
    // Define provider
    .provider("GreetingService", GreetingService)
    // Configure provider (note the suffix "Provider" here)
    .config((GreetingServiceProvider: GreetingService) => {
        GreetingServiceProvider.setGreeting("Hello Provider");
    })
    .controller("ControllerNeedingProvider", ControllerNeedingProvider);{% endhighlight %}