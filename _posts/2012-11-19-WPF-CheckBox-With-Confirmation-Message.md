---
layout: blog
title: WPF CheckBox With Confirmation Message
excerpt: During BASTA Austria I have been asked a WPF question. How can I implement a confirmation question that is asked whenever a user checks a CheckBox?
author: Rainer Stropek
date: 2012-11-19
bannerimage: 
lang: en
tags: [.NET,C#,WPF]
permalink: /devblog/2012/11/19/WPF-CheckBox-With-Confirmation-Message
---

<p>During <a href="http://www.basta-austria.at" title="Homepage of BASTA Austria" target="_blank">BASTA Austria</a> I have been asked a WPF question. How can I implement a confirmation question that is asked whenever a user checks a CheckBox? Imagine the following dialog:</p><p> <img src="{{site.baseurl}}/content/images/blog/2012/11/CheckboxConfirmation.png" alt="CheckBox Confirmation Sample Dialog" /></p><p>Our goal is to display an "Are you sure?" message if the user checks "Delete everything!" or hits the "Delete Everything (in Code)" button. There should not be a message box if the user unchecks the "Delete everything!" check box.</p><h2>XAML Source (Without Confirmation Message)</h2><p>Here you see the XAML source with which we start:</p>{% highlight xml %}<Window x:Class="WpfApplication1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:i="http://schemas.microsoft.com/expression/2010/interactivity"  
        xmlns:local="clr-namespace:WpfApplication1"
        Title="MainWindow" Height="350" Width="525">
    <StackPanel>
        <CheckBox Content="Delete everything!" Name="DeleteEverythingCheckbox" IsChecked="{Binding Path=CheckboxChecked}"
                  Margin="5">
        </CheckBox>
        <Button Command="{Binding Path=SetDeleteEverythingCommand}" Margin="5">Delete Everything (in Code)</Button>
        
        <TextBox IsEnabled="{Binding ElementName=DeleteEverythingCheckbox, Path=IsChecked}" Text="Here is some text to edit"
                 Margin="5"/>
    </StackPanel>
</Window>
{% endhighlight %}<p>The code behind file just connects to the view model:</p>{% highlight c# %}using System.Windows;

namespace WpfApplication1
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
{% endhighlight %}<p>And finally here is the view model (I use Prism's <em>NotificationObject</em> class as the base class to get an implementation of <em>INotifyPropertyChanged</em>):</p>{% highlight c# %}using Microsoft.Practices.Prism.Commands;
using Microsoft.Practices.Prism.ViewModel;
using System.Windows.Input;

namespace WpfApplication1
{
    public class MainWindowViewModel : NotificationObject
    {
        public MainWindowViewModel()
        {
            this.SetDeleteEverythingCommand = new DelegateCommand(() =>
                {
                    this.CheckboxChecked = true;
                },
                () => !this.CheckboxChecked);
        }

        private bool CheckboxCheckedValue = default(bool);
        public bool CheckboxChecked
        {
            get { return this.CheckboxCheckedValue; }
            set
            {
                if (this.CheckboxCheckedValue != value)
                {
                    this.CheckboxCheckedValue = value;
                    this.RaisePropertyChanged(() => this.CheckboxChecked);
                }
            }
        }
       
        public ICommand SetDeleteEverythingCommand { get; private set; }
    }
}
{% endhighlight %}<h2>Add a <em>TriggerAction</em> for Showing Confirmation Message</h2><p>
  <em>System.Windows.Interactivity</em> defines a class <em>TriggerAction&lt;T&gt;</em> which we can use to provide a mechanism for adding the confirmation message in XAML. The code is quite simple:</p>{% highlight c# %}using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Interactivity;

namespace WpfApplication1
{
    public class ConfirmInvokeCommandAction : TriggerAction<DependencyObject>
    {
        public static readonly DependencyProperty MessageProperty =
            DependencyProperty.Register("Message", typeof(string), typeof(ConfirmInvokeCommandAction), new PropertyMetadata("Are you sure?"));

        public string Message
        {
            get { return (string)GetValue(MessageProperty); }
            set { SetValue(MessageProperty, value); }
        }

        protected override void Invoke(object parameter)
        {
            var checkBox = this.AssociatedObject as CheckBox;
            if (checkBox != null)
            {
                if (MessageBox.Show(this.Message, "Alert", MessageBoxButton.YesNo) == MessageBoxResult.No)
                {
                    checkBox.IsChecked = false;
                }
            }
        }
    }
}
{% endhighlight %}<p>We use an event trigger (mechanism defined in the Expression SDK) to access our <em>TriggerAction</em> in XAML:</p>{% highlight xml %}<Window x:Class="WpfApplication1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:i="http://schemas.microsoft.com/expression/2010/interactivity"  
        xmlns:local="clr-namespace:WpfApplication1"
        Title="MainWindow" Height="350" Width="525">
    <StackPanel>
        <CheckBox Content="Delete everything!" Name="DeleteEverythingCheckbox" IsChecked="{Binding Path=CheckboxChecked}"
                  Margin="5">
            <i:Interaction.Triggers>
                <i:EventTrigger EventName="Checked">
                    <local:ConfirmInvokeCommandAction Message="Are you sure?" />
                </i:EventTrigger>
            </i:Interaction.Triggers>
        </CheckBox>
        <Button Command="{Binding Path=SetDeleteEverythingCommand}" Margin="5">Delete Everything (in Code)</Button>
        
        <TextBox IsEnabled="{Binding ElementName=DeleteEverythingCheckbox, Path=IsChecked}" Text="Here is some text to edit"
                 Margin="5"/>
    </StackPanel>
</Window>
{% endhighlight %}<h2>Result</h2><p>This does the trick:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2012/11/CheckBoxWithConfirmMessage.png" />
</p><p>If you want to try the solution, <a href="{{site.baseurl}}/content/Blog Assets/Code Samples/CheckBoxConfirmationSource.zip" target="_blank">download the source code</a>.</p>