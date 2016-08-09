---
layout: blog
title: Shipping large MSI installers via Azure Blob Storage
excerpt: Recently I did a WiX (Windows Installer XML) and MSI training at a customer in Germany. One of the questions I got asked was how to deliver large MSI installers efficiently to customers via web. The goal was to minimize download time. In this blog article I describe a possible approach.
author: Rainer Stropek
date: 2014-10-08
bannerimage: 
bannerimagesource: 
lang: en
tags: [Azure,Visual Studio]
ref: 
permalink: /devblog/2014/10/08/Shipping-large-MSI-installers-via-Azure-Blob-Storage
---

<p>Recently I did a <a href="http://wixtoolset.org" target="_blank">WiX</a> (Windows Installer XML) and <a href="http://msdn.microsoft.com/en-us/library/cc185688(v=vs.85).aspx" target="_blank">MSI</a> training at a customer in Germany. One of the questions I got asked was how to deliver large MSI installers efficiently to customers via web. The goal was to minimize download time. In this blog article I describe a possible approach.</p><p class="showcase">You can download the entire sample from my <a href="https://github.com/rstropek/Samples/tree/master/WiXSamples/CompositeWpfAppWithInstaller" target="_blank">GitHub Samples</a> repository.</p><h2>WiX/MSI Preconditions</h2><p>In many cases developers try to keep things simple by packaging everyhing an installer needs into a single MSI file. WiX has a very convenient feature for that: <a href="http://wixtoolset.org/documentation/manual/v3/xsd/wix/mediatemplate.html" target="_blank"><em>MediaTemplate</em></a> with <em>EmbedCab="yes"</em>.</p><p>The problem with this approach is that the MSI quickly gets quite large. This isn't an issue for small applications and customers with strong internet connections. However, if you have to deliver complex installations to devices spread over the whole globe partly with GPRS connections, this becomes a big problem.</p><p>Fortunately WiX and MSI are old technologies. They where originally developed in an age where software was shipped using diskettes. For those of you how are too young, <a href="http://en.wikipedia.org/wiki/Floppy_disk" target="_blank">here is the Wikipedia article</a> describing what a "diskette" is ;-) At that time, installers were too large for a single storage medium. Data had to be split up. For that, MSI supports external <a href="http://en.wikipedia.org/wiki/Cabinet_(file_format)" target="_blank"><em>Cabinet files</em></a> (CAB).</p><p>In WiX, you can setup media using the <em><a href="http://wixtoolset.org/documentation/manual/v3/xsd/wix/media.html" target="_blank">Media</a></em> tag. Once you defined your disks, you can assign each <em><a href="http://wixtoolset.org/documentation/manual/v3/xsd/wix/file.html" target="_blank">File</a></em> to the appropriate disk. The following example shows how this is done. It is taken from a larger sample that you can find in my <a href="https://github.com/rstropek/Samples/blob/master/WiXSamples/CompositeWpfAppWithInstaller/CompositeWpfApp.InstallCab/Product.wxs" target="_blank">GitHub Samples repository</a>.</p>{% highlight xml %}<?xml version="1.0" encoding="UTF-8"?>
<Wix ...>
    <Product ...>
        <Package ... />

        <!-- Note that this variant of the sample splits installer into multiple CAB files -->
        <Media Id="1" Cabinet="Disk1.cab" EmbedCab="no" CompressionLevel="high" />
        <Media Id="2" Cabinet="Disk2.cab" EmbedCab="no" CompressionLevel="high" />

        <Directory ...>
        </Directory>

        <DirectoryRef ...>
            <!-- Components/files necessary to run the shell -->
            <!-- Note that all components for the shell are stored in CAB file 1 -->
            <Component ...>
                <File ... DiskId="1" />
            </Component>
            <Component ...>
                <File ... DiskId="1" />
            </Component>
        </DirectoryRef>

        <DirectoryRef ...>
            <!-- Note that all components for the extension are stored in CAB file 2 -->
            <Component ...>
                <File ... DiskId="2" />
            </Component>
        </DirectoryRef>

        <DirectoryRef ...>
            <!-- Note that all components for the SDK are stored in CAB file 2 -->
            <!-- SDK components/files -->
            <Component ...>
                <File ... DiskId="2" />
            </Component>
            <Component ...
                <File ... DiskId="2" />
            </Component>
        </DirectoryRef>
        
        ...
    </Product>
</Wix>{% endhighlight %}<p>If you build this WiX file you will get three result files:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/10/WixCabFiles.png" />
</p><h2>Publishing MSI Installer on the Web with Azure Blob Storage</h2><h3>Why Blob Storage?</h3><p>Now that we have the installer, we want to offer it to our customers. <a href="http://azure.microsoft.com/en-us/documentation/services/storage/" target="_blank">Azure Blob Storage</a> is a great way to do that. Here are some reasons why:</p><ul>
  <li>You don't have to run and scale web servers.</li>
  <li>Microsoft manages SSL certificates.</li>
  <li>Blob storage is very cost efficient.</li>
  <li>You can turn on <a href="http://azure.microsoft.com/en-us/services/cdn/" target="_blank">Azure's CDN</a> to offer you customers even greater download experience.</li>
  <li>There are easy-to-use tools to manage your files and folders in Azure Blob Storage (e.g. from <a href="http://www.red-gate.com/products/azure-development/" target="_blank">redgate</a>, Visual Studio Server Explorer).</li>
  <li>You can offer your installer to everyone (public read) or distribute time-limited download URLs only to your customers (<a href="http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-shared-access-signature-part-1/" target="_blank">Shared Access Signatures</a>).</li>
</ul><h3>Setting up Blob Storage</h3><p>Follow these steps to configure Azure Blob Storage for public read access:</p><ul>
  <li>Log in at <a href="https://manage.windowsazure.com/" target="_blank">https://manage.windowsazure.com</a> (or use the new Azure portal at <a href="https://portal.azure.com/" target="_blank">https://portal.azure.com</a>)</li>
  <li>Create a storage account.</li>
  <li>Use a blob storage client of your choice. I will use Visual Studio Server Explorer here. Connect Visual Studio with your Azure account and create a new container in your storage account:</li>
</ul><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/10/Container.png" />
</p><ul>
  <li>Enable public read access for your blob container:</li>
</ul><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/10/PublicRead.png" />
</p><ul>
  <li>Upload your installer files to the container (click on image to enlarge):</li>
</ul>

<a data-lightbox="upload" href="{{site.baseurl}}/content/images/blog/2014/10/upload.png"><img src="{{site.baseurl}}/content/images/blog/2014/10/upload.png" /></a>

<h2>Running the MSI Installer</h2><p>Now that we have the MSI installer in Azure Blob Storage we can install our software from there. To make sure that Windows only downloads what it really needs, you should use a web debugger like <a href="http://www.telerik.com/fiddler" target="_blank">Fiddler</a> to check what's going on.</p><p>Note that you must not click on a link to the MSI installer in a browser. In that case, the browser would download the MSI and run it from a local location. Instead, we start the install directly from the URI:</p><p>
  <em>msiexec /i https://yourserver.blob.core.windows.net/msiinstaller/CompositeWpfApp.Install.msi ADDLOCAL=Shell REMOVE=SDK,Extension</em>
</p><p>Note that the command line does only install the <em>Shell</em> feature, i.e. only files referencing disk 1. If you run it, fiddler will show that Windows only downloads disk 1:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/10/Disk1.png" />
</p><p>If we add features from disk 2, the installer recognizes that it does not have to read disk 1 again. So the following command line leads to a download of only disk 2 if <em>Shell</em> has been installed before.</p><p>
  <em>msiexec /i https://yourserver.blob.core.windows.net/msiinstaller/CompositeWpfApp.Install.msi ADDLOCAL=Shell,SDK,Extension</em>
</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/10/Disk2.png" />
</p><h2>
  <span style="color: rgb(80, 80, 80); font-size: 14px; line-height: 22px;">As you can see, MSI is clever in determining what to download and Azure Blob Storage is a nice way for you to supply your installers to your customers.</span>
</h2>