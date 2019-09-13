---
id: electron-react-boiler
title: Electron React Boiler
sidebar_label: Electron React Boiler
---

 This is my React Electron Boilerplate doc.

Check out this [Article link](https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3), it details what we are doing here.

## Create-react-app and basic NPM modules

The basics are you first use create-react-app to create your application. Then you add some npm modules to get electron, electron builder and some helper modules.

```
$ npx create-react-app appname
$ yarn add electron electron-builder concurrently wait-on electron-devtools-installer --dev
$ yarn add electron-is-dev
```

**Concurrently** is used in *package.json* scripts to run multiple commands in one script.  [wait-on](https://www.npmjs.com/package/wait-on) is used when running the *electron-dev* script in *package.json*.

**electron-devtools-installer** is used to get the React and Redux(if you are using redux) developer tools installed.  You will see reference to these in the *electron.js* script below.

## electron.js file

Now we have a react app, but we want it to run in Electron.  To do this we need to add **electron.js** to the **public** directory.  This is so that during build time, it will get moved to the build directory.

```javascript {20-22}
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require("electron-devtools-installer");

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    show: false,
    icon: path.join(__dirname, "../assets/icons/png/64x64.png"),
    webPreferences: {
      nodeIntegration: true, // needed if going to access file system
      backgroundThrottling: false
    },
    title: "Title of your App" // Make sure to delete title tag in index.html if it exists
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  // If in development mode, then load the dev tools
  if (isDev) {
    installDevTools();
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    isDev && mainWindow.openDevTools();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

//---------- INSTALL DEV TOOLS ---------------------//
const installDevTools = () => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => {
      console.log(`Added Extension: ${name}`);
    })
    .catch(err => {
      console.log("An error occurred: ", err);
    });

  installExtension(REDUX_DEVTOOLS)
    .then(name => {
      console.log(`Added Extension: ${name}`);
    })
    .catch(err => {
      console.log("An error occurred: ", err);
    });
};
```

You can see that we are using the **electron-is-dev** module to determine if we are in dev mode or build mode.

We don't want a browser to open automatically, so we need to set the env variable BROWSER to none, however, I couldn't get this to work on Windows in a *Package.json* script.

To make it work, I created the **.env.development** file.  create-react-app will read this file.

```
BROWSER="NONE"
```

## package.json Setup

Now we need to fix up *package.json* file so electron knows where to find its entry point and to update the scripts.

```json
"homepage": "./",
"main": "public/electron.js",
"scripts": {
    "start": "react-scripts start",
    "electron-dev": "concurrently  \"yarn start\" \"wait-on http://localhost:3000 && electron .",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject",
    "electron-pack": "build --em.main=build/electron.js",
    "pack": "electron-builder --dir",
    "preelectron-pack": "yarn build"
},
"build": {
    "appId": "com.example.electron-cra",
    "files": [
        "build/**/*",
        "node_modules/**/*"
    ],
    "directories":{
        "buildResources": "assets"
    }
}
```

*main* tells electron where the entry point is. *homepage* has something to do with the build for production.

You should now be able to run the *electron-dev* script.

```
$ yarn run electron-dev
```

## Icon Creation

Best way to get all the sizes of the icon you will need is to use the [electron-icon-maker](https://github.com/jaretburkett/electron-icon-maker) npm module.

```bash
$ npm install -g electron-icon-maker
```

This can be a global install.  Don't need it on your project.

Create a directory in the root of your folder called ***assets*** to hold the output.

Check out docs, but basically get an PNG file, preferably at 1024x1024 resolution and run:

```bash
$ electron-icon-maker --input=youriconname.png --output=./assets
```

You will reference your icon files in the *electron.js* file when you create a new **BrowserWindow** instance.  It will be the *icon* property passed to this function.

```js {1-2}
mainWindow = new BrowserWindow({
 width: 900,
 height: 680,
 show: false,
 icon: path.join(__dirname, "../assets/icons/png/64x64.png"),
 webPreferences: {
   nodeIntegration: true, // needed if going to access file system
   backgroundThrottling: false
 },
 title: "Title of your App" // Make sure to delete title tag in index.html if it exists
});
```

## Basic Menu Setup

Electron will show a default menu if you don't do anything, but it is good to at least setup a simple File/Exit menu and a Developer menu that will show during development.

You can set this up directly in `electron.js` or preferably create a separate `menu.js` file and import it into the `electron.js`

Here is a basic template with a File menu and Developer menu when in Dev mode.

**menu.js**

```javascript
const { app, Menu } = require("electron");
const isDev = require("electron-is-dev");
const isWindows = process.platform === "win32";

module.exports = {
  setMainMenu
};

function setMainMenu(mainWindow) {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: isWindows ? "Exit" : `Quit ${app.getName()}`,
          accelerator: isWindows ? "Alt+F4" : "CmdOrCtrl+Q",
          click() {
            app.quit();
          }
        }
      ]
    }
  ];
  // - Push Developer menu on if in Dev Mode
  if (isDev) {
    template.push({
      label: "Developer",
      submenu: [
        {
          label: "Toggle Dev Tools",
          accelerator: "CommandOrControl+Alt+I",
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
```

To actually get this to show, you will need to add the following to your `electron.js` file.

**electron.js**

```javascript
...
const { setMainMenu } = require("./menu");
...
function createWindow() {
  mainWindow = ...
  ...
  setMainMenu()
}
```

### Opening a Route via a Menu

If you are using React Router and you want to navigate to a new route via a menu, you will need to use the `webContents` API from the Main process and the `ipcRenderer` from the Renderer process.

This example will add a "Settings" menu under File.  Based on the example above, you just need to add the new menu item to the template:

```javascript
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Settings",
          click() {
            mainWindow.webContents.send("route-settings");
          }
        },
        {
          label: isWindows ? "Exit" : `Quit ${app.getName()}`,
          accelerator: isWindows ? "Alt+F4" : "CmdOrCtrl+Q",
          click() {
            app.quit();
          }
        }
      ]
    }
  ];
```

### Send a Message to webContents (Main Process)

Notice that the "Settings" menu option has a click function that simply sends a message to the mainWindow's webContents. 

`mainWindow.webContents.send("route-settings");`

The other thing that would need to change is the **setMainMenu** function signature.  You will need to pass in the *mainWindow* variable so that we can access it's webContents.

But this is just the first part.  This will send a message to our mainWindow and now in that mainWindow (most likely a React application :-)), you will need to set up a listener for this message and act on it when received.

### Listen for Message (Renderer Process)

When figuring this out, I placed my listener in my `Main.js` file.  Could probably be elsewhere.

Anyway, whichever file you end up using, you will need to import the `ipcRenderer` from **electron**.

This can be tricky in the Renderer process, see [Accessing Electron Remote From Renderer Process](#accessing-electron-remote-from-renderer-process)

In your Main.js you just do this:

```javascript
...
import electron from "../electronExports";

...

function Main(props) {
  console.log("in Main", props);
  useEffect(() => {
    electron.ipcRenderer.on("route-settings", (event, message) => {
      console.log("route settings sent");
      props.history.push("/settings");
    });
  }, []);

  return (
    <AppWrapper>
      <Route exact path="/" component={SelectApplicationQVW} />
      <Route path="/:selectedQVW" component={EditorContainer} />
    </AppWrapper>
  );
};

export default Main;
```

Notice we put the `electron.ipcRenderer...` stuff in a useEffect function.  We only need it to run once when the application starts to set up the listener.

There is probably a cleanup function for the ipcRenderer.on listener, but haven't found it yet.

## React Router Setup

Now we need to add routing to our boilerplate application.

I'm using React Router 5.

```
$ yarn add react-router-dom
```

### Memory Router vs Browser Router vs Hash Router

I choose to use the **MemoryRouter** as I believe there would be issues with **BrowserRouter** and read some things about **HashRouter** being deprecated.  Also read some stuff about issues with **MemoryRouter** when trying to route to a page outside of the react app, but will deal with if encountered.

Here is a simple example implementation.

Modify App.js to be:

```jsx
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { MemoryRouter, Route, Link } from 'react-router-dom';
import { Home, About } from './MyRoutes';

const Header = () => (<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to Electron React</h1>
        <Link to="/about">About</Link>
      </header>
);
class App extends Component {
  render() {
    return (
      <MemoryRouter
        initialEntries={['/', '/about']}
        initialIndex={0}
      >
        <div className="App">
          <Header />
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </div>
      </MemoryRouter>
    );
  }
}

export default App;

```

You can load **MemoryRouter** with initial routes using the "initialEntries" array.  Think this is only useful to force you to your main path as all routes do not need to be in this initial array.

Note that all components rendered via the Route component will get a bunch of route props.  One of particular use is the **history** prop.  It has functions like **push**, **goBack**, **replace**, etc.

Next create a **MyPages.js** file to hold our example route destinations.

```jsx
import React from 'react';
import { Redirect } from 'react-router-dom';

export const Home = (props) => {
  return(
    <div>
      <h1>You Are Home</h1>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  )
};

export const About = (props) => {
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}

export const Contact = (props) => {
  console.log(props);
  let pos = props.history.entries.length - 2;
  return (
    <div>
      <h1>Contacts</h1>
      {props.history.entries[pos].pathname === "/about" ? 
      <Redirect to="/" /> :
      null
      }
    </div>
  )
}
```

In the **Contact** component, I'm playing around with Redirect, just to get a feel for it.  Useless in this context, but good to know how it works.  Believe it can be used in Auth stuff.

### NavLink Styling

The NavLink component provided by React Router is described as:

> A special version of the [`Link`](https://reacttraining.com/react-router/Link.md) Component that will add styling attributes to the rendered element when it matches the current URL.

It achieves this styling by allowing you to pass, as a prop, either *activeClassName* or *activeStyle*.  When one of the NavLink components is active, it will apply said class/style.

However, if you are using Styled Components you will need to go about it differently.  What I did was pass the location property for each **NavLink**, which will be your applications current location and then compared it to the **to** prop that is passed.

`color: ${props => (props.loc === props.to ? "red" : "blue")};` 

OR if you want to have the link "active" when any endpoint on the path is active, then use:

`color: ${props => (props.loc.includes(props.to) ? "red" : "blue")}`

OR you could use a regular expression if you needed something more complex, but the includes() function above is much more readable.

```javascript
let locProp = "/vareditor/test"
let toProp = "/vareditor"

let pattern = new RegExp(toProp + '.')
console.log(pattern.test(locProp))
```



```javascript
...
const MyNavLink = styled(NavLink)`
  color: ${props => (props.loc === props.to ? "red" : "blue")};
`;

const Header = withRouter(props => {
  console.log("HeaderProps", props);
  return (
    <div>
      <ul>
        <li>
          <MyNavLink loc={props.location.pathname} to="/vareditor">
            Variable Editor
          </MyNavLink>
        </li>
        <li>
          <MyNavLink loc={props.location.pathname} to="/groupeditor">
            Group Editor
          </MyNavLink>
        </li>
        <li>
          <MyNavLink loc={props.location.pathname} to="/settings">
            Settings
          </MyNavLink>
        </li>
      </ul>
    </div>
  );
});
```



-----



Here is an image of the file structure thus far.

![](https://dl.dropbox.com/s/3zofs1inlrorkvr/electron-file-structure.png)

However, I want my main react components in a component directory.  I will refactor as follows.

![](https://dl.dropbox.com/s/kiiqotgtypqmjm3/electron-refactor-structure.png?dl=0)

## Redux Setup

Get more in-depth information on [**My Redux Pattern**](../redux/my-redux-pattern)

To get Redux setup, you will need to install the following:

```bash
$ yarn add redux react-redux redux-thunk redux-immutable-state-invariant --dev
```

### Create the Redux store

I like to keep the store creation function in a folder called store, under the src directory called *configureStore.js*:

`.\src\store\configureStore.js`

The configureStore.js file will have a default export of your store that you can then pass into the react-redux  Provider component.

```javascript
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

const initialState = { name: "test" };
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TEST":
      return { ...state, name: "Not Testing" };
    default:
      return state;
  }
};

export default function configureStore() {
  // Middleware to only be used in development
  const devMiddleware =
    process.env.NODE_ENV !== "production"
      ? [require("redux-immutable-state-invariant").default()]
      : null;

  // If you don't need to use redux dev tools
  //return createStore(rootReducer, applyMiddleware(thunk));
  let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...devMiddleware, thunk))
  );
}
```

> The [redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant) package is just used for development to catch any mutations.

The above is a very simple starting point for your redux store.  You will want to do a couple of things as your refine your store:

1. Create separate files for your reducers and actions
2. Since your state will most likely be more complex, you will want to have separate reducers for each piece of state, thus requiring you to use *combineReducers*

> Note: when using the combineReduces function, make sure to declare an initial state in each of the reducers.  When redux starts off, it sends an action to each reducer with an *undefined* payload, thus each reducer must have an initial state and not return undefined.



You can find more information on how we setup the Redux Devtools extension at [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension#usage).

If you don't want to muddle with the above, the [React Redux Starter Kit](https://github.com/reduxjs/redux-starter-kit) has some great additions and even if you don't use it, it has great suggestions for moving forward with your redux project.  See the [React Redux Start Kit Documentation Site](https://redux-starter-kit.js.org/introduction/quick-start).

[immer](https://github.com/immerjs/immer) looks very interesting for helping with reducer complexity when dealing with state changes and mutability.



## Emotion JS or Styled-Components Setup with create-react-app v2

To use **EmotionJS** or **styled-components** with create-react-app v2, you simply need to use the babel-macros.

### styled-component Babel Macro usage

Here is what I have found.  Styled-Components just works with create-react-app v2.  Documentation said to import from `styled-components/macro` but I haven't need to do that.  Just `yarn add styled-components --dev` and you are good to go.  

> Note: I haven't used much other than the standard `styled` function, so other functions may not work.
>
> See Styled Components docs for more details [Styled-Component Docs](https://www.styled-components.com/docs/tooling#babel-macro)

```javascript
import styled from 'styled-components/macro' //I don't use the /macro

const Thing = styled.div`
  color: red;
`
```

### Emotion Babel Macro usage

[Emotion Docs](https://github.com/emotion-js/emotion/tree/master/packages/babel-plugin-emotion)

```javascript
import styled from 'react-emotion/macro'
import { css, keyframes, injectGlobal, flush, hydrate } from 'emotion/macro'
import css from '@emotion/css.macro'
import styled from '@emotion/styled.macro'
```



## Emotion JS Setup and Decorator Support

> With create-react-app v2, you can use babel-macros so you **DON'T** have to use react-app-rewired.  
>
> This works for styled-components as well as emotion.

To get some of the advanced features and syntactic sugar from emotion, you need a babel plugin.  Unfortunately, create-react-app doesn't let you add this plugin. To get it to work in CRA without ejecting you need to do the following.

First you need to install some dependencies (included here are emotion and react-emotion)

```
$ yarn add babel-loader babel-preset-env babel-plugin-emotion emotion react-app-rewired babel-plugin-transform-decorators-legacy
```

The **react-app-rewired** is the module that makes this possible.  But you are not done yet.

Next you need to update your scripts section in **package.json**.

```json
  "scripts": {
    "start": "react-app-rewired start",
    "electron-dev": "concurrently  \"yarn start\" \"wait-on http://localhost:3000 && electron .",
    "build": "react-app-rewired build",
    "electron-pack": "build --em.main=build/electron.js",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "test": "react-app-rewired test --env=jsdom",
    "eject": "react-app-rewired eject"
  },
```

Still not done.

You need to add a **.babelrc** file in the root.

```json
{
  "env": {
    "production": {
      "plugins": [["emotion", { "hoist": true }],
                 "transform-decorators-legacy"]
    },
    "development": {
      "plugins": [["emotion", { "sourceMap": true, "autoLabel": true }],
      "transform-decorators-legacy"]
    }
  }
}
```

Still not done, but almost.

Now you need to add a **config-overrides.js** file in the root.

```javascript
module.exports = function override(config, env) {
  //console.log(JSON.stringify(config))
  config.module.rules[1].oneOf[1].options.babelrc = true;

  return config;
};
```

The above is what overrides the CRA config via react-app-rewired.

This could change in future versions of CRA.  Hence the console.log statement.  Use it to see the config exported and change so that it uses the babelrc file.

## Accessing Electron Remote From Renderer Process

When you are in your main application code (Renderer Process), there are times when you need to use functions from the electron package.  You can't use `import from 'electron'` but instead must use 

```javascript
const { remote, ipcRenderer } = window.require("electron");
```

This will throw errors in a js file that is using imports.  Don't know why, but here is how I worked around it.

Created an `electronExport.js` file in the root of the **components** directory.

**electronExport.js**

```javascript
const electron = window.require("electron");

export default electron;
```

That's it!

Now, I can import it and pull whatever I need from it:

```javascript
import electron from "../electronExports";

...

electron.ipcRenderer.on("route-settings", (event, message) => {
  console.log("route settings sent");
  props.history.push("/settings");
});
```



## Building Your App

First build the react application:

```
$ yarn run build
```

Next, you can package it:

```
$ yarn run pack
```

The pack script won't create an installer, just the application files.  To create an installation package run:

```
$ yarn run dist
```

