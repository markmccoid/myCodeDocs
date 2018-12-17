---
id: electron-tooling
title: Electron Tooling
sidebar_label: Electron Tooling
---

## Set process.env.NODE_ENV in Windows

We often use the NODE_ENV variable to toggle things on in Dev and off in Production.  You can set an command window instance of this variable like this:

```
C:> set NODE_ENV=devlopment 
```

You can then access this via the process.env.NODE_ENV variable in your electron process.

## Supported Dev Tools

- Ember Inspector
- React Developer Tools
- Bakbone Debugger
- jQuery Debugger
- AngularJS Batarang
- Vue.js devtools
- Cerebral Debugger
- Redux DevTools Extension

## React DevTools and Redux DevTools

Getting chrome dev extensions to work, isn't difficult, but it is not obvious.
First, you need to find the id of the extension you want to enable.  On windows, the chrome extensions are in **%%appData%%/local/google/chrome/User Data/Default/Extensions/_:extensionid_**

React DevTools id is _'fmkadmapgofadopljbjfkapdkoienihi'_
Redux DevTools id is _'lmhkpmbekcpmknklioeibfkpmmfibljd'_

In your _app.on('ready',())_ callback, you need to run this BrowserWindow function.

```javascript
	app.on('ready', () => {

	if (process.env.NODE_ENV === 'development') {
		BrowserWindow.addDevToolsExtension('C:/Users/mark.mccoid/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.4.0_0');
		BrowserWindow.addDevToolsExtension('C:/Users/mark.mccoid/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.1_0');
	}
```

Note that there is a version folder.  Make sure to check your extension directory to see if there are multiple versions.

## Native Builds

Since we are creating application for Windows/Mac/Unix, there can be npm components that are specific to each platform and as such need to be installed(built) differently.

Haven't dealt with much, but check out the Master Electron course on Udemy, section 6 & 7.

## Devtron

[Devtron Website](https://electronjs.org/devtron)

First npm install:

```
$ npm install devtron --save-dev
```

So you don't muddy your application code, you can run devtron in the chrome developer tools.

First open the chrome developer tools when your application is running and go to the console tab.

Then run this command:

`require('devtron').install()`

This will add a new tab to the developer tools called Devtron.

## Creating Images for Electron and Adding to Application

The [Electron Icon Maker](https://github.com/jaretburkett/electron-icon-maker) will create a set of images to use as the icons in your electron application.

```
$ yarn add electron-icon-maker --dev
```

You can install globally if you want.

If installed locally, you can run as follows:

```
$ "./node_modules/.bin/electron-icon-maker" --input=image.png --output=./assets
```

### Add Image to your Application

The best way to set a window and app icon is when you are creating your BrowserWindow.  It is the **icon** property.  

```javascript
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 800,
    show: false,
    icon: path.join(__dirname, '../assets/icons/png/48x48.png'),
    webPreferences : { backgroundThrottling: false },
    title: 'Analytix Variable Editor'
  });
```

You must be careful about the location as when this code runs, it will be serving it from the *public* directory, that is assuming your base "electron.js" file is located in a public directory.  Anyway, usually the assets folder for the application is located in the root directory which requires you to navigate back one directory first, before moving into the assets directory.

