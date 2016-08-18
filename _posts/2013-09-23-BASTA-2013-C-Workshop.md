---
layout: blog
title: BASTA 2013 -  C# Workshop
excerpt: Meine Vorträge auf der BASTA 2013 starten heute mit einem ganztägigen C# Workshop. In diesem Blogartikel stelle ich Unterlagen und Links, die ich dabei verwende, zur Verfügung
author: Rainer Stropek
date: 2013-09-23
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET,C#,MEF,Visual Studio,WPF]
ref: 
permalink: /devblog/2013/09/23/BASTA-2013-C-Workshop
---

<p>Meine Vorträge auf der <a href="http://www.basta.net" target="_blank">BASTA 2013</a> starten heute mit einem ganztägigen C# Workshop. In diesem Blogartikel stelle ich Unterlagen und Links, die ich dabei verwende, zur Verfügung.</p><h2>Slidedeck</h2><p>You can download the entire <a href="{{site.baseurl}}/content/images/blog/2013/09/BASTA 2013 - CSharp Workshop.pdf" target="_blank">slidedeck in PDF</a> format. At the end of the workshop I will also publish the slides in my Slideshare account for online viewing.</p><h2>NuGet Sample</h2><p>One of the topics we cover in the workshop is NuGet. If you want to follow my sample you can use the following code snippet (.nuspec file) so you do not have to type XML by hand:</p>{% highlight xml %}<?xml version="1.0" encoding="utf-16"?>
<package xmlns="http://schemas.microsoft.com/packaging/2012/06/nuspec.xsd">
    <metadata>
        <id>Basta.ToolLib</id>
        <version>1.0.0</version>
        <title>BASTA C# Workshop Tools Library</title>
        <authors>software architects gmbh</authors>
        <owners>software architects gmbh</owners>
        <requireLicenseAcceptance>false</requireLicenseAcceptance>
        <description>...</description>
        <releaseNotes></releaseNotes>
        <!--<dependencies>
            <group targetFramework=".NETFramework4.0">
                <dependency id="Dependency" version="[1.0.0]" />
            </group>
        </dependencies>-->
        <frameworkAssemblies>
            <frameworkAssembly assemblyName="System.ComponentModel.Composition" targetFramework="net40" />
        </frameworkAssemblies>
    </metadata>

    <files>
        <!-- net4 -->
        <file src="bin\Debug\ToolsLib.dll" target="lib\net4" />
        <file src="bin\Debug\ToolsLib.pdb" target="lib\net4" />

        <!-- include source code  for symbols -->
        <file src="*.cs" target="src\ToolsLib" />

        <file src="content\app.config.transform" target="content\" />
        <file src="content\Tool1.cs.pp" target="content\" />
    </files>
</package>{% endhighlight %}
<p>Here are the two (very simple) content files. The first one is <em>Tool1.cs.pp</em>, the second one <em>app.config.transform</em>:</p><p>

{% highlight c# %}
//------------------------------------------------------------------------------------------------------------
// <copyright file="Tool1.cs" company="software architects gmbh">
//     Copyright (c) software architects gmbh. All rights reserved.
// </copyright>
//------------------------------------------------------------------------------------------------------------

namespace $rootnamespace${body}#xA;{
    using ToolsLib;

    public class Tool1 : Tool
    {
        public override void DoSomething()
        {
        }
    }
}
{% endhighlight %}

  {% highlight xml %}<configuration>
    <appSettings>
        <add key="ToolPath" value="c:\temp" />
    </appSettings>
</configuration>{% endhighlight %}
</p><h2>MAF (Managed Addin Framework aka System.Addin)</h2><p>In the morning we will also speak about MEF vs. MAF. The example I use to demonstrate MAF is a modified and upgraded (to .NET 4.5) version of Microsoft's original <a href="http://clraddins.codeplex.com/wikipage?title=Samples&amp;referringTitle=Home" target="_blank">WPF Calculator</a> sample. If you want to play with my version of the sample, you can <a href="{{site.baseurl}}/content/images/blog/2013/09/WPF Calculator.zip" target="_blank">download it here</a>.</p><h2>Update 2013-09-24: Live-Coding Sample, Missing Answer</h2><p>In the afternoon I have built a <em>async/await</em> WPF application following the MVVM design principle. Some people asked me to publish the live coded sample. <a href="{{site.baseurl}}/content/images/blog/2013/09/AsyncAwaitFullClientUI.zip" target="_blank">Here it is</a>. If you don't want to download the whole sample and you just want to look at the async view model we have built, here is the C# code followed by the XAML view:</p>{% highlight c# %}using AsyncAwaitFullClientUI.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Windows.Input;

namespace AsyncAwaitFullClientUI
{
    public class MainWindowViewModel : INotifyPropertyChanged
    {
        private HeatSensors sensors = new HeatSensors();

        public MainWindowViewModel()
        {
            this.FindAllSensorsCommand = new DelegateCommand(
                async () =>
                {
                    this.IsLoading = true;
                    this.Sensors = null;
                    this.cts = new CancellationTokenSource();
                    try
                    {
                        this.Sensors = await this.sensors.FindSensorsAsync(
                            this.cts.Token,
                            new Progress<int>((p) => this.Progress = p));
                    }
                    catch (OperationCanceledException)
                    {
                    }

                    this.IsLoading = false;
                },
                () => !this.IsLoading);
            this.CancelCommand = new DelegateCommand(
                () => this.cts.Cancel(),
                () => this.IsLoading);

        }

        private CancellationTokenSource cts;

        public ICommand FindAllSensorsCommand { get; private set; }
        public ICommand CancelCommand { get; private set; }

        private bool isLoading;
        public bool IsLoading 
        {
            get { return this.isLoading; }
            private set
            {
                this.isLoading = value;
                ((DelegateCommand)this.FindAllSensorsCommand).RaiseCanExecuteChanged();
                ((DelegateCommand)this.CancelCommand).RaiseCanExecuteChanged();
            }
        }

        private int progress;
        public int Progress
        {
            get { return this.progress; }
            private set
            {
                this.progress = value;
                this.RaisePropertyChanged();
            }
        }

        private IEnumerable<HeatSensor> SensorsValue;
        public IEnumerable<HeatSensor> Sensors
        {
            get
            {
                return this.SensorsValue;
            }

            set
            {
                if (this.SensorsValue != value)
                {
                    this.SensorsValue = value;
                    this.RaisePropertyChanged();
                }
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        private void RaisePropertyChanged([CallerMemberName]string caller = null)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, new PropertyChangedEventArgs(caller));
            }
        }
    }
}{% endhighlight %}{% highlight xml %}<Window x:Class="AsyncAwaitFullClientUI.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="MainWindow" Height="350" Width="525">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="*" />
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto" /> <!-- Find sensors button -->
            <ColumnDefinition Width="Auto" /> <!-- Cancel button -->
            <ColumnDefinition Width="*" />    <!-- Progress bar -->
        </Grid.ColumnDefinitions>
        
        <Button Content="Find Sensors" Margin="5"
                Command="{Binding Path=FindAllSensorsCommand}"/>
        <Button Grid.Column="1" Content="Cancel" Margin="5"
                Command="{Binding Path=CancelCommand}" />
        <ProgressBar Grid.Column="2" Margin="5"
                     Minimum="0" Maximum="100" Value="{Binding Path=Progress}" />
        
        <DataGrid Grid.Row="1" Grid.ColumnSpan="3" Margin="5,0,5,5"
                  ItemsSource="{Binding Path=Sensors}"/>
    </Grid>
</Window>{% endhighlight %}<p>Finally I forgot to answer a question I was asked. Sorry for that. I promised during the workshop I would but time was running and so I didn't remember this todo. Someone asked me how to use <em>await</em> to wait for two tasks which run in parallel. The answer is <em>Task.WhenAll</em>. Here is a code snippet:</p>{% highlight c# %}using System;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            Run().Wait();
        }

        private static async Task Run()
        {
            var t1 = Task.Run(() => 42);
            var t2 = Task.Run(() => 41);
            await Task.WhenAll(t1, t2);

            var result3 = await Task.Run(() => 43);
            Console.WriteLine(t1.Result + t2.Result + result3);
        }
    }
}{% endhighlight %}