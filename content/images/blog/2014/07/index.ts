// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

/// <reference path="RestClient.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
module AngularProbieren {
    "use strict";

    export module Application {
        export function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);

            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        }

        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }

    }

    /** Login credentials */
    var login;
    var password;
    /** ServiceClient instance */
    var sc;
    /** Id of addTime - interval */
    var id;
    /** Counter object */
    class Counter {
        hours: number;
        minutes: number;
        seconds: number;
        hoursOutput: string;
        minutesOutput: string;
        secondsOutput: string;
        constructor() {
            this.hoursOutput = "00:";
            this.minutesOutput = "00:";
            this.secondsOutput = "00";
        }
       /**
        *  Adds a leading zero if the time value is lower than 10.
        *  @param time - value
        *  @param name - name of the field
        *  @param seperator - Character that's added to the value
        */
        leadingZero(time, name, seperator) {
            if (time < 10)
                return "0" + time.toString() + seperator;
            else
                return time.toString() + seperator;
        }

        /**
         *  Clock that increments every second
         */
        addTime() : void {
            this.seconds++;
            this.minutes = ~~((this.seconds % (60*60))/60);
            this.hours = ~~(this.seconds / (60 * 60));

            this.secondsOutput = this.leadingZero(~~(this.seconds % 60), "seconds", "");
            this.minutesOutput = this.leadingZero(this.minutes, "minutes", ":");
            this.hoursOutput = this.leadingZero(this.hours, "hours", ":");
        }
    }
    /** Interface for $scope */
    interface ICounterViewModel extends ng.IScope {
        Count: Counter;
        $interval: ng.IIntervalService;
        changeURL(): any;
    }
    /** Class for handling the counter */
    class CounterViewModel {
        constructor($scope: ICounterViewModel, $interval: ng.IIntervalService, $location: ng.ILocationService) {
            $scope.changeURL = function () {
                $interval.cancel(id);
                $location.path("/Save");
            }
            $scope.$interval = $interval;
            $scope.Count = new Counter();
            this.checkLocalStorage($scope);
            this.initCounter($scope);
        }
        initCounter($scope) {
            id = $scope.$interval(function () {
                $scope.Count.addTime();
            }, 1000);
        }
        checkLocalStorage($scope) {
            if ((new Date(localStorage.getItem("beginTime"))).getDate() != (new Date()).getDate())
                localStorage.setItem("beginTime", (new Date()).toString());
            var difference = (+(new Date()) - +(new Date(localStorage.getItem("beginTime"))));
            $scope.Count.seconds = ~~(difference / 1000);
        }
    }
    /** Interface for $scope */
    interface ISaveViewModel extends ng.IScope {
        Timesh: Timesheet;
        changeURL(url: string): any;
        alert: string;
        submitTimesheet(): any;
        correctDateFormat(date: Date): string;
    }
    /** Timesheet object */
    class Timesheet {
        description: string;
        beginTime: string;
        endTime: string;
        uuid: string;
        noBilling: boolean;

        constructor() {
            this.description = "";
            this.beginTime = "";
            this.endTime = "";
            this.uuid = "";
            this.noBilling = false;
        }

        correctDateFormat(currDate: Date): string {
            var month, day, hour, minute, second;
            if ((currDate.getMonth() + 1) < 10)
                month = "0" + (currDate.getMonth() + 1);
            else
                month = (currDate.getMonth() + 1);
            if (currDate.getDate() < 10)
                day = "0" + currDate.getDate();
            else
                day = currDate.getDate();
            if (currDate.getHours() < 10)
                hour = "0" + currDate.getHours();
            else
                hour = currDate.getHours();
            if (currDate.getMinutes() < 10)
                minute = "0" + currDate.getMinutes();
            else
                minute = currDate.getMinutes();
            if (currDate.getSeconds() < 10)
                second = "0" + currDate.getSeconds();
            else
                second = currDate.getSeconds();
            return (currDate.getFullYear().toString() + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second);
        }
    }
    /** Handles saving a time sheet */
    class SaveViewModel {
        constructor($scope: ISaveViewModel, $location: ng.ILocationService, $interval: ng.IIntervalService) {
            $scope.Timesh = new Timesheet();
            if (localStorage.getItem("description") != undefined && localStorage.getItem("description") != "undefined")
                $scope.Timesh.description = localStorage.getItem("description");
            $scope.changeURL = function (url) {
                if (url == "save") {
                    if ($scope.Timesh.description == "") {
                        $scope.alert = "Empty description is not allowed";
                    }
                    else {
                        $scope.submitTimesheet();
                    }
                }
                if (url == "cancel") {
                    localStorage.setItem("description", $scope.Timesh.description);
                    $location.path("/Counter");
                }
                if (url == "start") {
                    localStorage.setItem("beginTime", "0");
                    localStorage.setItem("description", undefined);
                    $location.path("/Start");
                }
            }

            $scope.correctDateFormat = function (date) {
                var month, day, hour, minute, second;
                if ((date.getMonth() + 1) < 10)
                    month = "0" + (date.getMonth() + 1);
                else
                    month = (date.getMonth() + 1);
                if (date.getDate() < 10)
                    day = "0" + date.getDate();
                else
                    day = date.getDate();
                if (date.getHours() < 10)
                    hour = "0" + date.getHours();
                else
                    hour = date.getHours();
                if (date.getMinutes() < 10)
                    minute = "0" + date.getMinutes();
                else
                    minute = date.getMinutes();
                if (date.getSeconds() < 10)
                    second = "0" + date.getSeconds();
                else
                    second = date.getSeconds();
                return (date.getFullYear().toString() + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second);
            }

            $scope.submitTimesheet = function () {
                var data;
                var uuid;
                // Gets the uuid of the user
                sc.get("odata/APP_UserDetail").done(function (userdetail) {
                    userdetail.value.forEach(function (el) {
                        if (el.APP_Username == login)
                            $scope.Timesh.uuid = el.APP_UserDetailUuid;
                    });
                    // Saves the data into a timesheet
                    $scope.Timesh.endTime = $scope.Timesh.correctDateFormat(new Date());
                    data = {
                        APP_BeginTime: $scope.correctDateFormat(new Date(localStorage.getItem("beginTime"))),
                        APP_Description: $scope.Timesh.description,
                        APP_EndTime: $scope.Timesh.endTime,
                        APP_NoBilling: $scope.Timesh.noBilling,
                        APP_UserDetailUuid: $scope.Timesh.uuid
                    };
                    sc.post("odata/APP_Timesheet", data).done(function () {
                        localStorage.setItem("beginTime", "0");
                        localStorage.setItem("description", "undefined");
                        $location.path("/Start");
                        $scope.$apply();
                    });
                });
            }
        }
    }
    /** Interface for $scope */
    interface IChangeURL extends ng.IScope {
        username: string;
        password: string;
        alert: string;
        changeURL: any;
    }
    /** Handles the login */
    class LoginViewModel {
        constructor($scope: IChangeURL, $location: ng.ILocationService) {
            $scope.changeURL = function () {

                login = $scope.username;

                $.ajaxSetup({
                    global: true,
                    error: function (xhr, status, err) {
                        if (xhr.status == 401) {
                            $scope.alert = "Wrong username and/or password!";
                            $scope.$apply();
                        }
                    }
                });

                sc.login($scope.username, $scope.password).done(function () {
                    $location.path("/Start");
                    $scope.$apply();
                });
            }
        }
    }
    /** Handles the start button */
    class StartViewModel {
        constructor($scope: IChangeURL, $location: ng.ILocationService) {
            $scope.changeURL = function () {
                if (localStorage.getItem("beginTime") == "0")
                    localStorage.setItem("beginTime", new Date().toString());
                $location.path("/Counter");
            }
        }
    }
    /** Contains the applications's controllers */
    var StartStopControllers;
    /** The application's module */
    var StartStop;
    /** Initialises the angular module and controllers */
    function initAngular() {
        sc = new CockpitFramework.Rest.ServiceClient("https://apipreview.timecockpit.com/");

        StartStopControllers = angular.module('StartStopControllers', ['ngRoute']);
        StartStopControllers.controller('LoginCtrl', LoginViewModel);
        StartStopControllers.controller('StartCtrl', StartViewModel);
        StartStopControllers.controller('CounterCtrl', CounterViewModel);
        StartStopControllers.controller('SaveCtrl', SaveViewModel);

        StartStop = angular.module('StartStop', [
            'ngRoute',
            'StartStopControllers'
        ]);
        StartStop.config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.
                    when('/Login', {
                        templateUrl: 'Login.html',
                        controller: 'LoginCtrl'
                    }).
                    when('/Start', {
                        templateUrl: 'Start.html',
                        controller: 'StartCtrl'
                    }).
                    when('/Counter', {
                        templateUrl: 'Counter.html',
                        controller: 'CounterCtrl'
                    }).
                    when('/Save', {
                        templateUrl: 'Save.html',
                        controller: 'SaveCtrl'
                    }).
                    otherwise({
                        redirectTo: '/Login'
                    });
            }]);
    }
    initAngular();
    window.onload = function () {
        Application.initialize();
    }
}
