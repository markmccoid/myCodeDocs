---
id: react-hooks
title: React Hooks
sidebar_label: React Hooks
---

[React Documentation on Hooks](https://reactjs.org/docs/hooks-overview.html)

## Safe Set

Sometimes you will need to only use a useState setter 

```javascript
useEffect(() => {
  fetch('http://www.splashbase.co/api/v1/images/random?images_only=true')
    .then(response => response.json())
    .then(imageObj => safeSetRandomImage(imageObj.url))
}, []);

const mountedRef = useRef(false);
useEffect(() => {
  mountedRef.current = true;
    return () => (mountedRef.current = false)
  }, []);

const safeSetRandomImage = (...args) => mountedRef.current && setRandomImage(...args)
```

