---
layout: blog
title: JavaScript/TypeScript Training Resources
excerpt: We regularly do JavaScript and TypeScript trainings. In this blog article I collect important links and demos we typically do during such trainings.
author: Rainer Stropek
date: 2016-07-31
bannerimage: 
bannerimagesource:
lang: en
tags: [TypeScript]
permalink: /devblog/2016/07/31/JavaScript-TypeScript-Training
showtoc: true
---

## Introduction

We regularly do JavaScript and TypeScript trainings. In this blog article I collect important links and demos we typically do during such trainings.


## Prerequisites

During our trainings, you have to have recent versions of the following software installed:

* [Chrome Browser](https://www.google.com/chrome/)
* [Node.js](https://nodejs.org/) with NPM
* [Git](https://git-scm.com/)
* Global NPM packages: `npm install --global typescript gulp typings lite-server`

I *recommend* to have recent versions of the following software installed on your development machine:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Visual Studio](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx) with [.NET Core](https://www.microsoft.com/net/core#windows) (if you want to develop web apps with ASP.NET backend)
* Git client with UI like [Git Extensions](http://gitextensions.github.io/)
* [Docker](https://www.docker.com/) or [Docker for Windows](https://docs.docker.com/engine/installation/windows/)

I *recommend* to have accounts for the following cloud services:

* [Microsoft Azure](https://azure.microsoft.com)
* [GitHub](https://github.com/)
* [Plunker](https://plnkr.co/)


## JavaScript Basics

### Embedded vs. External Scripts

* Samples: [Embedded](https://github.com/software-architects/javascript-samples/tree/master/javascript/001%20embedded), [External](https://github.com/software-architects/javascript-samples/tree/master/javascript/002%20external)
* Exercises
  * Discuss code
  * Run it with `lite-server`
  * Code editing with VSCode
  * Basics of [Chrome Developer Tools](https://developers.google.com/web/tools/chrome-devtools/)
  * Create *external* sample with Plunker
  * Discuss [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) security feature based on [Bootstrap CDN](https://www.bootstrapcdn.com/) sample
  * Discuss [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/Security/CSP) security feature, in particular [`unsafe-inline` keyword](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives#Keywords)

### Data Types

* Samples: [Datatypes](https://github.com/software-architects/javascript-samples/tree/master/javascript/003%20datatypes), [Dynamically Typed](https://github.com/software-architects/javascript-samples/tree/master/javascript/004%20dynamically%20typed), [Multiline Strings](https://github.com/software-architects/javascript-samples/tree/master/javascript/005%20multiline%20strings)
* Exercises
  * Discuss code
  * Discuss [primitive types vs. objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
  * Discuss [`Date` utility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
  * Discuss advantages and disadvantages of dynamical typing
  * [Read about](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/let) ES2015's `let` keyword. Note that it [works in TypeScript](http://www.typescriptlang.org/docs/handbook/variable-declarations.html), too (even with ES5). 
  * Discuss concept of [Garbage Collection](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

### DOM Access

* Samples: [Datatypes](https://github.com/software-architects/javascript-samples/tree/master/javascript/003%20datatypes), [Basic DOM Access](https://github.com/software-architects/javascript-samples/tree/master/javascript/006%20basic%20DOM%20access)
* Exercises
  * Discuss code
  * Discuss role of [jQuery](https://jquery.com/)

### Truthy, Falsy, Operators

* Samples: [Falsy](https://github.com/software-architects/javascript-samples/tree/master/javascript/008%20falsy)
* Exercises
  * Discuss code
  * Discuss [truthy](https://developer.mozilla.org/en/docs/Glossary/Truthy), [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) and [type coercion](https://developer.mozilla.org/en-US/docs/Glossary/Type_Conversion) in boolean contexts
  * Discuss [operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators), in particular [Primary Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#Primary_expressions), [typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof), [in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)

### Statements and Declarations

* Samples: [Switch](https://github.com/software-architects/javascript-samples/tree/master/javascript/009%20switch), [Exceptions](https://github.com/software-architects/javascript-samples/tree/master/javascript/010%20exceptions), [For Loops](https://github.com/software-architects/javascript-samples/tree/master/javascript/011%20for%20loops), [While Loops](https://github.com/software-architects/javascript-samples/tree/master/javascript/012%20while%20loops), [Do While Loops](https://github.com/software-architects/javascript-samples/tree/master/javascript/013%20dowhile%20loops), [Break](https://github.com/software-architects/javascript-samples/tree/master/javascript/014%20break)/[Continue](https://github.com/software-architects/javascript-samples/tree/master/javascript/015%20continue), [For In](https://github.com/software-architects/javascript-samples/tree/master/javascript/016%20for%20in), [Index](https://github.com/software-architects/javascript-samples/tree/master/javascript/019%20index%20operator), [Delete](https://github.com/software-architects/javascript-samples/blob/master/javascript/021%20delete/delete.js)
* Exercises
  * Discuss code
  * Read [more details](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements) about statements and declarations
  * Discuss new ES2015 features (e.g. [for..of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of), [Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*))

### Objects

* Samples: [Creating Objects](https://github.com/software-architects/javascript-samples/tree/master/javascript/017%20creating%20objects), [Accessing Properties](https://github.com/software-architects/javascript-samples/tree/master/javascript/018%20accessing%20properties), [Object References](https://github.com/software-architects/javascript-samples/tree/master/javascript/020%20objectreferences), [Object Methods](https://github.com/software-architects/javascript-samples/tree/master/javascript/040%20objectmethod), [Callbacks](https://github.com/software-architects/javascript-samples/tree/master/javascript/045%20callback)
* Exercises
  * Discuss code
  * Read more details about [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
  * Discuss the [`JSON` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
  * Discuss JSON parse reviver functions (e.g. [parse date string](http://stackoverflow.com/questions/1792865/how-to-use-json-parse-reviver-parameter-to-parse-date-string)). See also [Json.NET Date Serialization](http://www.newtonsoft.com/json/help/html/datesinjson.htm)

### Arrays

* Samples: [Array Literal](https://github.com/software-architects/javascript-samples/tree/master/javascript/022%20arrayliteral), [Push/Pop](https://github.com/software-architects/javascript-samples/tree/master/javascript/023%20pushpop), [Reverse](https://github.com/software-architects/javascript-samples/tree/master/javascript/024%20reverse), [Sort](https://github.com/software-architects/javascript-samples/tree/master/javascript/025%20sort), [Concat](https://github.com/software-architects/javascript-samples/tree/master/javascript/026%20concat), [Shift/Unshift](https://github.com/software-architects/javascript-samples/tree/master/javascript/027%20shiftunshift), [Slice](https://github.com/software-architects/javascript-samples/tree/master/javascript/028%20slice), [Splice](https://github.com/software-architects/javascript-samples/tree/master/javascript/029%20splice), [Length](https://github.com/software-architects/javascript-samples/tree/master/javascript/030%20length)
* Exercises
  * Discuss code
  * Read more details about [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections)
  * Discuss ES2015 [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections)

### Functions

* Samples: [Basic Functions](https://github.com/software-architects/javascript-samples/tree/master/javascript/031%20basic%20functions), [Function Literals](https://github.com/software-architects/javascript-samples/tree/master/javascript/032%20function%20literal), [Function Dispatching](https://github.com/software-architects/javascript-samples/tree/master/javascript/033%20function%20dispatch), [Function Arguments](https://github.com/software-architects/javascript-samples/tree/master/javascript/034%20function%20arguments), [Variable Arguments](https://github.com/software-architects/javascript-samples/tree/master/javascript/035%20function%20varargs), [Nested Functions](https://github.com/software-architects/javascript-samples/tree/master/javascript/036%20function%20nested), [Scope Reference](https://github.com/software-architects/javascript-samples/tree/master/javascript/037%20function%20scopereference), [Functions as Data](https://github.com/software-architects/javascript-samples/tree/master/javascript/038%20functions%20as%20data), [Closures](https://github.com/software-architects/javascript-samples/tree/master/javascript/048%20closures)
* Exercises
  * Discuss code
  * Read more details about [functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
  * Discuss [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#Closures)
  * Discuss ES2015 [Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

### Object Model

Note that we do not *write* JavaScript code for constructor functions, inheritance, modules, etc. in JavaScript during the course. TypeScript will care for that. However, we write TypeScript code and discuss the resulting JavaScript for target ES5 and ES2015.

Read more about [JavaScript's object model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)

### Further Readings

* [Mozilla Developer Network JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
* [w3schools JavaScript Tutorial](http://www.w3schools.com/js/default.asp)
* [w3schools JavaScript Quiz](http://www.w3schools.com/js/js_quiz.asp)


## TypeScript

### Working With Types

* Sample: [Basic Types](https://github.com/software-architects/javascript-samples/tree/master/typescript/001%20Basic%20Types)
* Exercises
  * Discuss code
  * Compile with `tsc`
  * Use watch mode with `tsc -w`
  * Discuss and demo [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
  * Discuss `let` vs. `var`
  * Read details about [type inference](http://www.typescriptlang.org/docs/handbook/type-inference.html)
  * Read details about [advanced types](http://www.typescriptlang.org/docs/handbook/advanced-types.html)

### Working With Objects

* Sample: [Objects](https://github.com/software-architects/javascript-samples/tree/master/typescript/002%20Objects)
* Exercises
  * Discuss code
  * Try IntelliSense and early type checking in VSCode

### Interfaces and Classes

* Sample: [Interfaces and Classes](https://github.com/software-architects/javascript-samples/tree/master/typescript/003%20Interfaces%20and%20Classes)
* Exercises
  * Discuss code
  * Discuss generated JavaScript code (class pattern, inheritance, etc.)
  * Discuss *parameter properties*
  * Discuss static properties and abstract classes
  * Discuss [generics](http://www.typescriptlang.org/docs/handbook/generics.html)
  * Compare generated JavaScript code for `tsc app.ts` and `tsc app.ts --target ES6` and discuss different TypeScript targets.

### Lambdas, Arrow Functions

* Sample: [Lambdas](https://github.com/software-architects/javascript-samples/tree/master/typescript/004%20Lambdas)
* Exercises
  * Discuss code
  * Discuss `this` capturing in generated JavaScript code
  * Compare generated JavaScript code for `tsc map.ts` and `tsc map.ts --target ES6` and discuss different TypeScript targets.

### async/await

* Samples: [async/await](https://github.com/rstropek/Samples/tree/master/TypeScriptAsyncAwait)
* Exercises
  * Discuss code
  * Discuss [availability of ES2015 feature in browsers](http://kangax.github.io/compat-table/es6/)
  * Discuss [TypeScript roadmap for async/await in ES5](https://github.com/Microsoft/TypeScript/wiki/Roadmap)

### Modules

* Sample: [Modules](https://github.com/software-architects/javascript-samples/tree/master/typescript/005%20Modules)
* Exercises
  * Discuss code
  * Discuss internal vs. external modules
  * Compile code with `tsc app.ts module.ts anotherModule.ts` and run it with `node app.js`
  * Discuss ambient modules (`.d.ts`) and the *typings* tool
  * Read details about [modules](http://www.typescriptlang.org/docs/handbook/modules.html)

### Loading Modules with System.js

* Samples: [Loader](https://github.com/software-architects/javascript-samples/tree/master/typescript/006%20Loader)
* Exercises
  * Discuss code
  * Discuss different loader/packager options (e.g. System.js, Webpack)

### Further Readings, Resources

* [TypeScript Handbook](http://www.typescriptlang.org/docs/handbook/basic-types.html)
* [Definitely Typed on GitHub](https://github.com/DefinitelyTyped/DefinitelyTyped)
* [The *typings* tool](https://github.com/typings/typings)
* [*typings* Registry](https://github.com/typings/registry)
* [System.js Loader](https://github.com/systemjs/systemjs)


## Client-side Develoment with ASP.NET

### OWIN

* Samples: [OWIN](https://github.com/software-architects/javascript-samples/tree/master/aspnet)
* NuGet packages
  * `Microsoft.Owin.StaticFiles`
  * `Microsoft.Owin.Host.SystemWeb` (for IIS integration)
* Exercises
  * Discuss code
  * Demo creating OWIN sample from scratch
  * Discuss [`Gulpfile`](https://github.com/software-architects/javascript-samples/blob/master/aspnet/Owin/Gulpfile.js)
    * Show it in *Visual Studio Task Runner*
    * Discuss [NPM scripts](https://docs.npmjs.com/misc/scripts) as an addition/replacement for Gulp
  * Discuss necessary [changes in `web.config`](https://github.com/software-architects/javascript-samples/blob/master/aspnet/Owin/Web.config#L11-L18)
  
### ASP.NET Core

* Samples: [NetCore](https://github.com/software-architects/javascript-samples/tree/master/aspnet)
* NuGet packages
  * `Microsoft.AspNetCore.StaticFiles`
* Exercises
  * Discuss code
  * Demo creating ASP.NET Core sample from scratch
  * Demo running ASP.NET Core sample under Linux

### Further Readings

* [Rainer's ASP.NET Core samples on GitHub](https://github.com/rstropek/Samples/tree/master/AspNetCore1Workshop)
* [ASP.NET Core Documentation](https://docs.asp.net/en/latest/)
