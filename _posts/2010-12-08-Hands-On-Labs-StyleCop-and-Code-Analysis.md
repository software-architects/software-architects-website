---
layout: blog
title: Hands-On Labs StyleCop and Code Analysis
excerpt: This week I will be one of the speakers at BASTA On Tour in Munich. One of the topics I am going to speak about is the Managed Extensibility Framework (MEF). In this blog post I want to share my slides and summarize the hands-on labs that I am going to go through with the participants.
author: Rainer Stropek
date: 2010-12-08
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET]
ref: 
permalink: /devblog/2010/12/08/Hands-On-Labs-StyleCop-and-Code-Analysis
---

<p>This week I will be one of the speakers at <a href="http://basta-on-tour.de/csharp2010/" target="_blank"><span>BASTA On Tour</span></a> in Munich. One of the topics I am going to speak about is the Managed Extensibility Framework (MEF). In this blog post I want to share my slides and summarize the hands-on labs that I am going to go through with the participants.</p><ul>
  <li>
    <a href="{{site.baseurl}}/content/images/blog/2010/12/StyleCop Code Analysis Workshop.pdf" target="_blank">Download Slides</a> (PDF)</li>
</ul><h2>Hands-On Lab 1: StyleCop Documentation Rules</h2><p>Prerequisites:</p><ul>
  <li>Visual Studio 2010</li>
  <li>Download and install the latest version of the StyleCop from <a href="http://stylecop.codeplex.com/" target="_blank">http://stylecop.codeplex.com/</a></li>
</ul><p>Lab step by step description:</p><ul>
  <li>Create a class library project <span class="InlineCode">StyleCopDemo</span>.</li>
  <li>Add the following class to the newly created project:</li>
</ul>{% highlight c# %}using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace styleCopDemo
{
 public class utils_Bucket<T>
 {
  public utils_Bucket()
  {
  }

  public utils_Bucket(IEnumerable<Tuple<string, T>> data)
  {
   foreach (var item in data) {
    this.data[item.Item1] = item.Item2;
   }
  }

  private Dictionary<string, T> data = new Dictionary<string, T>();

  public T this[string index]
  {
   get
   {
    if (data.ContainsKey(index))
    {
     return data[index];


    }
    else
     return default(T);
   }
  }

  public int GetLength()
  {
   return this.data.Keys.Count;
  }

  private string Dump()
  {
   return this.data.Aggregate<KeyValuePair<string, T>, StringBuilder>(
    new StringBuilder(),
    (agg, item) =>
    {
     if (agg.Length > 0)
     {
      agg.Append(", ");
     }
     agg.AppendFormat("{0}: {1}", item.Key, item.Value.ToString());
     return agg;
    }).ToString();
  }
  public override string ToString()
  {
   return this.Dump();
  }
 }
}{% endhighlight %}<ul>
  <li>Launch StyleCop Settings (right-click on project, select <em>StyleCop settings</em>).</li>
  <li>Enable all rules except <em>Spacing Rules / SA1027</em></li>
  <li>Build your project and make sure that there are no errors and no warning.</li>
  <li>Run StyleCop on your project (right-click on project, select <em>Run StyleCop</em>). As you can see StyleCop generated a bunch of warnings.</li>
  <li>Correct all warnings appropriately.</li>
  <li>After that your file should look similar to the following implementation:</li>
</ul>{% highlight c# %}//-------------------------------------------------------
// <copyright file="Bucket.cs" company="Contoso Ltd.">
//     Copyright (c) Contoso Ltd. All rights reserved.
// </copyright>
//-------------------------------------------------------

namespace StyleCopDemo
{
 using System;
 using System.Collections.Generic;
 using System.Linq;
 using System.Text;

 /// <summary>
 /// Implements a bucket
 /// </summary>
 /// <typeparam name="T">Type of the elements in the bucket</typeparam>
 public class Bucket<T>
 {
  /// <summary>
  /// Internal helper to store data
  /// </summary>
  private Dictionary<string, T> data = new Dictionary<string, T>();

  /// <summary>
  /// Initializes a new instance of the Bucket class.
  /// </summary>
  public Bucket()
  {
  }

  /// <summary>
  /// Initializes a new instance of the Bucket class.
  /// </summary>
  /// <param name="data">The initial data.</param>
  public Bucket(IEnumerable<Tuple<string, T>> data)
  {
   foreach (var item in data) 
   {
    this.data[item.Item1] = item.Item2;
   }
  }

  /// <summary>
  /// Gets the element at the specified index.
  /// </summary>
  /// <param name="index">Index of the element to get.</param>
  /// <value>Element at the specified index.</value>
  public T this[string index]
  {
   get
   {
    if (this.data.ContainsKey(index))
    {
     return this.data[index];
    }
    else
    {
     return default(T);
    }
   }
  }

  /// <summary>
  /// Gets the length.
  /// </summary>
  /// <returns>Length of the dictionary</returns>
  public int GetLength()
  {
   return this.data.Keys.Count;
  }

  /// <summary>
  /// Returns a <see cref="System.String"/> that represents this instance.
  /// </summary>
  /// <returns>
  /// A <see cref="System.String"/> that represents this instance.
  /// </returns>
  public override string ToString()
  {
   return this.Dump();
  }

  /// <summary>
  /// Dumps this instance.
  /// </summary>
  /// <returns>String representation of the dictionary</returns>
  private string Dump()
  {
   return this.data.Aggregate<KeyValuePair<string, T>, StringBuilder>(
    new StringBuilder(),
    (agg, item) =>
    {
     if (agg.Length > 0)
     {
      agg.Append(", ");
     }

     agg.AppendFormat("{0}: {1}", item.Key, item.Value.ToString());
     return agg;
    }).ToString();
  }
 }
}{% endhighlight %}<h2>Hands-On Lab 2: StyleCop Build Integration</h2><p>Prerequisites:</p><ul>
  <li>Visual Studio 2010</li>
  <li>Download and install the latest version of the StyleCop from <a href="http://stylecop.codeplex.com/" target="_blank"><span>http://stylecop.codeplex.com/</span></a><ul><li>Make sure that you have selected <em>MSBuild integration files</em> when installing StyleCop</li></ul></li>
  <li>Complete Hands-On Lab 1 (see above)</li>
</ul><p>Lab step by step description:</p><ul>
  <li>Open the resulting solution from Hands-On Lab 1 (<span class="InlineCode">StyleCopDemo</span>).</li>
  <li>Unload the <span class="InlineCode">StyleCopDemo</span> project (right-click on project in <em>Solution Explorer</em>, select <em>Unload Project</em>).</li>
  <li>Edit <span class="InlineCode">StyleCopDemo</span> project (right-click on project in <em>Solution Explorer</em>, select <em>Edit StyleCopDemo.csproj</em>).</li>
  <li>Scroll to the end of the file. Find the line <span class="InlineCode">&lt;Import Project="$(MSBuildToolsPath)\Microsoft.CSharp.targets" /&gt;</span>.</li>
  <li>Immediately after that line add the following line:</li>
</ul>{% highlight xml %}<Import Project="$(ProgramFiles)\MSBuild\Microsoft\StyleCop\v4.4\Microsoft.StyleCop.targets" />{% endhighlight %}<ul>
  <li>Reload the <span class="InlineCode">StyleCopDemo</span> project (right-click on project in <em>Solution Explorer</em>, select <em>Reload Project</em>).</li>
  <li>Build your project to see that there are no errors and warnings.</li>
  <li>Break a StyleCop rule (e.g. remove the documentation of a method).</li>
  <li>Build your project.

<ul><li>StyleCop should have run automatically, you should see an appropriate warning.</li></ul></li>
  <li>Unload the <span class="InlineCode">StyleCopDemo</span> project (right-click on project in <em>Solution Explorer</em>, select <em>Unload Project</em>).</li>
  <li>Edit <span class="InlineCode">StyleCopDemo</span> project (right-click on project in <em>Solution Explorer</em>, select <em>Edit StyleCopDemo.csproj</em>).</li>
  <li>Find the first <span class="InlineCode">PropertyGroup</span> in the project file and add the following setting:</li>
</ul>{% highlight xml %}<StyleCopTreatErrorsAsWarnings>false</StyleCopTreatErrorsAsWarnings>{% endhighlight %}<ul>
  <li>Reload the <span class="InlineCode">StyleCopDemo</span> project (right-click on project in <em>Solution Explorer</em>, select <em>Reload Project</em>).</li>
  <li>Build your project.

<ul><li>The StyleCop warning should now be an error.</li></ul></li>
  <li>Suppress the warning/error using the <span class="InlineCode">SuppressMessage</span> attribute:</li>
</ul>{% highlight c# %}[SuppressMessage("Microsoft.StyleCop.CSharp.DocumentationRules", "SA1600:ElementsMustBeDocumented", 
  Justification = "No time to write documentation...")]
public class Bucket<T>
{
  ...
}{% endhighlight %}<h2>Hands-On Lab 3: Code Analysis</h2><p>Prerequisites:</p><ul>
  <li>Visual Studio 2010</li>
  <li>Complete Hands-On Lab 1 (see above)</li>
</ul><p>Lab step by step description:</p><ul>
  <li>Add a new class library project to solution from Hands-On Lab 1 (<span class="InlineCode">StyleCopDemo</span>).</li>
  <li>Add the following class to the newly created project:</li>
</ul>{% highlight c# %}namespace CodeAnalysisDemo
{
 using System;
 using System.Collections.Generic;
 using System.Data.SqlClient;
 using System.IO;

 public interface ISwiftItem<T>
 {
  string ItemName { get; }
  List<T> Values { get; }
 }

 public interface INamedItem
 {
  string ItemName { get; }
 }

 public class SwiftItem<T> : ISwiftItem<T>
 {
  public string ItemName
  {
   get;
   set;
  }

  public List<T> Values
  {
   get;
   set;
  }
 }

 public class SwiftFile
 {
  private Stream underlying_File;
  private string fileName;
  private object header;

  public SwiftFile(string fileName)
  {
   this.underlying_File = new FileStream(fileName, FileMode.Open);
   this.fileName = fileName;
   this.header = new object();
  }

  public List<Tuple<string, object>> Settings
  {
   get;
   set;
  }

  public void AddObject<T>(SwiftItem<T> newObj)
  {
   lock (this.header)
   {
    var header = string.Format("{0}: {1}", newObj.ItemName, newObj.Values.Count);

    foreach (var item in newObj.Values)
    {
     if (item is INamedItem)
     {
      var namedItem = item as INamedItem;

      // do something special with namedItem
     }
    }

    // do something with newObj
   }
  }

  public void CopyFile(string source_file_name)
  {
   using (var reader = new StreamReader(new FileStream(source_file_name, FileMode.Open)))
   {
    // TODO: copy file here
   }
  }

  public void WriteToDatabase(SqlConnection conn, string tenant)
  {
   var cmd = conn.CreateCommand();
   cmd.CommandText = string.Format("INSERT INTO Target ( Tenant, Data ) VALUES ( {0}, @Data )", tenant);
   
   // Build rest of the command and execute it
  }

  public void Close()
  {
   try
   {
    this.underlying_File.Close();
   }
   catch
   {
    Console.WriteLine("Error");
   }
  }
 }
}{% endhighlight %}<ul>
  <li>Build your project and make sure that there are no error and no warnings.</li>
  <li>Enable <em>Code Analysis</em> for the project and select rule set <em>Microsoft All Rules</em>.

<ul><li>You find the necessary options in the project's property window.</li></ul></li>
  <li>Build your project. As you can see code analysis shows you a bunch of warnings.</li>
  <li>Try to correct all warnings appropriately. If you are not sure what a certain warning means or why it is important check the rule documentation in MSDN: <a href="http://msdn.microsoft.com/en-us/library/ee1hzekz.aspx" target="_blank">http://msdn.microsoft.com/en-us/library/ee1hzekz.aspx</a></li>
  <li>After that your file should look similar to the following implementation:</li>
</ul>{% highlight c# %}using System;

[assembly: CLSCompliant(true)]

namespace CodeAnalysisDemo
{
 using System.Collections.Generic;
 using System.Collections.ObjectModel;
 using System.Data;
 using System.Data.SqlClient;
 using System.Diagnostics.CodeAnalysis;
 using System.IO;

 public interface ISwiftItem<T>
 {
  string ItemName { get; }
  IEnumerable<T> Values { get; }
 }

 public interface INamedItem
 {
  string ItemName { get; }
 }

 public class SwiftItem<T> : ISwiftItem<T>
 {
  public string ItemName
  {
   get;
   set;
  }

  public IEnumerable<T> Values
  {
   get;
   set;
  }
 }

 public class Setting
 {
  public string SettingName { get; set; }
  public object SettingValue { get; set; }
 }

 public class SettingCollection : Collection<Setting>
 {
 }

 public class SwiftFile : IDisposable
 {
  private Stream underlying_File;
  private object header;
  private bool disposed;

  public SwiftFile(string fileName)
  {
   this.underlying_File = new FileStream(fileName, FileMode.Open);
   this.header = new object();
   this.Settings = new SettingCollection();
  }

  public SettingCollection Settings
  {
   get;
   private set;
  }

  public void AddObject<T>(SwiftItem<T> newObj)
  {
   if (newObj != null)
   {
    lock (this.header)
    {
     foreach (var item in newObj.Values)
     {
      var namedItem = item as INamedItem;
      if (namedItem != null)
      {
       // do something special with namedItem
      }
     }

     // do something with newObj
    }
   }
  }

  [SuppressMessage("Microsoft.Performance", "CA1822", Justification = "Will reference 'this' later")]
  public void CopyFile(string sourceFileName)
  {
   var stream = new FileStream(sourceFileName, FileMode.Open);
   StreamReader reader;
   try
   {
    reader = new StreamReader(stream);
   }
   catch
   {
    stream.Dispose();
    throw;
   }

   try
   {
    // do something with reader
   }
   finally
   {
    reader.Dispose();
   }
  }

  [SuppressMessage("Microsoft.Performance", "CA1822", Justification = "Will reference 'this' later")]
  public void WriteToDatabase(SqlConnection conn, string tenant)
  {
   if (conn == null || (conn.State & ConnectionState.Open) == 0)
   {
    throw new ArgumentException("conn must not be null and must be open");
   }

   var cmd = conn.CreateCommand();
   cmd.CommandText = "INSERT INTO Target ( Tenant, Data ) VALUES ( @Tenant, @Data )";
   cmd.Parameters.Add("@Tenant", System.Data.SqlDbType.NVarChar, 100).Value = tenant;

   // Build rest of the command and execute it
  }

  public void Close()
  {
   try
   {
    this.underlying_File.Close();
   }
   catch
   {
    Console.WriteLine("Error");
    throw;
   }
  }

  private void Dispose(bool disposing)
  {
   if (!this.disposed)
   {
    if (disposing)
    {
     this.underlying_File.Dispose();
    }

    disposed = true;
   }
  }

  public void Dispose()
  {
   this.Dispose(true);
   GC.SuppressFinalize(this);
  }

  ~SwiftFile()
  {
   Dispose(false);
  }
 }
}{% endhighlight %}