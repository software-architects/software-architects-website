---
layout: blog
title: Software Quality Days 2014 -  Model Driven Development and Testing
teaser: Yesterday we represented Microsoft and their Team Foundation Server in the Tools Challenge at the Software Quality Days 2014 in Vienna. The topic was Model Driven Development and Testing. The  great news -  We won  - -) Read more about what we have demonstrated during the challenge.
author: Rainer Stropek
date: 2014-01-16
bannerimage: 
lang: en
tags: [C#,TFS,Visual Studio]
permalink: /blog/2014/01/16/Software-Quality-Days-2014-Model-Driven-Development-and-Testing
---

<p class="showcase">Yesterday we represented Microsoft and their <a href="http://msdn.microsoft.com/en-us/vstudio/ff637362.aspx" target="_blank">Team Foundation Server</a> in the Tools Challenge at the <a href="http://www.software-quality-days.com" target="_blank">Software Quality Days 2014</a> conference in Vienna. The topic was <a href="http://en.wikipedia.org/wiki/Model-based_testing" title="Model-based testing on Wikipedia" target="_blank">Model Driven Development and Testing</a>. <strong>The  great news: We won :-)</strong> In this article you can read more about what we have demonstrated during the challenge.<br /></p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/01/MBTDemo/ToolsChallenge.jpg" />
</p><p>You can find more images from the Tools Challenge in my <a href="http://www.flickr.com/photos/rainerstropek/sets/72157639817988406/" target="_blank">Flickr album</a>.</p><h2>The Challenge</h2><p>The idea of the tools challenge is to bring multiple vendors of leading software quality tools on stage and let them present a solution for a specific software quality-related problem in front of the audience of the Software Quality Days conference. The vendors get the requirements for the presentation in the morning. They have the entire day to prepare a solution and a presentation. In the evening, every vendor has exactly seven minutes for the presentation - and this is a hard time limit with a loud bell ringing when the time is over. Afterwards a panel of domain specialists ask three questions and the presenter has exactly one minute for each answer.</p><p>After all presentations everyone in the audience has one vote for her favorite vendor. The vendor who gets the most votes is the winner of the Tools Challenge. Additionally, the jury is also electing a winner who gets the Jury Price of the conference.</p><p>In 2014 the topic was Model-driven Development and Testing. The participating vendors were:</p><ol>
  <li>IBM</li>
  <li>imbus AG</li>
  <li>Microsoft</li>
  <li>Polarion</li>
  <li>Ranorex</li>
  <li>Tricentis</li>
</ol><p>It was explicitly allowed to use 3rd party extensions or tools from partners.</p><p>We are a close partner of Microsoft and heavy user of their Team Foundation Server product when developing our SaaS time tracking solution <a href="http://www.timecockpit.com" target="_blank">time cockpit</a>. Therefore Microsoft asked us to do the Tools Challenge on their behalf. Last year we also represented Microsoft at the 2013 Tools Challenge and we managed to reach the second place. Polarion has been the winner in 2013. This year we succeeded and reached the first place of the Tools Challenge. We want to congratulate all vendors for their great presentations - especially imbus AG who won the Jury Price.</p><h2>Our Presentation</h2><p>Team Foundation Server (TFS) is a great platform for application lifecycle management. It covers many different aspects like requirements management, test management, issue tracking, source code management, automated build, automated testing, etc. For the Tools Challenge we had to concentrate on model-based testing and development. The presentations of the different vendors have shown that this means a lot of different things to a lot of different people. We decided to show to scenarios at the show:</p><ol>
  <li>A top-down scenario that starts with a visual model from which we generate tests. The tests should be exported to TFS for further processing (test execution, test result management, reporting, etc.).</li>
  <li>A bottom-up scenario where we start with C# source code and build a model from the source code from which we can automatically create test cases that point us to scenarios which would lead to errors.</li>
</ol><h3>Top-Down Scenario: Visual Model</h3><p>TFS does not contain a module for visually building a model from which you can generate tests. However, TFS is extremely flexible and a large ecosystem of partners create TFS extensions. On of these partners is the German company <a href="http://www.seppmed.de/" target="_blank">sepp.med gmbh</a>.</p><p class="showcase">For the Tools Challenge we integrated the <a href="http://www.seppmed.de/produkte/mbtsuite.html" target="_blank">MBTsuite</a> from sepp.med with Team Foundation Server. It added visual modelling and automatic generation of tests to the feature set of TFS.</p><p>For the demo we used a model that everyone is familiar with: The turn indicator system of a car. The MBTSuite can use <a href="http://office.microsoft.com/en-us/visio/" target="_blank">Microsoft Office Visio</a> for visual modelling. The following gallery contains some screenshot of the visual model we showed in the contest presentation.</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaFolder" value="MediaArchive:6902ff0b-c390-455a-9288-5dd645d9777b" />
  <param name="ThumbnailMaxWidth" value="200" />
  <param name="ThumbnailMaxHeight" value="200" />
  <param name="ImageMaxWidth" value="1024" />
  <param name="ImageMaxHeight" value="768" />
</function><p>We imported the model from Visio into the MBTSuite. There we could choose from different strategies for test generation. During the tools challenge we only had seven minutes for the entire presentation. Therefore we prepared two guided paths through the model and generated two test scenarios for them. The following gallery contains some screenshots of the MBTSuite showing the imported model and the generation of tests.</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaFolder" value="MediaArchive:3cdb9d96-8970-4fa3-aeb3-091f45daa4d6" />
  <param name="ThumbnailMaxWidth" value="200" />
  <param name="ThumbnailMaxHeight" value="200" />
  <param name="ImageMaxWidth" value="1024" />
  <param name="ImageMaxHeight" value="768" />
</function><p>After we generated the tests based on our model, we had to export them to TFS. To show the power of the TFS integration, we started with an entirely empty project in TFS. The MBTSuite recognized that it had never exchanged data with the TFS project before and created User Stories (based on the requirements in the model) and Test Plans. The following gallery contains some screenshots showing the export process.</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaFolder" value="MediaArchive:8e2e2e40-7776-445a-b353-5b41d55ceac3" />
  <param name="ThumbnailMaxWidth" value="200" />
  <param name="ThumbnailMaxHeight" value="200" />
  <param name="ImageMaxWidth" value="1024" />
  <param name="ImageMaxHeight" value="768" />
</function><p>Last but not least we showed how to run the generated tests in TFS's Testing Center. As we did not have a real car on stage during our presentation, we wrote a "Blinking Simulator" containing an intentional bug. The following gallery contains some screenshots showing the test in TFS Testing Center.</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaFolder" value="MediaArchive:313a0386-d02f-431a-a4f4-8d72ce8ab8ca" />
  <param name="ThumbnailMaxWidth" value="200" />
  <param name="ThumbnailMaxHeight" value="200" />
  <param name="ImageMaxWidth" value="1024" />
  <param name="ImageMaxHeight" value="768" />
</function><h2>Bottom-Up Scenario: Code Contracts, PEX, and CodeDigger</h2><p>We are passionate programmers and therefore we could not resist showing a more code-driven aspect of model-driven development in the Tools Challenge, too.</p><p class="showcase">In our presentation we used Microsoft's <a href="http://research.microsoft.com/en-us/projects/Pex/" target="_blank">PEX</a> (automated white-box unit testing tool) and Microsoft's <a href="http://research.microsoft.com/en-us/projects/codedigger/" target="_blank">Code Digger</a> (Visual Studio add-in using PEX in the background) to let Visual Studio generate a model from our source code and suggest test cases.</p><p>First we introduced PEX and CodeDigger with a very simple procedure (click to enlarge):</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:3bd825da-0027-45bc-8da4-c153c746057c" />
  <param name="ThumbnailMaxWidth" value="500" />
  <param name="ThumbnailMaxHeight" value="500" />
  <param name="ImageMaxWidth" value="1024" />
  <param name="ImageMaxHeight" value="1024" />
</function><p>In this simple scenario Code Digger comes up with three different tests. Two of them result in an error (click to enlarge):</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:ee1f2b55-9b5e-4658-88a0-97f0193cd475" />
  <param name="ThumbnailMaxWidth" value="500" />
  <param name="ThumbnailMaxHeight" value="500" />
  <param name="ImageMaxWidth" value="1024" />
  <param name="ImageMaxHeight" value="1024" />
</function><p>Next we wanted to demo the power of PEX and Code Digger in a slightly more complex scenario. Here is the code we used (don't analyze the logic, it does not have any deeper meening):</p>{% highlight javascript %}public class Bill
{
    public Bill(Region outsideEU, decimal amount, string supplier)
    {
        this.Region = outsideEU;
        this.Amount = amount;
        this.Supplier = supplier;
    }

    public Region Region { get; private set; }

    public decimal Amount { get; private set; }

    public string Supplier { get; private set; }

    public bool ValidateSupplier()
    {
        Contract.Ensures(Contract.OldValue(this.Region) == this.Region);
        Contract.Ensures(Contract.OldValue(this.Amount) == this.Amount);
        Contract.Ensures(Contract.OldValue(this.Supplier) == this.Supplier);

        if (this.Region == Region.ASIA)
        {
            // internal bills are always ok.
            if (this.Supplier == "INTERNAL")
            {
                return true;
            }

            if (this.Amount > 150.00m)
            {
                // supplier required if amount > 150 outside of EU
                if (this.Supplier.Length == 0)
                {
                    // if no supplier is available ->
                    return false;
                }
            }

            return true;
        }
        else if (this.Region == Region.US)
        {
            this.Amount = -this.Amount;
            return true;
        }
        else if (this.Region == Region.EU && this.Supplier.Length > 0)
        {
            return true;
        }

        return false;
    }
}{% endhighlight %}<p>Trying to come up with interesting test cases for the <em>ValidateSupplier</em> method would not be super easy. We let PEX do the math (click on image to enlarge):</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:13d3184f-ca8e-474c-bf32-996082e7d896" />
  <param name="ThumbnailMaxWidth" value="500" />
  <param name="ThumbnailMaxHeight" value="500" />
  <param name="ImageMaxWidth" value="1024" />
  <param name="ImageMaxHeight" value="1024" />
</function><p>You can not only run PEX through CodeDigger in Visual Studio. You can also use it as a stand-alone tool. You will get an HTML result showing things like code coverage, test cases (including code to copy into your automated unit test projects), etc. Here are some screenshots of the PEX report for our demo scenario:</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaFolder" value="MediaArchive:598d2f77-6d43-4f3c-b7c6-4eb41fea5c99" />
  <param name="ThumbnailMaxWidth" value="200" />
  <param name="ThumbnailMaxHeight" value="200" />
  <param name="ImageMaxWidth" value="1024" />
  <param name="ImageMaxHeight" value="768" />
</function>