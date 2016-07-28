---
layout: blog
title: AngularJS with TypeScript and Windows Azure Mobile Services
excerpt: In the coming two weeks I will do a series of talks at various conferences in Austria and Germany. I will speak about AngularJS, TypeScript, and Windows Azure Mobile Services. In this blog post I publish the slides and the sample code.
author: Rainer Stropek
date: 2013-10-17
bannerimage: 
lang: en
tags: [Azure,TypeScript]
permalink: /devblog/2013/10/17/AngularJS-with-TypeScript-and-Windows-Azure-Mobile-Services
---

<p>
  <img src="{{site.baseurl}}/content/images/blog/2013/10/Slide7.PNG?mw=650&amp;mh=650" />
</p><p>In the coming two weeks I will do a series of talks at various conferences in Austria and Germany. I will speak about AngularJS, TypeScript, and Windows Azure Mobile Services. In this blog post I publish the slides and the sample code.</p><p class="showcase">Update February 18th, 2014: I published an <a href="https://github.com/rstropek/Samples/tree/master/AngularTypeScriptSamples" target="_blank">updated version of the sample on GitHub</a>.</p><h2>Slides</h2><p>You can view the slides online using Slideshare. If you prefer the complete deck including hidden slides with working hyperlinks and code samples, you can <a href="{{site.baseurl}}/content/images/blog/2013/10/AngularJS.pdf" target="_blank">download the deck in PDF</a>.</p><iframe src="http://www.slideshare.net/slideshow/embed_code/27309265?rel=0" width="512" height="421" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="allowfullscreen"></iframe><div style="MARGIN-BOTTOM: 5px" data-mce-style="margin-bottom: 5px;">
  <strong>
    <a title="AngularJS with TypeScript and Windows Azure Mobile Services" href="https://de.slideshare.net/rstropek/angular-js-27309265" target="_blank">AngularJS with TypeScript and Windows Azure Mobile Services</a>
  </strong> from <strong><a href="http://www.slideshare.net/rstropek" target="_blank">Rainer Stropek</a></strong></div><h2>Sample 1: The Basics</h2><p>The first sample shows how to hook up AngularJS and TypeScript. You see different data binding techniques (scalar values, methods, and collections).</p><h3>TypeScript Controller Code</h3>{% highlight javascript %}/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>

// Create a custom scope based on angular's scope and define
// type-safe members which we will add in the controller function.
interface IHelloWorldScope extends ng.IScope {
    name: string;
    countries: ICountryInfo[];
    getName: () => string;
    getEnclosedName: (tag: string) => string;
}

interface ICountryInfo {
    isoCode: string;
    name: string;
}

var HelloCtrl = function ($scope: IHelloWorldScope) {
    $scope.name = "World";
    $scope.countries = [
        { isoCode: 'AT', name: 'Austria' },
        { isoCode: 'DE', name: 'Germany' },
        { isoCode: 'CH', name: 'Switzerland' }];
    $scope.getName = () => $scope.name;
    $scope.getEnclosedName = (tag) => "<" + tag + ">" + $scope.name + "<" + tag + "/>";
};{% endhighlight %}<h3>HTML View</h3>{% highlight xml %}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
   <title>Angular.js Samples Using TypeScript</title>

    <link href="../../../Content/bootstrap/bootstrap.css" rel="stylesheet">
  <link href="helloWorldWithController.css" rel="stylesheet">

 <script src="../../../Scripts/angular.js"></script>
  <script src="helloWorldWithController.js"></script>
</head>
<body ng-app>
    <div ng-controller="HelloCtrl">

       <form>
           <h2>Two-Way Binding</h2>
           <label for="messageInput">Say 'Hello' to:</label>
            <input type="text" id="messageInput" ng-model="name">

         <h2>Simple Bindings</h2>
           <table class="table table-hover table-condensed">
              <tr>
                 <th>Syntax</th><th>Result</th>
             </tr>
                <tr>
                 <td>Interpolation</td><td>Hello, {{name}}!</td>
                </tr>
                <tr>
                 <td>ng-bind</td><td>Hello, <span ng-bind="name" />!</td>
               </tr>
                <tr>
                 <td>Interpolation with controller function</td>
                    <td>Hello, {{getName()}}!</td>
             </tr>
                <tr>
                 <td>ng-bind with getEnclosedName</td>
                  <td>Hello, <span ng-bind="getEnclosedName('b')" />!</td>
               </tr>
                <tr>
                 <td>ng-bind-html-unsafe with getEnclosedName</td>
                  <td>Hello, <span ng-bind-html-unsafe="getEnclosedName('b')" />!</td>
               </tr>
            </table>

            <h2>Collection Binding</h2>
            <table class="table table-hover table-condensed">
              <tr>
                 <th>Pos.</th>
                  <th>ISO Code</th>
                  <th>Country Name</th>
              </tr>
                <tr ng-repeat="country in countries">
                  <td>{{$index}}</td>
                    <td>{{country.isoCode}}</td>
                   <td>{{country.name}}</td>
              </tr>
            </table>
     </form>

 </div>
</body>
</html>{% endhighlight %}<h2>Sample 2: TypeScript Modules vs. AngularJS Modules</h2><p>The second example is just a minor variation of the first one. This time you see a TypeScript modules as well as an AngularJS module.</p><h3>TypeScript Controller Code</h3>{% highlight javascript %}/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>

interface IHelloScope extends ng.IScope {
    name: string;
}

module Hello {
    export class HelloCtrl {
        constructor($scope: IHelloScope) {
            $scope.name = "World!";
        }
    }
}

angular.module("Hello", [])
    .controller("HelloCtrl", Hello.HelloCtrl);{% endhighlight %}<h3>HTML View</h3>{% highlight xml %}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
   <title>Angular.js Samples Using TypeScript</title>

    <link href="../../../Content/bootstrap/bootstrap.css" rel="stylesheet">

 <script src="../../../Scripts/angular.js"></script>
  <script src="moduleWithController.js"></script>
</head>

<body ng-app="Hello" ng-controller="HelloCtrl">

<h1>Hello, {{name}}!</h1>

</body>
</html>{% endhighlight %}<h2>Sample 3: AngularJS Scopes</h2><p>I use the third sample to describe how AngularJS <strong>scopes</strong> work. Note that this sample was inspired by the book <a href="http://www.amazon.de/gp/product/1782161821/ref=as_li_ss_tl?ie=UTF8&amp;camp=1638&amp;creative=19454&amp;creativeASIN=1782161821&amp;linkCode=as2&amp;tag=timecockpit-21">Mastering</a><a href="http://www.amazon.de/gp/product/1782161821/ref=as_li_ss_tl?ie=UTF8&amp;camp=1638&amp;creative=19454&amp;creativeASIN=1782161821&amp;linkCode=as2&amp;tag=timecockpit-21" target="_blank">Web Application Development with</a><a href="http://www.amazon.de/gp/product/1782161821/ref=as_li_ss_tl?ie=UTF8&amp;camp=1638&amp;creative=19454&amp;creativeASIN=1782161821&amp;linkCode=as2&amp;tag=timecockpit-21">AngularJS</a> from Pawel Kozlowski and Peter Darwin (BTW, a good book if you want to dig deeper into AngularJS). I have translated it into TypeScript.</p><h3>TypeScript Controller Code</h3>{% highlight javascript %}/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>

interface ICountry {
    name: string;
    population: number;
}

interface IHierarchyScope extends ng.IScope {
    population: number;
    countries: ICountry[];
    worldsPercentage: (countryPopulation: number) => number;
}

var WorldCtrl = function ($scope: IHierarchyScope) {
    $scope.population = 7000;
    $scope.countries = [
        { name: "France", population: 63.1 },
        { name: "United Kingdom", population: 61.8 }
    ];
    $scope.worldsPercentage = function (countryPopulation) {
        return (countryPopulation / $scope.population) * 100;
    };
};{% endhighlight %}<h3>HTML View</h3>{% highlight xml %}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
   <title>Angular.js Samples Using TypeScript</title>

    <link href="../../../Content/bootstrap/bootstrap.css" rel="stylesheet">

 <script src="../../../Scripts/angular.js"></script>
  <script src="hierarchyOfScopes.js"></script>
</head>

<body ng-app>

 <div ng-controller="WorldCtrl">
        <hr>
     <ul>
         <li ng-repeat="country in countries">
              {{country.name}} has population of {{country.population | number:1}} millions,
             {{worldsPercentage(country.population) | number:1}} % of the World's population
            </li>
        </ul>
        <hr>
     World's population: {{population | number:1}} millions
 </div>
</body>
</html>{% endhighlight %}<h2>Sample 4: Dependency Injection</h2><p>The fourth sample is a little bit more complex than the first three samples. I use it to describe AngularJS's dependency injection system and its connection to TypeScript's type system (especially interfaces). Note that this sample is again inspired by the book mentioned above. The following slide gives an overview about the sample (click to enlarge):</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:e0e09f2e-353c-40f1-9c46-3d37498f7091" />
  <param name="ThumbnailMaxWidth" value="250" />
  <param name="ThumbnailMaxHeight" value="250" />
</function><h3>Contract Type</h3><p>At first we define a contract interface for an archive of notification messages:</p>{% highlight javascript %}module NotificationsModule {
    export interface INotificationsArchive {
        archive(notification: string);
        getArchived(): string[];
    }
}{% endhighlight %}<h3>Notifications Archive Implementation</h3><p>Here you see the implementation of the notifications archive. Note that it implements the interface shown above.</p>{% highlight javascript %}/// <reference path="INotificationsArchive.ts"/>

module NotificationsModule {
    export class NotificationsArchive implements INotificationsArchive {
        private archivedNotifications: string[];

        constructor() {
            this.archivedNotifications = [];
        }

        archive(notification: string) {
            this.archivedNotifications.push(notification);
        }

        public getArchived(): string[]{
            return this.archivedNotifications;
        }
    }
}{% endhighlight %}<p>For demonstration purposes I added a Jasmine unit test:</p>{% highlight javascript %}/// <reference path="../../../tsDeclarations/jasmine/jasmine.d.ts"/>
/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>
/// <reference path="../../../tsDeclarations/angularjs/angular-mocks.d.ts"/>

describe("Notifications Archive Tests", function () {
    var notificationsArchive;
    beforeEach(module('notificationsArchive'));
    beforeEach(inject(function (_notificationsArchive_) {
        notificationsArchive = _notificationsArchive_;
    }));

    it(' should give access to the archived items', function () {
        var notification = { msg: 'Old message.' };
        notificationsArchive.archive(notification);
        expect(notificationsArchive.getArchived()).toContain(notification);
    });
});{% endhighlight %}<h3>Notifications Service</h3><p>Here you see the third component: The notification service. Note that it has <strong>no</strong> dependency on the archive implementation. It just uses the interface.</p>{% highlight javascript %}/// <reference path="INotificationsArchive.ts"/>

module NotificationsModule {
    export class NotificationsService {
        private notifications: string[];

        public maxLen: number = 10;

        public static Factory(notificationsArchive: INotificationsArchive, MAX_LEN: number, greeting: string) {
            return new NotificationsService(notificationsArchive, MAX_LEN, greeting);
        }

        constructor(private notificationsArchive: INotificationsArchive, MAX_LEN: number, greeting: string) {
            this.notifications = [];
            this.maxLen = MAX_LEN;
        }

        public push(notification: string): void {
            var notificationToArchive: string;
            var newLen = this.notifications.unshift(notification);
            if (newLen > this.maxLen) {
                notificationToArchive = this.notifications.pop();
                this.notificationsArchive.archive(notificationToArchive);
            }
        }

        public getCurrent(): string[] {
            return this.notifications;
        }
    }
}{% endhighlight %}<h3>TypeScript Controller Code</h3><p>Finally here you see the controller using the notification service:</p>{% highlight javascript %}/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>
/// <reference path="NotificationsArchive.ts"/>

module NotificationsModule {
    export interface INotificationsCtrlScope extends ng.IScope {
        notification: string;
        vm: NotificationsCtrl;
    }

    export class NotificationsCtrl {
        constructor(private $scope: INotificationsCtrlScope, private notificationService: NotificationsService) {
            $scope.vm = this;
        }

        private addNotification(): void {
            this.notificationService.push(this.$scope.notification);
            this.$scope.notification = "";
        }

        private getNotifications(): string[] {
            return this.notificationService.getCurrent();
        }
    }
}{% endhighlight %}<h3>Bringing it all together</h3><p>The AngularJS dependency injection system brings all components together. It connects the notifications archive with the notifications service and the controller.</p>{% highlight javascript %}/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>
/// <reference path="NotificationsArchive.ts"/>
/// <reference path="NotificationsService.ts"/>
/// <reference path="NotificationsCtrl.ts"/>

angular.module("notificationsApp", [])
    .value("greeting", "Hello World")
    .constant("MAX_LEN", 10)
    .factory("notificationsArchive", () => new NotificationsModule.NotificationsArchive())
    .factory("notificationService", NotificationsModule.NotificationsService.Factory)
    .controller("NotificationsCtrl", NotificationsModule.NotificationsCtrl);{% endhighlight %}<h3>HTML View</h3><p>Here is the view for the controller. Nothing special, just some controls to interact with the controller. The focus of this sample is not the view, its the TypeScript code shown above.</p>{% highlight xml %}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
   <title>Angular.js Samples Using TypeScript</title>

    <link href="../../../Content/bootstrap/bootstrap.css" rel="stylesheet">

 <script src="../../../Scripts/angular.js"></script>
  <script src="NotificationsArchive.js"></script>
  <script src="NotificationsService.js"></script>
  <script src="NotificationsCtrl.js"></script>
 <script src="app.js"></script>
   
   <style>
   body {
         max-width: 500px;
      margin: 25px;
  }

     table {
        margin-top: 10px;
  }
 </style>
</head>

<body ng-app="notificationsApp" ng-controller="NotificationsCtrl">
 <div>
        <form>
           <textarea ng-model="notification" cols="40" rows="3" class="span6"></textarea><br>
           <button class="btn btn-primary" ng-click="vm.addNotification()">Add</button>
       </form>
  </div>
   <table class="table table-striped table-bordered">
     <tr>
         <th>Notifications</th>
     </tr>
        <tr ng-repeat="notification in vm.getNotifications()">
         <td>{{notification}}</td>
      </tr>
    </table>
</body>
</html>{% endhighlight %}<h2>Sample 5: Accessing Backend Services</h2><p>Web applications become really interesting when we start to access REST services in the backend. Therefore my 5th sample accesses a <a href="http://www.windowsazure.com/en-us/solutions/mobile/" target="_blank">Windows Azure Mobile Services</a> table. If you want to try my code, get an account for <a href="http://www.windowsazure.com/" target="_blank">Windows Azure</a> and create a table in mobile services:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2013/10/Slide37.PNG?mw=650&amp;mh=650" />
</p><h3>Accessing Azure Table Storage with AngularJS and TypeScript</h3><p>First we need to write some code to access our REST service. It turns out that we can write a reusable class that could be used for any Azure Mobile Service. Note the use of TypeScript generics and AngularJS's promise API.</p>{% highlight javascript %}/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>

module MobileServicesDataAccess {
    export interface ITableRow {
        id?: number;
    }

    export interface ITable<T extends ITableRow> {
        query: (page?: number) => ng.IHttpPromise<IQueryResult<T>>;
        insert: (item: T) => ng.IHttpPromise<any>;
        update: (item: T) => ng.IHttpPromise<any>;
        deleteItem: (item: T) => ng.IHttpPromise<any>;
        deleteItemById: (id: number) => ng.IHttpPromise<any>;
    }

    export interface IQueryResult<T extends ITableRow> {
        results: T[];
        count: number;
    }

    export class Table<T extends ITableRow> implements ITable<T> {
        constructor(private $http: ng.IHttpService, private serviceName: string, private tableName: string, private pageSize: number, private apiKey: string) {
            // Set public methods using lambdas for proper "this" handling
            this.query = (page?) => this.queryInternal(page);
            this.insert = (item) => this.insertInternal(item);
            this.update = (item) => this.updateInternal(item);
            this.deleteItem = (id) => this.deleteItemInternal(id);
            this.deleteItemById = (id) => this.deleteItemByIdInternal(id);

            // Build http header with mobile service application key
            this.header = {
                headers: {
                    "X-ZUMO-APPLICATION": apiKey
                }
            };
        }

        public query: (page?: number) => ng.IHttpPromise<IQueryResult<T>>;
        public insert: (item: T) => ng.IHttpPromise<any>;
        public update: (item: T) => ng.IHttpPromise<any>;
        public deleteItem: (item: T) => ng.IHttpPromise<any>;
        public deleteItemById: (id: number) => ng.IHttpPromise<any>;

        private header: any;

        private queryInternal(page?: number): ng.IHttpPromise<IQueryResult<T>> {
            var uri = this.buildBaseUri() + "?$inlinecount=allpages&$orderby=id";
            if (page !== undefined) {
                // Add "skip" and "top" clause for paging
                uri += "&$top=" + this.pageSize.toString();
                if (page > 1) {
                    var skip = (page - 1) * this.pageSize;
                    uri += "&$skip=" + skip.toString();
                }
            }

            return this.$http.get(uri, this.header);
        }

        private insertInternal(item: T): ng.IHttpPromise<any> {
            return this.$http.post(this.buildBaseUri(), item, this.header);
        }

        private updateInternal(item: T): ng.IHttpPromise<any> {
            var uri = this.buildBaseUri() + "/" + item.id.toString();
            return this.$http({ method: "PATCH", url: uri, headers: this.header, data: item });
        }

        private deleteItemInternal(item: T): ng.IHttpPromise<any> {
            return this.deleteItemByIdInternal(item.id);
        }

        private deleteItemByIdInternal(id: number): ng.IHttpPromise<any> {
            var uri = this.buildBaseUri() + "/" + id.toString();
            return this.$http.delete(uri, this.header);
        }

        private buildBaseUri(): string {
            return "https://" + this.serviceName + ".azure-mobile.net/tables/" + this.tableName;
        }
    }
}{% endhighlight %}<h3>Unit Test with HTTP Mocking</h3><p>I use the sample to demonstrate how to automatically unit test a class that contains REST calls using AngularJS's HTTP mocking.</p>{% highlight javascript %}/// <reference path="../../../tsDeclarations/jasmine/jasmine.d.ts"/>
/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>
/// <reference path="../../../tsDeclarations/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../../samples/communication/httpService/MobileServicesTable.ts"/>

interface IDummyRow extends MobileServicesDataAccess.ITableRow {
}

describe("Mobile Services Table Test", function () {
    var $http: ng.IHttpService;
    var $httpBackend: ng.IHttpBackendService;
    var table: MobileServicesDataAccess.ITable<IDummyRow>;
    beforeEach(inject((_$http_, _$httpBackend_) => { 
        $http = _$http_; 
        $httpBackend = _$httpBackend_;
        table = new MobileServicesDataAccess.Table<IDummyRow>($http, "dummyService", "dummyTable", 10, "dummyKey");
    }));
    var dummyResult: MobileServicesDataAccess.IQueryResult<IDummyRow> = { results: [{ id: 1 }, { id: 2 }], count: 2 };

    it(' should query Azure Mobile Service without paging', () => {
        $httpBackend.whenGET("https://dummyService.azure-mobile.net/tables/dummyTable?$inlinecount=allpages&$orderby=id")
            .respond(dummyResult);

        var result: IDummyRow[];
        table.query().success(r => {
            result = r.results;
        });
        $httpBackend.flush();
        expect(result.length).toEqual(2);
    });

    it(' should query Azure Mobile Service with paging', () => {
        $httpBackend.whenGET("https://dummyService.azure-mobile.net/tables/dummyTable?$inlinecount=allpages&$orderby=id&$top=10")
            .respond(dummyResult);

        var result: IDummyRow[];
        table.query(1).success(r => {
            result = r.results;
        });
        $httpBackend.flush();
        expect(result.length).toEqual(2);

        $httpBackend.whenGET("https://dummyService.azure-mobile.net/tables/dummyTable?$inlinecount=allpages&$orderby=id&$top=10&$skip=10")
            .respond(dummyResult);
        table.query(2);
        $httpBackend.flush();
    });

    it(' should issue a POST to Azure Mobile Service for insert', () => {
        $httpBackend.expectPOST("https://dummyService.azure-mobile.net/tables/dummyTable")
            .respond(201 /* Created */);

        var data: IDummyRow = {};
        table.insert(data);
        $httpBackend.flush();
    });

    it(' should issue a DELETE to Azure Mobile Service for delete', () => {
        $httpBackend.expectDELETE("https://dummyService.azure-mobile.net/tables/dummyTable/1")
            .respond(204 /* No Content */);

        table.deleteItemById(1);
        $httpBackend.flush();
    });

    it(' should issue a PATCH to Azure Mobile Service for delete', () => {
        $httpBackend.expect("PATCH", "https://dummyService.azure-mobile.net/tables/dummyTable/1", '{"id":1}')
            .respond(200 /* OK */);

        table.update({ id: 1 });
        $httpBackend.flush();
    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});{% endhighlight %}<h3>HTML View + TypeScript Controller</h3><p>For this last sample I created a view that is a little bit more complete. It contains a grid, a server-side pager, and a form with date picker, numeric field, etc. Here is a screenshot showing the form (click to enlarge):</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:b64bc5b9-99a6-467f-95c1-2ae84c7a3f52" />
  <param name="ThumbnailMaxWidth" value="250" />
  <param name="ThumbnailMaxHeight" value="250" />
</function><p>Here is the TypeScript controller that uses the data access class shown above:</p>{% highlight javascript %}/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>
/// <reference path="MobileServicesTable.ts"/>

module HttpServiceModule {
    export interface IEvent extends MobileServicesDataAccess.ITableRow {
        eventTitle: string;
        eventCategory: string;
        eventDescription: string;
        eventDate: Date;
        maximumParticipants: number;
    }

    export interface IServiceModuleScope extends ng.IScope {
        vm: HttpServiceController;

        events: IEvent[];
        currentEvent: IEvent;

        loading: boolean;

        gridOptions: any;
        paginationItemsPerPage: number;
        totalItems: number;
        currentPage: number;
    }

    export class HttpServiceController {
        constructor(private $scope: IServiceModuleScope, paginationItemsPerPage: number,
            private eventTable: MobileServicesDataAccess.ITable<IEvent>, private $q: ng.IQService) {
            $scope.vm = this;

            $scope.events = [];
            $scope.gridOptions = {
                data: 'events',
                totalServerItems: 'totalItems',
                showFooter: true,
                columnDefs: [
                    { field: "eventCategory", displayName: "Category" },
                    { field: "eventTitle", displayName: "Title" },
                    { field: "eventDescription", displayName: "Description" },
                    { field: "eventDate", displayName: "Date", cellFilter: "date" },
                    { field: "maximumParticipants", displayName: "Participant Limit", cellFilter: "number:0" }
                ]
            };

            $scope.paginationItemsPerPage = paginationItemsPerPage;
            $scope.totalItems = 0;
            $scope.currentPage = 1;

            $scope.$watch("currentPage", (_, __) => this.getEvents());

            this.addEvent = () => this.addEventInternal();
            this.getEvents = () => this.getEventsInternal();
            this.deleteEvents = () => this.deleteEventsInternal();

            $scope.loading = false;
            $scope.currentEvent = {
                eventCategory: "Concert", eventTitle: "",
                eventDescription: "", eventDate: new Date(), maximumParticipants: 1000
            };
            this.getEvents();
        }

        public addEvent: () => void;
        public getEvents: () => void;
        public deleteEvents: () => void;

        private getEventsInternal(): void {
            this.$scope.loading = true;
            var current = this;
            this.$scope.events = [];
            this.eventTable
                .query(this.$scope.currentPage)
                .success(result => {
                    current.$scope.events = result.results;
                    current.$scope.totalItems = result.count;
                    current.$scope.loading = false;
                });
        }

        private addEventInternal() {
            var current = this;
            this.$scope.loading = true;
            this.eventTable.insert(this.$scope.currentEvent).then(() => {
                current.getEvents();
                current.$scope.currentPage = 1;
            });
        }

        private deleteEventsInternal() {
            var current = this;
            this.$scope.loading = true;
            this.$scope.events = [];
            this.eventTable.query().success(result => {
                current.$q.all(result.results.map(current.eventTable.deleteItem))
                    .then(() => {
                        current.getEvents();
                        current.$scope.currentPage = 1;
                    });
            });
        }

        private generateEvents(numberOfEvents?: number): void {
            var current = this;
            this.$scope.loading = true;
            this.$scope.events = [];
            var events: IEvent[] = [];
            numberOfEvents = numberOfEvents || 25;

            for (var i = 0; i < (numberOfEvents / 2); i++) {
                events.push({
                    eventCategory: "Concert",
                    eventDescription: "Artist " + i.toString() + " live in concert at central opera hall",
                    eventTitle: "Artist " + i.toString() + " live in concert",
                    eventDate: new Date(2013, Math.random() * 100 % 12 + 1, Math.random() * 100 % 28 + 1),
                    maximumParticipants: i * 10000
                });
            }

            for (var i = (numberOfEvents / 2); i < numberOfEvents; i++) {
                events.push({
                    eventCategory: "Sport Event",
                    eventDescription: "Soccer Championship " + i.toString() + ". Who will be the new champion?",
                    eventTitle: "Soccer Campionship " + i.toString(),
                    eventDate: new Date(2013, Math.random() * 100 % 12 + 1, Math.random() * 100 % 28 + 1),
                    maximumParticipants: i * 10000
                });
            }

            this.$q.all(events.map(event => this.eventTable.insert(event)))
                .then(() => {
                    current.getEvents();
                    current.$scope.currentPage = 1;
                });
        }
    }
}{% endhighlight %}<p>It was important for me to also demonstrate how to unit-test a controller like this one. Note that the unit test does not really access Azure Mobile Services. It uses HTTP mocking again.</p>{% highlight javascript %}/// <reference path="../../../tsDeclarations/jasmine/jasmine.d.ts"/>
/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>
/// <reference path="../../../tsDeclarations/angularjs/angular-mocks.d.ts"/>
/// <reference path="MobileServicesTable.ts"/>
/// <reference path="HttpServiceController.ts"/>

describe("Mobile Services Table Test", function () {
    var $http: ng.IHttpService;
    var $httpBackend: ng.IHttpBackendService;
    var $scope: HttpServiceModule.IServiceModuleScope;
    var $rootScope: ng.IRootScopeService;
    var $controller: ng.IControllerService;
    var ctrl: HttpServiceModule.HttpServiceController;

    var table: MobileServicesDataAccess.ITable<IDummyRow>;
    beforeEach(inject((_$http_, _$httpBackend_) => {
        $http = _$http_;
        $httpBackend = _$httpBackend_;
        table = new MobileServicesDataAccess.Table<HttpServiceModule.IEvent>($http, "dummyService", "dummyTable", 10, "dummyKey");
    }));
    beforeEach(inject(function (_$rootScope_: ng.IRootScopeService, _$controller_: ng.IControllerService) {
        $rootScope = _$rootScope_;
        $scope = <HttpServiceModule.IServiceModuleScope>_$rootScope_.$new();
        $controller = _$controller_;

        $httpBackend.whenGET("https://dummyService.azure-mobile.net/tables/dummyTable?$inlinecount=allpages&$orderby=id&$top=10")
            .respond({ results: [], count: 0 });
        ctrl = $controller(HttpServiceModule.HttpServiceController, { $scope: $scope, eventTable: table, paginationItemsPerPage: 10 });
    }));

    it(' should get events after creation', () => {
        $httpBackend.flush();
    });

    it(' should load second page if clicked on pager', () => {
        $httpBackend.whenGET("https://dummyService.azure-mobile.net/tables/dummyTable?$inlinecount=allpages&$orderby=id&$top=10&$skip=10")
            .respond({ results: [], count: 0 });
        $scope.currentPage = 2;
        $scope.$apply();
        $httpBackend.flush();
    });

    it(' should delete all events correctly', () => {
        $httpBackend.whenGET("https://dummyService.azure-mobile.net/tables/dummyTable?$inlinecount=allpages&$orderby=id")
            .respond({
                results: [{
                    id: 1, eventCategory: "Concert", eventDescription: "Dummy",
                    eventTitle: "Dummy", eventDate: new Date(), maximumParticipants: 1
                }, {
                        id: 2, eventCategory: "Concert", eventDescription: "Dummy",
                        eventTitle: "Dummy", eventDate: new Date(), maximumParticipants: 1
                    }], count: 2
            });
        $httpBackend.expectDELETE("https://dummyService.azure-mobile.net/tables/dummyTable/1")
            .respond(204);
        $httpBackend.expectDELETE("https://dummyService.azure-mobile.net/tables/dummyTable/2")
            .respond(204);
        $scope.vm.deleteEvents();
        $httpBackend.flush();
    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});{% endhighlight %}<p>Again AngularJS's dependency injection system brings everything together:</p>{% highlight javascript %}/// <reference path="../../../tsDeclarations/angularjs/angular.d.ts"/>
/// <reference path="MobileServicesTable.ts"/>
/// <reference path="HttpServiceController.ts"/>

angular.module("HttpServiceModule", ["ui.bootstrap", "ngGrid"])
    .constant("paginationItemsPerPage", 10)
    .factory("eventTable", ($http: ng.IHttpService, paginationItemsPerPage: number) =>
        new MobileServicesDataAccess.Table($http, "adcthings", "events",
            paginationItemsPerPage, "...yourApiKey..."))
    .controller("HttpServiceController", HttpServiceModule.HttpServiceController);{% endhighlight %}<p>Last but not least here is the HTML code of the view:</p>{% highlight xml %}<!doctype html>
<html>
<head>
  <meta charset="utf-8">

    <!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>-->
    <!--<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.8/angular.min.js"></script>-->
 <script src="../../../Scripts/jquery-1.9.1.js"></script>
 <script src="../../../Scripts/angular.js"></script>
  <script src="../../../Scripts/ng-grid-2.0.7.min.js"></script>
    <script src="../../../Scripts/ui-bootstrap-tpls-0.6.0.js"></script>
  <script src="MobileServicesTable.js"></script>
   <script src="HttpServiceController.js"></script>
 <script src="app.js"></script>

  <!-- <link href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap.min.css" rel="stylesheet" />-->
  <link href="../../../styles/bootstrap-2.3.1/bootstrap.css" rel="stylesheet" />
   <link href="../../../Content/ng-grid.min.css" rel="stylesheet" />
    <link href="app.css" rel="stylesheet" />
</head>

<body ng-app="HttpServiceModule" ng-controller="HttpServiceController">
    <div class="well well-small">
      <input type="button" class="btn" ng-click="vm.generateEvents()" value="Generate 25 random events" />
     <input type="button" class="btn" ng-click="vm.deleteEvents()" value="Delete first 50 events" />
  </div>

  <div class="well well-small">
      <div>
            <div class="gridStyle" ng-grid="gridOptions"></div>
        </div>
       <div>
            <pagination total-items="totalItems" items-per-page="paginationItemsPerPage"
                page="currentPage"></pagination>
        </div>
       <div ng-class="{'div-visible': loading, 'div-hidden': !loading}">
          <alert type="success">Loading...</alert>
     </div>
   </div>

  <div class="well well-small">
      <form name="eventForm" class="form-horizontal">
          <div class="control-group">
                <label class="control-label" for="eventCategory">Category</label>
              <div class="controls">
                 <select id="eventCategory" ng-model="currentEvent.eventCategory">
                        <option>Concert</option>
                       <option>Sports Event</option>
                  </select>
                </div>
               <label class="control-label" for="eventTitle">Title</label>
                <div class="controls">
                 <input type="text" id="eventTitle" ng-model="currentEvent.eventTitle" />
               </div>
               <label class="control-label" for="eventDescription">Description</label>
                <div class="controls">
                 <textarea rows="3" id="eventDescription" ng-model="currentEvent.eventDescription"></textarea>
                </div>
               <label class="control-label" for="eventDate">Date</label>
              <div class="controls" ng-model="currentEvent.eventDate">
                 <datepicker id="eventDate"></datepicker>
             </div>
               <label class="control-label" for="maxParticipants">Participant Limit</label>
               <div class="controls">
                 <input type="number" name="maxParticipants" id="maxParticipants" ng-model="currentEvent.maximumParticipants" />
              </div>
               <div class="controls">
                 <input type="button" class="btn" ng-click="vm.addEvent()" value="Add Event" />
               </div>
           </div>
       </form>
  </div>
</body>
</html>{% endhighlight %}