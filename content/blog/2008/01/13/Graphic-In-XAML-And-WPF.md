---
layout: blog
title: Graphic In XAML And WPF
teaser: In this article I want to describe the functions of XAML, WPF and Silverlight in the context of graphic. I will use the corporate logo of our new company as the sample for this article because it's XAML implementation uses quite a lot of the graphic functions of XAML.
author: Rainer Stropek
date: 2008-01-13
bannerimage: 
lang: en
tags: [WPF]
permalink: /blog/2008/01/13/Graphic-In-XAML-And-WPF
---

<p>In this article I want to describe the functions of XAML, WPF and Silverlight in the context of graphic. I will use the corporate logo of our new company as the sample for this article because it's XAML implementation uses quite a lot of the graphic functions of XAML.</p><p>Unfortunately I cannot go into all great details in this document. If you are interested in more in-depth information you can either read on in the <a href="http://msdn2.microsoft.com/de-at/library/ms752061(VS.85).aspx" target="_blank">MSDN Library</a> or (if you are able to read German) you can check out our <a href="http://www.amazon.de/WPF-XAML-Programmierhandbuch-Rainer-Stropek/dp/3939084603/ref=pd_bbs_sr_1?ie=UTF8&amp;s=books&amp;qid=1199433309&amp;sr=8-1" target="_blank">book about XAML and WPF</a>. Here is what I will discuss in this article:</p><ul>
  <li>From Inkscape to XAML - how to work with design professionals</li>
  <li>Shapes and Drawing Objects - Similarities, differences and when to use what</li>
  <li>Combining Geometry Objects</li>
  <li>Transformation Objects - Building a shadow effect</li>
  <li>Differences between WPF and Silverlight</li>
</ul><h2 class="Head">
  <a id="FromInkscapeToXAML" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="FromInkscapeToXAML"></a>From Inkscape to XAML</h2><p>If you are a programmer it is very likely that you have to work together with a design professional whenever it comes to graphic design. In my experience you get the best results if you start thinking about the content, basic layout and design principles <span class="Highlighted">before</span> you hire a design professional. We always try to work out a very basic draft of what we want to have and hand this draft over to our design partners. We experienced that the design results we can achieve ourselves are suboptimal simply because we have studied software development and not design. However, the results are also not the best they could be if you are not able to express what you want when you request the design work. This leads us to two important needs:</p><ul>
  <li>One member of your software development team should know about the very basic principles of graphic design. He can be the "communication bridge" between the software technicians and the designers.</li>
  <li>The tools that these people use are quite different from what we as software developers use. In the area of graphic design nearly all of the professionals I know use tools from Adobe (e.g. <a href="http://www.adobe.com/products/illustrator/?ogn=EN_US-gntray_prod_illustrator_home" target="_blank">Adobe Illustrator</a>). You have to find a common denominator for exchanging work with them.</li>
</ul><p>Let us concentrate on the second point for the moment. If you are lucky you can afford Adobe licenses in your software development team, too. There are XAML exporters and converters for Adobe tools on the web. Try them and see if they can help you to build the bridge from development to design. However, these tools are extremely powerful and you have to spend some time to learn how to use them.</p><p>Another option is the use of the Microsoft pendants: <a href="http://www.microsoft.com/expression/" target="_blank">Microsoft Expression Studio</a>. These tools have a similar functional range as the Adobe tools I mentioned before. The problem is that most design professionals I know do not use them by now. Their biggest advantage is that Microsoft's design tools "speak" XAML natively. Their XAML export capabilities are very good! However, just like with Adobe-tools it will take you a while to get familiar with Expression.</p><p>If you work on a low budget project or you want to use a design program that is a bit easier to use (because of less functions) you could get your hands dirty with an open source design tool: <a href="http://www.inkscape.org/" target="_blank">Inkscape</a>.  I personally like Inkscape very much. One of the beautiful things of Inkscape is it's file format: It uses <a href="http://www.w3.org/Graphics/SVG/" target="_blank">SVG</a> (Scalable Vector Graphics). You could use Inkscape to sketch basic layout ideas and pass the SVG file to you design professionals. You can be sure that they can handle SVG; this file format is nothing strange for them. Jon Galloway did an excellent job describing ways to convert SVG to XAML in his <a href="http://weblogs.asp.net/jgalloway/archive/2007/06/05/silverlight-and-xaml-have-you-guys-met-old-man-svg.aspx" target="_blank">blog</a>.</p><p>Depending on the tools your design professionals use they can give you back SVG again or they can export XAML directly. If you get SVG back it is quite easy for you to convert it to XAML. Even if your designers create bitmap images and do not use vector oriented tools Inkscape can help. The program has a built in algorithm for vectorizing bitmaps. It is useful, but be prepared for reworking the result of the vectorization process.</p><p>Let us take a look how we lived the process when creating our new logo in XAML. The first thing we did was to think about what we wanted. The name of the company was defined (<span class="Highlighted">software architects</span>). We started by defining some basic guidelines about how we want our logo to be designed:</p><ul>
  <li>We did not want to have a complex clipart. The logo should consist of the company name using an interesting typeface.</li>
  <li>The name of the company is quite long. Therefore the typeface had to be condensed. Otherwise the ratio of width and height would have been strange.</li>
  <li>...</li>
</ul><p class="DecoratorRight">The basic idea we gave to our design professional:<br /><img height="79" alt="Logo Step 1 - How We Designed It" width="221" src="{{site.baseurl}}/content/images/blog/2008/01/LogoStep1.png" class="               " /></p><p>Given these design ideas we looked for a font that could be the basis for our logo. After some research we decided to use a subtype of "ITC Franklin Gothic Book" created by the <a href="http://www.itcfonts.com/" target="_blank">International Typeface Corporation</a>. We recognized that the last three letters of softw<strong>are</strong> and the first three of <strong>arc</strong>hitects are quite similar and decided that we wanted to use that for a graphical effect. As the result we gave the following sketch of our logo (SVG built with Inkscape) together with our written ideas to our design professional.</p><p>
  <img height="90" alt="Logo Freehand Sketch" width="221" src="{{site.baseurl}}/content/images/blog/2008/01/LogoHandSketch2.png" class="                " />
</p><p class="DecoratorRight">After first enhancements:<br /><img height="58" alt="Logo Step 2 - First Enhancement By Our Design Professional" width="221" src="{{site.baseurl}}/content/images/blog/2008/01/LogoStep2.png" class="          " /><br /><br /> After enhancing the typeface:<br /><img height="58" alt="Logo Step 2 - Enhanced Typeface" width="221" src="{{site.baseurl}}/content/images/blog/2008/01/LogoStep3.png" class="          mceC1Focused" /></p><p>In my opinion this is a great example of what difference design professionals can make. In our case the designer took our ideas and enhanced it a little bit. He combined the two words a little bit different to make the effect much more interesting (see images on the right).</p><p>As the second step he converted the typeface into paths and changed some letters to create a grid that breaks the logo into different horizontal parts. Additionally he created an enhanced version of the logo including gradient brushes and a reflection:</p><p>
  <img height="139" alt="Logo Step 4 - Enhanced Coloring" width="521" src="{{site.baseurl}}/content/images/blog/2008/01/LogoStep4v2.png" class="        " />
</p><p>After a short while we had the logo in Inkscape (SVG format) as a vector graphic:</p><p>
  <img height="211" alt="Logo In Inkscape" width="338" src="{{site.baseurl}}/content/images/blog/2008/01/LogoInInkscape.png" />
</p><p>From that point on we were back in our original profession - CODE. In the SVG file we had all the path expressions of our logo ready to be copied out. We could use them without any change in XAML. Here ist an example of a path expression in SVG:</p><p class="DecoratorRight">As you can see the path is defined using a mini-language in which all points, lines and curves are specified. This mini-language is very, very similar between XAML and SVG. Usually you can copy the paths from SVG to XAML without any change.<br /> You can find detailed information about path specifications in SVG at <a href="http://www.w3.org/TR/SVG11/paths.html" target="_blank">W3C</a> and about paths in XAML at Microsoft's <a href="http://msdn2.microsoft.com/en-us/library/ms752293(VS.85).aspx" target="_blank">MSDN Library</a>.</p><p>
  <img height="590" alt="Path In SVG File" width="467" src="{{site.baseurl}}/content/images/blog/2008/01/SvgPath.png" class="     " />
</p><h2 class="Head">
  <a id="ShapesAndDrawingObjects" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="ShapesAndDrawingObjects"></a>Shapes and Drawing Objects</h2><p>The next step is the implementation of the logo in XAML. In XAML you have two possibilities for how to specify graphic objects: You can either use the classes derived from <span class="Highlighted">Shape </span> (e.g.<span class="Highlighted">Rectangle</span>, <span class="Highlighted">Ellipse</span>, etc.) or you use Drawing Objects (classes derived from <span class="Highlighted">Drawing</span>). The following UML class diagram from our book "XAML und WPF Programmierhandbuch" shows the inheritance tree of 2D graphic-related classes in WPF:</p><p class="DecoratorRight">
  <img height="319" alt="UML Class Diagram for Shape, Drawing and Geometry" width="421" src="{{site.baseurl}}/content/images/blog/2008/01/Figure_7_10_WPF_und_XAML.png" />
</p><p class="DecoratorRight">
  <span class="Highlighted">XAML und WPF Programmierhandbuch
<br /></span> Figure 7.10, Page 442<br /></p><p>The main differences between Shapes and Drawing Objects are:</p><ul>
  <li>Shapes are Framework Elements. Because of that you can use them in your user interface just like any other control (e.g. <span class="Highlighted">Button</span>, <span class="Highlighted">TextBox</span>, etc.). They are also derived from <span class="Highlighted">Visual</span>. Therefore they now themselves how to render them.

<p class="DecoratorRight">Freezables that are in read-only state are called "Frozen Freezables".</p></li>
  <li>Drawing Objects are no Framework Elements! They are Freezables (derived from<span class="Highlighted">Freezable</span>). Therefore they can be set into a read-only state. With this you can significantly enhance performance. However, Freezables in ready-only state cannot be modified using animations or data bindings. This leads to the conclusion that you should only "freeze" Freezables if they represent static graphics without changes during runtime.</li>
  <li>Drawing Objects are no Visuals! To display Drawing Objects you need a Framework Element helper object. The following figure shows this relationship.</li>
</ul><p class="DecoratorRight">
  <img height="329" alt="Relationship of Drawing Objects And Framework Elements" width="406" src="{{site.baseurl}}/content/images/blog/2008/01/Figure_7_27_WPF_und_XAML.png" class="           " />
</p><p>
  <span class="Highlighted">XAML und WPF Programmierhandbuch
<br /></span> Figure 7.27, Page 467<br /></p><p>At the first glance Geometries (objects derived from <span class="Highlighted">Geometry</span>) seem to be similar as Shapes. Actually they are quite different. Geometries do not represent graphical objects that are ready to be displayed on the screen. They just specify the shape of an object.</p><p>In our case it makes sense to use Drawing Objects to implement the logo because it is a relatively static graphical object. Here is the XAML code for the basic shapes of the logo:</p><p class="DecoratorRight">Note the namespace declaration for<span class="Highlighted">PresentationOptions</span>. You need this to be able to freeze Freezables.</p>{% highlight javascript %}<Page
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  xmlns:PresentationOptions=
    "http://schemas.microsoft.com/winfx/2006/xaml/presentation/options" 
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
  mc:Ignorable="PresentationOptions" >{% endhighlight %}<p class="DecoratorRight">We put the logo into the page's resource collection. Thus the logo could easily be extracted into a separate XAML file (e.g. App.xaml or another file).</p><p class="Code">
  {% highlight javascript %}  <Page.Resources>{% endhighlight %}
  <br /> Here you can see the declaration of the two graphic objects ("software" and "architects"). Note that we use <strong>frozen</strong> Drawing objects.</p><p class="DecoratorRight">You should also take a look at how we combine multiple <span class="Highlighted">PathGeometry</span>-objects using <span class="Highlighted">GeometryGroup</span>. I will go into details concerning this class later.</p>{% highlight javascript %}    <!-- ****** SOFTWARE ******************************************* -->
    <!-- Geometry for the word "software" -->
    <GeometryGroup x:Key="LogoSoftware" 
      PresentationOptions:Freeze="True" >
      <PathGeometry Figures="M 0.31163807,145.75739 ... z" />
      <PathGeometry Figures="M 70.074606,115.57876 ... z" />
      <PathGeometry Figures="M 173.53291,0.40830421 ... z" />
      <PathGeometry Figures="M 307.03223,184.21003 ... z" />
      <PathGeometry Figures="M 391.22711,96.183574 ... z" />
      <PathGeometry Figures="M 426.25331,184.22683 ... z" />
      <PathGeometry Figures="M 501.63047,145.55673 ... z" />
    </GeometryGroup>

    <!-- ****** ARCHITECTS **************************************** -->
    <!-- Geometry for the word "architects" -->
    <GeometryGroup x:Key="LogoArchitects" 
      PresentationOptions:Freeze="True" >
      <PathGeometry Figures="M 391.29841,156.18357 ... z" />
      <PathGeometry Figures="M 426.35415,242.80498 ... z" />
      <PathGeometry Figures="M 590.3878,242.94013 ... z" />
      <PathGeometry Figures="M 625.36802,242.94013 ... z" />
      <PathGeometry Figures="M 682.10338,226.72431 ... z" />
      <PathGeometry Figures="M 735.83215,206.36345 ... z" />
      <PathGeometry Figures="M 502.24129,206.22951 ... z" />
      <PathGeometry Figures="M 805.67431,206.22951 ... z" />
      <PathGeometry Figures="M 869.59918,226.66181 ... z" />
      <PathGeometry Figures="M 873.62206,206.17249 ... z" />
    </GeometryGroup>{% endhighlight %}<p class="DecoratorRight">Here we define the gradient brushes used in the logo.</p>{% highlight javascript %}    <!-- ****** BRUSHES ******************************************* -->
    <!-- Brush for the word "software" -->
    <LinearGradientBrush x:Key="SoftwareBrush" StartPoint="0,1" 
      EndPoint="0,0" PresentationOptions:Freeze="True">
      <GradientStop Color="#76ba52" Offset="0.0" />
      <GradientStop Color="#c0dd89" Offset="1.0" />
    </LinearGradientBrush>

    <!-- Brush for the word "architects" -->
    <LinearGradientBrush x:Key="ArchitectsBrush" StartPoint="0,1" 
      EndPoint="0,0" PresentationOptions:Freeze="True">
      <GradientStop Color="#264da6" Offset="0.0" />
      <GradientStop Color="#15306c" Offset="1.0" />
    </LinearGradientBrush>{% endhighlight %}<p class="DecoratorRight">As we said before Drawing Objects needs a Framework Element helper to display them on the screen. In our case the class <span class="Highlighted">Image</span> is used for that. <span class="Highlighted">Image</span> needs a descendant of<span class="Highlighted">ImageSource</span> as the source of the image. For this reason we provide a <span class="Highlighted">DrawingImage</span>-object (<span class="Highlighted">DrawingImage</span> derives from<span class="Highlighted">ImageSource</span>) in the resource dictionary.</p>{% highlight javascript %}    <!-- ****** LOGO ********************************************** -->
    <DrawingImage x:Key="SoftwareArchitectsLogo" 
      PresentationOptions:Freeze="True" >
      <DrawingImage.Drawing>
        <DrawingGroup>
          <GeometryDrawing Brush="{StaticResource SoftwareBrush}" 
            Geometry="{StaticResource LogoSoftware}" />
          <GeometryDrawing Brush="{StaticResource ArchitectsBrush}" 
            Geometry="{StaticResource LogoArchitects}" />
        </DrawingGroup>
      </DrawingImage.Drawing>
    </DrawingImage>
  </Page.Resources>{% endhighlight %}<p class="DecoratorRight">Three lines of code are enough to display the logo in any WPF window or page. Everything else is defined in the resources.</p>{% highlight javascript %}  <Canvas>
    <Image Source="{StaticResource SoftwareArchitectsLogo}" />
  </Canvas>
</Page>{% endhighlight %}<p class="DecoratorRight">Here you can see the logo implemented with the code shown above in XAMLPad. XAMLPad is a small tool with which you can prototype your XAML code. It is included in the free <a href="http://msdn2.microsoft.com/en-us/windowsvista/aa904955.aspx" target="_blank">Windows SDK</a>.</p><p>
  <img height="262" alt="Logo In XAML Pad" width="449" src="{{site.baseurl}}/content/images/blog/2008/01/LogoInXamlPad.png" />
</p><h2 class="Head">
  <a id="CombiningGeometryObjects" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="CombiningGeometryObjects"></a>Combining Geometry Objects</h2><p>In WPF you have two possibilities to combine Geometries. You can either group them in a collection as shown in the code above. In this case you use the class <span class="Highlighted">GeometryGroup</span>. Be aware that <span class="Highlighted">GeometryGroup</span> is really just a collection and nothing more. If you want to build a completely new Geometry by combining two others (e.g. intersection, union, etc.) you have to use <span class="Highlighted">CombinedGeometry</span> instead.</p><p>In our case we use a combination of two Geometries to create the solid color bottom of the word "software". The goal is not to create separate paths for this area of the logo. Instead we want to build on the previously declared path and exclude the gray rectangle (see picture below) from it.</p><p>
  <img height="323" alt="CombinedGeometry Applied In The Logo" width="361" src="{{site.baseurl}}/content/images/blog/2008/01/LogoDarkBottom.png" class="   " />
</p>{% highlight javascript %}<Page.Resources>
[...]{% endhighlight %}<p class="DecoratorRight">Note how we reference the existing Geometry of the word "software" by using the<span class="Highlighted">StaticResource</span>-Markup Extension.</p>{% highlight javascript %}  <!-- Geometry for the dark area at the bottom of the letters 
       of the word "software" -->
  <CombinedGeometry x:Key="LogoSoftwareBottomShape" 
    GeometryCombineMode="Exclude" 
    Geometry1="{StaticResource LogoSoftware}" 
    PresentationOptions:Freeze="True">
    <CombinedGeometry.Geometry2>
      <RectangleGeometry Rect="0,0,519,145" />
    </CombinedGeometry.Geometry2>
  </CombinedGeometry>

  [...]

  <!-- Brush for the dark area at the bottom of the letters 
       of the word "software" -->
  <SolidColorBrush x:Key="SoftwareBottomShapeBrush" 
    Color="#76BA52" PresentationOptions:Freeze="True" />

  [...]

  <!-- ****** LOGO ********************************************** -->
  <DrawingImage x:Key="SoftwareArchitectsLogo" 
    PresentationOptions:Freeze="True" >
    <DrawingImage.Drawing>
      <DrawingGroup>
        <GeometryDrawing Brush="{StaticResource SoftwareBrush}"
          Geometry="{StaticResource LogoSoftware}" />
        <GeometryDrawing 
          Brush="{StaticResource SoftwareBottomShapeBrush}" 
          Geometry="{StaticResource LogoSoftwareBottomShape}" />
        <GeometryDrawing Brush="{StaticResource ArchitectsBrush}" 
          Geometry="{StaticResource LogoArchitects}" />
      </DrawingGroup>
    </DrawingImage.Drawing>
  </DrawingImage>

</Page.Resources>{% endhighlight %}<h2 class="Head">
  <a id="TransformationObjects" class="FCK__AnchorC FCK__AnchorC mceItemAnchor" name="TransformationObjects"></a>Transformation Objects</h2><p>The last piece that is missing to complete the logo is the reflection effect of the two words. The effect can be created by flipping them on the Y axis. For such cases WPF offers the class<span class="Highlighted">Transform</span>. The library contains various decendent classes of <span class="Highlighted">Transform</span> with which you can create different effects. The following figure gives an overview about what is there for your use:</p><p>
  <img height="175" alt="WPF Transform Classes" width="385" src="{{site.baseurl}}/content/images/blog/2008/01/Figure_7_39_WPF_und_XAML.png" class="        " />
</p><p>
  <span class="Highlighted">XAML und WPF Programmierhandbuch
<br /></span> Figure 7.39, Page 484</p><p>In our case we do not only use a <span class="Highlighted">Transform</span>-object. Additionally we use <a href="http://www.software-architects.com/TechnicalArticles/GraphicInWPF/tabid/74/Default.aspx#CombiningGeometryObjects" target="_blank">CombinedGeometry</a> to truncate the mirrored words. If we would not do that objects that follow the logo horizontally would show a strange distance from the logo.</p>{% highlight javascript %}<Page.Resources>
[...]

  <!-- Geometry for the mirror-effect of the word "software" -->
  <CombinedGeometry x:Key="LogoSoftwareMirror" 
    GeometryCombineMode="Exclude" 
    PresentationOptions:Freeze="True">
    <CombinedGeometry.Geometry1>
      <GeometryGroup>
        <PathGeometry Figures="M 0.31163807,145.75739 ... z" />
        <PathGeometry Figures="M 70.074606,115.57876 ... z" />
        <PathGeometry Figures="M 173.53291,0.40830421 ... z" />
        <PathGeometry Figures="M 307.03223,184.21003 ... z" />
        <PathGeometry Figures="M 391.22711,96.183574 ... z" />
        <PathGeometry Figures="M 426.25331,184.22683 ... z" />
        <PathGeometry Figures="M 501.63047,145.55673 ... z" />
      </GeometryGroup>
    </CombinedGeometry.Geometry1>
    <CombinedGeometry.Geometry2>
      <RectangleGeometry Rect="0,0,519,145" />
    </CombinedGeometry.Geometry2>{% endhighlight %}<p class="DecoratorRight">You can apply a transformation by assigning the appropriate decendent class of<span class="Highlighted">Transform</span> to the <span class="Highlighted">Transform</span>-property of the object you want to change.</p>{% highlight javascript %}    <CombinedGeometry.Transform>
      <TransformGroup>
        <ScaleTransform CenterY="184" ScaleY="-1" />
      </TransformGroup>
    </CombinedGeometry.Transform>
  </CombinedGeometry>
  [...]

  <!-- Geometry for the mirror-effect of the word "architects" -->
  <CombinedGeometry x:Key="LogoArchitectsMirror" 
    GeometryCombineMode="Exclude" 
    PresentationOptions:Freeze="True">
    <CombinedGeometry.Geometry1>
      <GeometryGroup PresentationOptions:Freeze="True" >
        <PathGeometry .../>
        [...]
      </GeometryGroup>
    </CombinedGeometry.Geometry1>
    <CombinedGeometry.Geometry2>
      <RectangleGeometry Rect="330,0,604,206" />
    </CombinedGeometry.Geometry2>
    <CombinedGeometry.Transform>
      <TransformGroup>
        <ScaleTransform CenterY="243" ScaleY="-1" />
      </TransformGroup>
    </CombinedGeometry.Transform>
  </CombinedGeometry>
  [...]

  <!-- Brush for the mirror-effect of the word "software" -->
  <LinearGradientBrush x:Key="SoftwareMirrorBrush" StartPoint="0,1" 
    EndPoint="0,0" PresentationOptions:Freeze="True">
    <GradientStop Color="#0076ba52" Offset="0.4" />
    <GradientStop Color="#60c0dd89" Offset="1.0" />
  </LinearGradientBrush>

  <!-- Brush for the mirror-effect of the word "architects" -->
  <LinearGradientBrush x:Key="ArchitectsMirrorBrush" StartPoint="0,1"
    EndPoint="0,0" PresentationOptions:Freeze="True">
    <GradientStop Color="#00264da6" Offset="0" />
    <GradientStop Color="#3015306c" Offset="1.0" />
  </LinearGradientBrush>
  [...]

  <!-- ****** LOGO ********************************************** -->
  <DrawingImage x:Key="SoftwareArchitectsLogo" 
    PresentationOptions:Freeze="True" >
    <DrawingImage.Drawing>
      <DrawingGroup>
          <GeometryDrawing Brush="{StaticResource SoftwareBrush}"
            Geometry="{StaticResource LogoSoftware}" />
          <GeometryDrawing Brush="{StaticResource SoftwareMirrorBrush}"
            Geometry="{StaticResource LogoSoftwareMirror}" />
          <GeometryDrawing 
            Brush="{StaticResource SoftwareBottomShapeBrush}" 
            Geometry="{StaticResource LogoSoftwareBottomShape}" />
          <GeometryDrawing Brush="{StaticResource ArchitectsBrush}" 
            Geometry="{StaticResource LogoArchitects}" />
          <GeometryDrawing Brush="{StaticResource ArchitectsMirrorBrush}" 
            Geometry="{StaticResource LogoArchitectsMirror}" />
      </DrawingGroup>
    </DrawingImage.Drawing>
  </DrawingImage>

</Page.Resources>{% endhighlight %}<p class="DecoratorRight">This is the finished logo with all effects in XAMLPad.<br /><br /> If you have .NET 3 installed you can also view the <a href="{{site.baseurl}}/content/images/blog/2008/01/Logo Software Architects.xaml" target="_blank">Logo in XAML format</a>.</p><p>
  <img height="279" alt="Finished Logo in XAMLPad" width="457" src="{{site.baseurl}}/content/images/blog/2008/01/FinishedLogoXAMLPad.png" class="   mceC1Focused mceC1Focused mceC1Focused" />
</p><h2 class="Head">
  <a id="DifferencesWPFSilverlight" name="DifferencesWPFSilverlight" class="mceItemAnchor"></a>Differences between WPF and Silverlight</h2><p>
  <a href="http://www.microsoft.com/silverlight" target="_blank">Silverlight</a> is Microsoft's answer to Adobe's <a href="http://www.adobe.com/products/flash/" target="_blank">Flash</a>. Just like WPF Silverlight uses XAML to specify an object tree that represents the user interface elements. If you know WPF's XAML it will not be difficult for you to start with Silverlight. Unfortunately Silverlight's XAML does not offer all the functionality you are used to in WPF.</p><p class="DecoratorRight">We are talking about Silverlight 1.0 (which is the version that currently is RTM) here.</p><p>I do not want to give a complete listing of all the differences because you can read that in every detail at Microsoft's <a href="http://msdn2.microsoft.com/en-us/silverlight/default.aspx" target="_blank">Silverlight Dev Center</a> in the MSDN Library. I just want to name the differences that affected us when implementing our logo for the use in Silverlight applications. In contrast to WPF's XAML Silverlight does <strong>not</strong>...</p><ul>
  <li>...have support for resources to the extent WPF has. Silverlight resources just hold<span class="Highlighted">Storyboard</span>-objects used for animation.</li>
  <li>...know about Freezables.</li>
  <li>...support the mini-language for path expressions in <span class="Highlighted">PathGeometry</span>. It is just supported in <span class="Highlighted">Path</span>.</li>
  <li>...know Markup Extensions like {StaticResource ...} or {Binding ...}. You have to implement the corresponding functionality yourself using JavaScript.</li>
</ul><p>Here is the source code of an implementation of a simplified version of the logo in Silverlight. You can see how similar the Silverlight version is to the WPF version.</p><p class="DecoratorRight">Note that there is no reference related to freezing Freezables in the Silverlight version. Silverlight does not know Freezables.</p>{% highlight javascript %}<Canvas
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" 
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" >

  <Path x:Name="SoftwarePath"
    Data="M 0.31163807,145.75739 ... z">
    <Path.Fill>
      <LinearGradientBrush StartPoint="0,1" EndPoint="0,0">
        <GradientStop Color="#76ba52" Offset="0.0" />
        <GradientStop Color="#c0dd89" Offset="1.0" />
      </LinearGradientBrush>
    </Path.Fill>
    <Path.RenderTransform>
      <TransformGroup>
        <ScaleTransform ScaleX="0.25" ScaleY="0.25" />
        <TranslateTransform x:Name="SoftwareTranslateAnimation" />
      </TransformGroup>
    </Path.RenderTransform>{% endhighlight %}<p class="DecoratorRight">For demonstration purposes we added a small animation here. We used <span class="Highlighted">DoubleAnimation</span>-objects to let the logo fly and fade in.</p>{% highlight javascript %}    <Path.Triggers>
      <EventTrigger RoutedEvent="Path.Loaded">
        <BeginStoryboard>
          <Storyboard>
            <DoubleAnimation
              Storyboard.TargetName="SoftwareTranslateAnimation"
              Storyboard.TargetProperty="Y"
              From="-50" To="0" Duration="0:0:0.5" />
            <DoubleAnimation
              Storyboard.TargetName="SoftwarePath"
              Storyboard.TargetProperty="Opacity"
              From="0" To="1" Duration="0:0:0.5" />
          </Storyboard>
        </BeginStoryboard>
      </EventTrigger>
    </Path.Triggers>
  </Path>

  <Path x:Name="ArchitectsPath"
    Data="M 391.29841,156.18357 ... z">
    <Path.Fill>
      <LinearGradientBrush StartPoint="0,1" EndPoint="0,0">
        <GradientStop Color="#264da6" Offset="0.0" />
        <GradientStop Color="#15306c" Offset="1.0" />
      </LinearGradientBrush>
    </Path.Fill>
    <Path.RenderTransform>
      <TransformGroup>
        <ScaleTransform ScaleX="0.25" ScaleY="0.25" />
        <TranslateTransform x:Name="ArchitectsTranslateAnimation" />
      </TransformGroup>
    </Path.RenderTransform>
    <Path.Triggers>
      <EventTrigger RoutedEvent="Path.Loaded">
        <BeginStoryboard>
          <Storyboard>
            <DoubleAnimation
              Storyboard.TargetName="ArchitectsTranslateAnimation"
              Storyboard.TargetProperty="Y"
              From="50" To="0" Duration="0:0:0.5" />
            <DoubleAnimation
              Storyboard.TargetName="ArchitectsPath"
              Storyboard.TargetProperty="Opacity"
              From="0" To="1" Duration="0:0:0.5" />
          </Storyboard>
        </BeginStoryboard>
      </EventTrigger>
    </Path.Triggers>
  </Path>
</Canvas>{% endhighlight %}<p class="DecoratorRight">Silverlight does not only work in IE. You can also view the Silverlight-version of the logo in Firefox or other Silverlight-enabled browsers.</p><h2 class="Head">Summary</h2><p>WPF and XAML are great tools to develop next generation Windows applications. In contrast to HTML you do not need to convert all images you want to use in your WPF application into bitmap images. Just let your design professionals deliver the images in a vector-based format and you will find it easy to convert it to XAML.</p>