---
id: lib_zustand
title: Zustand State Managment
sidebar_label: Zustand State Managment
---

[Zustand's Github Page](https://github.com/react-spring/zustand)

Zustand is a state management package which uses the React hooks api.  

Why would I choose this over creating my own Context/hooks stuff?  First, I like the ease of setting up and using.  Very quick and easy for simple usage.

The other big thing is that it interfaces with **Redux Dev Tools**!

## Install

```javascript
$ yarn add zustand
```

## Usage

### Create Your Store

The default export from Zustand is *create*. This is a function that creates your store AND returns the hook that will be exported and used by your components.

```javascript
import create from 'zustand';

const [useStore] = create(set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 })
}));
```

The **create** function expects a function as a parameter.  This function returns an object which includes the state and the state setters for the store.  The **set** argument is the setter function that you will use in your *"actions"* (**increase, decrease** in the example).

> **set** merges state for you just like react's setState function.



### Use Your Store

Just use the hook created by your store.

```jsx
function Counter() {
  const count = useStore(state => state.count)
  return <h1>{count}</h1>
};

function Controls() {
  const increase = useStore(state => state.increase)
  return <button onClick={increase}>up</button>
};
```

#### Fetching the data you need

If you do: `const { count } = useStore()` it will work, but you will cause the component to rerender on every change to the store.

By passing the **useStore** a function (selector), and grabbing a single piece of the state, you will minimize rerenders.

If we had a store with the following:

```javascript
{
  count: 0,
  increase: () => set(state => ({ count: state.count + 1})),
  reset: () => set({ count: 0 })
}
```

When accessing these properties you could:

```javascript
const { increase, reset } = useStore()
```

The above, however, would cause the whole store to be fetched even though we are only using the two functions.  That means that this component will rerender whenever the *count* property changes, even though it is not being used in the component.

You might think, this would work:

```javascript
const { increase, reset } = useStore(state => { increase: state.include, reset: state.reset});
```

However, since Zustand does strict equality to detect changes `old === new` , sending an object back will always be NOT Equal causing a rerender every time.

You have two options.  

First, you can just break up your slices of state into separate calls to **useStore**

```javascript
const increase = useStore(state => state.increase);
const reset = useStore(state => state.reset);
```

You can also make use of the "shallow" setting.  This is straight from the docs:

If you want to construct a single object with multiple state-picks inside, similar to redux's mapStateToProps, you can tell zustand that you want the object to be diffed shallowly by passing an alternative equality function.

```javascript
import shallow from 'zustand/shallow'

// Object pick, re-renders the component when either foo or bar change
const { foo, bar } = useStore(state => ({ foo: state.foo, bar: state.bar }), shallow)

// Array pick, re-renders the component when either foo or bar change
const [foo, bar] = useStore(state => [state.foo, state.bar], shallow)

// Mapped picks, re-renders the component when state.objects changes in order, count or keys
const keys = useStore(state => Object.keys(state.objects), shallow)
```



## Using Devtools

Very easy, just import the **devtools** function from *zustand/middleware* and pass the store function to devtools and that to **create**.

However, to actually get anything logging to the redux devtool, you will need to pass a second parameter to the **set** function in your *actions*.  This second parameter is just a string, but is used to identify the action that is happening.

```javascript
{
  someState: '',
  myAction: () => set({someState: 'isSet'}, 'myAction')
}
```

Here is another example.

```javascript
import { devtools } from 'zustand/middleware'

const store = set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 }), 'increase'),
  reset: () => set({ count: 0 }, 'reset')
}));

// Usage with a plain action store, it will log actions as "setState"
const [useStore] = create(devtools(store))
```

> zustand also offers a **redux** middleware that wires up your main-reducer, sets initial state, and adds a dispatch function to the state itself and the vanilla api.



