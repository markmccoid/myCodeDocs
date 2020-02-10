---
id: lib_overmind
title: Overmind
sidebar_label: Overmind
---

[Overmind Docs](https://www.overmindjs.org/guides?view=react&typescript=false)

## Installation

For use in react you need not only overmind, but also overmind-react:

```bash
$ yarn add overmind overmind-react
```

### DevTools

There are also nice **devTools** and a vsCode plugin.  The VSCode plugin I got working once.  The other way is to npx (run) or install the devtools.

```bash
$ npx overmind-devtools@latest
```

Or just npm install:

```bash
$ npm install overmind-devtools@latest
```

And then create a script in package.json to run it:

```json
"script": {
  ...
  "devtools": "overmind-devtools"
  ... 
}
```

When running on a Mac, you will need to initialize the overmind store giving it your local IP address.  Go to system pref, network and grab the IP from there.  Then when instantiating the store pass it in the devtools property:

```javascript
const overmind = createOvermind(config, { devtools: "192.168.1.9:3031" });
```

## Using

You will want to really think about the structure of your data and your application before embarking on setting up Overmind.  A couple of things to consider:

1. **Data grouping / Namespacing** - To make things easier to reason about, you most likely will want to split the data into separate namespaces.  An obvious on for many application is  **User** namespace separate from your main data.  
2. **Initializing Data** -  Will you need to hydrate or load data when the app loads?  This will happen using the *onInitialize* feature of overmind.  It is passed to the config object to the key ***onInitialize***
3. **Separating Actions and Effects** - Overmind has a distinction between effects and actions.  *Effects* seeming to be the side effects, like fetching from an API and the *actions* to be the declarative what we are going to do.



## Config

Your config object is passed to the **createOvermind()** function when creating the initial instance of overmind.

**app.js** or entry point into your application

```javascript
import { createOvermind } from 'overmind';
import { config } from './store/overmind';

const overmind = createOvermind(config)
```

Usually it makes sense to set up the config object in a separate directory *store* or *overmind*.

**overmind.js**

```javascript
import { createHook } from "overmind-react";
import * as actions from "./actions";
import * as effects from "./effects";
import onInitialize from "./onInitialize";

export const config = {
  onInitialize, // Optional
  state: {
    movies: [],
    savedMovies: []
  },
  actions,
  effects
};

// export the useOvermind hook so we can access
// the state and actions in our application
export const useOvermind = createHook();

```



### [onInitialize](https://overmindjs.org/api/onInitialize?view=react&typescript=false)

This simply a separate function will run and init your store.

```javascript
const onInitialize = async ({
  state,
  actions,
  effects
}, overmind) => {
  const initialData = await effects.api.getInitialData()
  state.initialData = initialData
}

export default onInitialize
```

See Config main example, but to run, just include the *onInitialize* object property in the config that you pass to the *createOvermind* function.  

> If you are using Namespacing, I have found that you put your onInitialize functions on the appropriate namespace.  For example, if you were initializing the user namespace and the main data namespace, you could do it from a single onInitialize function passed in one of the namespaced configs, however, it may be cleaner to keep that code separate and create an onInitialize function for each namespace.  These onInitialize functions will run in parallel, so if any init function relies on data from another, you will need to take that into consideration.

### State

#### [getters](https://overmindjs.org/guides/beginner/02_definingstate?view=react&typescript=false)

I'm looking at these getters, which can traditional JavaScript `get doSomething(){ }` style getters or Overmind's cached getter as similar to selectors in redux:

**cached getter**

```javascript
export const state = {
  title: 'My awesome title',
  upperTitle: state => state.title.toUpperCase()
}
```

This cached getter does receive two arguments, the first is the current state the getter is defined and the second all the state.  This second argument may be helpful if you have namespaces and thus multiple states.



### Actions

The Overmind actions are functions that you can call within your application.  The power is that these functions will be injected with a ***context*** property which includes **({ state, effects, actions })**.

```javascript
export const myAction = ({ state, effects, actions }, value) => { ... }
```

[Structuring the Actions File](https://overmindjs.org/guides/beginner/06_structuringtheapp?view=react&typescript=false#structuring-the-app-the-actions-file)



#### Passing Values to Actions

Most of the time you will want to pass additional information to your actions.  Like if you are performing a search, you need to know what to search for.

You can pass a second argument after the *context*.  Since you can only pass a single argument, if you need more than a single value passed, you will need to pass an object with your needed data.

```javascript
export const myOtherAction = ({ state, effects, actions }, payload) => {
	let { title, page } = payload
  ...
}
```

#### Internal Actions

If you have actions that are considered private and from this I'm understanding this to mean that the action is only used by other actions and not called externally, you can define these as internal actions. 

> This is just a convention for name spacing these actions.  I don't see anything "special" happening in the overmind library itself.  

The suggestion is to create a separate file called **internalActions.js**

```javascript
// internalActions.js
export const someInternalAction = (context) => {
  // Do your stuff -- remember you have access to
  // { state, effect, actions } from context
}
```

Then in your **actions.js** file you import the function in the internalActions.js file and export them under the name "internal"

```javascript
import * as internalFunctions from "./internalFunctions";
// export the imported internalFunctions under the internal object
// Now in your other actions you can access these functions by
// actions.internal.someInternalAction()
export const internal = internalFunctions;

export const searchByTitle = async ({ state, effects, actions }, title) => {
  actions.internal.internalFunc();
  state.movies = await effects.searchMovieByTitle(title);
};

```

### Namespacing your Config

[Namespacing Docs](https://overmindjs.org/guides/beginner/06_structuringtheapp?view=react&typescript=false#structuring-the-app-bring-it-together)

In Redux, there is the concept of breaking out your state into separate reducers and then bringing them together in a single root reducer.

In Overmind, it seems that you can create each state tree independently, with its own actions and effects, then bring all the separate state trees together in a final **namespaced** overmind configuration.

**overmind/posts/index.js**

```javascript
import { state } from './state'
import * as actions from './actions'
import * as effects from './effects'

export {
  state,
  actions,
  effects
}
```

**overmind/admin/index.js**

```javascript
import { state } from './state'
import * as actions from './actions'
import * as effects from './effects'

export {
  state,
  actions,
  effects
}
```

**overmind/index.js**

```javascript
import { namespaced } from 'overmind/config'
import * as posts from './posts'
import * as admin from './admin'

export const config = namespaced({
  posts,
  admin
})
```

When you create your **overmind** object with `const overmind = createOvermind(config);` and then access it with **useOvermind**, you will get back an object with your different namespaces.  For the above, you would get:

```javascript
let { state, actions } = useOvermind();

// state will look like this:
{
  posts: {
    //Whatever post state you have
  },
  admin: {
    //Whatever admin state you have
  }
}

//Actions will look similar
{
  posts: {
    //Whatever post actions you have
  },
  admin: {
    //Whatever admin actions you have
  }
}
```

> This is the same state/actions/effects that you will get in the **context** object passed to your actions/effects.



## Functional Programming with Overmind

Overmind has some cool functional operators built it.

[Functional Overmind Overview](https://overmindjs.org/guides/intermediate/04_goingfunctional?view=react&typescript=false)

[Functional Operators](https://overmindjs.org/api/operators?view=react&typescript=false)

