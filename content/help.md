---
layout: pageWithToc
title: Help
permalink: /help
---

# Help

## Installation

At [Jekyll on Windows](http://jekyll-windows.juthilo.com/) there is a good installation guide to get jekyll running on windows. You will need the following components:

* [Ruby](http://rubyinstaller.org/downloads/) (make sure to check "Add Ruby executables to your PATH")
* [Ruby DevKit](http://rubyinstaller.org/downloads/)
  * Enter a path that has no spaces in it like C:\RubyDevKit\. Click Extract and wait until the process is finished.
  * Open a line tool and navigate to the folder you extracted the DevKit into.
  * Run `ruby dk.rb init`
  * Run `ruby dk.rb install`
* Jekyll
  * Run `gem install jekyll`
  * Run `gem install wdm`

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

List with subitems, use two blanks to generate a subitem:

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

### Styles

TODO