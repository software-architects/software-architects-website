---
layout: blog
title: Tri-State Check Box in HTML with AngularJS and TypeScript
excerpt: HTML does not support tri-state checkboxes by default. There is an indeterminate attribute to indicate that the value is undefined but there is no way to set a checkbox back to indeterminate through the user interface once it has been checked or unchecked. The following sample shows how to build an AngularJS directive for a tri-state checkbox with TypeScript.
author: Karin Huber
date: 2015-02-26
bannerimage: /content/images/blog/2015/02/tri-state-check-box.png
bannerimagesource: 
lang: en
tags: [AngularJS,HTML,TypeScript]
ref: 
permalink: /devblog/2015/02/26/Tri-State-Check-Box-in-HTML-with-AngularJS-and-TypeScript
---

<p>HTML does not support tri-state checkboxes by default. There is an indeterminate attribute to indicate that the value is undefined but there is no way to set a checkbox back to indeterminate through the user interface once it has been checked or unchecked. The attribute can only be changed with JavaScript.</p>

<h2>Current State in HTML and JavaScript</h2>

<p>The following screenshot shows how the three states of a checkbox are visualized in Internet Explorer 11. Other browsers visualize the states slightly different.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2015/02/check-box-states.png" />
</p><p>This is how the HTML for the tree checkboxes looks like:</p>

{% highlight xhtml %}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Check Box States</title>
    <script>
        window.onload = function (e) {
            document.getElementById("indeterminateCheckBox").indeterminate = true;
        }
    </script>
</head>
<body>
    <input type="checkbox" id="indeterminateCheckBox" /> Indeterminate checkbox</p>
    <p><input type="checkbox" checked="checked" /> Checked checkbox</p>
    <p><input type="checkbox" /> Unchecked checkbox</p>
</body>
</html>{% endhighlight %}

<p>As the indeterminate state cannot be set in HTML, it has to be set in the <em>window.onload</em> function with JavaScript and it cannot be set back to indeterminate by a user once it has lost the indeterminate state.</p>

<h2>Building the AngularJS TriStateCheckBox Directive</h2>

<p>The directive offers two properties to bind against: <em>isThreeState</em> and <em>isChecked</em>. The <em>CheckBoxScopeDeclaration</em> class specifies these properties.</p>

<p>The <em>$scope</em> of the directive of type <em>ICheckBoxScope</em> holds the current values for these two properties. Additionally it offers a function <em>updateState</em>, which is used in the template of the directive to update the <em>isChecked</em> property whenever the checkbox is clicked.</p><p>The linking function of the directive finds the <em>HTMLInputElement</em> for the checkbox. This is required as the indeterminate state of the checkbox can only be set from JavaScript. So it is not possible to do this via data binding. Additionally, it defines the updateState function and adds a <em>$watch</em> listener for the <em>isChecked</em> property. Whenever the value is set to <em>null</em> or <em>undefined</em> and the <em>isThreeState</em> property is set to <em>true</em>, the checkbox is set back to indeterminate state.</p>
  
{% highlight javascript %}
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" /> 

module Samples.Controls {
    /** 
    * Scope declaration for CheckBox.
    */
    export class CheckBoxScopeDeclaration {
        isChecked: string;
        isThreeState: string;
    }

    /** 
    * Interface for CheckBox scope.
    */
    export interface ICheckBoxScope extends ng.IScope {
        isChecked: boolean;
        isThreeState: boolean;
        updateState: () => void;
    }

    /**
    * HTML checkbox with three states: true, false and null.
    * @class
    */
    export class CheckBox implements ng.IDirective {
        public template: any;
        public link: (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction) => void;
        public restrict: string;
        public transclude: boolean;
        public scope: CheckBoxScopeDeclaration;

        /**
        * Creates a new CheckBox directive.
        */
        public static Create(): CheckBox {
            var checkBox = new CheckBox();

            checkBox.restrict = "EA";
            checkBox.template = "<input type=\"checkbox\" ng-click=\"updateState()\" /><span ng-transclude></span>";
            checkBox.transclude = true;

            checkBox.scope = new CheckBoxScopeDeclaration();
            checkBox.scope.isChecked = "=";
            checkBox.scope.isThreeState = "=";

            // Initialize component
            checkBox.link = ($scope: ICheckBoxScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                var checkBoxInputElement = <HTMLInputElement>element[0].childNodes[0];
                checkBoxInputElement.indeterminate = $scope.isThreeState && $scope.isChecked == null;
                checkBoxInputElement.checked = $scope.isChecked;

                // Update the scope values when the checkbox is clicked.
                $scope.updateState = () => checkBox.UpdateState($scope);

                // Update the checked and indeterminate attribute of the checkbox control.
                $scope.$watch("isChecked",
                    (newValue, oldValue) => {
                        if (oldValue != newValue) {
                            checkBoxInputElement.indeterminate = $scope.isThreeState && newValue == null;
                            checkBoxInputElement.checked = newValue;
                        }
                    },
                    true);
            };

            return checkBox;
        }

        /** 
        * Change state of isChecked in scope if attribute checked on checkbox has changed.
        * @param {ICheckBoxScope} scope - The scope of the CheckBox directive.
        */
        private UpdateState($scope): void {
            if ($scope.isChecked === false) {
                $scope.isChecked = true;
            } else if ($scope.isChecked === true && $scope.isThreeState) {
                $scope.isChecked = null;
            } else {
                $scope.isChecked = false;
            }
        }
    }
}{% endhighlight %}

<h2>How to Use the Directive in HTML</h2>
<p>The goal for the directive built with AngularJS and TypeScript was to:</p>
<ul>
  <li>be able to set all three states directly in HTML without the need for JavaScript</li>
  <li>allow data binding in AngularJS</li>
</ul><p>The first HTML snippet shows how the directive can be used to set the values in HTML:</p>{% highlight xhtml %}<div class="col-md-4">
    <p><span tri-state-check-box is-three-state="true" is-checked="null">Tri-state check box 1</span></p>
</div>
<div class="col-md-4">
    <p><span tri-state-check-box is-three-state="true" is-checked="true">Tri-state check box 2</span></p>
</div>
<div class="col-md-4">
    <p><span tri-state-check-box is-three-state="true" is-checked="false">Tri-state check box 3</span></p>
</div>{% endhighlight %}<p>The next snippet shows how data binding works. For each state there is a property in the controller: myBooleanValue1, myBooleanValue2 and myBooleanValue3. Each is bound to a checkbox to change the value and a span tag to display the current value.</p>{% highlight xhtml %}<div class="col-md-4">
    <p><span tri-state-check-box is-three-state="true" is-checked="myBooleanValue1">Tri-state check box 1</span></p>
    <p>Check box value: <span ng-bind="myBooleanValue1 == null ? '-' : myBooleanValue1" /></p>
</div>
<div class="col-md-4">
    <p><span tri-state-check-box is-three-state="true" is-checked="myBooleanValue2">Tri-state check box 2</span></p>
    <p>Check box value: <span ng-bind="myBooleanValue2 == null ? '-' : myBooleanValue2" /></p>
</div>
<div class="col-md-4">
    <p><span tri-state-check-box is-three-state="true" is-checked="myBooleanValue3">Tri-state check box 3</span></p>
    <p>Check box value: <span ng-bind="myBooleanValue3 == null ? '-' : myBooleanValue3" /></p>
</div>{% endhighlight %}<p>The controller for the view contains the tree boolean values:</p>{% highlight javascript %}sampleApp.controller("testCheckBoxController", ['$scope', function ($scope) {
    $scope.myBooleanValue1 = null;
    $scope.myBooleanValue2 = true;
    $scope.myBooleanValue3 = false;
}]);
{% endhighlight %}<p>Here is the result for the view and the controller:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2015/02/tri-state-check-box.png" />
</p><h2>Limitations</h2><p>The indeterminate state of the checkbox is not displayed correctly in Safari. There is no visual difference between an unchecked checkbox and an indeterminate checkbox. To make it work in Safari too, you can replace the checkbox visualization of the browser with your own. There is a simple and nice implementation at <a href="http://w3facility.org/question/custom-html-checkbox-symbols-with-keyboard-navigation-support/" target="_blank">http://w3facility.org/question/custom-html-checkbox-symbols-with-keyboard-navigation-support/</a>.</p>

<h2>Try in JSFiddle</h2>
<iframe width="100%" height="500" src="https://jsfiddle.net/karin112358/zqgo4j12/embedded/result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

<h2>Download Source Code</h2><p>You can get the complete source code for the directive and the HTML sample pages at <a href="https://github.com/karin112358/Samples/tree/master/AngularJS/TriStateCheckBox">https://github.com/karin112358/Samples/tree/master/AngularJS/TriStateCheckBox</a>. There you will find both the TypeScript file and the automatically generated JavaScript file for the directive.</p>