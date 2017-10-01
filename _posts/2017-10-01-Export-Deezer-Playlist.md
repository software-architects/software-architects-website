---
layout: blog
title: Exporting a Deezer Playlist
excerpt: Today I had to export a playlist from Deezer for an event. The DJ who will care for the event's music asked me for title ideas. I have hacked together a quick-and-dirty Node.js script that generates a Markdown music list from Deezer playlists. Maybe it is useful for other people, too.
author: Rainer Stropek
date: 2017-10-01
bannerimage: /content/images/blog/2017/10/deezer-logo.png
bannerimagesource: 
lang: en
tags: [Node.js]
permalink: /devblog/2017/10/01/export-deezer-playlist
showtoc: false
---

## Introduction

Today I had to export a playlist from *Deezer* for an event. The DJ who will care for the event's music asked me for title ideas. I have hacked together a quick-and-dirty Node.js script that generates a Markdown music list from *Deezer* playlists. Maybe it is useful for other people, too.


## Getting the Access Token

First, you have to create an application in [Deezer's API portal](https://developers.deezer.com/myapps).

Next, you can interactively get an access token using the following URL:

```
https://connect.deezer.com/oauth/auth.php?app_id=YOUR_APP_ID
    &redirect_uri=https://dummydomain.com/login
    &response_type=token
    &perms=basic_access,manage_library
```

Note that it doesn't matter if the redirect URI exists. You are just interested in the access token that is embedded in the redirect URI.


## Export Script

```
const fetch = require('node-fetch');

async function run() {
    const response = await fetch('https://api.deezer.com/user/me/playlists?output=json&access_token=YOUR_ACCESS_TOKEN');
    const playlists = await response.json();
    const hochzeitPlaylists = playlists.data.filter(p => p.title.startsWith('something'));
    console.log('# Dinner');
    console.log('');
    await processPlaylist(hochzeitPlaylists.find(p => p.title === 'Dinner'));
    console.log('# Party');
    console.log('');
    await processPlaylist(hochzeitPlaylists.find(p => p.title === 'Party'));
    console.log('\\newpage');
    console.log('# Dance Music');
    console.log('');
    for (let playlist of hochzeitPlaylists.filter(p => p.title !== 'Dinner' && p.title !== 'Party')) {
        console.log(`## ${playlist.title}`);
        console.log('');
        await processPlaylist(playlist);
    }
}

async function processPlaylist(playlist) {
    const response = await fetch(`https://api.deezer.com/playlist/${playlist.id.toString()}?output=json&access_token=YOUR_ACCESS_TOKEN`);
    const details = await response.json();
    for (let track of details.tracks.data) {
        console.log(`1. ${track.title} - ${track.artist.name}`);
    }
    console.log('');
    console.log('');
}

run();
```

Export the output into a Markdown file.

## Create PDF

Once I had the Markdown playlist, I used *pandoc* (see my blog post [Markdown and Pandoc for Conceptual Documents](http://www.software-architects.com/devblog/2017/05/23/Markdown-pandoc-conceptual-documents) for details) to convert it to PDF.

Hope that this quick-and-dirty hack is useful for somebody.
