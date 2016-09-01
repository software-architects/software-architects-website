---
layout: blog
title: Caching in ASP.NET
excerpt: There are a lot of ways to improve performance in web applications. One of the simplest but most effective methods is to cache images on the client. In this article I would like to show how we implemented image caching for our DotNetNuke website.
author: Karin Huber
date: 2008-01-19
bannerimage: 
bannerimagesource: 
lang: en
tags: [ASP.NET]
ref: 
permalink: /devblog/2008/01/19/Caching-in-ASPNET
redirect_from:
- "/Blogs/tabid/72/EntryID/5/language/en-US/Default.aspx/index.html"
- "/TechnicalArticles/CachinginASPNET/tabid/75/language/en-US/Default.aspx/index.html"
- /TechnicalArticles/CachinginASPNET/tabid/75/Default.aspx/index.html
- "/Blogs/tabid/72/EntryID/5/language/en-US/DateTimeImage.aspx/index.html"
---

<p>There are a lot of ways to improve performance in web applications. One of the simplest but most effective methods is to cache images on the client. In this article I would like to show how we implemented image caching for our DotNetNuke website.</p><ul>
  <li>The Problem</li>
  <li>Caching Images in IIS</li>
  <li>Caching Images with a Custom HttpHandler</li>
  <li>Defining Custom Configuration Sections in web.config</li>
  <li>Testing the CachingHandler</li>
</ul><div>
  <p>You may download the complete project or only the compiled assembly and use them in your own projects:</p>
  <ul>
    <li>Complete <a href="{{site.baseurl}}/content/images/blog/2008/01/CachingHandler.zip">source code</a> - 75 KB</li>
    <li>Compiled <a href="{{site.baseurl}}/content/images/blog/2008/01/SoftwareArchitects.Web.CachingHandler.zip">assembly</a> - 3 KB</li>
  </ul>
</div><h2 class="Head">
  <a id="problem" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="problem"></a>The Problem</h2><p>When I was building the website <a href="http://www.software-architects.com/">http://www.software-architects.com</a> I used a lot of images in the css style sheets to display background images for menu items. After transfering the files to our web server I tested how much traffic a request to our start page would produce. With Microsoft Network Monitor 3.1 I recorded a call to <a href="http://www.software-architects.com/"><font color="#800080">http://www.software-architects.com</font></a>. As a result I got 20 requests to 20 different files to display one single page. Microsoft Network Monitor shows that appoximatly half of the requests are required for the menu images.</p><p class="DecoratorRight">Microsoft Network Monitor is a Tool to allow capturing and protocol analysis of network traffic. You can download it from the <a href="http://www.microsoft.com/downloads/details.aspx?FamilyID=18b1d59d-f4d8-4213-8d17-2f6dde7d7aac&amp;DisplayLang=en" target="_blank">Microsoft Download Center</a>.</p><p>
  <img height="523" width="523" src="{{site.baseurl}}/content/images/blog/2008/01/MNM_ohneCaching.png" class="  " />
</p><p>There are two different ways to avoid this problem. On the one hand you can tell IIS to cache images on the client, and on the other hand you can do this directly in ASP.net (which is a bit more complicated).</p><h2 class="Head">
  <a id="iis" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="iis"></a>Caching Images in IIS<a id="iis" name="iis" class="mceItemAnchor"></a></h2><p>Caching in IIS is very simple. Select a folder in the left pane or a single file in the right pane and open the properties dialog.</p><p>
  <img height="323" width="520" src="{{site.baseurl}}/content/images/blog/2008/01/IIS_Images.png" class="  " />
</p><p>Check "Enable content expiration" and choose when your content should expire.</p><p>
  <img height="440" width="472" src="{{site.baseurl}}/content/images/blog/2008/01/IIS_CachingProperties.png" class="   " />
</p><p>That's it! IIS tells the client with the "Cache-Control" header that the content may be cached on the client. The "Expires" header contains the expiration date. So the client knows that after this date it has to ask the server for the new content.</p><p>This approach works very well if</p><ul>
  <li>you can place all your images and other cachable files in one or a few folders,</li>
  <li>and, most important, you have access to the IIS.</li>
</ul><p>Both conditions are not fulfilled in our case. In our DotNetNuke project images are spread accross multiple folders so it would be quite complex to configure IIS. And more important, our hosting provider does not give us access to IIS. Thus I had to look for another solution.</p><h2 class="Head">
  <a id="httphandler" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="httphandler"></a>Caching Images with a Custom HttpHandler</h2><p class="DecoratorRight">You can find a good article about IHttpHandler at the APress web site: <a target="_blank" href="http://microsoft.apress.com/asptodayarchive/72809/use-local-scope-to-improve-performance"><font color="#800080">Use local scope to improve performance</font></a>.</p><p>First thing I had to solve was to bypass IIS to get the request to ASP.NET. I deciced to write a custom http handler which listens to files with the paths *.gif.ashx, *.jpg.ashx and *.png.ashx. Therefore I built a new class library project in Visual Studio with a class <span class="InlineCode">CachingHandler</span>, which is responsible for handling requests to images. <span class="InlineCode">CachingHandler</span> implements the interface <span class="InlineCode">IHttpHandler</span> like the <span class="InlineCode">Page</span> class does. The interface provides the property<span class="InlineCode">IsReusable</span> and the method <span class="InlineCode">ProcessRequest</span>.</p><p>
  <span class="InlineCode">IsResuable</span> indicates if another request can reuse the http handler. This means, we have to guarantee that the <span class="InlineCode">ProcessRequest</span> method is threadsafe.</p><p>
  <span class="InlineCode">ProcessRequest</span> does the real work. It gets the current context and is responsible for sending the result to the client.</p><p class="DecoratorRight">Download complete code for <a target="_blank" href="{{site.baseurl}}/content/images/blog/2008/01/CachingHandler.cs">CachingHandler.cs</a>.</p>{% highlight c# %}namespace SoftwareArchitects.Web 
{ 
  public class CachingHandler : IHttpHandler 
  { 
    public bool IsReusable 
    { 
      get { return true; } 
    } 

    public void ProcessRequest(HttpContext context) 
    { 
      ... 
    } 
  } 
}{% endhighlight %}<p>We want our http handler to send a file to the client. As we are listening to files with the paths *.gif.ashx, *.jpg.ashx and *.png.ashx, all we have to do is to remove the ".ashx" from the request path to get the file we want to send to the client. Besides we extract the filename and the extension from the file.</p>{% highlight c# %}public void ProcessRequest(HttpContext context) 
{ 
  string file = context.Server.MapPath 
    (context.Request.FilePath.Replace(".ashx", "")); 
  string filename = file.Substring(file.LastIndexOf('\\') + 1); 
  string extension = file.Substring(file.LastIndexOf('.') + 1);{% endhighlight %}<p class="DecoratorRight">I will show you the code for the class CachingSection a little bit later.</p><p>In the next step we load the configuration for the <span class="InlineCode">CachingHandler</span> from the web.config file. Therfore I built a class <span class="InlineCode">CachingSection</span>, which contains a property <span class="InlineCode">CachingTimeSpan</span> and a collection <span class="InlineCode">FileExtensions</span>, which knows the content type for each file extension. With help of this config class we configure the <span class="InlineCode">HttpCachePolicy</span> object of the response:</p><ul>
  <li>
    <span class="InlineCode">SetExpires</span> tells the client how long the content should be valid.</li>
  <li>
    <span class="InlineCode">SetCacheability</span> tells the client who is allowed to cache the content. We set the the cacheability to public. This means that the response is cacheable by clients and shared (proxy) caches.</li>
  <li>
    <span class="InlineCode">SetValidUnitExpires</span> specifies whether the ASP.NET cache should ignore HTTP<span class="keyword">Cache-Control</span> headers sent by the client that invalidate the cache.</li>
  <li>
    <span class="InlineCode">ContentType</span> sets the MIME type of the response.</li>
</ul>{% highlight c# %}  CachingSection config = (CachingSection)context.GetSection 
    ("SoftwareArchitects/Caching"); 
  if (config != null) 
  { 
    context.Response.Cache.SetExpires 
      (DateTime.Now.Add(config.CachingTimeSpan)); 
    context.Response.Cache.SetCacheability(HttpCacheability.Public); 
    context.Response.Cache.SetValidUntilExpires(false); 

    FileExtension fileExtension = config.FileExtensions[extension]; 
    if (fileExtension != null) 
    { 
      context.Response.ContentType = fileExtension.ContentType; 
    } 
  }{% endhighlight %}<p>Finally we add the content-disposition header to the response to tell the client that it should open the file in the browser (inline). Additionally we set the filename to the name without the extension .ashx, because this is the name, that will be displayed when you try to download the file. Then we use <span class="InlineCode">WriteFile</span> to send the file to the client.</p>{% highlight c# %}  context.Response.AddHeader("content-disposition",  
    "inline; filename=" + filename); 
  context.Response.WriteFile(file); 
}{% endhighlight %}<h3 class="Head">
  <a id="configurationSections" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="configurationSections"></a>Defining Custom Configuration Sections in web.config</h3><p>In the http handler we used a custom class to read some configuration information from the web.config file. Therfore I built the class <span class="InlineCode">CachingSection</span> derived from<span class="InlineCode">ConfigurationSection</span>. In this class I implemented a property <span class="InlineCode">CachingTimeSpan</span>, which holds a <span class="InlineCode">TimeSpan</span> value for the time to cache objects on the client, and a property<span class="InlineCode">FileExtensions</span>, which holds a collection of <span class="InlineCode">FileExtension</span> objects. To map these properties to elements in web.config you simply have to add a <span class="InlineCode">ConfigurationProperty</span>attribute to each property, which can be set in web.config.</p><p class="DecoratorRight">Download complete code for <a target="_blank" href="{{site.baseurl}}/content/images/blog/2008/01/CachingSection.cs">CachingSection.cs</a>.</p>{% highlight c# %}namespace SoftwareArchitects.Web.Configuration 
{ 
  /// <summary> 
  /// Configuration for caching 
  /// </summary> 
  public class CachingSection : ConfigurationSection 
  { 
    [ConfigurationProperty("CachingTimeSpan", IsRequired = true)] 
    public TimeSpan CachingTimeSpan  
    { 
      get { return (TimeSpan)base["CachingTimeSpan"]; } 
      set { base["CachingTimeSpan"] = value; } 
    } 

    [ConfigurationProperty("FileExtensions", IsDefaultCollection = true,  
      IsRequired = true)] 
    public FileExtensionCollection FileExtensions  
    { 
      get { return ((FileExtensionCollection)base["FileExtensions"]); } 
    } 
  }{% endhighlight %}<p>To support not only single values but also collections we have to implement a class derived from <span class="InlineCode">ConfigurationElementCollection</span>. In our sample we need a collection to configure a list of valid extensions with their corresponding content types. </p>{% highlight c# %}  /// <summary> 
  /// List of available file extensions 
  /// </summary> 
  public class FileExtensionCollection : ConfigurationElementCollection 
  { 
    ... 
  }{% endhighlight %}<p>Finally we need a class for each extension, which holds a property for the extension and a property for the content type.</p>{% highlight c# %}  /// <summary> 
  /// Configuration for a file extension 
  /// </summary> 
  public class FileExtension : ConfigurationElement 
  { 
    [ConfigurationProperty("Extension", IsRequired = true)] 
    public string Extension 
    { 
      get { return (string)base["Extension"]; } 
      set { base["Extension"] = value.Replace(".", ""); } 
    } 

    [ConfigurationProperty("ContentType", IsRequired = true)] 
    public string ContentType 
    { 
      get { return (string)base["ContentType"]; } 
      set { base["ContentType"] = value; } 
    } 
  } 
}{% endhighlight %}<p>All we have to do now is to add a configuration section to our web.config. In the <span class="InlineCode">configSections</span> tag we add a new <span class="InlineCode">sectionGroup</span> with the name SoftwareArchitects. In this group we add a section named <span class="InlineCode">Caching</span>. The attribute type specifies the class and the assembly of our <span class="InlineCode">CachingSection</span> class. Of course we have to add the assembly with the<span class="InlineCode">CachingSection</span> class to the bin folder of the web application. Then we can add a new tag with the name of the group to the configuration tag. Inside of the group we add a new tag with the name of the section, and in this section all properties we have defined in the<span class="InlineCode">CachingSection</span> class are now available.</p>{% highlight xml %}<configuration> 
  <configSections> 
    <sectionGroup name="SoftwareArchitects"> 
      <section name="Caching" requirePermission="false"  
        type="SoftwareArchitects.Web.Configuration.CachingSection,  
        SoftwareArchitects.Web.CachingHandler" /> 
    </sectionGroup> 
  </configSections> 

  <SoftwareArchitects> 
    <Caching CachingTimeSpan="1"> 
      <FileExtensions> 
        <add Extension="gif" ContentType="image\gif" /> 
        <add Extension="jpg" ContentType="image\jpeg" /> 
        <add Extension="png" ContentType="image\png" /> 
      </FileExtensions> 
    </Caching> 
  </SoftwareArchitects> 

  ...{% endhighlight %}<p>Now there is only one last thing missing until we can use the <span class="InlineCode">CachingHandler</span>. We have to add it to the <span class="InlineCode">httpHandlers</span> section in web.config. There we have to add an entry for each file extension we want to map to our http handler. I decided to support images with the extensions .gif, .jpg and .png. So I added a handler for the paths *.gif.ashx, *.jpg.ashx and *.png.ashx. In the type attribute I specified class and assembly of the http handler. Of course the assembly must be placed in the bin folder as well.</p><p class="DecoratorRight">You could also use other file extensions like *.gifx. But to do so you need to have access to IIS to configure the new extension to be handeled by the aspnet_isapi.dll. As I do not have access to the IIS of our hosting provider, I had to use *.ashx, because it is already mapped to aspnet_isapi.dll.</p>{% highlight xml %}  <httpHandlers> 
    <add verb="*" path="*.gif.ashx"  
      type="SoftwareArchitects.Web.CachingHandler,  
      SoftwareArchitects.Web.CachingHandler"/> 
    <add verb="*" path="*.jpg.ashx"  
      type="SoftwareArchitects.Web.CachingHandler,  
      SoftwareArchitects.Web.CachingHandler"/> 
    <add verb="*" path="*.png.ashx"  
      type="SoftwareArchitects.Web.CachingHandler,  
      SoftwareArchitects.Web.CachingHandler"/> 
  </httpHandlers> 
</configuration>{% endhighlight %}<p>Finally I added the extension .ashx to all images in the web site (in .css files and .aspx files). When I monitored a request to the main page of <a href="http://www.software-architects.com/"><font color="#800080">http://www.software-architects.com</font></a> again, the first request still generated 20 requests to the web server but from the second request on it took only 7 requests to load the page, because the images were cached on the client.</p><p>You can see how it works right here in this article. Right-click on an image and open the properties dialog. You will see, that the URL ends with .ashx. When you right-click on an image and select "Save Picture as..." the suggested filename does not include the extension .ashx because of the content-disposition header.</p><p class="DecoratorRight">Of course you can use the handler for other file types like javascript files of css files, too. So you could reduce the number of requests again.</p><p>
  <img height="347" width="523" src="http://web.archive.org/web/20091114122003im_/http://www.software-architects.com/Portals/1/Articles/ASPNETCaching/MNM_mitCaching.png.ashx" />
</p><h3 class="Head">
  <a id="testCaching" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="testCaching"></a>Testing the CachingHandler</h3><p>You can easily test the caching of images with a simple web site. I added a web site project with the name CachingWebSite to the Visual Studio Solution with which you can try how it works (<a href="{{site.baseurl}}/content/images/blog/2008/01/CachingHandler.zip">download complete solution</a>). On the one hand the web site contains a page Default.aspx, which contains an image tag. You can see that the image source ends with .ashx.</p>{% highlight xhtml %}<img src="/Portals/1/App_Themes/Standard/Images/LogoWithMenuBackground.png.ashx" />{% endhighlight %}<p>On the other hand the web site contains a theme Standard with a stylesheet Style.css. In the stylesheet I use a background image. Again the image source ends with .ashx.</p>{% highlight css %}body  
{ 
  margin: 0px; 
  padding: 0px; 
  background-image: url(Images/MenuBackground.png.ashx); 
  background-repeat: repeat-x; 
}{% endhighlight %}<p>In the web.config of the web site I inserted a custom section to configure the CachingHandler and a http handler for each extension, exactly as explained above. Furthermore I added the trace tag to the system.web section to trace every request to a file.</p>{% highlight xml %}<trace enabled="true" pageOutput="false" requestLimit="50" mostRecent="true" />{% endhighlight %}<p>When I start my web site project I see the Default.aspx page with the logo, which is defined in Default.aspx, and with the background image, which is defined in the stylesheet.</p><p>
  <img height="368" width="523" src="{{site.baseurl}}/content/images/blog/2008/01/CachingWebSite.png" class="  " />
</p><p>To view the trace I opened a new tab in IE and replaced Default.aspx with Trace.axd in the URL. The trace shows that four request were necessary to display the page Default.aspx.</p><p class="DecoratorRight">For the first request and every time the users hits F5 all files are sent to the client.</p><p>
  <img height="368" width="523" src="{{site.baseurl}}/content/images/blog/2008/01/Trace_withoutCaching.png" class="  " />
</p><p>When I switch back to the first tab I have three possibilities to reload the page. I could</p><ul>
  <li>press F5</li>
  <li>click the "Reload page ..." link</li>
  <li>click the "Reload page ..." button</li>
</ul><p>Pressing F5 would reload all the content, whereas clicking the link or the button would only reload content, which is not cached on the client. I clicked the link and the button for the following screenshot. As you can see there were only requests to Default.aspx and Style.css added in the trace.</p><p class="DecoratorRight">If the user navigates to a page via a hyperlink or does a post back only files which are not cached on the client are requested from the server. Request no. 5 and 6 were caused by clicking the link whereas request no. 7 and 8 were caused by clicking the button.</p><p>
  <img height="368" width="523" src="{{site.baseurl}}/content/images/blog/2008/01/Trace_withCaching.png" class="   mceC1Focused mceC1Focused" />
</p>