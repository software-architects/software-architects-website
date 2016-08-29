---
layout: blog
title: WPF Master Pages
excerpt: One of the really great enhancements in ASP.NET was the introduction of master pages. They help developers to create a consistent layout for the pages in an application. Unfortunately there is no such concept in WPF and XAML. In the following sample I would like to show a simple way to build a control in WPF similar to an ASP.NET master page.
author: Karin Huber
date: 2008-01-07
bannerimage: 
bannerimagesource: 
lang: en
tags: [WPF]
ref: 
permalink: /devblog/2008/01/07/WPF-Master-Pages
redirect_from:
- "/TechnicalArticles/WPFMasterPages/tabid/80/language/en-US/Default.aspx/index.html"
---

<p>One of the really great enhancements in ASP.NET was the introduction of master pages. They help developers to create a consistent layout for the pages in an application. Unfortunately there is no such concept in WPF and XAML. In the following sample I would like to show a simple way to build a control in WPF similar to an ASP.NET master page. <a href="{{site.baseurl}}/content/images/blog/2008/01/MasterPages.zip"><span>Download </span> sourcecode<span> - 143 KB...</span></a></p><ul>
  <li>Layout in WPF</li>
  <li>Building a Master Page</li>
  <li>Using the Master Page</li>
</ul><h2 class="Head">
  <a id="Layout" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Layout"></a>Layout in WPF</h2><p>My goal is to build a simple WPF Application with three pages. Each of the pages should consist of three areas:</p><ul>
  <li>a title,</li>
  <li>an abstract</li>
  <li>and the main content</li>
</ul><p class="DecoratorRight">The screenshot shows the first page of the applications. In this case all three areas contain some text. But as we will see later in the sample we are not limited to text.</p><p>
  <img height="350" width="500" src="{{site.baseurl}}/content/images/blog/2008/01/Page1.png" class="     mceC1Focused" />
</p><p>If I would build this page without using a master page I would start with a new blank page and then I would arrange different types of controls on this page. I used Stackpanels and a Grid to arrange the logo and the three types of content on the page.</p>{% highlight xml %}<Page x:Class="MasterPages.Page.PageWithoutMaster"
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  Title="PageWithoutMaster">
  <Page.Resources>
    <ResourceDictionary>
      <ResourceDictionary.MergedDictionaries>
        <ResourceDictionary Source="../Style/Logo.xaml" />
        <ResourceDictionary Source="../Style/Standard.xaml" />
      </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
  </Page.Resources>
  
  <StackPanel>
    <Grid Height="70">
      <Image Source="{StaticResource SoftwareArchitectsLogoBackground}"
        Stretch="Fill" />
      <Grid Margin="10">
        <Image Source="{StaticResource SoftwareArchitectsLogo}" 
          HorizontalAlignment="Left" />
      </Grid>
    </Grid>
    <StackPanel Margin="10">
      <TextBlock Style="{StaticResource Title}">
        About us
      </TextBlock>
      <TextBlock Style="{StaticResource Abstract}">
        software architects builds a ...
      </TextBlock>
      <TextBlock>
        In the long term software architects ...
      </TextBlock>
    </StackPanel>
  </StackPanel>
</Page>{% endhighlight %}<p>This works very well for one single page, but when adding new pages I have to care for including the general layout code consistently. And it really gets bad when I would like to change the layout after building lots of pages. To avoid this problem I would like to have something similar to ASP.NET Masterpages in my WPF projects.</p><h2 class="Head">
  <a id="BuildingAMasterPage" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="BuildingAMasterPage"></a>Building a Master Page</h2><p>The basis for my master page is a new custom control named <span class="InlineCode">Master</span> in my project. I added three dependency properties:</p><ul>
  <li>Title</li>
  <li>Abstract</li>
  <li>Content</li>
</ul><p>Each property represents one area in my master page.</p><p class="DecoratorRight">The datatype for the dependency properties is<span class="InlineCode">object</span>. This ensures that I cannot only add text but also controls to each area in the page.</p>{% highlight c# %}namespace MasterPages.Master
{
  public class Master : Control
  {
    static Master()
    {
      DefaultStyleKeyProperty.OverrideMetadata(typeof(Master), 
        new FrameworkPropertyMetadata(typeof(Master)));
    }

    public object Title
    {
      get { return (object)GetValue(TitleProperty); }
      set { SetValue(TitleProperty, value); }
    }

    public static readonly DependencyProperty TitleProperty =
      DependencyProperty.Register("Title", typeof(object), 
      typeof(Master), new UIPropertyMetadata());

    public object Abstract
    {
      get { return (object)GetValue(AbstractProperty); }
      set { SetValue(AbstractProperty, value); }
    }

    public static readonly DependencyProperty AbstractProperty =
      DependencyProperty.Register("Abstract", typeof(object), 
      typeof(Master), new UIPropertyMetadata());

    public object Content
    {
      get { return (object)GetValue(ContentProperty); }
      set { SetValue(ContentProperty, value); }
    }

    public static readonly DependencyProperty ContentProperty =
      DependencyProperty.Register("Content", typeof(object), 
      typeof(Master), new UIPropertyMetadata());
  }
}{% endhighlight %}<p>As you may know WPF does not add layout information into the class implementing a custom control like <span class="InlineCode">Master</span>. The content of the file <span class="InlineCode">generic.xaml</span> defines the look of the control. This file is automatically created by Visual Studio as soon as you add a custom control to your project.</p><p>In my case I defined a style for my new class <span class="InlineCode">Master</span> in generic.xaml. This is the place where the arrangement of the areas should happen. Just as in the single page before I used Stackpanels and Grids to arrange the logo and all the other parts of the page. The key to include the content of the dependency properties is the control <span class="InlineCode">ContentPresenter</span>. I inserted three of them and bound them to the three dependency properties of the <span class="InlineCode">Master</span>class.</p><p class="DecoratorRight">I added some <span class="InlineCode">ResourceDictionary</span>objects to the generic.xaml for my more complex styles like the logo, which is entirely built in XAML.</p>{% highlight xml %}<ResourceDictionary
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  xmlns:local="clr-namespace:MasterPages.Master">

  <ResourceDictionary.MergedDictionaries>
    <ResourceDictionary Source="Style/Logo.xaml" />
    <ResourceDictionary Source="Style/Master.xaml" />
  </ResourceDictionary.MergedDictionaries>

  <Style TargetType="{x:Type local:Master}">
    <Setter Property="Template">
      <Setter.Value>
        <ControlTemplate TargetType="{x:Type local:Master}">
          <StackPanel>
            <Grid Height="70">
              <Image 
                Source="{StaticResource SoftwareArchitectsLogoBackground}"
                Stretch="Fill" />
              <Grid Margin="10">
                <Image Source="{StaticResource SoftwareArchitectsLogo}" 
                  HorizontalAlignment="Left" />
              </Grid>
            </Grid>
            <StackPanel Margin="10">
              <ContentPresenter Content="{TemplateBinding Title}" 
                Style="{StaticResource Title}" />
              <ContentPresenter Content="{TemplateBinding Abstract}" 
                Style="{StaticResource Abstract}" />
              <ContentPresenter Content="{TemplateBinding Content}" />
            </StackPanel>
          </StackPanel>
        </ControlTemplate>
      </Setter.Value>
    </Setter>
  </Style>
</ResourceDictionary>{% endhighlight %}<p>Now our master page is ready to use. All we had to do was to</p><ul>
  <li>insert a new custom control,</li>
  <li>add a dependency property for each area of the page and</li>
  <li>define the layout of the control in the file generic.xaml.</li>
</ul><h2 class="Head">
  <a id="UsingTheMasterPage" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="UsingTheMasterPage"></a>Using the Master Page</h2><p>Finally we are able to build a new page based on the master page. Therefore we need a reference to to class <span class="InlineCode">Master </span> in our WPF file: <span class="InlineCode">xmlns:m="clr-namespace:MasterPages.Master"</span>. I chose the prefix m for my <span class="InlineCode">Master</span> class. With this prefix I can add a new instance of <span class="InlineCode">Master</span> to the page. Inside of &lt;m:Master&gt; I can set the<span class="InlineCode">Title</span>, the <span class="InlineCode">Abstract</span> and the <span class="InlineCode">Content</span> property of the class.</p><p class="DecoratorRight">In this case I only used text but as you can see in the next sample I am not limited to text.</p>{% highlight xml %}<Page x:Class="MasterPages.Page.Page1"
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  xmlns:m="clr-namespace:MasterPages.Master"
  Title="Page1">
  <m:Master>
    <m:Master.Title>
      About us
    </m:Master.Title>
    <m:Master.Abstract>
      software architects builds a new generation of ...
    </m:Master.Abstract>
    <m:Master.Content>
      In the long term software architects will offer ...
    </m:Master.Content>
  </m:Master>
</Page>{% endhighlight %}<p>To show the advange of a master page I added a second page to my project. Again I do not have to care about layout any more. I just add the <span class="InlineCode">Master</span> control to my page and set the properties of the control. But this time I add more advanved content to the control. The<span class="InlineCode">Content</span> property holds a <span class="InlineCode">StackPanel</span> with a <span class="InlineCode">ListBox</span>.</p>{% highlight xml %}<Page x:Class="MasterPages.Page.Page2"
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  xmlns:m="clr-namespace:MasterPages.Master"
  Title="Page2">
  <m:Master>
    <m:Master.Title>
      Page 2
    </m:Master.Title>
    <m:Master.Abstract>
      Page 2 contains a ListBox.
    </m:Master.Abstract>
    <m:Master.Content>
      <StackPanel>
        <ListBox>
          <ListBoxItem>Item 1</ListBoxItem>
          <ListBoxItem>Item 2</ListBoxItem>
          <ListBoxItem>Item 3</ListBoxItem>
        </ListBox>
      </StackPanel>
    </m:Master.Content>
  </m:Master>
</Page>{% endhighlight %}<p>As you can see in the following screenshot my second page looks similar to my first one. Instead of the text it shows a <span class="InlineCode">ListBox</span> with some items. </p><p>
  <img height="350" width="500" src="{{site.baseurl}}/content/images/blog/2008/01/Page2.png" />
</p><p>If you want to access controls of your page in the codebehind file you just have to add a name to the control. In the following sample I added a <span class="InlineCode">Button</span> to the <span class="InlineCode">Content</span> area of my page.</p>{% highlight xml %}<Page x:Class="MasterPages.Page.Page3" 
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" 
  
  Title="Page3"> 
  <m:Master> 
    <m:Master.Title> 
      Page 3 
    </m:Master.Title> 
    <m:Master.Abstract> 
      Page 3 contains a Button, which opens a MessageBox. 
    </m:Master.Abstract> 
    <m:Master.Content> 
      <StackPanel> 
        <Button Name="btnShowMessage" Content="Show MessageBox" /> 
      </StackPanel> 
    </m:Master.Content> 
  </m:Master> 
</Page>{% endhighlight %}<p>In the codebehind file of the page I added a click eventhandler to the button which shows a messagebox when it is clicked.</p>{% highlight c# %}... 

protected override void OnInitialized(EventArgs e) 
{ 
  base.OnInitialized(e); 
  btnShowMessage.Click += new RoutedEventHandler(BtnShowMessage_Click); 
} 

private void BtnShowMessage_Click(object sender, RoutedEventArgs e) 
{ 
  MessageBox.Show("You clicked the button."); 
} 

...{% endhighlight %}<p>Again I dot not have to care about the layout of the page. The logo, the background, the colors and everything else that makes up a page in my project is encapsulated in the <span class="InlineCode">Master</span>class. I just have to care about the things that are unique to my page like the button and its eventhandler.</p><p>
  <img height="350" width="500" src="{{site.baseurl}}/content/images/blog/2008/01/Page3.png" />
</p>