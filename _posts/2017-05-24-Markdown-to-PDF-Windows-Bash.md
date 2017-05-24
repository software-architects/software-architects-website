---
layout: blog
title: Markdown and Pandoc for Conceptual Documents
excerpt: At time cockpit, we use Markdown in more and more scenarios. I have been using it for conceptual documents, too. Writing it in Visual Studio Code and converting it to PDF using Pandoc with Bash on Ubuntu on Windows works like a charm. In this blog post, I share the setup and scripts I use in such scenarios.
author: Rainer Stropek
date: 2017-05-24
bannerimage: /content/images/blog/2017/05/markdown-logo-small.png
bannerimagesource: 
lang: en
tags: [Documentation,Markdown,VSCode]
permalink: /devblog/2017/05/23/Markdown-pandoc-conceptual-documents
showtoc: false
---

{: .banner-image}
![Markdown Logo]({{site.baseurl}}/content/images/blog/2017/05/markdown-logo-large.png)

# Introduction

At time cockpit, we use Markdown in more and more scenarios. In our latest newsletter ([We Fell in Love With Markdown](https://www.timecockpit.com/blog/2017/05/09/We-Fell-in-Love-With-Markdown){:target="_blank"}), we have written about it. I have been using it for conceptual documents, too. Writing it in [*Visual Studio Code*](https://code.visualstudio.com/){:target="_blank"} and converting it to PDF using [*Pandoc*](http://pandoc.org/){:target="_blank"} with [*Bash on Ubuntu on Windows*](https://msdn.microsoft.com/en-us/commandline/wsl/about) works like a charm. In this blog post, I share the setup and scripts I use in such scenarios.


# Toolchain

As mentioned above, I like using [*Visual Studio Code*](https://code.visualstudio.com/){:target="_blank"} for writing Markdown. I use one of the various spell checkers plugins ([example](https://marketplace.visualstudio.com/items?itemName=swyphcosmo.spellchecker){:target="_blank"}) to get pointed to typing mistakes.

I switched the integrated console in VSCode to *bash on Ubuntu on Windows 10* ([description in VSCode docs](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration){:target="_blank"}).

Finally, I use [Evince](https://wiki.gnome.org/Apps/Evince){:target="_blank"} as my PDF viewer because...

* ...it does not lock the PDF file, so I can overwrite it although it is open.
* ...it auto-reloads the PDF file when it changes.

When I am in my office, I have *VSCode* on one monitor and *Evince* on the other. Here is a screenshot that shows what I mean:

<a data-lightbox="Expression-bodied members" href="/content/images/blog/2017/05/Markdown-VSCode-Screen-Setup.png"><img src="/content/images/blog/2017/05/Markdown-VSCode-Screen-Setup.png" /></a>

Of course, many documents contain diagrams. I use [Inkscape](https://inkscape.org/en/){:target="_blank"} to create SVG files.


# Markdown to PDF Conversion

I use two tools for converting my Markdown conceptual documents to PDF:

* [*Pandoc*](http://pandoc.org/){:target="_blank"}
* Pandoc requires [*LaTeX*](https://www.latex-project.org/){:target="_blank"} for PDF-conversion
* [*librsvg*](https://en.wikipedia.org/wiki/Librsvg){:target="_blank"} for converting SVG to PDF

I have written a short helper script `build-pdf.sh` doing the conversion. Note that it assumes that SVG diagrams are in a subfolder that has the same name as the Markdown file (without the `.md` extension). Please excuse possible mistakes in the script. I mainly use languages like C#, TypeScript, etc. and I am by far no bash expert.

```
#!/bin/sh

# Author: Rainer Stropek
# Tested on Ubuntu 16.04 LTS on Windows 10 Pro

# On Ubuntu 16.04 LTS, you need to install (apt-get install) the following packages in order to run this script:
# * LaTeX (e.g. texlive texlive-lang-german texlive-latex-extra)
# * pandoc
# * librsvg2-bin

# Verify that argument has been given
if [ -z "$1" ]; then {
    echo "Error: Missing argument\n"
    echo "USAGE: $0 name-of-markdown-file"
    echo "Converts specified markdown file to pdf"
    exit 1
}
fi

# Check that file extension is .md
EXT=$1
EXT="${EXT##*.}"
if [ "$EXT" != "md" ]; then {
    echo "Error: Specified file name does not have the extension .md"
    exit 1
} fi

# Verify that file exists
if [ ! -f $1 ]; then {
    echo "Error: Specified file not found"
    exit 1
} fi

BASENAME=$(basename "$1" .md)

# Look for all SVG files in subdirectory having the same name
# as the markdown file to convert.
for f in ./$BASENAME/*.svg
do
    # Skip if not a file
    test -f "$f" || continue
    
    # Convert SVG file into PDF
    rsvg-convert $f -f pdf -o ./$BASENAME/$(basename "$f" .svg).pdf
done

## Convert markdown file into PDF
pandoc $1 -f markdown -t latex -o $BASENAME.pdf
```

In addition to that script, I use another helper script `rerun.sh` that executes the script above whenever a file changes. The original script is [on GitHub](https://github.com/tartley/rerun2/blob/master/rerun){:target="_blank"}. I only made minor modifications.

```
#!/usr/bin/env bash

# Events that occur within this time from an initial one are ignored
IGNORE_SECS=0.25

function execute() {
    echo "$@"
    "$@"
}

execute "$@"
ignore_until=$(date +%s.%N)

inotifywait --quiet --recursive --monitor --format "%e %w%f" \
    --event modify --event move --event create --event delete \
    *.md | while read changed
do

    echo "$changed"

    if [ $(echo " $(date +%s.%N) > $ignore_until" | bc) -eq 1 ] ; then
        ignore_until=$(echo "$(date +%s.%N) + $IGNORE_SECS" | bc)
        ( sleep $IGNORE_SECS ; execute "$@" ) &
    fi

done
```

I hope this is useful for you.
