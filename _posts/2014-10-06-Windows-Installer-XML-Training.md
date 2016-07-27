---
layout: blog
title: Windows Installer XML Training
excerpt: This week I will do another one of my Windows Installer XML (WiX) trainings in Germany. In this blog article I summarize the prerequisites that participants need in order to follow along the samples.
author: Rainer Stropek
date: 2014-10-06
bannerimage: 
lang: en
tags: [Visual Studio]
permalink: /devblog/2014/10/06/Windows-Installer-XML-Training
---

<p>This week I will do another one of my Windows Installer XML (WiX) trainings in Germany organized by our friends from <a href="http://www.it-visions.de/start.aspx" target="_blank">IT-Visions</a>. In this blog article I summarize the prerequisites that participants need in order to follow along the samples.</p><h2>Microsoft Visual Studio</h2><p>During the training we will use Microsoft Visual Studio 2013 to author installable programs and installers. Therefore, attendees will need Visual Studio on their laptops. If you do not have Visual Studio already, here are some links where to get it:</p><ul>
  <li>You can download Visual Studio 2013 full versions (if you have a license) as well as Express Edition (free) from <a href="http://msdn.microsoft.com/developer-resource-downloads-msdn" target="_blank">MSDN</a>.</li>
  <li>If you cannot or don't want to install Visual Studio 2013 on your production laptop, you can also use <a href="http://azure.microsoft.com" target="_blank">Microsoft Azure</a> pre-built Virtual Machine images with Visual Studio already installed. <a href="http://azure.microsoft.com/en-us/campaigns/visual-studio-2013/" target="_blank">Here</a> you find more information about this offering.</li>
</ul><p class="showcase">Note that you can use free offerings in Azure if you are using it <a href="http://azure.microsoft.com/en-us/pricing/free-trial/" title="Azure Free Trial" target="_blank">for the first time</a> or if you have an <a href="http://azure.microsoft.com/en-us/pricing/member-offers/msdn-benefits-details/" target="_blank">MSDN subscription</a>. Please check if you can use <a href="http://en.wikipedia.org/wiki/Remote_Desktop_Protocol" target="_blank">RDP (Remote Desktop Protocol)</a> from the training network if you want to use Azure during the training.</p><h2>Windows Installer XML (WiX)</h2><p>Please install the latest version if WiX. You can download it from <a href="http://wixtoolset.org/">http://wixtoolset.org/</a>.</p><h2>MSI Tools from Microsoft Windows SDK (Optional)</h2><p>As WiX is based on Windows Installer technology, we will use MSI-related (MSI = Microsoft Installer) tools during the training. You can get them free in the <a href="http://msdn.microsoft.com/en-US/windows/desktop/aa904949.aspx" target="_blank">Windows Dev Center</a>.</p><h3>Windows 8.x</h3><p>If you have Windows 8 and pick the Windows 8 SDK, select <em>MSI Tools</em> during installation:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/10/MSIToolsWin8.png" />
</p><h3 class="textalignleft">Windows 7</h3><p>If you have Windows 7 and pick the Windows 7 SDK, select <em>Tools</em> during installation:</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2014/10/MSIToolsWin7.png" />
</p><h3>Install Orca</h3><p>After that, you should find an <em>OrcaXXX.msi</em> installer in <em>%ProgramFiles%\Microsoft SDKs\Windows\v[VERSION]\Bin</em> (Windows 7) or <em>C:\Program Files (x86)\Windows Kits\8.1\bin\x86</em> (Windows 8). Please install it for the training.</p>