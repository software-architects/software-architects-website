---
layout: blog
title: C# and .NET Secrets - Quiz
excerpt: We invite you to prove your knowledge about certain subjects concerning Microsoft .NET technology by participating in a monthly quiz. This month the quiz is about C# and .NET secrets. In this article you can reread the questions. Additionally you get background information about the correct answers.
author: Rainer Stropek
date: 2009-10-13
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET]
ref: 
permalink: /devblog/2009/10/13/C-and-NET-Secrets---Quiz
redirect_from:
- "/TechnicalArticles/Quiz/tabid/82/language/en-US/Default.aspx/index.html"
---

<p>We invite you to prove your knowledge about certain subjects concerning Microsoft .NET technology by participating in a monthly quiz. This month the quiz is about C# and .NET secrets. In this article you can reread the questions. Additionally you get background information about the correct answers.</p><p class="Abstract">Here is a list of all questions included in the quiz. Use the hyperlinks to jump to the topic you are interested in:</p><ul>
  <li>Question 1 - A Simple One To Start</li>
  <li>Question 2 - String vs. System.String</li>
  <li>Question 3 - Implicitly Typed Variables</li>
  <li>Question 4 - Value vs. Reference Types</li>
  <li>Question 5 - Finalizing Objects</li>
  <li>Question 6 - Lambda Expressions</li>
  <li>Question 7 - Nullable Types</li>
  <li>Question 8 - JIT Compiler </li>
</ul><h2 class="Head">
  <a id="Q1" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q1"></a>Question 1 - A Simple One To Start</h2><p class="Abstract">
  <strong>The CTS (Common Type System) does not know about object orientation at all. Programming languages like C# include all the OO logic. They generate procedural IL code behind the scenes. True or false?</strong>
</p><p>That's absolutely not true! The Common Type System supports object oriented and procedural languages. It has support for OO constructs built in.</p><p>If you are interested you can download the ECMA C# and Common Language Infrastructure Standards from <a href="http://msdn2.microsoft.com/en-us/netframework/aa569283.aspx" target="_blank">Microsoft's website</a>. The documents include a good introduction into as well as a detailed documentation of the Common Type System.</p><h2 class="Head">
  <a id="Q2" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q2"></a>Question 2 - String vs. System.String</h2><p class="Abstract">
  <strong>What is more efficient in respect of memory usage and performance: The use of <em>string</em> or the use of <em>System.String</em>?</strong>
</p><p>The correct answer is <span class="Highlighted">It doesn’t matter which one you take, they perform equally</span>. <span class="InlineCode">string</span> is a synonym for <span class="InlineCode">System.String</span>. Therefore it does not matter if you take <span class="InlineCode">string</span> or <span class="InlineCode">System.String</span>.</p><p>You can prove that the C# compiler and the .NET CLR treats <span class="InlineCode">string</span> and <span class="InlineCode">System.String</span>equally by looking at the generated code in intermediate language. Take a look at the following lines of code. As you can see we define two classes handling strings. One of them (<span class="InlineCode">PersonString</span>) uses string to do its job; the other (<span class="InlineCode">PersonSystemString</span>) uses<span class="InlineCode">System.String</span>.</p><p class="DecoratorRight">This class uses <span class="InlineCode">string</span>.<br /><br />Mark the use of auto-implemented properties in this sample. This is a new feature of C# 3.0!</p>{% highlight c# %}internal class PersonString
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }

    public PersonString(string FirstName, string LastName)
    {
        this.FirstName = FirstName;
        this.LastName = LastName;
    }
    public void Replace( string TextToFind, string ReplacingText )
    {
        FirstName = FirstName.Replace( TextToFind, ReplacingText );
        LastName = LastName.Replace( TextToFind, ReplacingText );
    }
    public override string ToString()
    {
        return FirstName + " " + LastName;
    }
}{% endhighlight %}<p class="DecoratorRight">This class uses <span class="InlineCode">System.String</span>.</p>{% highlight c# %}internal class PersonSystemString
{
    public System.String FirstName { get; private set; }
    public System.String LastName { get; private set; }

    public PersonSystemString(System.String FirstName, 
        System.String LastName)
    {
        this.FirstName = FirstName;
        this.LastName = LastName;
    }
    public void Replace(System.String TextToFind, 
        System.String ReplacingText)
    {
        FirstName = FirstName.Replace(TextToFind, ReplacingText);
        LastName = LastName.Replace(TextToFind, ReplacingText);
    }
    public override System.String ToString()
    {
        return FirstName + " " + LastName;
    }
}{% endhighlight %}<p class="DecoratorRight">The implementation of Main uses implicitly typed variables. This is a new featur of C# 3.0! See question 2 for more details about implicitly typed variables.</p>{% highlight c# %}static class Program
{
    static void Main()
    {
        var pString = new PersonString("Rainer", "Stropek");
        System.Console.WriteLine(pString);

        var pSystemString = new PersonSystemString("Rainer", "Stropek");
        System.Console.WriteLine(pSystemString);
    }
}{% endhighlight %}<p class="DecoratorRight">
  <img alt="IL code of the two classes" src="{{site.baseurl}}/content/images/blog/2009/10/DotNetQuizQuestion1_large.png" class="   " />
  <em>IL code of the two classes</em>
</p><p>After compiling the program we can use ILDASM (MS Intermediate Language Disassembler) to generate a readable version of the IL:</p>{% highlight text %}ildasm.exe /output="$(TargetDir)\$(TargetName).il" $(TargetPath){% endhighlight %}<p>If you compare the IL of the two classes you can see that they are (with the exception of their names) absolutely identical.</p><h2 class="Head">
  <a id="Q3" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q3"></a>Question 3 - Implicitly Typed Variables</h2><p class="Abstract">
  <strong>C# 3.0 introduces implicitly typed local variables. You do not need to specify a type for a local variable any more! The compiler figures out which type to use for you. So what do you think; does the following code work?</strong>
</p>{% highlight c# %}namespace ImplicitTypes
{
    class Program
    {
        static void Main()
        {
            var v = "Hello World!";
            v = 10;
            System.Console.WriteLine(v);
        }
    }
}{% endhighlight %}<p class="DecoratorRight">You can read more about implicitly typed local variables in <a href="http://msdn2.microsoft.com/en-us/library/bb384061.aspx" target="_blank">MSDN</a>.</p><p>The correct answer is <span class="Highlighted">No, you cannot compile this code</span>.</p><p>The code does not compile. The line <span class="InlineCode">v = 10;</span> produces the error <span class="InlineCode">Cannot implicitly convert type 'int' to 'string'</span>. The reason is that the new keyword <span class="InlineCode">var</span> does not mean<span class="InlineCode">variant</span>! It just means that the compiler determines and assigns the most appropriate type <strong>during compile time</strong>!</p><h2 class="Head">
  <a id="Q4" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q4"></a>Question 4 - Value vs. Reference Types</h2><p class="Abstract">
  <strong>What is the output of the following program?</strong>
</p>{% highlight c# %}namespace ValueVsReferenceTypes
{
    class Program
    {
        static void Main()
        {
            var stringValue = "Hello World!";
            var stringValue2 = stringValue;
            stringValue = "Hello Austria!";
            System.Console.WriteLine(stringValue2);

            var array = new[] { 1, 2, 3, 4 };
            var array2 = array;
            array[0] = 99;
            System.Console.WriteLine(array2[0]);
        }
    }
}{% endhighlight %}<p>The correct answer is <span class="Highlighted">Hello World! 99</span>.</p><p class="DecoratorRight">System.String is called <span class="Highlighted">immutable </span> (read-only) because its value cannot be modified once it has been created.</p><p>Although <span class="InlineCode">System.String</span> is a class and therefore a reference type you can never change the content of a string. Every modification to a string variable generates a new <span class="InlineCode">String</span> object. Therefore the assignment of "Hello Austria!" to <span class="InlineCode">stringValue</span> does not affect the value of<span class="InlineCode">stringValue2</span>.</p><p>
  <span class="InlineCode">System.Array</span> behaves differently. If you assign an array to another variable only a new reference to the array is generated. A modification of an array element is visible to everyone holding a reference to the array. Knowing this it should be clear to you why <span class="InlineCode">array2[0]</span>contains 99 even if this value has been assigned to <span class="InlineCode">array[0]</span>.</p><h2 class="Head">
  <a id="Q5" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q5"></a>Question 5 - Finalizing Objects</h2><p class="Abstract">
  <strong>It is a good practise to use destructors in C# just like in C++. Put cleanup code in your class' destructor and the CLR will care for the rest. Is that correct?</strong>
</p><p>The correct answer is <span class="Highlighted">Cleaning up in the destructor is fine. But that is not enough!</span></p><p class="DecoratorRight">
  
 {% highlight c# %}class MyClass { 
    ~MyClass() { ... } 
} 
{% endhighlight %}

  <br />is the same as
			<br /><br />{% highlight c# %}class MyClass { 
    protected override 
      void Finalize()
    {   ...
        base.Finalize(); 
    } 
}{% endhighlight %}<br /></p><p>C# knows destructors. A destructor is the same as a <span class="InlineCode">Finalize</span>-Method in which you call<span class="InlineCode">base.Finalize();</span> at the end. However, using finalizers costs performance. Additionally you have to be aware that finalizers are not called when an object is no longer needed by your program. It is called when the garbage collector decides to remove the object. Usually you cannot predict when that will happen. Therefore you have to do a little bit more to provide a proper cleanup mechanism in your programs.</p><p>Take a look at the following program:</p>{% highlight c# %}using System;
using System.IO;

namespace Finalizers
{
    internal class FileGenerator : IDisposable
    {
        public FileGenerator()
        {
        }
        ~FileGenerator()
        {
            // Just a debug output
            Console.WriteLine("Closing file!");
        }
        public void Generate(int Length)
        {
            // Here some work is done...
        }
        public void Dispose()
        {
            // Just a debug output
            Console.WriteLine("Disposing object!");
        }
    }

    class Program
    {
        static void Generate()
        {
            using ( var fGen = new FileGenerator() )
                fGen.Generate(512);
        }
        static void Main(string[] args)
        {
            Generate();
            // Here we do some work; simulated by ReadLine statement
            Console.Write("Please Press Enter...");
            Console.ReadLine();
        }
    }
}{% endhighlight %}<p>If you run this program you will notice that the output <span class="Highlighted">Closing file!</span> appears at the very end of the program. The destructor is not immediately called when the object <span class="InlineCode">fGen</span> is out of scope. The CLR calls it when the garbage collector frees the object.</p><p>This is one of the reasons why a destructor or a finalizer is not enough for an object that has to clean up when it is no longer needed. Here is a list of things you should consider regarding cleanup:</p><p class="DecoratorRight">Jeffrey Richter wrote an interesting <a href="http://msdn.microsoft.com/msdnmag/issues/1100/gci/" target="_blank">article about memory management and finalization </a> of objects in the MSDN Magazine. Although the text has been written in 2000 it is still worth reading!</p><ol>
  <li>Try to avoid objects that require clean up!</li>
  <li>If you cannot avoid it provide a destructor or a finalizer.</li>
  <li>Add an additional method with which a user can 
				<strong>force</strong> the object to clean up.
				<ol><li>Implement the <span class="InlineCode">IDisposable</span> interface by providing a <span class="InlineCode">Dispose</span>-method. Follow the guidelines for implementing <span class="InlineCode">IDisposable </span> that are included in <a href="http://msdn2.microsoft.com/en-us/library/fs2xkftw.aspx" target="_blank">MSDN</a>.</li><li>If a user can (re)open the object using some kind of <span class="InlineCode">Open</span>-method offer a<span class="InlineCode">Close</span>-method in addition to <span class="InlineCode">Dispose</span>. The <span class="InlineCode">Close</span>-method should call <span class="InlineCode">Dispose</span>internally.</li><li>Do not forget to call <span class="InlineCode">SuppressFinalize</span> in your <span class="InlineCode">Dispose</span>-method. Otherwise you would waste performance.</li></ol></li>
  <li>Objects that implement <span class="InlineCode">IDisposable </span> should be used inside C# <span class="InlineCode">using </span> statement. It automatically cleans up correctly.</li>
</ol><h2 class="Head">
  <a id="Q6" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q6"></a>Question 6 - Lambda Expressions</h2><p class="Abstract">
  <strong>In C# every method must have a name. True or false?</strong>
</p><p>That's not true! Since the version 2.0 C# has known anonymous methods. Take a look at the following code:</p>{% highlight c# %}namespace AnonymousMethods
{
    class Program
    {
        delegate int CalcOperation(int x);
        static int PerformCalculation( int x, CalcOperation calc )
        {
            return calc(x);
        }
        static void Main()
        {
            System.Console.Write(PerformCalculation(5, 
                delegate(int x) { return x * x; }));
        }
    }
}{% endhighlight %}<p>The <span class="InlineCode">main</span>-method creates an anonymous method that is passed in the <span class="InlineCode">calc</span>-parameter to the<span class="InlineCode">PerformCalculation</span>-method. This construct is quite useful in a situation when having to create a method might seem an unnecessary overhead.</p><p class="DecoratorRight">Read more about Lambda Expressions in <a target="_blank" href="http://msdn2.microsoft.com/en-us/library/bb397687.aspx">MSDN</a>.</p><p>In C# 3.0 you can replace anonymous methods with Lamdba Expressions in most cases. In our case we could change the implementation of the <span class="InlineCode">Main</span>-method as follows:</p>{% highlight c# %}static void Main()
{
    System.Console.Write(PerformCalculation(5, x => x*x ));
}{% endhighlight %}<p>If you take a look behind the scenes and check the intermediate language that the C# compiler generates you will see that the generated IL nearly does not differ between C# 2.0 anonymous methods and Lamdba Expressions.</p><h2 class="Head">
  <a id="Q7" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q7"></a>Question 7 - Nullable Types</h2><p class="Abstract">
  <strong>What is the output of the following program?</strong>
</p>{% highlight c# %}namespace NullableTypes
{
    class Program
    {
        static void Main()
        {
            int a = 10;
            int? b = 20;
            int? c = null;
            System.Console.WriteLine( a + c ?? b );
        }
    }
}{% endhighlight %}<p>The correct answer is <span class="Highlighted">20</span>.</p><p>In C# you can make every value type nullable by adding a question mark to the type's name (you could also use <span class="InlineCode">System.Nullable&lt;T&gt;</span> instead of the <span class="InlineCode">?</span>). The operator <span class="InlineCode">??</span> can be used to specify a default value for an expression. This default value is returned if the expression evaluates to null. In our case c is null; therefore <span class="InlineCode">a + c</span> is null and the default value b (20) is returned.</p><h2 class="Head">
  <a id="Q8" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q8"></a>Question 8 - JIT Compiler</h2><p class="Abstract">
  <strong>The JIT compiler converts the IL in a portable executable into native machine language...</strong>
</p><p>The correct answer is <span class="Highlighted">method by method</span>.</p><p>During loading the CLR creates a stub for each method in a type when it is loaded and initialized. When a method is called for the first time the stub passes control to the JIT compiler which converts the MSIL for that method into native code. If the method is called again the native code is executed without involving the JIT.</p><p>You can observe how the JITter generates native code using the following code sample:</p><p class="DecoratorRight">
  <img alt="Observe the number of methods Jited using Performance Monitor" src="{{site.baseurl}}/content/images/blog/2009/10/JIT_large.png" class="   " />
  <em>In the Performance Monitor you can see how the JITter generates native code.</em>
</p>{% highlight c# %}namespace JIT
{
    class Program
    {
        static void Method1()
        {
            System.Console.WriteLine("Method1");
        }
        static void Method2()
        {
            System.Console.WriteLine("Method2");
        }
        static void Main()
        {
            System.Console.ReadLine();
            Method1();
            System.Console.ReadLine();
            Method2();
            System.Console.ReadLine();
            Method1();
            System.Console.ReadLine();
        }
    }
}{% endhighlight %}<p class="DecoratorRight">Note: You cannot use <span class="InlineCode">ngen</span> with ASP.NET (for details see <a href="http://support.microsoft.com/kb/331979/en-us" target="_blank">Microsoft Support Site</a>).</p><p>If you do not want to convert your IL code method by method every time the program starts you can use the <a href="http://msdn2.microsoft.com/en-us/library/6t9t5wcf(VS.80).aspx" target="_blank">Native Image Generator (ngen.exe)</a> to convert it e.g. during installation. ngen generates processor-specific machine code in the native image cache. The runtime uses these images from the cache instead of using the JIT compiler to compile the original assembly.</p>