---
id: react-redux-compliment
title: Redux with React (First Doc)
sidebar_label: Redux with React (First Doc)
---



## Intro

The main parts of the redux flow for react are:

3. &lt;Provider&gt;&lt;/Provider&gt; component
4. The store
5. Middleware - applyMiddleware()
6. actions and their Action Creators
7. reducers
8. The connect function

Very similar to ES5 syntax, but a bit different when using the connect() function.

## Provider Component
The Provider component is the wrapper for our application, it will wrap react-router also:

	import { Provider } from 'react-redux';
	...
	 <Provider store={createStoreWithMiddleware(reducers)}>
	 <Router history={browserHistory} routes={routes}/>
	 </Provider>

The store is where all the data will be stored. I have seen a couple of ways to create the store.

Here is one way, it is done in the main index.js file:

```javascript
	import React from 'react';
	import ReactDOM from 'react-dom';
	import { Provider } from 'react-redux';
	import { createStore, applyMiddleware } from 'redux';
	import { Router, browserHistory } from 'react-router';
	import promise from 'redux-promise';
	
	import reducers from './reducers';
	import routes from './routes';
	
	const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
	
	ReactDOM.render(
	 <Provider store={createStoreWithMiddleware(reducers)}>
	 <Router history={browserHistory} routes={routes}/>
	 </Provider>
	 , document.querySelector('.container'));
```

## The Store

On line 11, we are creating a variable "createStoreWithMiddleware" which is setting up our createStore() function, but also passing "promise" (redux-promise), which greatly helps when pulling data using axios.

Then in the Provider component, we create the store and pass is to the store prop.

For more detail see [My Redux Pattern Docs](./my-redux-pattern#configurestorejs).

## connect() funtion

The connect() function allows you to inject your redux state into the components props object as we'll as map your action creators so that they are automatically send to the dispatch function.

We do the above two things by creating a mapStateToProps(state) function and mapDispatchToProps(dispatch) funciton.

```javascript
	function mapStateToProps(state) {
		return {
			weather: state.weather
		};
	}
	
	function mapDispatchToProps(dispatch) {
		return bindActionCreators({	fetchWeather }, dispatch);
	}
	
	export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
```

### mapStateToProps(state)

The state parameter is passed the full application state. We can then either return all of the state:

```javascript
	function mapStateToProps(state) {
		return state;
	}
```

Or, most likely just return the portion of state that this component/container needs. 

In that case, you will return an object where the key is the prop name and the value is the piece of state that you want in the component. 

> Note that the prop name (key) you choose, can be anything.

### mapDispatchToProps(dispatch) — See how to get rid of using this function.

This function creates new wrapper functions that will call the dispatch function with your action create as a parameter.
The function returns the bindActionsCreators() function, which is passed an object defining the new wrapped functions. 
It is easiest to simply use the ES6 object syntax and just pass the original action creator function name. 
This creates a wrapped function of the same name that you call via this.props.actionCreator(), which translates to dispatch(actionCreator).

The second parameter to bindActionCreators is the dispatch function that is passed as a parameter to the mapDispatchToProps function.

## export component using the connect() HOC

The last step is to export your component/container so that other components can have access.

This is done using the connect() function.

```javascript
	export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
	//Or if you do not need any application state
	export default connect(null, mapDispatchToProps)(SearchBar);
```
## Redux Shorthands for map functions

There are a few shortcuts. One will get rid of the need for the mapDispatchToProps function.

To do this, you simply pass the action creator functions that you want to "bind" to the dispatch function as an object to the second parameter to the connect() function:

```javascript
	export default connect(null, {fetchPosts: fetchPosts})(PostsIndex);
```

## HOOKS

[Redux Hooks Docs](https://react-redux.js.org/next/api/hooks)

Hooks for the most part (in my initial impression) replace the need for `connect()`, `mapStateToProps` and `mapDispatchToProps`

The two main hooks are `useSelector` and `useDispatch`

### useDispatch

**useDispatch** will return the dispatch function for you to use when dispatching actions.  Nothing new here, it used to be injected with the `connect` function, but since we won't be using `connect`, we will need to use this hook to get the `dispatch` functino.

### useSelector

**useSelector** - takes a selector function which accepts a state parameter, which is the whole state in your redux store.

```js
let pieceOfState = useSelector(state => state.pieceOfState)
```

If you need props in your selector, simply use closure

```js
let { itemId } = props;
let pieceOfState = useSelector(state => state.pieceOfState[itemId])
```

### Reselect for memoization of Selectors

The redux docs are a good place to start as they describe how to use Reselect with the `useSelector` function. [Redux Memoization Docs](https://react-redux.js.org/next/api/hooks#using-memoizing-selectors).

The main function that I have used from Reselect is the `createSelector` function.  It is a little confusing and there are some gotchas you need to watch for.

But first, how does it work?

The `createSelector` function takes in two parameters, an array of selectors and a function the will process the output from those selectors.

```js
import _ from "lodash";
import { createSelector } from "reselect";

//------------- Standard Selectors ----------------------------//
export const selectAllShows = state => state.shows;

// ----------- ReSelect Selectors ---------------------------//
export const selectShowsFromGroup = createSelector(
  [selectAllShows, (_, selectedGroup) => selectedGroup],
  (shows, selectedGroup) => {
    return shows.filter(show => show.id === selectedGroup)
    );
  }
);

// Calling Component

import { useSelector } from "react-redux";
import { selectShowsFromGroup } from './selectors'
function Shows = (props) => {
  let { group } = props;
  let showsFromGroup = useSelector(state => selectShowsFromGroup(state, group))
  
}
```

In the above example, the standard selector **selectAllShows** could be used directly in a `useSelector` call and would return  an array of the shows stored in the state.

We will use ReSelect to return only shows from a passed group.

This is where it gets a little tricky.  You need to understand that the *selectors* passed in the first argument (array) each will be called and passed the stores state and (if you need ask for it), any second parameter passed when calling the **selectShowsFromGroup** selector.

Since we don't need that second parameter in the **selectAllShows** selector, we don't worry about it in that selectors signature.  However, we do need it in the selector that the `createSelector` function is going to return.  So, we pass a second selector, in the form of an inline function that just pulls off that second parameter and returns it.

Now ReSelect passes to the second parameter of the `createSelector` all of the return values from the selectors in the first parameter.

In this case, it will return ***shows*** and ***selectedGroup***. 

> If you want to do the above from a single selector, meaning not sending in the second selector function to extract the props, you would need to make a modification in the selector you pass to createSelector and have it return an object with all the stuff you need.
>
> ```js
> //------------- Standard Selectors ----------------------------//
> export const selectAllShows = (state, props) => ({ 
>   shows: state.shows, group: props
> });
> 
> export const selectShowsFromGroup = createSelector(
>   [selectAllShows],
>   ({shows, selectedGroup}) => {
>     return shows.filter(show => show.id === selectedGroup)
>     );
>   }
> );
> ```
>
> The calling of `selectShowsFromGroup` will stay the same, but the base selector **selectAllShows** must change.  You will also no longer need that second selector function to get the props.
>
> Lastly, the function you pass as the second parameter to `createSelector` will now be accepting a single value, which is our object we created and return from **selectAllShows**.  In the above example, I'm just destructuring it.





## Redux Helper Modules - i.e. Redux Middleware

There are a couple of helper modules specifically for Redux that I have found useful.

### Redux-Promise

If it receives a promise, it will dispatch the resolved value of the promise. It will not dispatch anything if the promise rejects.

This makes it so that we do not have to deal with the promise, it will only dispatch the action if and when the promise resolves.

**redux thunk** can also deal with promises as well as a number of other situations.  

 **Setup Example:** 

```javascript
	...
	import promise from 'redux-promise';
	
	const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
	
	ReactDOM.render(
	 <Provider store={createStoreWithMiddleware(reducers)}>
	 <Router history={browserHistory} routes={routes}/>
	 </Provider>
	 , document.querySelector('.container'));

Action Creator example:

	export function createPost(props) {
		const request = axios.post(`${ROOT_URL}/posts${API_KEY}`, props);
	
		return {
			type: CREATE_POST,
			payload:request
		};
	}
```
When the above action creator is called, it will only dispatch to the reducers if and when the promise resolves.

However, wherever you call the action creator from will still return the promise if you need to use if in your code:

```javascript
		onSubmit(props) {
			this.props.createPost(props)
				.then(() => {
					browserHistory.push('/');
				});
		}
```

## combineReducers in Depth

Here is a simple sample of what the combineReducers function is doing:

```javascript
	var todos = (state = '', action) => {
	 console.log("todos");
	 return "todo";
	};
	
	var visFilter = (state = '', action) => {
	 console.log("visFilter");
	 return "visFilter";
	};
	
	var reducers = {
	 todos,
	 visFilter
	};
	
	const combineReducers = (reducers) => {
	 return (state = {}, action) => {
	 return Object.keys(reducers).reduce(
	 	(nextState, key) => {
	 		nextState[key] = reducers[key] (
	 		state[key], action);
	 		return nextState;
	 	},{});
	 };
	};
	
	console.log(combineReducers(reducers)({}, 'DONE'));
```

Output will be:

```javascript
	"todos" //Getting logged when the todos reducer is run
	"visFilter" //Getting logged when the visFilter reducer is run
	//Final object created from line 27 above.
	[object Object] {
	 todos: "todo",
	 visFilter: "visFilter"
	}
```

First thing to remember is that the const combineReducers is returning a function that accepts an object containing the state pieces with their assigned reducers:

```javascript
//This is an example of what combineReducers function does. 
//Loops through the reducers and 
const combineReducers = (reducers) => {
	return (state = {}, action) => {
		return Object.keys(reducers)
            .reduce((nextState, key) => {
              //assigning the function calls
                nextState[key] = reducers[key] (state[key], action);
                return nextState;
            },{});
	};
};
```
Next, when executing the combineReducers function, you will get back another function, which will accept the state and action parameters. 
Note, this is what our reducers need. But at this point, the state is the full state. The next part is where we dole out the pieces of state to the correct reducers.

`	return Object.keys(reducers)`

Object.keys will return an array of the keys of the object passed. In this case it will return the pieces of our state object: 

` ["todos", "visFilter"]`

Next, we will take this array of keys and pass them to the reduce() function

```javascript
return Object.keys(reducers).reduce(
	(nextState, key) => {
		nextState[key] = reducers[key] (
		state[key], action);
		return nextState;
		},{});
```

The reduce function takes a callback function with 4 parameters (prevValue, CurrValue, CurrentIndex, Array). T
he reduce function takes two arguments, the callback function and an optional intial value. However, if the initial value is supplied, then it is used as the first parameter (not confusing at all!).

So in our above example, we are passing the initial value ({}), so the **nextState** argument is actually the **CurrValue** parameter and the **Key** is the **Index.** 

Here is an example of how the reduce function works on the array Object.keys(reducers) produces

```javascript
	var reducers = {
	 todos,
	 visFilter
	};
	
	Object.keys(reducers).reduce((nextState, key) => {
	 console.log(key);
	 console.log(nextState);
	 nextState[key] = 1;
	 console.log(nextState);
	 return nextState;
	 }, {});
```

I'm not returning any functions, but this allows you to see how reduce() works. It starts with the initial value (an empty object) and the first pass through reduce sends the Initial state as nextState (an empty object). The key will be the first "reducer" sent in the form of the object keys. In this example, the reducers object contains two key "todos" and "visFilter", so "todos" will be passed as the first key. 

When we take what is currently an empty object and do this: nextState[key], JavaScript will add that key if it doesn't exist or overwrite with the value we are setting it equal to.

Last (and very important) we MUST return the nextState. This is the whole idea of a reduce function, it builds something based on each iteration.

Ok, back to the actual combineReducers function. When you invoke combineReducers and pass it an argument (an object defining the reducing functions), it returns to you a function. E.g. the first return statement. Note that this returned function takes to arguments, the state and action, just what our reducers need!

```javascript
	const combineReducers = (reducers) => {
	 return (state = {}, action) => {
	 return Object.keys(reducers).reduce(
	 (nextState, key) => {
	 nextState[key] = reducers[key] (
	 state[key], action);
	 return nextState;
	 },{});
	 };
	};
```

So, when redux finally call the function that combineReducers creates, it passes the whole state tree and the action called. Then our Object.keys().reduce does the magic of actually calling the reducers with just their portion of the state tree and reducing it back into a single state tree.

Note that in line 5 above, the reducers[key](...). We are invoking the function in the reducers[key].

Example: 

```javascript
	var reducers = {
	 todos,
	 visFilter
	};
```

If todos and visFilter both reference functions, then the following would invoke the function.

` reducers["todos"]({}, "New Todo");`

## Reducer Composition

Reducer composition sounds intimidating, but it's simpler than you might think. The idea is that you can create a reducer to manage not only each section of your Redux store, but also any nested data as well.

Let's say we were dealing with a state tree like had this structure

```
{
  users: {},
  setting: {},
  tweets: {
    btyxlj: {
      id: 'btyxlj',
      text: 'What is a jQuery?',
      author: {
        name: 'Tyler McGinnis',
        id: 'tylermcginnis',
        avatar: 'twt.com/tm.png'
      }   
    }
  }  
}
```

We have three main properties on our state tree: users, settings, and tweets. Naturally, we'd create an individual reducer for both of those and then create a single root reducer using Redux's "combineReducers" method.

```
const reducer = combineReducers({
  users,
  settings,
  tweets
})
```

combineReducers, under the hood, is our first look at reducer composition. combineReducers is responsible for invoking all the other reducers, passing them the portion of their state that they care about. We're making one root reducer, by composing a bunch of other reducers together. With that in mind, let's take a closer look at our tweets reducer and how we can leverage reducer composition again to make it more compartmentalized. Specifically, let's look how a user might change their avatar with the way our store is currently structured. Here's the skeleton with what we'll start out with -

```
function tweets (state = {}, action) {
  switch(action.type){
      case ADD_TWEET :
        ...
      case REMOVE_TWEET :
        ...
      case UPDATE_AVATAR :
        ???
  }
}
```

What we're interested in is that last one, UPDATE_AVATAR. This one is interesting because we have some nested data - and remember, reducers have to be pure and can't mutate any state. Here's one approach.

```
function tweets (state = {}, action) {
  switch(action.type){
      case ADD_TWEET :
        ...
      case REMOVE_TWEET :
        ...
      case UPDATE_AVATAR :
        return {
          ...state,
          [action.tweetId]: {
            ...state[action.tweetId],
            author: {
              ...state[action.tweetId].author,
              avatar: action.newAvatar 
            }
          }
        }
  }
}
```

That's a lot of spread operators. The reason for that is because, for every layer, we're wanting to spread all the properties of that layer on the new objects we're creating (because, immutability). What if, just like we separated our tweets, users, and settings reducers by passing them the slice of the state tree they care about, what if we do the same thing for our tweets reducer and its nested data.

Doing that, the code above would be transformed to look like this

```
function author (state, action) {
  switch (action.type) {
      case : UPDATE_AVATAR
        return {
          ...state,
          avatar: action.newAvatar
        }
      default :
        state
  }
}
 
function tweet (state, action) {
  switch (action.type) {
      case ADD_TWEET :
        ...
      case REMOVE_TWEET :
        ...
      case : UPDATE_AVATAR
        return {
          ...state,
          author: author(state.author, action)
        }
      default :
        state
  }
}
 
function tweets (state = {}, action) {
  switch(action.type){
      case ADD_TWEET :
        ...
      case REMOVE_TWEET :
        ...
      case UPDATE_AVATAR :
        return {
          ...state,
          [action.tweetId]: tweet(state[action.tweetId], action)
        }
      default :
        state
  }
}
```

All we've done is separated out each layer of our nested tweets data into their own reducers. Then, just like we did with our root reducer, we're passing those reducers the slice of the state they care about.

## Observe for Changes in Store

This is a pattern I found that allows you to watch for changes in to the data in your store and run some function when a change is found.

[Observer Pattern](https://github.com/reactjs/redux/issues/303#issuecomment-125184409)

Bottom line, this allows us to check the current state with the next state and determine if we should update. 

 **The parameters:** 

 **store -** the redux store variable

 **select -** a function that pulls the piece of state we want to check

 **onChange -** a function that will be invoked if the current and next state are different

```javascript
function observeStore(store, select, onChange) {
	let currentStatetvShows, currentStateShowData;

	function handleChange() {
		let nextStateObj = select(store.getState());

		let nextStatetvShows = nextStateObj.tvShows;
		let nextStateShowData = nextStateObj.showData;
		if (nextStatetvShows !== currentStatetvShows || nextStateShowData !== currentStateShowData) {
			currentStatetvShows = nextStatetvShows;
			currentStateShowData = nextStateShowData;
			onChange(currentStatetvShows, currentStateShowData);
		}
	}

	let unsubscribe = store.subscribe(handleChange);
	handleChange();
	return unsubscribe;
}

var unsubscribe = observeStore(store, (state) => {
	return {tvShows: state.tvShows, showData: state.showData}}, 
	(tvShows, showData) => tvMaze.saveShowData(tvShows, showData)
);
```

On lines 21-23, we call the observeStore() function, which, I believe, sets up a closure around the handleChange() function, which is what the store "subscribes" to. 
Which means that whenever a change in state occurs, the handleChange function will be called.

Because this was initiated inside the original observeStore() call, it is a closure, so the handleChange() function has access to the store, select and onChange arguments as well as any variables created outside of it (within the observeStore() function). 

This closure is what allows us to retain the state the last time that handleChange was called. Closure is cool.

Also note that the second and third parameters sent to the observeStore() function are FUNCTIONS. The **select** function determines what state gets returned from the state object.

The **onChange** function does what we want done where there is a state change in the part of the state we are observing.

## Middleware

Middleware is

Some useful pieces of middleware are:

3.  [redux-logger ](https://github.com/evgenyrodionov/redux-logger) - Which is a logger/debugger for redux
4.  redux-promise
5.  redux-thunk


## Selectors

Selectors are not a feature of redux or external library, but a concept.

Selectors are just regular functions, but they can be used to modify state data.

Here is a great video overview:
[Redux Selectors](https://www.youtube.com/watch?v=frT3to2ACCw)

## Redux DevTools Extension

[Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)

