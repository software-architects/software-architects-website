---
layout: blog
title: app.config in IronPython without additional assemblies
excerpt: Third-party .net assemblies can be easily used from IronPython. If the external assembly relies on a companion .exe.config/app.config file, a config for ipy.exe or an IInternalConfigSystem-implementation is required.
author: Simon Opelt
date: 2012-10-29
bannerimage: 
bannerimagesource: 
lang: en
tags: [Iron Python]
ref: 
permalink: /devblog/2012/10/29/appconfig-in-IronPython-without-additional-assemblies
---

<h2>Problem and Motivation</h2><p>One of the most important features of <a href="http://ironpython.net/" title="IronPython" target="_blank">IronPython</a> is its interoperability with existing <a href="http://www.microsoft.com/net" title=".net" target="_blank">.net</a> assemblies. They can be easily referenced, imported and used like in the following sample:</p>{% highlight python %}import clr
clr.AddReference("SomeLibrary")
from SomeLibrary import Helper

someValue = Helper.GetSomeValueUsingConfig()
print someValue{% endhighlight %}<p>In this sample I add a reference to a CLR-library called <em>SomeLibrary</em>, import one of its classes called <em>Helper</em>, call a static member named <em>GetSomeValueUsingConfig</em> and <em>print</em> its result using python. The implementation of the Helper class is very simple and just creates some string values which use the <a href="http://msdn.microsoft.com/library/system.configuration.configurationmanager.aspx" title="ConfigurationManager" target="_blank">ConfigurationManager</a> to access the <a href="http://msdn.microsoft.com/library/1xtk877y.aspx" title="application configuration file" target="_blank">application configuration file</a> and the contained <a href="http://msdn.microsoft.com/library/system.configuration.appsettingssection.aspx" title="AppSettings" target="_blank">AppSettings</a>.</p>{% highlight c# %}namespace SomeLibrary
{
    using System.Configuration;

    /// <summary>
    /// Example helper class.
    /// </summary>
    public static class Helper
    {
        /// <summary>
        /// Gets a string which contains some data from appSettings.
        /// </summary>
        /// <returns>Some string including config data.</returns>
        public static string GetSomeValueUsingConfig()
        {
            var someSetting = ConfigurationManager.AppSettings["SomeSetting"];
            return string.Format("The config contains: {0}", someSetting);
        }
    }
}{% endhighlight %}<p>The App.config contains the following xml data:</p>{% highlight xml %}<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <appSettings>
        <add key="SomeSetting" value="this is config data" />
    </appSettings>
</configuration>{% endhighlight %}<p>During building or deploying of a .net application the <em>App.config</em> file is typically copied to the location of the resulting library (e.g. <em>SomeLibrary.dll</em>) or executable (e.g. <em>SomeApp.exe</em>) and has to conform to a strict naming convention to be discovered by the runtime (e.g. <em>SomeApp.exe.config</em>). In case of a IronPython script the .net runtime is looking for a config-file called like the process executable (e.g. <em>ipy64.exe</em>) which would have to be called <em>ipy64.exe.config</em> and reside in the IronPython installation directory. This is not very useful and maintainable when trying to run different scripts. If the referenced DLL is developed in-house the configuration mechanism could be adapted to allow for alternative/external configuration mechanisms but in many cases third-party assemblies are as-is and can't be changed.</p><p>If the example python script is executed the Helper class won't be able to find the required app settings and the result looks like:</p>{% highlight text %}The config contains:{% endhighlight %}<h2>Previous Solutions</h2><p>An <a href="http://stackoverflow.com/a/8785980/468244" title="answer on Stack Overflow" target="_blank">answer on Stack Overflow</a> and the <a href="http://technomosh.blogspot.co.at/2012/01/using-appconfig-in-ironpython.html" title="related blog post" target="_blank">related blog post</a> (which is based on <a href="http://tomestephens.com/2011/02/making-ironpython-work-overriding-the-configurationmanager" title="another blog post" target="_blank">another blog post</a>) pointed me in the right direction by explaining how to implement <a href="http://msdn.microsoft.com/library/system.configuration.internal.iinternalconfigsystem.aspx" title="IInternalConfigSystem" target="_blank">IInternalConfigSystem</a> in order to redirect all configuration requests to an arbitrary file (which can reside at a more convenient location like next to our IronPython script).</p><p>These solutions require to reference an additional .net assembly containing a class implementing IInternalConfigurationSystem. In my situation I wanted to avoid having to add another assembly due to some deployment constraints. Therefore a pure IronPython solution was the best approach.</p><h2>Implementing IInternalConfigurationSystem in IronPython</h2><p>The following snippet shows how to implement a configuration proxy in IronPython (based on the previous solutions):</p>{% highlight python %}import clr
clr.AddReference("System.Configuration")
from System.Configuration.Internal import IInternalConfigSystem
class ConfigurationProxy(IInternalConfigSystem):
    def __init__(self, fileName):
        from System import String
        from System.Collections.Generic import Dictionary
        from System.Configuration import IConfigurationSectionHandler, ConfigurationErrorsException
        self.__customSections = Dictionary[String, IConfigurationSectionHandler]()
        loaded = self.Load(fileName)
        if not loaded:
            raise ConfigurationErrorsException(String.Format("File: {0} could not be found or was not a valid cofiguration file.", fileName))

    def Load(self, fileName):
        from System.Configuration import ExeConfigurationFileMap, ConfigurationManager, ConfigurationUserLevel
        exeMap = ExeConfigurationFileMap()
        exeMap.ExeConfigFilename = fileName
        self.__config = ConfigurationManager.OpenMappedExeConfiguration(exeMap, ConfigurationUserLevel.None);
        return self.__config.HasFile;
    
    def GetSection(self, configKey):
        if configKey == "appSettings":
            return self.__BuildAppSettings()
        return self.__config.GetSection(configKey);
    
    def __BuildAppSettings(self):
        from System.Collections.Specialized import NameValueCollection
        coll = NameValueCollection()
        for key in self.__config.AppSettings.Settings.AllKeys:
            coll.Add(key, self.__config.AppSettings.Settings[key].Value);
        return coll

    def RefreshConfig(self, sectionName):
        self.Load(self.__config.FilePath)
        
    def SupportsUserConfig(self):
        return False
    
    def InjectToConfigurationManager(self):
        from System.Reflection import BindingFlags
        from System.Configuration import ConfigurationManager
        configSystem = clr.GetClrType(ConfigurationManager).GetField("s_configSystem", BindingFlags.Static | BindingFlags.NonPublic)
        configSystem.SetValue(None, self);{% endhighlight %}<p>When added to our initial IronPython script the <em>ConfigurationProxy</em> class can be used to redirect all configuration requests to a file called <em>my.config</em> located next to the IronPython script.</p>{% highlight python %}proxy = ConfigurationProxy("my.config")
proxy.InjectToConfigurationManager()

someValue = Helper.GetSomeValueUsingConfig()
print someValue{% endhighlight %}<p>This will result in the correct output:</p>{% highlight text %}The config contains: this is config data{% endhighlight %}<p>
  <a href="{{site.baseurl}}/content/images/blog/2012/10/UseLibraryWithAppConfig.1.zip" title="Full sample">Full sample</a> (VS2012 + <a href="http://pytools.codeplex.com" title="pytools" target="_blank">pytools</a> solution, tested with IronPython 2.7.3), possible updates can be found at <a href="https://github.com/software-architects/blogsamples/tree/master/UseLibraryWithAppConfig" target="_blank">our github repository.</a></p>