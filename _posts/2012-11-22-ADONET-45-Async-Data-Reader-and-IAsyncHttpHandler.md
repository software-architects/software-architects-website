---
layout: blog
title: ADO.NET 4.5 Async Data Reader and IAsyncHttpHandler
excerpt: In cloud computing scenarios latencies between the application and database server are usually higher compared to an on premise scenario. With the rise of node.js I/O driven web hosts are becoming more familiar and ADO.Net 4.5 aids this by providing Async methods to I/O bound functions. 
author: Philipp Aumayr
date: 2012-11-22
bannerimage: 
bannerimagesource: 
lang: en
tags: [ASP.NET]
ref: 
permalink: /devblog/2012/11/22/ADONET-45-Async-Data-Reader-and-IAsyncHttpHandler
redirect_from:
- /devblog/2012/11/22/ADONet-45-Async-Data-Reader-and-IAsyncHttpHandler.aspx/index.html
---

<p>Having written quite a few lines of Silverlight (RIP!) as well as asynchronous WPF code over the last two years, I have started to appreciate the Don't-Create-A-Thread-For-Everything approach. On the server side node.js is definitely one of the frameworks to thank for the popularity boost and lately the async-await feature in C# 5 has taken things to a new level.</p><h2>Asynchronous Web Services</h2><p>When ASP.NET processes a request it assigns a thread from the thread pool to this request. The usual web service scenario then connects to a database by opening a connection (ADO.net will helpfully assign a connection from a pool), issues a select and then reads the result one by one from the database. In the synchronous world the executing thread waits for the operation to finish, which generally implies idling the thread and reducing CPU utilization. The goal here is to allow that execution thread to handle a different request (or whatever other task there is to do). Essentially it is a form of cooperative multithreading.</p><h3>Synchronous Version</h3><p>First the synchronous implementation of our simple person table reader:</p>{% highlight c# %}    public class SynchronousContentProducer : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.Write("<!DOCTYPE html><html><head></head><body><table>");

            using (var connection = new SqlConnection(@"Data Source =""(LocalDB)\TestInstance"""))
            {
                connection.Open();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "Select id, FirstName, LastName From [dbo].[Table];";

                    var reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        var id = reader.GetInt32(0);
                        var firstName = reader.GetString(1);
                        var lastName = reader.GetString(2);
                        var line = string.Format("<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>", id, firstName, lastName);
                        context.Response.Write(line);
                    }
                }
            }

            context.Response.Write("</table></body></html>");
        }

        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }
{% endhighlight %}<h3>Asynchronous Version using async/await</h3><p>In the second version, I made everything asynchronous by calling the corresponding Async() methods and awaiting the result. I also inherited from HttpTaskAsyncHandler instead of implementing IHttpHandler. Finally, knowing async await in C# 5.0 can help with increasing performance even further: By default an await captures the current ExecutionContext and dispatches to the same thread when the asynchronous operation is done. This therefore has some overhead and can be turned off by calling .ConfigureAwait(false) on the task returned by the async function call and finally awaiting it. I also have to issue a warning here though: If you are using .ConfigureAwait(false) your static context variables will possibly not match after a return from another thread. E.g. HttpContext.Current will possibly refere to another request. So be sure to not reference static variables (you should not anyhow!) and watch those libraries you are using for that.</p><p>So here the asynchronous version of the sample above:</p>{% highlight c# %}    public class AsyncContentProducer : HttpTaskAsyncHandler
    {
        public async override Task ProcessRequestAsync(HttpContext context)
        {
            using (StreamWriter sw = new StreamWriter(context.Response.OutputStream))
            {
                await sw.WriteLineAsync("<!DOCTYPE html><html><head></head><body><table>");

                using (var connection = new SqlConnection(@"Data Source =""(LocalDB)\TestInstance"""))
                {
                    await connection.OpenAsync().ConfigureAwait(false);

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "Select id, FirstName, LastName From [dbo].[Table];";

                        var reader = await command.ExecuteReaderAsync().ConfigureAwait(false);

                        while (await reader.ReadAsync().ConfigureAwait(false))
                        {
                            var id = reader.GetInt32(0);
                            var firstName = reader.GetString(1);
                            var lastName = reader.GetString(2);
                            var line = string.Format("<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>", id, firstName, lastName);
                            await sw.WriteLineAsync(line);
                        }
                    }
                }

                await sw.WriteLineAsync("</table></body></html>");
            }
        }

        public override bool IsReusable
        {
            get { return true; }
        }
    }
{% endhighlight %}<p>As you can see, the PerformRequest method now returns a task and is sprinkled with await calls, but conceptionally the flow of the function stays pretty much the same.</p><h2>Considerations</h2><p>Finally, I have to mentioned that i have only tested this in a localhost / LocalDB environment and one thing that obviously became apparent is that there is, of course, overhead associated with the async function call. Because there is no latency to the LocalDB SQL server and the requests are repeated over and over again, the asynchronous functions could actually complete pretty close to synchronously therefore rendering the task (no pun intended) useless. Further, realize that the amount of asynchronity will depend on your use case: It might be beneficial to execute the Open and ExecuteCommand operations asynchronously as they usually will require more time than the asynchronous MoveNext which could be more efficient to execute synchronously.</p><p>As always, benchmark your results and find the right tradeoffs!</p>