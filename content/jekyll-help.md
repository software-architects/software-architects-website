---
layout: pageWithToc
title: Help
excerpt: Documentation for software architects websites
permalink: /jekyll-help
---

# Help

## Installation

At [Jekyll on Windows](http://jekyll-windows.juthilo.com/) there is a good installation guide to get jekyll running on windows. You will need the following components:

* [Ruby](http://rubyinstaller.org/downloads/) (make sure to check "Add Ruby executables to your PATH")
* [Ruby DevKit](http://rubyinstaller.org/downloads/)
  * Enter a path that has no spaces in it like C:\RubyDevKit\. Click Extract and wait until the process is finished.
  * Open a command line tool and navigate to the folder you extracted the DevKit into.
  * Run `ruby dk.rb init`
  * Run `ruby dk.rb install`
* Jekyll
  * Run `gem install jekyll`
  * Run `gem install wdm`
  * Run `gem install jekyll-paginate`

## Run Jekyll

Make sure to save all files with encoding **Unicode (UTF-8 without signature) - Codepage 65001**. If files are saved with the wrong encoding, 
the build may break or it also may run successfully but files are missing in the output folder.

### Build

```bat
jekyll build
```

The result is copied to the _site folder. Do not check in the generated files.

### Start Jekyll Server

```bat
jekyll serve -w -i
```

If files are not updated as expected, check if the encodings of all changed files are correct. If this does not solve the problem, 
stop the jekyll server (`ctrl + c`), run `jekyll build` and then start the server again.

## Markdown

### Overview

You can find an overview of available styles at [Kramdown Syntax](http://kramdown.gettalong.org/syntax.html).

Result | Markdown | Notes
--- | 
H1 | `# H1` | [see details](#headers)
H2 | `# H2` | [see details](#headers)
H3 | `# H3` | [see details](#headers)
H4 | `# H4` | [see details](#headers)
**Bold** | `**Bold**` | 
*Emphasize* | `*Emphasize*` |
~~Strike through~~ | `~~Strike through~~` |
<http://...> | `<http://...>` | 
[Link with text](http://...) | `[Link text](http://... "Title")` |
Image | `![Alt text](http://... "Title")` |  [see details](#images)
`Inline code` | `` `Inline code` `` |
1. Ordered list | `1. Ordered list` | use 1. for every item, numeration will be generated automatically, [see details](#lists)
* Unordered list | `* Unordered list` | [see details](#lists)
Blockquote | > Blockquote |

### Headers

For each header an id is generated automatically. 
The id is generated from the header text, all characters are lowercase and blanks are replaced by dashes:

```
## Start Jekyll Server
``` 

This header generates the following html:

```html
<h2 id="start-jekyll-server">Start Jekyll Server</h3>
```

You can use the id for hyperlinks:

```
(Link to Start Jekyll Server)[#start-jekyll-server]
```

### Paragraphs

TODO

#### Styles

TODO

### Lists

```
Unordered list:

* First item
* Second item
* Third item

Ordered list:

1. First item
1. Second item
1. Third item

List with subitems, use four blanks to generate a subitem:

1. First item
  1. First subitem
    1. Another subitem
    1. Another subitem
  1. Second subitem
  1. Third subitem
1. Second item
  * First subitem
  * Second subitem
1. Third item
```

Unordered list:

* First item
* Second item
* Third item

Ordered list:

1. First item
1. Second item
1. Third item

List with subitems, use four blanks to generate a subitem:

1. First item
    1. First subitem
        1. Another subitem
        1. Another subitem
    1. Second subitem
    1. Third subitem
1. Second item
    * First subitem
    * Second subitem
1. Third item

### Links

TODO

### Images

TODO

#### Styles

TODO

### Code

TODO

## Repair Old Blog Entries

### Slimbox Images

Find `<function name="Composite.Media.ImageGallery.Slimbox2"` in folder `_posts` in files with extension .md.

#### Slimbox Images With MediaImage

Replace function blocks for single images with the following code:

```html
<a data-lightbox="bugfix" href="{{site.baseurl}}/content/images/blog/2014/02/bugfix.png"><img src="{{site.baseurl}}/content/images/blog/2014/02/bugfix.png" /></a>
```

Make sure to replace the following three items:

* data-lightbox: a unique name for the lightbox (no blanks or special characters)
* href: url for the image
* src: url for the image

#### Slimbox Images With MediaFolder

Replace function blocks for folders with the following code:

```html
<div class="row tc-image-gallery">
    <div class="col-xs-6 col-sm-3 col-md-3"><a data-lightbox="gab" href="{{site.baseurl}}/content/images/blog/2016/04/image1.jpg"><img src="{{site.baseurl}}/content/images/blog/2016/04/image1.jpg" /></a></div>
    <div class="col-xs-6 col-sm-3 col-md-3"><a data-lightbox="gab" href="{{site.baseurl}}/content/images/blog/2016/04/image2.jpg"><img src="{{site.baseurl}}/content/images/blog/2016/04/image2.jpg" /></a></div>
    <div class="col-xs-6 col-sm-3 col-md-3"><a data-lightbox="gab" href="{{site.baseurl}}/content/images/blog/2016/04/image3.jpg"><img src="{{site.baseurl}}/content/images/blog/2016/04/image3.jpg" /></a></div>
</div>
```

You have to add all images for a folder manually.

The classes col-xs-\*, col-sm-\*, col-md-\* and col-lg-\* specify the number of columns for an image. \* must be a number between 1 and 12. Specify a least col-xs-\* and col-sm-\*. If col-md-\* or col-lg-\* are not specified they are equal to the next smaller class.

You can find more details about the Bootstrap grid system at <http://getbootstrap.com/css/#grid>.

