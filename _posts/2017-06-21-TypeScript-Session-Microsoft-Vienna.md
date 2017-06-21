---
layout: blog
title: Build Recap Session about Whats New in TypeScript
excerpt: Today, I will do a session about TypeScript at a //Build2017 Recap event at Microsoft Vienna. In this blog post I share my samples and important links.
author: Rainer Stropek
date: 2017-06-21
bannerimage: /content/images/blog/2017/06/build-recap-image-small.png
bannerimagesource: 
lang: en
tags: [TypeScript, Node.js]
permalink: /devblog/2017/06/21/build-recap-whats-new-in-typescript
showtoc: false
---

{: .banner-image}
![Intro Logo]({{site.baseurl}}/content/images/blog/2017/06/build-recap-image.png)

# Introduction

Today, I will do a session about TypeScript at a [*//Build2017 Recap*](https://blogs.msdn.microsoft.com/codefest/2017/06/05/build-on-tour-neuigkeiten-fuer-devs-und-it-pros/) event at Microsoft Vienna. In this blog post I share my samples and important links.

The goal of my talk is to highlight some important features that came with TypeScript 2.x. Instead of bullet points on slides I will use an end-to-end sample demonstrating the language enhancements.

# Sample

## Library

This library will be used by the backend (RESTful web api) and the web front end. Note that it does not follow all best practices for reusable NPM packages. It contains only minimal infrastructure because the main target is talking about new TypeScript features, not demonstrating how to build perfect NPM packages.

* Create folder for library called 'product-lib'. Open folder in [Visual Studio Code](https://code.visualstudio.com).

* Open integrated terminal in VSCode
   * Speak about using Bash on Ubuntu on Windows in VSCode (`"terminal.integrated.shell.windows": "\\WINDOWS\\sysnative\\bash.exe"` in user settings)

* Initialize Node app (describe each step)
   * `npm init`
   * `npm install --save-dev typescript rimraf cpx`
   * `./node_modules/.bin/tsc --init` (talk about new TypeScript 2.3 feature: [Enhanced `tsc --init` output](https://github.com/Microsoft/TypeScript/pull/13982))
   * Changes to `tsconfig.json`
     * `target` to `es5`
     * `module` to `umd` (talk about new TypeScript 2.0 feature: [UMD support](https://github.com/Microsoft/TypeScript/issues/7125))
     * `outDir` to `./dist`
     * `sourceMap` to `true`
     * `declaration` to `true`

* Add build scripts to `package.json`:

```
...
"scripts": {
  "clean": "rimraf dist",
  "build": "tsc && cpx package.json ./dist",
  "rebuild": "npm run clean && npm run build"
},
...
```

* Add `product-lib.ts` as follows:

```
export interface IExternalProduct {
    pid: number;
    type: 'e';
    supplier: string;
    extCode: string
    price: number;
}

export interface IInternalProduct {
    pid: number;
    type: 'i';
    intCode: string;
    costs: number;
}
```

* Build library with `npm run rebuild` and show generated code.

* Add `"main": "./product-lib.js", "types": "./product-lib.d.ts"` to `package.json` and rebuild library again.

## Backend

* Create folder for web api backend called `web-api`. Open folder in [Visual Studio Code](https://code.visualstudio.com).

* Initialize Node app (describe each step)
   * `npm init`
   * `npm install --save express body-parser cors mongodb applicationinsights`
   * `npm install --save-dev typescript rimraf cpx`
   * `./node_modules/.bin/tsc --init`
   * Changes to `tsconfig.json`
     * `target` to `es2017` (talk about new TypeScript 2.1 feature: [Support for targets `ES2016` and `ES2017`](https://github.com/Microsoft/TypeScript/pull/11407))
     * `outDir` to `./dist`
     * `sourceMap` to `true`
     * `moduleResolution` to `node`

* Add typings with `npm install --save-dev @types/express @types/body-parser @types/cors @types/mongodb` and speak about new TypeScript 2.0 feature  [improved declaration file acquisition](https://github.com/Microsoft/TypeScript/issues/9184)
   * Use *Application Insights* to speak about packages written in TypeScript containing declaration files out of the box.

* Add `product-lib` with `npm install --save ../product-lib/dist`

* Add build scripts to `package.json`:

```
...
"scripts": {
  "clean": "rimraf dist",
  "build": "tsc && cpx package.json ./dist",
  "rebuild": "npm run clean && npm run build",
  "start": "node ./dist/server.js"
},
...
```

* Add `middleware.ts` as follows:

```
import * as express from 'express';
import * as mongodb from 'mongodb';
import {IExternalProduct, IInternalProduct} from 'product-lib';

export function addDb(mongoUrl: string, app: express.Express, cb: () => void) {
  mongodb.MongoClient.connect(mongoUrl, (err, db) => {
    (<any>app).db = db;
    cb();
  });
}

function getDb(req: express.Request): mongodb.Db {
  return ((<any>(req.app)).db);
}

export async function addProduct(
    req: express.Request, res: express.Response, next: express.NextFunction) {
  // Use the following line to speak about TypeScript 2.0 feature
  // discriminated union types
  // (https://github.com/Microsoft/TypeScript/pull/9163)
  const prod: (IExternalProduct|IInternalProduct) = req.body;
  if (prod.type === 'i') {
    if (prod.costs > 1000) {
      res.status(400).send('Products with costs > 1000 are not supported');
      return;
    }
  } else {
    if (!prod.extCode) {
      res.status(400).send('External product code is missing');
      return;
    }
  }

  // Use the following line to speak about async/await
  // (try target ES2016 and ES2017 and compare js code)
  await getDb(req).collection('products').insertOne(prod);
  res.status(201).send();
}

export async function getProducts(
    req: express.Request, res: express.Response, next: express.NextFunction) {
  const result = await getDb(req)
                     .collection('products')
                     .find()
                     .toArray();
  if (result.length === 0) {
    res.status(404).send();
  } else {
    res.status(200).send(result);
  }
}
```

* Speak about new TypeScript 2.0 feature: [Discriminated union types](https://github.com/Microsoft/TypeScript/pull/9163)

* Show generated code for `target=es2016` and `target=es2017`

* Create a *CosmosDB with MongoDB API* in Azure. Speak about CosmosDB.

* Create an *Application Insights* instance in Azure. Speak about *Application Insights*.

* Add `server.ts` as follows (note that you have to change the connection string and the AI GUID):

```
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import {addDb, addProduct, getProducts} from './middleware';

import appinsights = require('applicationinsights');
appinsights.setup('04ea2b0d-...').start();

var app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/products', addProduct);
app.get('/api/products', getProducts);

// Start express server
var port: number = process.env.port || 1337;
addDb(
    'mongodb://user:password@typescript-demo.documents.azure.com:10255/?ssl=true&replicaSet=globaldb',
    app, () => {
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
      });
    });
```

* Build backend with `npm run build`

* Run backend with `npm start`

* Show API in action with the following requests (uses [VSCode REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client))

```
// The following request will fail because extCode is missing
POST http://localhost:1337/api/products
Content-Type: application/json

{"pid":1,"type":"e","supplier":"Acme corp","price": 99}

// The following request will succeed and add data
POST http://localhost:1337/api/products
Content-Type: application/json

{"pid":1,"type":"e","supplier":"Acme corp","price": 99, "extCode":"P001"}

// The following request will succeed and add data
POST http://localhost:1337/api/products
Content-Type: application/json

{"pid":2,"type":"i","intCode":"0088001155","costs":100}

// Get inserted products
GET http://localhost:1337/api/products
```

## Front-End

* Create folder for frontend called `ui`. Open folder in [Visual Studio Code](https://code.visualstudio.com).

* Initialize Node app (describe each step)
   * `npm init`
   * `npm install --save jquery`
   * `npm install --save-dev typescript webpack webpack-dev-server css-loader html-webpack-plugin style-loader ts-loader`
   * `./node_modules/.bin/tsc --init`
   * Changes to `tsconfig.json`
     * `module` to `commonjs`
     * `target` to `es5`
     * `sourceMap` to `true`
     * `moduleResolution` to `node`
     * `lib` to `["dom", "es2015"]`

* Add typings with `npm install --save-dev @types/jquery`

* Add `product-lib` with `npm install --save ../product-lib/dist`

* Add build scripts to `package.json`:

```
...
"scripts": {
  "build": "webpack",
  "start": "webpack-dev-server"
},
...
```

* Add `webpack.config.js` as follows and speak about webpack/TypeScript integration:

```
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        scripts: './index.ts',
        styles: './index.css'
    },
    output: {
        filename: '[name].js',
        path: __dirname + "/dist"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            inject: "head"
        })
    ]
};
```

* Add `index.html` as follows:

```
<!DOCTYPE html>

<head>
  <title>TypeScript Demo</title>
  <script type="text/javascript">
    var appInsights = window.appInsights || function (config) {
      function i(config) { t[config] = function () { var i = arguments; t.queue.push(function () { t[config].apply(t, i) }) } } var t = { config: config }, u = document, e = window, o = "script", s = "AuthenticatedUserContext", h = "start", c = "stop", l = "Track", a = l + "Event", v = l + "Page", y = u.createElement(o), r, f; y.src = config.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js"; u.getElementsByTagName(o)[0].parentNode.appendChild(y); try { t.cookie = u.cookie } catch (p) { } for (t.queue = [], t.version = "1.0", r = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; r.length;)i("track" + r.pop()); return i("set" + s), i("clear" + s), i(h + a), i(c + a), i(h + v), i(c + v), i("flush"), config.disableExceptionTracking || (r = "onerror", i("_" + r), f = e[r], e[r] = function (config, i, u, e, o) { var s = f && f(config, i, u, e, o); return s !== !0 && t["_" + r](config, i, u, e, o), s }), t
    }({
      instrumentationKey: "04ea2b0d-..."
    });

    window.appInsights = appInsights;
    appInsights.trackPageView();
  </script>
</head>

<body>
  <h1>Products</h1>

  <h2>Internal Products</h2>
  <ul id="internal"></ul>

  <h2>External Products</h2>
  <ul id="external"></ul>
</body>

</html>
```

* Add `index.css` as follows: 

```
body {
    font-family: Arial, Helvetica, sans-serif;
}
```

* Add `index.ts` as follows. Speak about async/await with ES5.

```
import $ = require('jquery');
import {IExternalProduct, IInternalProduct} from 'product-lib';

$(async () => {
  let result: (IExternalProduct | IInternalProduct)[];
  result = await $.get("http://localhost:1337/api/products").promise();
  const internal = $('#internal');
  const external = $('#external');
  result.forEach(p => {
    switch(p.type)
    {
      case 'i':
        internal.append(`<li>${p.intCode}</li>`);
        break;
      case 'e':
        external.append(`<li>${p.extCode}</li>`);
        break;
    }
  });
});
```

* Build frontend with `npm run build`

* Run frontend with `npm start`

Have fun!