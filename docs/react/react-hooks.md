---
id: react-hooks
title: React Hooks
sidebar_label: React Hooks
---

[React Documentation on Hooks](https://reactjs.org/docs/hooks-overview.html)

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

## Hooks with Context

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

