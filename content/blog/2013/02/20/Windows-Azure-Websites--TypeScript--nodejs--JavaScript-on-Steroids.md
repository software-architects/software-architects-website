---
layout: blog
title: Windows Azure Websites + TypeScript + node.js = JavaScript on Steroids
teaser: I had the opportunity to do two sessions at MVP Summit 2013 in Redmond/Bellevue. The first one covered TypeScript. In this blog article I summarize my main points and share the demo code.
author: Rainer Stropek
date: 2013-02-20
bannerimage: 
lang: en
tags: [Azure,TypeScript]
permalink: /blog/2013/02/20/Windows-Azure-Websites--TypeScript--nodejs--JavaScript-on-Steroids
---

<h2>Abstract</h2><p>JavaScript has an important advantages: Reach. However, the language is not perfectly suited for larger development projects. The new language TypeScript offers a solution. It combines the advantages of type information for compile-time error checking and IntelliSense with the reach of JavaScript. In this session, Azure MVP Rainer Stropek demonstrates how you can make use of TypeScript to implement a web application with a node.js. See how you can share business logic code between server and client, and watch how to deploy your TypeScript application to Windows Azure Websites.</p><p>
  <span style="color: rgb(37, 160, 218); font-size: 20px; line-height: 20px;" data-mce-style="color: #25a0da; font-size: 20px; line-height: 20px;">Using My Sample as a Hands-On Lab</span>
</p><p>If you want to get my sample running, you can copy-and-paste the code I show below on your machine. In order to be able to build and run it, you will need the following components:</p><ol>
  <li>Visual Studio 2012 (you can get the sample running without VS2012; however, it is a lot more fun if you have it)</li>
  <li>TypeScript with Visual Studio 2012 tooling (get it from <a href="http://www.typescriptlang.org" title="TypeScript Homepage" target="_blank">http://www.typescriptlang.org</a>)</li>
  <li>Node.js (get it from <a href="http://nodejs.org/" title="Node.js Homepage" target="_blank">http://nodejs.org</a>)</li>
  <li>git (get it from <a href="http://git-scm.com/" title="Git Homepage" target="_blank">http://git-scm.com</a>)</li>
</ol><p>For the source code you should create the following directory structure:</p><ul>
  <li>
    <em>Sample root</em>
    <ul>
      <li>
        <em>code</em>
      </li>
      <li>
        <em>DefinitelyTyped</em>
      </li>
    </ul>
  </li>
</ul><h2>TypeScript Basics</h2><p>
  <a href="http://www.typescriptlang.org" title="TypeScript Homepage" target="_blank">TypeScript</a> is a great new language that has the potential to enable efficient use of JavaScript in larger projects. In the past I did quite a few talks and wrote articles on TypeScript. At the beginning of my talk I presented some of the most important language features like modules, interfaces, classes, etc. If these basics are new to you, I encourage you to talk a look at my <a href="http://www.software-architects.com/devblog/2012/11/22/BASTA-Austria-2012-TypeScript---JavaScript-on-Steroids" title="Slidedeck about TypeScript basics in my blog" target="_blank">TypeScript intro slide deck</a>.</p><p>During my talk at the MVP Summit 2013 I talked about some of the basics using a simple example module implementing a <em>Customer</em> class. It was the starting point for my sample. Here is the code:</p>{% highlight javascript %}export module customer {
    /**
      * Represents a customer
      * @param firstName First name of customer
      * @param lastName Last name of customer
      */
    export interface ICustomer {
        firstName: string;
        lastName: string;
    }

    /**
      * Represents a customer
      */
    export class Customer implements ICustomer {
        public firstName: string;
        public lastName: string;

        constructor (arg: ICustomer = { firstName: "", lastName: "" }) {
            this.firstName = arg.firstName;
            this.lastName = arg.lastName;
        }

        /**
          * Returns the full name of the customer
          */
        public fullName() {
            return this.lastName + ", " + this.firstName;
        }
    }
}{% endhighlight %}<p>Note that the sample class uses a rather new feature of the TypeScript tooling: <a href="http://blogs.msdn.com/b/typescript/archive/2013/01/21/announcing-typescript-0-8-2.aspx" title="Blog article about TypeScript 0.8.2" target="_blank">JSDoc support</a>.</p><p>If you want to play with my sample, copy the code of the class in the <em>code</em> directory. Compile it using the TypeScript compiler: <em>tsc Customer.ts</em>. Now take a few minutes to take a look at the resulting <em>Customer.js</em> file. I encourage you to open the file in Visual Studio 2012 and play with IntelliSense, syntax checking, syntax highlighting, etc.</p><h2>Programming Node.js With TypeScript</h2><p>The first practical use of TypeScript that I showed at MVP Summit was using the basic TypeScript module shown above on the server-side with <a href="http://nodejs.org/" title="Node.js Homepage" target="_blank">node.js</a>. Let's assume we want to implement a very simple REST/JSON-based Web API to query customers. Users of our API should able to query a single customer using a URI like <em>http://&lt;myserver&gt;/Customer/99</em> (asking for customer with ID 99). If the user needs all users, she would use a URI like <em>http://&lt;myserver&gt;/Customer</em>. Here is the code that I have developed during my session (copy it into the file <em>server.js</em> in the <em>code</em> directory):</p>{% highlight javascript %}/// <reference path="../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../DefinitelyTyped/express/express.d.ts" />
/// <reference path="./customer.ts" />
import express = module("express");
import crm = module("customer");

var app = express();

app.get("/customer/:id", function (req, resp) {
    var customerId = <number>req.params.id;
    var c = new crm.customer.Customer({ firstName: "Max" + customerId.toString(), lastName: "Muster" });
    console.log(c.fullName()); 
    resp.send(JSON.stringify(c));
});

app.get("/customer", function (req, resp) {
    var customers: crm.customer.Customer [];
    customers = new Array();
    for (var i = 0; i<10; i++) {
        customers.push(new crm.customer.Customer({ firstName: "Max" + i.toString(), lastName: "Muster" }));
    }
    resp.send(JSON.stringify(customers));
});

var port = process.env.PORT || 1337; 
app.listen(port);{% endhighlight %}<p>Before I draw you attention to some details of the code, note that my samples uses the <a href="http://expressjs.com/" title="Express.js Homepage" target="_blank">express.js</a> framework for implementing the Web API. In order to get it, you need a reference to the module in your <em>package.json</em> file. Here is the code (copy it into the <em>code</em> directory):</p>{% highlight javascript %}{
  "name": "hello-world",
  "description": "hello world test app",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "express": "3.1.0"
  }
}{% endhighlight %}<p>After you have copied the <em>package.json</em> file to the directory, you have to run <em>npm install</em> in the directory. It will inspect the <em>package.json</em> file and get the referenced modules from the web. It will place it in the <em>node_modules</em> subdirectory.</p><p>Now let's get back to the code in <em>server.js</em>. You might have noticed the references to <em>node.d.ts</em>, <em>express.d.ts</em>, and <em>customer.ts </em> at the beginning of the file. These references are key to your understanding of the advantages of TypeScript. Types enable the development environment to give you e.g. IntelliSense. We do not only want IntelliSense for our own <em>Customer</em> class, we want it for existing packages like the node.js SDK and express.js, too. However, they are implemented in JavaScript without type information. So where can we get the type information for them? The answer is the <a href="https://github.com/borisyankov/DefinitelyTyped" title="DefinitelyTyped project on github" target="_blank">DefinitelyTyped project on github</a>. It brings type information for all major JavaScript libraries. In order to get it, you do not need to download it manually. Use git instead. Here is how you do that:</p><ol>
  <li>Open a command prompt</li>
  <li>Change directory to <em>DefinitelyTyped</em></li>
  <li>Initialize a git repository in this directory: <em>git init</em></li>
  <li>Pull down <em>DefinitelyTyped</em> from github: <em>git pull https://github.com/borisyankov/DefinitelyTyped.git</em></li>
</ol><p>After you have downloaded the type information, you should reload <em>server.js</em> in Visual Studio. Now you have IntelliSense for the <em>node.js</em> SDK and even for <em>require.js</em>. Isn't that cool? You are ready to compile <em>server.ts</em>: <em>tsc server.ts</em>. Take a few minutes to look at the resulting JavaScript file <em>server.js</em>.</p><p>After you successfully compiled both TypeScript files, you are ready to test your Web API locally. You run the server using node: <em>node server.js</em>. If it started without an error, you can try it in the browser or in <a href="http://www.fiddler2.com/fiddler2/" title="Fiddler Homepage" target="_blank">Fiddler</a>: <em>http://localhost:1337/customer/99</em>. You should see the JSON result from your Web API call.</p><h2>Running Your Web API in Windows Azure using Windows Azure Websites</h2><p>If your Web API runs locally, deploying it in Windows Azure is a piece of cake. Here is how you do it:</p><ol>
  <li>If you do not already have a Windows Azure subscription, get one at <a href="http://www.windowsazure.com" title="Windows Azure Homepage" target="_blank">http://www.windowsazure.com</a>. It is free.</li>
  <li>Log in to your Windows Azure Management Portal at <a href="http://windows.azure.com" title="Windows Azure Management Portal" target="_blank">http://windows.azure.com</a>.</li>
  <li>Create a new and empty Windows Azure Website (WAWS) in the Management Portal:
<br /><function name="Composite.Media.ImageGallery.Slimbox2"><param name="MediaImage" value="MediaArchive:717b2ba4-759e-4ad6-a1a5-65cdc6239081" /><param name="ThumbnailMaxWidth" value="350" /></function>(Image source: <a href="http://www.windowsazure.com/" title="Windows Azure Homepage" target="_blank">http://www.windowsazure.com</a>; click to enlarge)</li>
  <li>Once the website will have been created (only takes a few seconds), you have to enable git-deployment:
<br /><function name="Composite.Media.ImageGallery.Slimbox2"><param name="MediaImage" value="MediaArchive:5d92b6e6-b826-4996-a495-caedbccf7835" /><param name="ThumbnailMaxWidth" value="350" /><param name="ThumbnailMaxHeight" value="243" /></function>(Image source: <a href="http://www.windowsazure.com/" title="Windows Azure Homepage" target="_blank">http://www.windowsazure.com</a>; click to enlarge)
<br /></li>
  <li>Once git deployment will have been enabled (again only takes a few seconds), you should copy the git repository URI. We will need it later.
<br /><function name="Composite.Media.ImageGallery.Slimbox2"><param name="MediaImage" value="MediaArchive:4b631293-3850-4c34-b6d3-7c06fd26fd63" /><param name="ThumbnailMaxWidth" value="350" /><param name="ThumbnailMaxHeight" value="243" /></function>(Image source: <a href="http://www.windowsazure.com/" title="Windows Azure Homepage" target="_blank">http://www.windowsazure.com</a>; click to enlarge)</li>
  <li>Now let's setup a local git repository which we can later push into the cloud. If you want to learn more about the basics of git, I suggest taking a look at git's manual pages. If you want to get help about e.g. the <em>git commit</em> command, you can launch the corresponding manual page by typing  <em>git help commit</em> on the command line. If you are new to git, here are the steps necessary to prepare your local repository:
<br /><ol><li>Open a command prompt</li><li>Navigate to your <em>code</em> directory</li><li>Initialize the local git repository: <em>git init</em></li><li>Add the necessary files (only the JavaScript files, the TypeScript sources are not necessary at runtime): <em>git add customer.js server.js package.json</em></li><li>Commit your changes: <em>git commit -m "Initial deployment"</em></li></ol></li>
  <li>Next we add the git repository in the cloud as a remote repository to our local repository (note that <em>azure</em> is the name of the remote repository; choose a different name if you want): <em>git remote add azure &lt;path_to_git_repo_copied_from_azure_management_portal&gt;</em></li>
  <li>Last but not least we push our local files into our Windows Azure Website: <em>git push azure master</em></li>
</ol><p>Watch closely how git deploys your Web API into the cloud. Notice that we did <em>not</em> add the <em>express.js</em> package to git. It is just referenced in <em>package.json</em>. Deployment to WAWS pays attention to this reference and gets the referenced package during deployment.</p><p>That's it. Your Web API is online. You can try it using <em>http://&lt;yourwebsite&gt;.azurewebsites.net/customer/99</em>.</p><h2>Sharing TypeScript Code Between Client and Server</h2><p>Now we have a Web API in the cloud, we need a client consuming it. We are going to implement a very simple client that uses <a href="http://jquery.com/" title="JQuery Homepage" target="_blank">JQuery</a> to load customer data and display it on a website. In this scenario, TypeScript gives us a lot of advantages over writing the client using pure JavaScript:</p><ol>
  <li>IntelliSense and type-safety (to a certain extent) for client-side libraries like JQuery.</li>
  <li>IntelliSense and type-safety for our <em>Customer</em> module because we are going to share the TypeScript code on server and client.</li>
  <li>Re-use the business logic in our <em>Customer</em> class (<em>fullName</em> method) on the client. This is useful in practice for e.g. form validation logic, calculated properties, etc.</li>
</ol><p>In order to use our <em>Customer</em> TypeScript module, we have to use <a href="http://en.wikipedia.org/wiki/Asynchronous_module_definition" title="AMD on Wikipedia" target="_blank">Asynchronous Module Definition</a> (AMD). We are going to use the <a href="http://requirejs.org/" title="Require.JS Homepage" target="_blank">Require.JS</a> framework to load AMD modules. I will not go into the details of AMD and require.js. If you are interested follow the links. They will bring you the more detailed information on the topic including samples.</p><p>In order to safe time I suggest that you download the pre-built client and open it in Visual Studio 2012: <a href="{{site.baseurl}}/content/images/blog/2013/02/website.zip" title="Source code of the website project" target="_blank">Download Source Code</a>. I will walk you through the interesting parts of the project in a second. You should extract the ZIP file with the source code directly in your <em>code</em> directory so that it contains a subdirectory called <em>website</em> and a helper-file called <em>.gitignore</em>.</p><p>Before you open the downloaded solution in Visual Studio, you should open the file <em>SharedSource.csproj</em> in a text editor like Notepad++. I would like to draw your attention to the <em>PropertyGroup</em> elements for <em>Debug</em> and <em>Release</em> configurations:</p>{% highlight xml %}  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <TypeScriptTarget>ES3</TypeScriptTarget>
    <TypeScriptIncludeComments>true</TypeScriptIncludeComments>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
    <TypeScriptModuleKind>AMD</TypeScriptModuleKind>
  </PropertyGroup>{% endhighlight %}<p>Note the line <em>&lt;TypeScriptModuleKind&gt;AMD&lt;/TypeScriptModuleKind&gt;</em>. This forces Visual Studio to use the <em>--module AMD</em> switch when compiling TypeScript files. Let's take a look at the consequences of this compiler switch. Here is the JavaScript code generated from <em>Customer.ts</em> <em>without</em> the AMD switch:</p>{% highlight javascript %}(function (customer) {
    var Customer = (function () {
        function Customer(arg) {
            if (typeof arg === "undefined") { arg = {
                firstName: "",
                lastName: ""
            }; }
            this.firstName = arg.firstName;
            this.lastName = arg.lastName;
        }
        Customer.prototype.fullName = function () {
            return this.lastName + ", " + this.firstName;
        };
        return Customer;
    })();
    customer.Customer = Customer;    
})(exports.customer || (exports.customer = {}));
var customer = exports.customer;{% endhighlight %}<p>Now let's compare that with the JavaScript code when compiled with <em>tsc --module AMD customer.ts</em>:</p>{% highlight javascript %}define(["require", "exports"], function(require, exports) {
    (function (customer) {
        var Customer = (function () {
            function Customer(arg) {
                if (typeof arg === "undefined") { arg = {
                    firstName: "",
                    lastName: ""
                }; }
                this.firstName = arg.firstName;
                this.lastName = arg.lastName;
            }
            Customer.prototype.fullName = function () {
                return this.lastName + ", " + this.firstName;
            };
            return Customer;
        })();
        customer.Customer = Customer;        
    })(exports.customer || (exports.customer = {}));
    var customer = exports.customer;
}){% endhighlight %}<p>As you can see the AMD version will work perfectly fine with require.js.</p><p>Now that you have seen what happens behind the scenes, we can concentrate on the actual source code. Open the downloaded solution in Visual Studio. I suggest that you open the file <em>app/AppMain.ts</em>. It contains the JQuery code accessing the Web API we have created previously. Play around with the code. You will see IntelliSense and type safety for our <em>customer</em> class and JQuery. We have reached one of our main goals: We share code (<em>Customer</em> class) between server and client.</p><p>
  <function name="Composite.Media.ImageGallery.Slimbox2">
    <param name="MediaImage" value="MediaArchive:46573782-0693-4edb-af87-589a84b921a2" />
    <param name="ThumbnailMaxWidth" value="350" />
    <param name="ThumbnailMaxHeight" value="157" />
  </function>(click to enlarge)</p><p>Of course we now want to test our application. To do this we add a single line to our <em>server.ts</em> file:</p>{% highlight javascript %}...

app.use("/", express.static(__dirname + "/website/"));

var port = process.env.PORT || 1337; 
app.listen(port);{% endhighlight %}<p>The important line is the one with <em>app.use(...);</em> It enables access to the static files in the <em>website</em> directory. When you have added the line, don't forget to compile everything (<em>server.ts</em> and the solution in Visual Studio). After that you are ready to test it locally. Run <em>node server.js</em> and open the static website in your favorite browser:</p><p>
  <function name="Composite.Media.ImageGallery.Slimbox2">
    <param name="MediaImage" value="MediaArchive:92db18bc-1467-435c-9414-767522d11e82" />
    <param name="ThumbnailMaxWidth" value="350" />
    <param name="ThumbnailMaxHeight" value="102" />
  </function>(click to enlarge)</p><h2>Pushing the Changes into the Cloud</h2><p>Last but not least we will push the changes including the website using the Web API into the cloud. Here is how you do that:</p><ol>
  <li>Open a command prompt and navigate to your <em>code</em> directory.</li>
  <li>Add the static website files to your git repository: <em>git add website</em></li>
  <li>Commit your changes: <em>git commit -m "Extended version"</em></li>
  <li>Push changes into the cloud: <em>git push azure master</em></li>
</ol><p>Done! Try your website in the cloud:</p><p>
  <function name="Composite.Media.ImageGallery.Slimbox2">
    <param name="MediaImage" value="MediaArchive:2841e75c-8037-46fe-b5a4-725636bd1f62" />
    <param name="ThumbnailMaxWidth" value="350" />
    <param name="ThumbnailMaxHeight" value="105" />
  </function>(click to enlarge)</p>