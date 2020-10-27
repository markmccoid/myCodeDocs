---
id: npm-module-creation
title: npm Module Creation
sidebar_label: npm Module Creation
---

This is a brief document on how to go about creating, testing and publishing an npm module.

## Linking to a npm Module

When you first start working on your module, you most likely do not want to immediately publish it to the npm registry.  Instead, you would like it to behave like an npm module during your testing and then once you are ready, you can publish.

This can be done and is facilitated by the link command in npm (I believe yarn also has this command).

For the below examples I will be using the package name **tmdb_api** as the npm module we want to "test" or more accurately publish locally.

To create a local module we would use the npm link command in the **tmdb_api** repository.

```powershell
> npm link

C:\Users\mark.mccoid\AppData\Roaming\npm\node_modules\tmdb_api -> C:\Users\mark.mccoid\Documents\GitHub\tmdb_api
```

The above command has created a **symlink** (symbolic link) which is a shortcut that point to another directory or file on your system.

Lastly, we need to use it in another project.  We will use it in the **tmdb_api_tester** application.

```powershell
> npm link tmdb_api

C:\Users\mark.mccoid\Documents\GitHub\tmdb_api_tester\node_modules\tmdb_api -> C:\Users\mark.mccoid\AppData\Roaming\npm\node_modules\tmdb_api -> C:\Users\mark.mccoid\Documents\GitHub\tmdb_api
```

## Publishing to NPM

The easiest way to publish to NPM is to use the `np` package.  This is a good article on [publishing to NPM](https://zellwk.com/blog/publish-to-npm/).

Here are the basics.

Make sure `np` is installed globally or locally.  Globally is just easier:

```bash
$ npm install --global np
```

When in the directory of the package you want to publish, just run `np` and it will go through a series of questions and checks.

Basics to have thought about:

1. Make sure git is clean.  Everything is committed and pushed to the remote
2. Make sure you know what version you want to make this release