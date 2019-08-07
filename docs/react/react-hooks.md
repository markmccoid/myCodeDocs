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

