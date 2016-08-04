---
layout: blog
title: dotnet Cologne 2013 -  async/await
excerpt: This year at dotnet Cologne I have proposed a 60 minutes live-coding talk about async/await. It was really accepted and I even got the large ballroom. Wow, live coding in front more than 100 developers. This will be awesome. In this blog I post the sample that I am going to develop on stage.
author: Rainer Stropek
date: 2013-05-03
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET,C#,Visual Studio,WPF]
ref: 
permalink: /devblog/2013/05/03/dotnet-Cologne-2013-asyncawait
---

<p>This year at <a href="http://dotnet-cologne.de/" target="_blank">dotnet Cologne</a> I have proposed a 60 minutes live-coding talk about <em>async/await</em>. It was really accepted and I even got the large ballroom. Wow, live coding in front of a huge crowd of developers. This will be awesome. In this blog I post the sample that I am going to develop on stage (at least approximately; let's see if I have some ad hoc ideas on stage).</p><h2>The Starting Point</h2><p>We start from a very simple class simulating a sensor:</p>{% highlight c# %}using System;
using System.Net;
using System.Threading;

namespace AsyncAwaitDemo
{
    public class SyncHeatSensor
    {
        /// <summary>
        /// Flag indicating whether the sensor is connected.
        /// </summary>
        private bool isConnected = false;

        public void Connect(IPAddress address)
        {
            if (address == null)
            {
                throw new ArgumentNullException("address");
            }

            if (this.isConnected)
            {
                throw new InvalidOperationException("Already connected");
            }

            // Simulate connect
            Thread.Sleep(3000);

            this.isConnected = true;
        }

        public void UploadFirmware(byte[] firmware)
        {
            if (firmware == null)
            {
                throw new ArgumentNullException("firmeware");
            }

            if (!this.isConnected)
            {
                throw new InvalidOperationException("Not connected");
            }

            for (var i = 0; i < 10; i++)
            {
                // Simulate uploading of a chunk of data
                Thread.Sleep(200);
            }
        }

        public bool TryDisconnect()
        {
            if (!this.isConnected)
            {
                return false;
            }

            // Simulate disconnect
            Thread.Sleep(500);

            this.isConnected = false;
            return true;
        }
    }
}{% endhighlight %}<p>The user interface is very simple - just a button:</p>{% highlight xml %}<Window x:Class="AsyncAwaitDemo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="MainWindow" Height="350" Width="525">
    <Window.Resources>
        <Style TargetType="Button">
            <Setter Property="Margin" Value="3" />
        </Style>
    </Window.Resources>
    <StackPanel>
        <Button Command="{Binding Path=ConnectAndUpdateSync}">Connect to sensor and upload firmware</Button>
    </StackPanel>
</Window>{% endhighlight %}<p>Of course the UI logic is implemented in a ViewModel class:</p><p>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="using System.Windows;&#xA;&#xA;namespace AsyncAwaitDemo&#xA;{&#xA;    public partial class MainWindow : Window&#xA;    {&#xA;        public MainWindow()&#xA;        {&#xA;            InitializeComponent();&#xA;            this.DataContext = new MainWindowViewModel();&#xA;        }&#xA;    }&#xA;}" />
    <param name="CodeType" value="c#" />
  </function>
  {% highlight c# %}using System;
using System.ComponentModel;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Windows;
using System.Windows.Input;

namespace AsyncAwaitDemo
{
    public class MainWindowViewModel : INotifyPropertyChanged
    {
        private SyncHeatSensor syncSensor = new SyncHeatSensor();

        public MainWindowViewModel()
        {
            this.InternalConnectAndUpdateSync = new DelegateCommand(
                this.ConnectSync,
                () => true);
        }

        private void ConnectSync()
        {
            var address = Dns.GetHostAddresses("localhost");
            this.syncSensor.Connect(address.FirstOrDefault());
            this.syncSensor.UploadFirmware(new byte[] { 0, 1, 2 });
            this.syncSensor.TryDisconnect();
            MessageBox.Show("Successfully updated");
        }

        private DelegateCommand InternalConnectAndUpdateSync;
        public ICommand ConnectAndUpdateSync
        {
            get
            {
                return this.InternalConnectAndUpdateSync;
            }
        }

        public void RaisePropertyChanged([CallerMemberName]string propertyName = null)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
    }
}{% endhighlight %}
</p><p>The unit test for the synchronous version is also very basic. However, it will be enough to demonstrate the basic idea of async unit tests later.</p>{% highlight c# %}using AsyncAwaitDemo;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace AsyncUnitTest
{
    [TestClass]
    public class TestAsyncSensor
    {
        [TestMethod]
        public void TestConnectDisconnect()
        {
            var sensor = new SyncHeatSensor();
            sensor.Connect(Dns.GetHostAddresses("localhost").First());
            Assert.IsTrue(sensor.TryDisconnect());
        }
    }
}{% endhighlight %}<h2>Moving to an Async API</h2><p>Here is the async version of the sensor class using best-practices for async APIs:</p>{% highlight c# %}using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace AsyncAwaitDemo
{
    public class AsyncHeatSensor
    {
        private bool isConnected = false;
        private object workInProgressLockObject = new object();

        public Task ConnectAsync(IPAddress address)
        {
            // Note that parameters are checked before the task is scheduled.
            if (address == null)
            {
                throw new ArgumentNullException("address");
            }

            return Task.Run(() =>
                {
                    // Note that method calls are serialized using this lock statement.
                    // If you want to specify a lock timeout, use Monitor.TryEnter(...)
                    // instead of lock(...).
                    lock (this.workInProgressLockObject)
                    {
                        if (this.isConnected)
                        {
                            throw new InvalidOperationException("Already connected");
                        }

                        // Simulate connect
                        Thread.Sleep(3000);

                        this.isConnected = true;
                    }
                });
        }

        public Task UploadFirmwareAsync(byte[] firmware, CancellationToken ct, IProgress<int> progress)
        {
            if (firmware == null)
            {
                throw new ArgumentNullException("firmeware");
            }

            return Task.Run(() =>
                {
                    lock (this.workInProgressLockObject)
                    {
                        if (!this.isConnected)
                        {
                            throw new InvalidOperationException("Not connected");
                        }

                        // Simulate upload in chunks.
                        for (var i = 1; i <= 10; i++)
                        {
                            // Note that we throw an exception if cancellation has been requested.
                            ct.ThrowIfCancellationRequested();

                            // Simulate uploading of a chunk of data
                            Thread.Sleep(200);

                            // Report progress
                            progress.Report(i * 10);
                        }
                    }
                }, ct);
        }

        public Task<bool> TryDisconnectAsync()
        {
            return Task.Run(() =>
            {
                lock (this.workInProgressLockObject)
                {
                    if (!this.isConnected)
                    {
                        return false;
                    }

                    // Simulate disconnect
                    Thread.Sleep(500);

                    this.isConnected = false;
                    return true;
                }
            });
        }
    }
}{% endhighlight %}<p>In the ViewModel we can use async/await to make the code more readable:</p>{% highlight c# %}using System;
using System.ComponentModel;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Windows;
using System.Windows.Input;

namespace AsyncAwaitDemo
{
    public class MainWindowViewModel : INotifyPropertyChanged
    {
        private SyncHeatSensor syncSensor = new SyncHeatSensor();
        private AsyncHeatSensor asyncSensor = new AsyncHeatSensor();

        private Action<string> stateNavigator;
        private CancellationTokenSource cts;

        public MainWindowViewModel(Action<string> stateNavigator)
        {
            this.stateNavigator = stateNavigator;

            this.InternalConnectAndUpdateSync = new DelegateCommand(
                this.ConnectSync,
                () => !this.IsUpdating);

            this.InternalConnectAndUpdateAsync = new DelegateCommand(
                this.ConnectAsync,
                () => !this.IsUpdating);
            this.InternalCancelConnectAndUpdateAsync = new DelegateCommand(
                () => { if (this.cts != null) this.cts.Cancel(); },
                () => this.IsUpdating);
        }

        private void ConnectSync()
        {
            var address = Dns.GetHostAddresses("localhost");
            this.syncSensor.Connect(address.FirstOrDefault());
            this.syncSensor.UploadFirmware(new byte[] { 0, 1, 2 });
            this.syncSensor.TryDisconnect();
            MessageBox.Show("Successfully updated");
        }

        private async void ConnectAsync()
        {
            this.IsUpdating = true;
            this.cts = new CancellationTokenSource();
            this.stateNavigator("Updating");
            var ip = await Dns.GetHostAddressesAsync("localhost");
            await this.asyncSensor.ConnectAsync(ip.FirstOrDefault());
            var success = false;
            try
            {
                await this.asyncSensor.UploadFirmwareAsync(
                    new byte[] { 0, 1, 2 }, 
                    this.cts.Token, 
                    new Progress<int>(p => this.Progress = p));
                success = true;
            }
            catch (OperationCanceledException)
            {
            }

            await this.asyncSensor.TryDisconnectAsync();
            this.stateNavigator(success ? "Updated" : "Cancelled");
            this.IsUpdating = false;
            if (success)
            {
                MessageBox.Show("Successfully updated");
            }
        }

        private DelegateCommand InternalConnectAndUpdateSync;
        public ICommand ConnectAndUpdateSync
        {
            get
            {
                return this.InternalConnectAndUpdateSync;
            }
        }

        private DelegateCommand InternalConnectAndUpdateAsync;
        public ICommand ConnectAndUpdateAsync
        {
            get
            {
                return this.InternalConnectAndUpdateAsync;
            }
        }

        private DelegateCommand InternalCancelConnectAndUpdateAsync;
        public ICommand CancelConnectAndUpdateAsync
        {
            get
            {
                return this.InternalCancelConnectAndUpdateAsync;
            }
        }

        private bool IsUpdatingValue;
        public bool IsUpdating
        {
            get
            {
                return this.IsUpdatingValue;
            }

            set
            {
                if (this.IsUpdatingValue != value)
                {
                    this.IsUpdatingValue = value;
                    this.RaisePropertyChanged();
                    this.InternalConnectAndUpdateAsync.RaiseCanExecuteChanged();
                    this.InternalCancelConnectAndUpdateAsync.RaiseCanExecuteChanged();
                }
            }
        }

        private int ProgressValue;
        public int Progress
        {
            get
            {
                return this.ProgressValue;
            }

            set
            {
                if (this.ProgressValue != value)
                {
                    this.ProgressValue = value;
                    this.RaisePropertyChanged();
                }
            }
        }

        public void RaisePropertyChanged([CallerMemberName]string propertyName = null)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
    }
}{% endhighlight %}<p>In the UI I use visual states:</p><p>
  <function name="Composite.Web.Html.SyntaxHighlighter">
    <param name="SourceCode" value="&lt;Window x:Class=&quot;AsyncAwaitDemo.MainWindow&quot;&#xA;        xmlns=&quot;http://schemas.microsoft.com/winfx/2006/xaml/presentation&quot;&#xA;        xmlns:x=&quot;http://schemas.microsoft.com/winfx/2006/xaml&quot;&#xA;        Title=&quot;MainWindow&quot; Height=&quot;350&quot; Width=&quot;525&quot;&gt;&#xA;    &lt;VisualStateManager.VisualStateGroups&gt;&#xA;        &lt;VisualStateGroup Name=&quot;ConnectingStates&quot;&gt;&#xA;            &lt;VisualState Name=&quot;Initial&quot;&gt;&#xA;            &lt;/VisualState&gt;&#xA;            &lt;VisualState Name=&quot;Updating&quot;&gt;&#xA;                &lt;Storyboard&gt;&#xA;                    &lt;ColorAnimationUsingKeyFrames Storyboard.TargetName=&quot;Indicator&quot;&#xA;                                                  Storyboard.TargetProperty=&quot;Color&quot;&#xA;                                                  RepeatBehavior=&quot;Forever&quot; &gt;&#xA;                        &lt;DiscreteColorKeyFrame Value=&quot;Green&quot; KeyTime=&quot;00:00:00.5&quot; /&gt;&#xA;                        &lt;DiscreteColorKeyFrame Value=&quot;Red&quot; KeyTime=&quot;00:00:01.0&quot; /&gt;&#xA;                    &lt;/ColorAnimationUsingKeyFrames&gt;&#xA;                    &lt;ObjectAnimationUsingKeyFrames Storyboard.TargetName=&quot;CancelButton&quot;&#xA;                                                   Storyboard.TargetProperty=&quot;Visibility&quot;&gt;&#xA;                        &lt;DiscreteObjectKeyFrame Value=&quot;{x:Static Visibility.Visible}&quot; KeyTime=&quot;00:00:00&quot; /&gt;&#xA;                    &lt;/ObjectAnimationUsingKeyFrames&gt;&#xA;                &lt;/Storyboard&gt;&#xA;            &lt;/VisualState&gt;&#xA;            &lt;VisualState Name=&quot;Cancelled&quot;&gt;&#xA;                &lt;Storyboard&gt;&#xA;                    &lt;ColorAnimation Storyboard.TargetName=&quot;Indicator&quot;&#xA;                                    Storyboard.TargetProperty=&quot;Color&quot;&#xA;                                    To=&quot;Red&quot;&#xA;                                    Duration=&quot;0&quot; /&gt;&#xA;                &lt;/Storyboard&gt;&#xA;            &lt;/VisualState&gt;&#xA;            &lt;VisualState Name=&quot;Updated&quot;&gt;&#xA;                &lt;Storyboard&gt;&#xA;                    &lt;ColorAnimation Storyboard.TargetName=&quot;Indicator&quot;&#xA;                                    Storyboard.TargetProperty=&quot;Color&quot;&#xA;                                    To=&quot;Green&quot;&#xA;                                    Duration=&quot;0&quot; /&gt;&#xA;                &lt;/Storyboard&gt;&#xA;            &lt;/VisualState&gt;&#xA;        &lt;/VisualStateGroup&gt;&#xA;    &lt;/VisualStateManager.VisualStateGroups&gt;&#xA;    &lt;Window.Resources&gt;&#xA;        &lt;Style TargetType=&quot;Button&quot;&gt;&#xA;            &lt;Setter Property=&quot;Margin&quot; Value=&quot;3&quot; /&gt;&#xA;        &lt;/Style&gt;&#xA;    &lt;/Window.Resources&gt;&#xA;    &lt;StackPanel&gt;&#xA;        &lt;Button Command=&quot;{Binding Path=ConnectAndUpdateSync}&quot;&gt;Connect to sensor and upload firmware&lt;/Button&gt;&#xA;&#xA;        &lt;Grid Margin=&quot;0, 20, 0, 0&quot;&gt;&#xA;            &lt;Grid.RowDefinitions&gt;&#xA;                &lt;RowDefinition Height=&quot;Auto&quot; /&gt;&#xA;                &lt;RowDefinition Height=&quot;Auto&quot; /&gt;&#xA;            &lt;/Grid.RowDefinitions&gt;&#xA;            &lt;Grid.ColumnDefinitions&gt;&#xA;                &lt;ColumnDefinition Width=&quot;Auto&quot; /&gt;&#xA;                &lt;ColumnDefinition Width=&quot;*&quot; /&gt;&#xA;            &lt;/Grid.ColumnDefinitions&gt;&#xA;            &lt;Ellipse Name=&quot;ConnectionIndicator&quot; Width=&quot;50&quot; Height=&quot;50&quot;&gt;&#xA;                &lt;Ellipse.Fill&gt;&#xA;                    &lt;SolidColorBrush Color=&quot;Gray&quot; x:Name=&quot;Indicator&quot; /&gt;&#xA;                &lt;/Ellipse.Fill&gt;&#xA;            &lt;/Ellipse&gt;&#xA;            &lt;ProgressBar Minimum=&quot;0&quot; Maximum=&quot;100&quot; Value=&quot;{Binding Path=Progress}&quot; &#xA;                         MinHeight=&quot;20&quot; MinWidth=&quot;200&quot; Grid.Row=&quot;1&quot; Margin=&quot;3&quot; /&gt;&#xA;            &lt;Button Command=&quot;{Binding Path=ConnectAndUpdateAsync}&quot; Grid.Column=&quot;1&quot;&gt;Connect and Update&lt;/Button&gt;&#xA;            &lt;Button Name=&quot;CancelButton&quot; Command=&quot;{Binding Path=CancelConnectAndUpdateAsync}&quot; Grid.Column=&quot;1&quot; Grid.Row=&quot;1&quot;&#xA;                    Visibility=&quot;Hidden&quot;&gt;Cancel&lt;/Button&gt;&#xA;        &lt;/Grid&gt;&#xA;    &lt;/StackPanel&gt;&#xA;&lt;/Window&gt;" />
    <param name="CodeType" value="xml" />
  </function>
  {% highlight c# %}using System.Windows;

namespace AsyncAwaitDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            this.DataContext = new MainWindowViewModel(
                targetState => VisualStateManager.GoToElementState(App.Current.MainWindow, targetState, false));
        }
    }
}{% endhighlight %}
</p><p>Visual Studio 2012 allows you to also use async/await in unit tests. Note how the unit test functions returns a <em>Task</em>.</p>{% highlight c# %}using AsyncAwaitDemo;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace AsyncUnitTest
{
    [TestClass]
    public class TestAsyncSensor
    {
        [TestMethod]
        public void TestConnectDisconnect()
        {
            var sensor = new SyncHeatSensor();
            sensor.Connect(Dns.GetHostAddresses("localhost").First());
            Assert.IsTrue(sensor.TryDisconnect());
        }

        [TestMethod]
        public async Task TestConnectDisconnectAsync()
        {
            var sensor = new AsyncHeatSensor();
            await sensor.ConnectAsync((await Dns.GetHostAddressesAsync("localhost")).First());
            Assert.IsTrue(await sensor.TryDisconnectAsync());
        }
    }
}{% endhighlight %}