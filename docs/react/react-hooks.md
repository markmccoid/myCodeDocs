---
id: react-hooks
title: React Hooks
sidebar_label: React Hooks
---

- [React Documentation on Hooks](https://reactjs.org/docs/hooks-overview.html)
- [Some Useful Hooks](https://usehooks.com/)

## Safe Set

Sometimes you will need to only use a useState setter. 

Useful if it is possible that your component will unmount after an async function runs but before it finishes.

```javascript
useEffect(() => {
  fetch('http://www.splashbase.co/api/v1/images/random?images_only=true')
    .then(response => response.json())
    .then(imageObj => safeSetRandomImage(imageObj.url))
}, [someDependancy]);

const mountedRef = useRef(false);
useEffect(() => {
  mountedRef.current = true;
    return () => (mountedRef.current = false)
  }, [someDependancy]);

const safeSetRandomImage = (...args) => mountedRef.current && setRandomImage(...args)
```

## Handle Dynamic Height Changes in Component

See Analytix Security [MainContent.js](https://github.com/analytixncs/analytixsecurity/blob/master/src/components/Main.js) and [SearchFilterBar.js](https://github.com/analytixncs/analytixsecurity/blob/master/src/components/SearchFilterBar/SearchFilterBar.js)

This is a situation where you have a component like a navbar or searchbar and the elements in it can change their height, based on items selected, etc.

To accomplish this, we will use the *useEffect* hook to setup a listener for resize events and then another *useEffect* hook to make sure those changes are reflected in our CSS, here being a styled-component.  Oh and don't forget we need some state to store the updated height in, thus we will use *useState* for this.

> The updated height (state) in this case will need to be used by the parent component most likely.  It will depend on how you have structured your application.  In this example, I have:
>
> ```jsx
> <MainContent>
>    <SearchBarFilter setSearchBarHeight={setSearchBarHeight} />
>   
>    <Grid searchBarHeight={searchBarHeight}>{children...}</Grid>
> </MainContent>
> ```
>
> Grid is a styled-component that will use the height to modify it's CSS

### useEffect to add Event Listener

The first *useEffect* hooks set up the window event listener and is only run on mounting.  Also note we are sending a cleanup function.

> The event listener will only respond to resizes of your window itself.  If you have something like a option box that when filled makes the component height larger, you will need to setup an effect to deal with those changes and update the height when that state changes.

```javascript
  // Add an event listener that fires every time window is resized
  // Use this so that we can set the 'div' height of SearchFilterBar
  useEffect(() => {
    window.addEventListener('resize', handleResize.current);
    return () => {
      window.removeEventListener('resize', handleResize.current);
    };
  }, []);
```

### handleResize Function

Note that we have a **handleResize** function that we need to create.  I am storing it in a *ref*, but I don't think that is necessary.

```javascript
  // Stores height of search bar since it dynamically gets bigger/smaller based on
  // how many companies are being searched for.  Passed up to CSS for appropriate styling
  let handleResize = useRef(() => {
    setSearchBarHeight(document.getElementById('SearchFilterBar').clientHeight);
  });
```

### useEffect To Set The New Height

Whenever the *setSearchBarHeight* function changes, we run the effect.

```javascript
useEffect(() => {
  setSearchBarHeight(
   document.getElementById('SearchFilterBar').clientHeight
  );
}, [setSearchBarHeight]);
```



### Style-component using Height

```javascript
const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  background: ${baseColors.background};
  margin-top: ${props => `${props.searchBarHeight + 10}px`};
  position: absolute;
  width: 100%;
`;
```

## *Hooks with Context

If you have some state that you will need to be sharing with via context, this seemed like a great way to "package" the state, state setters and context all together.

Main ideas for this came from [article by Kent Dodds](https://kentcdodds.com/blog/how-to-use-react-context-effectively)

The idea is that we have a single file that exports the following:

- **StateProvider** - This is the context provider and will be the default export from the file.
- **use...State** - This is the hook that will return the state values to you.  This keeps your files consuming the context from having to use the *useContext* hook and also they will not have to import the context
- **use...StateSetters** - This is the hook that returns the state setters.

I stored this file in a folder called **context** with the thought that if you have multiple sets of data that will be shared at different levels of the application, we will have different contexts.

This example is for storing information on viewing/editing a Qlikview Variable, hence all of the naming have Variable in them.

The first piece of the file creates our needed Contexts, one to hold the **State**, the other to hold the **Setters**.

Then we build the function that will return our Context Provider.

Note that all our state is created inside this provider function. 

```javascript
// variableStateContext.js

import React, { useState, useContext } from "react";

const VariableStateContext = React.createContext();
const VariableSettersContext = React.createContext();

/**======================================================
 * Provider function
 * This function is also where all the state is created
 */
function VariableStateProvider({ children }) {
  let [viewingId, setViewingIdMain] = useState();
  let [isEditing, setIsEditing] = useState(false);
  let [isDirty, setIsDirty] = useState(false);
  // When setting the viewing ID need to take into account state
  // of being edited
  let setViewingId = newViewingId => {
    if (newViewingId) {
      setIsEditing(false);
    }
    setViewingIdMain(newViewingId);
  };

  return (
    <VariableStateContext.Provider value={{ viewingId, isEditing, isDirty }}>
      <VariableSettersContext.Provider
        value={{ setViewingId, setIsEditing, setIsDirty }}
      >
        {children}
      </VariableSettersContext.Provider>
    </VariableStateContext.Provider>
  );
}

export const useVariableState = () => { ... }
export const useVariableStateSetters = () => { ... }

export default VariableStateProvider;
```

Now that we have the provider, we will build out our hooks that will get the context for us.

```js
/**======================================================
 * Variable State
 *
 * useVariableState()
 *  Returns and object with the Variable state
 *   { viewingId, isEditing, isDirty }
 *
 * Just a helper hook so that the user doesn't
 * need to import the VariableStateContext and useContext
 */
export const useVariableState = () => {
  const context = useContext(VariableStateContext);
  if (context === undefined) {
    throw new Error(
      "useVariableState must be used within a VariableStateProvider"
    );
  }
  return context;
};

/**======================================================
 * Variable State Setters
 *
 * useVariableStateSetting()
 *  Return an object with the setter functions
 *   { setViewingId, setIsEditing, setIsDirty }
 *
 *
 */
export const variableStateContext = () => {
  const context = useContext(VariableSettersContext);
  if (context === undefined) {
    throw new Error(
      "useVariableStateSetters must be used within a VariableStateProvider"
    );
  }
  return context;
};
```

Straight forward, read Kent's article for the details.  

Lastly, to implement, you will need to first place the provider around the components that need access to the state.

```jsx
import VariableStateProvider from '../context/variableStateContext';
...
<VariableStateProvider>
  <VariableMain />
</VariableStateProvider>
...
```

To access the context, just use the hooks!

```js
import { useVariableState, useVariableStateSetters} from '../context/variableStateContext';

function VariableMain() {
  let { viewingId, isEditing, isDirty } = useVariableState;
  let { setViewingId, setIsEditing, setIsDirty } = useVariableStateSetters;
  ...
}
```

## Search Input Box Hook

Originally implemented as a **Render Prop** component, this is the hook implementation.

To see the Render Prop implementation, go to [Search Input Box Component](../_components/component-searchinputbox)

The idea with this hooks is that  you will pass it the **searchArray** that will be used to match with typed in input.  The hook returns the following:

```javascript
{
  searchingIsOn, // boolean letting us know if the search function is active
  spreadProps // props that need to be spread on the input control
}
```

**spreadProps** is itself an object the contains

```javascript
spreadProps: {
  ref,
  value,
  onKeyDown,
  onChange
}
```

Since the updated **value** is always being returned in spreadProps, you can pull it out early on and use it as needed:

```jsx
import React from "react";
import useSearchInput from "./useSearchInput";

const authors = [
  { author: "mark" },
  { author: "lori" },
  { author: "Haley" },
  { author: "Hunter" }
];

function App() {
  let [author, setAuthor] = React.useState("");
  let {searchingIsOn, spreadProps} = useSearchInput({
    searchArray: authors.map(author => author.author)
  });
  let { value } = spreadProps;
  
  return (
    <div className="App">
      <input 
      style={searchingIsOn ? { backgroundColor: 'white'} : {backgroundColor: 'yellow'}}
      {...spreadProps} placeholder="Use an Author" />
    </div>
  );
```

### Code for useSearchInput hook

```javascript
import { useState, useRef, useEffect } from "react";
/**
 * parameters: { searchArray: [] }
 * Uses the passed searchArray and display like google predictive search
 * Escape key press turns off searching, press again, turns back on
 * the "searchingIsOn" value returned from useSearchInput() lets you know if
 * searching is on or off
 *
 * @param {Object} - { searchArray: [] }
 * @example
 *   let {searchingIsOn, spreadProps} = useSearchInput({
 *     searchArray: arrayToSearch
 *   });
 *  // get the value so you can use it after it is input
 *   let { value } = spreadProps;
 *  ....
 *  <input {...spreadProps}
 *    style={searchingIsOn ? { backgroundColor: 'white'} : {backgroundColor: 'yellow'}}
 *    placeholder="Input a Value"
 *  />
 */
const useSearchInput = ({ searchArray }) => {
  const [inputValue, setInputValue] = useState("");
  const [backspace, setBackspace] = useState(false);
  const [escKey, setEscKey] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [endPos, setEndPos] = useState(0);
  const inputEl = useRef();

  const onKeyDown = e => {
    const keyPressed = e.key;
    //Check keyPressed and set selection
    switch (keyPressed) {
      case "ArrowRight":
        setStartPos(inputEl.current.selectionStart + 1);
        setEndPos(inputEl.current.selectionStart + 1);
        break;
      case "ArrowLeft":
        setStartPos(inputEl.current.selectionStart - 1);
        setEndPos(inputEl.current.selectionStart - 1);
        break;
      case "Backspace":
        if (startPos !== endPos) {
          setStartPos(inputEl.current.selectionStart);
          setEndPos(inputEl.current.selectionStart);
        } else {
          setStartPos(inputEl.current.selectionStart - 1);
          setEndPos(inputEl.current.selectionStart - 1);
        }
        setBackspace(true);
        break;
      case "Delete":
        setStartPos(inputEl.current.selectionStart);
        setEndPos(inputEl.current.selectionStart);
        setBackspace(true);
        break;
      case "Escape":
        setStartPos(inputEl.current.selectionStart);
        setEndPos(inputEl.current.selectionStart);
        setEscKey(!escKey);
        break;
      default:
        break;
    }
  };
  const onInputChange = e => {
    //Get input value
    //CHECK FOR this.state.backspace and if true, set state to target.value passed
    // and set backspace to false
    const inputValue = e.target.value;
    if (backspace || escKey) {
      setInputValue(inputValue);
      setBackspace(false);
      return;
    }
    //Setup match expression
    const matchExpr = inputValue.length > 0 ? "^" + inputValue : /.^/;
    //Create RegExp Object
    const expr = new RegExp(matchExpr, "ig");
    //Try and Find a match in array of service inputValues
    const foundItem = searchArray.find(desc => desc.match(expr));
    // console.log(`foundItem ${foundItem}`);
    //If not found, return inputValue, else return found item and set selection range
    const finalValue = foundItem || inputValue;

    setStartPos(inputValue.length);
    setEndPos(finalValue.length);
    // console.log(`startpos: ${startPos} -- endpos: ${endPos} -- foundItem: ${foundItem}`)
    setInputValue(finalValue);
  };
  useEffect(() => {
    if (startPos !== endPos) {
      inputEl.current.setSelectionRange(startPos, endPos);
    }
  });
  return {
    searchingIsOn: !escKey,
    spreadProps: {
      ref: inputEl,
      value: inputValue,
      onKeyDown: onKeyDown,
      onChange: onInputChange
    }
  };
};

export default useSearchInput;
```







## Publish Hook to NPM

The [create-react-hook](https://www.npmjs.com/package/create-react-hook) module sets up a project so that you can deploy your react hook.

```bash
$ npx create-react-hook
? Package Name: @yournpmusename/useMyNewHook // scopes hook to your user
? Package Description: a description for the hook
? Authors GitHub Handle: markmccoid
? Github Repo Path: markmccoid\useMyNewHookd
...
```

Add your hook code to the `index.js` in the `src` directory. [Egghead course](https://egghead.io/lessons/react-extract-a-custom-hook-into-its-own-module-with-create-react-hook)

### npm version ([docs](https://docs.npmjs.com/cli/version))

You can use the command line tool `npm version ...` to bump your version.  It will also set a git tag for the version.