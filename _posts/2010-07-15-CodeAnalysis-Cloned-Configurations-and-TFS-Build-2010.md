---
layout: blog
title: CodeAnalysis, Cloned Configurations and TFS Build 2010
excerpt: In case you are stumbling across a problem where your build does not succeed because the result file for code analysis cannot be found (Unable to read Code Analysis output report. Make sure that the directory is writable (default is the project output directory) be sure to not have any CodeAnalysisLogFile entries in your project build files.
author: Philipp Aumayr
date: 2010-07-15
bannerimage: 
bannerimagesource: 
lang: en
tags: [TFS]
ref: 
permalink: /devblog/2010/07/15/CodeAnalysis-Cloned-Configurations-and-TFS-Build-2010
---

<p>In case you are stumbling across a problem where your build does not succeed because the result file for code analysis cannot be found (<strong>Unable to read Code Analysis output report. Make sure that the directory is writable (default is the project output directory</strong>) be sure to not have any &lt;CodeAnalysisLogFile&gt; entries in your project build files. As <a title="KnowledgeBase entry from microsoft" href="http://www.mskbarticles.com/index.php?kb=2249899" target="_blank">this KB entry</a> states those entries are generated when cloning build configurations. To remove them, unload the project, manually remove the lines from the project file, reload the project. After you check in the file and start a new build things should be better. Note that there is an &lt;CodeAnalysisLogFile&gt; entry for every cloned configuration, so make sure you get all of them.</p>