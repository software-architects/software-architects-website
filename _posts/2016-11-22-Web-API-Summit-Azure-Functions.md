---
layout: blog
title: API Summit Berlin
excerpt: For the next two days, I will be at the first API Summit in Berlin. I will do the keynote and two sessions about serverless cloud computing and .NET Core fundamentals. In this blog post I share slides and samples of my talks. 
author: Rainer Stropek
date: 2016-11-22
bannerimage: /content/images/blog/2016/11/api-summit-thumb.png
bannerimagesource: 
lang: en
tags: [DevOps,C#,.NET,Visual Studio,Azure]
permalink: /devblog/2016/11/22/Web-API-Summit-Azure-Functions
showtoc: false
---

{: .banner-image}
![API Summit Logo]({{site.baseurl}}/content/images/blog/2016/11/api-summit-keynote.jpg)


## Introduction

For the next two days, I will be at the first API Summit in Berlin. Given that I was member of the advisory board for that conference, I am very happy that it is quite successful. We will welcome more than 130 atteendees at the new API event. I will do the keynote and two sessions about serverless cloud computing and .NET Web API fundamentals. In this blog post I share slides and samples of my talks.


## Keynote: Web API Take Over the Web

In my keynote, I will not focus on technical aspects of Web API. Instead, I speak about *why* a change towards open APIs, Microservices, Cloud, etc. is necessary. Additionally, I point out organizational consequences that have to be considered when doing the change.

You can find my slides on [Speaker Deck](https://speakerdeck.com/rstropek/api-summit-keynote-web-api-take-over-the-web):

<div class="videoWrapper">
    <script async class="speakerdeck-embed" data-id="3370946ffa1e4992a74bb5959f995a58" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>
</div>


## Serverless Cloud Computing (Azure Functions)

My second session is a technical one. I will talk about serverless web APIs and demo [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) as a practical example.

### Slides

You can find my slides on [Speaker Deck](https://speakerdeck.com/rstropek/serverless-web-api-azure-functions):

<div class="videoWrapper">
    <script async class="speakerdeck-embed" data-id="be9ad8ab9bcd4c90aec64e6a38049a8f" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>
</div>

### Sample Code

In my session, I will show some samples with [Azure Functions](https://azure.microsoft.com/en-us/services/functions/). If you want to take my code as a basis for your own experiments, here is it for you to copy:

#### C# Sample for HTTP Binding

```
using System.Net;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log) {
    log.Info("Received Tic-Tac-Toe request");
    var board = await req.Content.ReadAsAsync<string[]>();

    if (board.Length != 9) {
        req.CreateResponse(HttpStatusCode.BadRequest, "No valid tic-tac-toe board");
    }

    for(var row = 0; row < 3; row ++) {
        if (!string.IsNullOrWhiteSpace(board[row * 3]) 
            && board[row * 3] == board[row * 3 + 1] && board[row * 3] == board[row * 3 + 2]) {
                return BuildResponse(req, board[row * 3]);
            }
    }

    for(var column = 0; column < 3; column ++) {
        if (!string.IsNullOrWhiteSpace(board[column]) 
            && board[column] == board[3 + column] && board[column] == board[2 * 3 + column]) {
                return BuildResponse(req, board[column]);
            }
    }

    if (!string.IsNullOrWhiteSpace(board[0]) 
        && board[0] == board[3 + 1] && board[0] == board[2 * 3 + 2]) {
            return BuildResponse(req, board[0]);
        }

    if (!string.IsNullOrWhiteSpace(board[2]) 
        && board[2] == board[3 + 1] && board[2] == board[2 * 3]) {
            return BuildResponse(req, board[1]);
        }

    return BuildResponse(req);
}

private static HttpResponseMessage BuildResponse(HttpRequestMessage req, string winner = null)=> 
    req.CreateResponse(HttpStatusCode.OK, (winner == null) ? "No Winner" : $"Winner: {winner}");
```

#### Node.js Sample for HTTP and Service Bus Queue Binding

```
module.exports = function (context, req) {
    // Parse request body
    var board = JSON.parse(req.body);

    // Make sure that body is a properly formed array
    if (Array.isArray(board) && board.length == 9) {
        // Body is ok -> send message to trigger analysis
        context.bindings.outputSbMsg = JSON.stringify({ Message: board });

        // Send OK result to caller
        context.res = { status: 200 };
        context.done();
    }
    else {
        // Body is malformed -> send Bad Request to caller
        context.res = { status: 400, body: "No valid tic-tac-toe board" };
        context.done();
    }
};
```

#### C# Sample for Service Bus Queue Binding

```
#r "Newtonsoft.Json"

using System;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class BoardMessage
{
    public string[] Message { get; set; }
}

public static void Run(string boardMsg, TraceWriter log, out string outputSbMsg)
{
    log.Info("Received Tic-Tac-Toe request");
    var boardContent = JsonConvert.DeserializeObject<BoardMessage>(boardMsg);
    var board = boardContent.Message;

    if (board == null || board.Length != 9) {
        outputSbMsg = "No valid tic-tac-toe board";
        return;
    }

    for(var row = 0; row < 3; row ++) {
        if (!string.IsNullOrWhiteSpace(board[row * 3]) 
            && board[row * 3] == board[row * 3 + 1] && board[row * 3] == board[row * 3 + 2]) {
                outputSbMsg = BuildResponse(board[row * 3]);
                return;
            }
    }

    [...] // Same logic as above

    outputSbMsg = BuildResponse();
}

private static string BuildResponse(string winner = null) => 
    (winner == null) ? "No Winner" : $"Winner: {winner}";
```
