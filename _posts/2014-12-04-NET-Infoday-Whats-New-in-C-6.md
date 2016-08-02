---
layout: blog
title: .NET Infoday -  What's New in C# 6?
excerpt: At IT-Visions' .NET InfoDay 2015 in Graz, my friend Roman Schacherl and I will do a session about new features in C# 6. In this blog article I summarize the content of the talk and make the sample available for download.
author: Rainer Stropek
date: 2014-12-04
bannerimage: 
bannerimagesource: 
lang: en
tags: [C#,Visual Studio]
permalink: /devblog/2014/12/04/NET-Infoday-Whats-New-in-C-6
---

<p>At <a href="http://www.it-visions.at/OffeneSeminare/IT-Visions%20Infotag%202014%20zur%20Zukunft%20von%20.NET/7895" target="_blank">IT-Visions' .NET InfoDay 2015</a> in Graz, my friend <a href="http://www.softaware.at/About/Unser-Team" target="_blank">Roman Schacherl</a> and I will do a session about new features in C# 6. In this blog article I summarize the content of the talk and make the sample available for download.</p><h2>Introduction</h2><p>The upcoming version of C# will bring some convenient features for every-day coding. You should not expect such ground-breaking changes* like <em>async/await</em>. However, your C# code will be easier to write and easier to read if you make use of the new features.</p><p>In our session we cover the following new C# topics:</p><ul>
  <li>Null-conditional Operator</li>
  <li>
    <em>nameof</em> Operator</li>
  <li>Dictionary Initializers</li>
  <li>Auto-Property initializers</li>
  <li>Expression Bodied Functions and Properties</li>
  <li>Static Using Statements - not covered here as we are no big fans of this feature ;-)</li>
  <li>Exception-Handling (async, exception filters)</li>
  <li>String Interpolation</li>
</ul><p>*) In fact, you can. With Visual Studio 2015, Microsoft puts <a href="https://roslyn.codeplex.com/" target="_blank">Roslyn</a>, their brand new compiler platform for C# and Visual Basic, into production. This new platform is a real game-changer for language- and programming-tools around C# and VB. Our talk and therefore this article do not cover Roslyn.</p><h2>Sample</h2><p>Roman prepared a sample for our talk based on which we show all the new features of C# 6 mentioned above. I added this sample to my <a href="https://github.com/rstropek/Samples/tree/master/WhatsNewInCSharp6" target="_blank">GitHub Samples repository</a>. You can download it from there.</p><h2>Null-conditional Operator</h2><h3>Basic Usage</h3><p>Imagine the following code sample (<em>Program.cs</em>):</p>{% highlight c# %}public class Program
{
    private static IList<Theme> themes;

    static void Main(string[] args)
    {
        InitializeThemes();
        DoSomethingWithCSharp6();
    }

    private static void DoSomethingWithCSharp6()
    {
        // Read theme from application settings and look it up in theme directory
        var themeConfig = ConfigurationManager.AppSettings["Theme"].ToLower();
        var theme = themes.FirstOrDefault(p => p.Name == themeConfig);

        Console.ForegroundColor = theme.ForegroundColor;
        Console.BackgroundColor = theme.BackgroundColor;
    }

    private static void InitializeThemes()
    {
        themes = new List<Theme>()
        {
            new Theme("dark", ConsoleColor.Black, ConsoleColor.White),
            new Theme("light", ConsoleColor.White, ConsoleColor.Black),
            new Theme("winter", ConsoleColor.Gray, ConsoleColor.Gray) // everything's gray in Austrian winter.
        };
    }
}{% endhighlight %}<p>Note line 23. If the <em>app.config</em> file does not contain the <em>Theme</em> setting, we will get a null reference exception.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/nullrefex.png" />
</p><p>The reason is obious. <em>AppSettings["Theme"]</em> returns null and therefore the call to <em>ToLower</em> is invalid. In old versions of C# you would have to add an <em>if</em> statement. With C# 6, you can just add a "?", the null-conditional operator: <em>var themeConfig = ConfigurationManager.AppSettings["Theme"]<strong>?</strong>.ToLower();</em></p><p>This change will solve the null referencing problem. However, the result stored in <em>themeConfig</em> will be null. Even with the "?", you will still have to write code to handle this null value. One option is the good old null coalesce operator. The following code snippet would fall back to the "light" theme if not app settings are present.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/nullcoalesce.png" />
</p><h3>Multiple Null Conditional Operators in a Single Expression</h3><p>You can also combine multiple null conditional operators in a single expression.</p><p class="showcase">However, you have to note that whenever you use the new operator, the return type will be nullable (in this case <em>Nullable&lt;ConsoleColor&gt;</em> instead of <em>ConsoleColor</em>).</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/multiplenullcond.png" />
</p><p>The new null conditional operator is also handy with arrays as shown in the following code snippet (for test purposes I added a null pointer to the <em>themes</em> array to generate the following screenshot):</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/nullcondarrays.png" />
</p><h3>Null Conditional Operator Behind the Scenes</h3><p>So what happens behind the scene? Let's look at the generated IL code (see following screenshot). Note the <em>brtrue.s</em> statments that are added to handle null values (see <a href="http://en.wikipedia.org/wiki/List_of_CIL_instructions" target="_blank">details about IL statements in Wikipedia</a>). This IL operation goes to the specified target if the value is true (i.e. not null).</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/ildasm.png" />
</p><h3>Null Conditional Operator and Delegates</h3><p>The null conditional operator is also usable with delegates. The typical example is an implementation of <em>INotifyPropertyChanged</em> as shown in the following code snippet:</p>{% highlight c# %}public string Name
{
    get { return NameValue; }
    set
    {
        if (NameValue != value)
        {
            NameValue = value;

            // Instead of:
            // if (PropertyChanged != null)
            // {
            //     PropertyChanged(this, new PropertyChangedEventArgs("Name"));
            // }
            // you can now write:
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Name"));
        }
    }
}{% endhighlight %}<h2>
  <em>Nameof</em> Operator</h2><p>Speaking of <em>INotifyPropertyChanged</em>: <a href="http://msdn.microsoft.com/en-us/library/system.runtime.compilerservices.callermembernameattribute%28v=vs.110%29.aspx" target="_blank">CallerMemberName</a> has been a usefull addition in this context in the past. However, there are many situations where it is not sufficient. Enter <em>nameof</em>, a new C# operator:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/nameof.png" />
</p><p>Note that the compiler simply replaces <em>nameof(Name)</em> with the string "Name" during compile time.</p><h2>Dictionary Initializers</h2><p>Our <em>Theme</em> class can be used to demo the next C# 6 feature: You can now initialize dictionaries like you are used to initialize lists:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/dictinit.png" />
</p><h2>Auto-Properties Initializers</h2><p>In a world that depends more and more on parallel and asnyc programming, <a href="http://en.wikipedia.org/wiki/Immutable_object" target="_blank">immutable objects</a> have become more and more important. Before C# 6, you had to add a private setter to initialize auto properties. In C# this is no longer necessary. Let's apply this to our <em>Theme</em> class. Note that the color-related property is set in the constructor although they do not have setters.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/AutoPropInit.png" />
</p><h2>Expression Bodied Functions and Properties, String Interpolation</h2><p>We can further enhance our <em>Theme</em> class. First, we can use a new feature called expression bodied properties to shorten the code necessary for our <em>FullName</em> property. In analogy you can also define methods like this. Additionally we can greatly enhance the string building code. Instead of <em>string.Format</em> we use the new string interpolation feature which makes our code much easier to read and maintain.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/StringInterpolation.png" />
</p><h2>Exception Handling</h2><p>Last but not least Microsoft has enhanced C#'s exception handling code. Firstly, C# 6 enables you to use async methods with <em>await</em> inside of a catch block. Think of an async logging API you would like to use. C# makes consuing it very easy. Additionally, C# 6 allows us to filter the exceptions that should be caught not only based on the exception's type.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/12/exceptionHandling.png" />
</p><h2>Start Evaluating C# 6 and VS2015</h2><p>Interested? You can easily try Visual Studio 2015 Preview in <a href="https://azure.microsoft.com" target="_blank">Microsoft Azure</a>. Microsoft provides a ready-made VM image that is ready for your experiments within a few minutes:</p><function name="Composite.Media.ImageGallery.Slimbox2">
  <param name="MediaImage" value="MediaArchive:58fc1066-2d64-4496-b3b8-fe25c17ea102" />
  <param name="ThumbnailMaxWidth" value="800" />
  <param name="ThumbnailMaxHeight" value="800" />
  <param name="ImageMaxWidth" value="1280" />
  <param name="ImageMaxHeight" value="800" />
</function>