---
layout: blog
title: Techorama Belgium 2018 - Async Programming with JavaScript and TypeScript
excerpt: Its Techorama in Belgium again. This time I speak about async programming with JavaScript and TypeScript. In this blog post I would like to share my sample code and the recording of the session.
author: Rainer Stropek
date: 2018-05-23
bannerimage: /content/images/blog/2015/05/Brussels-Atomium-cropped.jpg
bannerimagesource: 
lang: en
tags: [JavaScript, TypeScript]
permalink: /devblog/2018/01/17/techorama-async-javascript
showtoc: true
---

{: .banner-image}
![Intro Logo]({{site.baseurl}}/content/images/blog/2015/05/Brussels-Atomium-cropped.jpg)

## Session

Title: *Async Programming with JavaScript and TypeScript*

Abstract: *Some people call async JavaScript the "callback hell". They had been right in the past, but time have changed. JavaScript and TypeScript have recently made impressive progress when it come to writing beautiful, readable async code. Join Rainer Stropek in this deep dive into async programming with web technologies. You will learn about Promises, async/await, ReactiveX, backwards compatibility, etc. Be prepared for a coding session without slides but with lots of live demos.*

## The Problem

At the beginning of the session, I demonstrate the problem by trying to implement the following simple algorithm:

* Open a *mongoDB* Database
* Read all persons with first name *John*
* For each person:
  * If person is a customer:
    * Read customer details for person
    * Print person and customer details
  * Else:
    * Read supplier details for person
    * Print person and supplier details
* Close connection to the Database

We are going to implement the plain JavaScript solution without Promises, async/await, and RxJS (note that I will use snippets during the talk in order to save time for typing):

```ts
import { MongoClient, MongoClientOptions } from 'mongodb';

interface IPerson {
    _id: any;
    firstName: string;
    lastName: string;
    isCustomer: boolean;
    customerId: any;
    supplierId: any;
}

interface ICustomer {
    _id: any;
    customerName: string;
}

interface ISupplier {
    _id: any;
    supplierName: string;
}

(() => {
  MongoClient.connect('mongodb://localhost:27017',
    <MongoClientOptions>{ useNewUrlParser: true }, (err, client) => {
    // TODO: Error handling; not in scope of this presentation
    const db = client.db('demo');

    db.collection('person', (_, personColl) => {
      personColl.find({ firstName: 'John' }).toArray((_, persons: IPerson[]) => {
        let counter = persons.length;
        const close = () => { if (--counter == 0) client.close(); };

        for (const p of persons) {
          if (p.isCustomer) {
            db.collection('customer', (_, customerColl) => {
              customerColl.findOne(p.customerId, (_, customer: ICustomer) => {
                console.log(`${p.firstName} ${p.lastName} works at ${customer.customerName}`);
                close();
              });
            });
          } else {
            db.collection('supplier', (_, supplierColl) => {
              supplierColl.findOne(p.supplierId, (_, supplier: ISupplier) => {
                console.log(`${p.firstName} ${p.lastName} works at ${supplier.supplierName}`);
                close();
              });
            });
          }
        }
      });
    });
  });
})();
```

The algorithm is quite hard to read and understand. It's structure does not really reflect the algorithm we wanted to code.

## *async/await*

Next, we are making it better by solving the same problem with async/await:

```ts
(() => {
  async function run() {
    const client = await MongoClient.connect('mongodb://localhost:27017',
      <MongoClientOptions>{ useNewUrlParser: true });
    const db = client.db('demo');

    const personColl = await db.collection('person');
    const persons = <IPerson[]>await personColl.find({ firstName: 'John' }).toArray();

    for (const p of persons) {
      if (p.isCustomer) {
        const customerColl = await db.collection('customer');
        const customer = await customerColl.findOne(p.customerId);
        console.log(`${p.firstName} ${p.lastName} works at ${customer.customerName}`);
      } else {
        const supplierColl = await db.collection('supplier');
        const supplier = await supplierColl.findOne(p.supplierId);
        console.log(`${p.firstName} ${p.lastName} works at ${supplier.supplierName}`);
      }
    }

    await client.close();
  }

  run();
})();
```

The algorithm is much cleaner and easier to read. It now does reflect the problem we wanted to solve.

During the session we dive deeper into the following aspects of the code:

* How does the *mongoDB* API support both programming models?
* TypeScript's backward compatibility using the compiler's *target* option

## Diving deeper into Promises

Next, we want to gain deep understanding about `Promise` by analyzing the following sample code step-by-step:

```ts
// Very basic function to start with
function div(x: number, y: number): number {
  return x / y;
}

// Let's simulate a complex, async implementation
function divAsync(x: number, y: number): Promise<number> {
  return new Promise((res, rej) => {
    // Simulate some think time (e.g. web api call)
    setTimeout(() => {
      if (y !== 0) res(x / y);
      else rej("Div by zero");
    }, 250);
  });
}

(() => {
  async function run() {
    // Chain async functions with `then`
    divAsync(84, 2).then(x => console.log(x));

    divAsync(168, 2)
      .then(x => divAsync(x, 2))
      .then(x => console.log(x));

    // Use async/await instead of `then`
    console.log(await divAsync(84, 2));

    // Run async functions in parallel
    const results = await Promise.all([ divAsync(84,2), divAsync(84,2) ]);
    console.dir(results);

    // Error handling with `then`
    divAsync(42, 0).then(x => console.log(x), err => console.log(err));

    // Error handling with `catch`
    divAsync(168, 2)
      .then(x => divAsync(x, 0))
      .then(x => console.log(x))
      .catch(err => console.error(err));

    // Error handling with async/await and try/catch
    try {
      await divAsync(42, 0);
    } catch (ex) {
      console.log(ex);
    }
  }

  run();
})();
```

## RxJS

An alternative for async programming in JavaScript/TypeScript is *RxJS*. During the session we explore RxJS using the following code snippets:

```ts
(() => {
  // The basics
  (function () {
    var observable = Observable.create(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      setTimeout(() => {
        observer.next(4);
        // observer.error("ERROR");
        observer.next(5);
        observer.complete();
      }, 1000);
    });

    console.log('just before subscribe');
    observable.subscribe({
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    });
    console.log('just after subscribe');
  })();

  // Samples for creating observables
  (function () {
    of(1, 2, 3).forEach(v => console.log(v));
    range(1, 3).forEach(v => console.log(v));

    timer(1000, 0).pipe(take(3)).forEach(v => console.log(v + 1))
      .then(_ => console.log("Done!"));
  })();

  // Subscribing and unsubscribing
  (function () {
    const subscription = interval(250).subscribe(v => console.log(v));
    console.log(subscription.closed);
    setTimeout(() => {
      subscription.unsubscribe();
      console.log(subscription.closed);
    }, 1000);
  }); //();

  // Combining observables
  (function () {
    const o1 = of(1, 2);
    const o2 = of(3, 4);
    const o3 = o1.pipe(concat(o2));
    o3.forEach(v => console.log(v));

    // Try `concat` and `merge` with async code...
    const asyncO1 = interval(1000).pipe(map(v => v + 1), take(3));
    const asyncO2 = interval(2000).pipe(map(v => (v + 1) * 10), take(3));
    const asyncO3 = asyncO1.pipe(concat(asyncO2));
    asyncO3.forEach(v => console.log(v));
  })();

  // Error handling
  (function () {
    const o = of(1, 2).pipe(concat(
      throwError(new Error("Something happened..."))));
    o.subscribe(
      v => console.log(v),
      err => console.log(`ERROR: ${err.message}`));
  })();
})();
```

We also take a look at an RxJS example with `HttpClient` in Angular. You can find it [on GitHub](https://github.com/software-architects/javascript-samples/tree/master/angular/02-vehicle-energy-monitor).

## Startup Solution

If you want to recap the session content step-by-step, you can find the startup solution including the snippets I used [on GitHub](https://github.com/software-architects/javascript-samples/tree/master/typescript/labs/060-async-javascript-techorama-2018).
