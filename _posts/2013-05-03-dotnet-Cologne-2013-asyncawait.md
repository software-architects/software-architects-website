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
redirect_from:
- "/devblog/team/rainer-stropek/2013/05/03/dotnet-Cologne-2013-asyncawait"
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
}{% endhighlight %}
<p>The user interface is very simple - just a button:</p>{% highlight xml %}<Window x:Class="AsyncAwaitDemo.MainWindow"
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
  
  {% highlight c# %}using System.Windows;

namespace AsyncAwaitDemo
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            this.DataContext = new MainWindowViewModel();
        }
    }
}
{% endhighlight %}

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
}{% endhighlight %}
<p>In the UI I use visual states:</p><p>
 
  {% highlight xml %}<Window x:Class="AsyncAwaitDemo.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="MainWindow" Height="350" Width="525">
    <VisualStateManager.VisualStateGroups>
        <VisualStateGroup Name="ConnectingStates">
            <VisualState Name="Initial">
            </VisualState>
            <VisualState Name="Updating">
                <Storyboard>
                    <ColorAnimationUsingKeyFrames Storyboard.TargetName="Indicator"
                                                  Storyboard.TargetProperty="Color"
                                                  RepeatBehavior="Forever" >
                        <DiscreteColorKeyFrame Value="Green" KeyTime="00:00:00.5" />
                        <DiscreteColorKeyFrame Value="Red" KeyTime="00:00:01.0" />
                    </ColorAnimationUsingKeyFrames>
                    <ObjectAnimationUsingKeyFrames Storyboard.TargetName="CancelButton"
                                                   Storyboard.TargetProperty="Visibility">
                        <DiscreteObjectKeyFrame Value="{x:Static Visibility.Visible}" KeyTime="00:00:00" />
                    </ObjectAnimationUsingKeyFrames>
                </Storyboard>
            </VisualState>
            <VisualState Name="Cancelled">
                <Storyboard>
                    <ColorAnimation Storyboard.TargetName="Indicator"
                                    Storyboard.TargetProperty="Color"
                                    To="Red"
                                    Duration="0" />
                </Storyboard>
            </VisualState>
            <VisualState Name="Updated">
                <Storyboard>
                    <ColorAnimation Storyboard.TargetName="Indicator"
                                    Storyboard.TargetProperty="Color"
                                    To="Green"
                                    Duration="0" />
                </Storyboard>
            </VisualState>
        </VisualStateGroup>
    </VisualStateManager.VisualStateGroups>
    <Window.Resources>
        <Style TargetType="Button">
            <Setter Property="Margin" Value="3" />
        </Style>
    </Window.Resources>
    <StackPanel>
        <Button Command="{Binding Path=ConnectAndUpdateSync}">Connect to sensor and upload firmware</Button>

        <Grid Margin="0, 20, 0, 0">
            <Grid.RowDefinitions>
                <RowDefinition Height="Auto" />
                <RowDefinition Height="Auto" />
            </Grid.RowDefinitions>
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto" />
                <ColumnDefinition Width="*" />
            </Grid.ColumnDefinitions>
            <Ellipse Name="ConnectionIndicator" Width="50" Height="50">
                <Ellipse.Fill>
                    <SolidColorBrush Color="Gray" x:Name="Indicator" />
                </Ellipse.Fill>
            </Ellipse>
            <ProgressBar Minimum="0" Maximum="100" Value="{Binding Path=Progress}" 
                         MinHeight="20" MinWidth="200" Grid.Row="1" Margin="3" />
            <Button Command="{Binding Path=ConnectAndUpdateAsync}" Grid.Column="1">Connect and Update</Button>
            <Button Name="CancelButton" Command="{Binding Path=CancelConnectAndUpdateAsync}" Grid.Column="1" Grid.Row="1"
                    Visibility="Hidden">Cancel</Button>
        </Grid>
    </StackPanel>
</Window>{% endhighlight %}
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