---
layout: blog
title: Windows Azure Remote Desktop Hint
excerpt: Just a quick heads up -  "Administrator" is not the best user name you could try to use for Windows Azure Remote Desktop connections.
author: Simon Opelt
date: 2011-07-19
bannerimage: 
bannerimagesource: 
lang: en
tags: [Azure]
permalink: /devblog/2011/07/19/Windows-Azure-Remote-Desktop-Hint
---

<p>Just a quick heads up: "Administrator" is not the best user name you could try to use for <a href="http://msdn.microsoft.com/library/gg443832.aspx" target="_blank">Windows Azure Remote Desktop</a> connections.</p><p>When deploying through Visual Studio the wizard doesn't seem to mind if you set this user name but afterwards connections simply don't work. We then tried to set/change the user name through the <a href="https://windows.azure.com/" target="_blank">Management Portal</a> which hinted that "You need to provide a valid Account Name first" which actually meant that we should choose a proper user name.</p><p>(At first we managed to miss that the exception referred to the user name field as account name.)</p>