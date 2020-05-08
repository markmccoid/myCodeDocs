---
id: react-navigation-v5
title: React Navigation V5
sidebar_label: React Navigation V5
---

Version 5 of React Navigation breaks out each navigation component into different packages that you will import.  For most navigation scenarios, I use the following:

```bash
$ yarn add @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer 
```

You will also need to install some other dependencies.  If you are using **Expo**, then run this:

```bash
$ expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

If you are not using **Expo**, then check out the docs on installing dependencies for a [bare React Native Project](https://reactnavigation.org/docs/getting-started#installing-dependencies-into-a-bare-react-native-project).

## Stack Navigator

### Navigate to a Specific Screen

This should apply to navigation to any screen, regardless of what type of Navigator it is located in.  To navigate to a specific screen, you will most likely be using the `navigation` prop.  It has several functions for navigation.

- **navigation.goBack**() - moves backwards in your history stack of screens.
- **navigation.navigate('route name')** - Must pass a route name to navigate to.  If you have nested navigators, I believe you can pass a second object with your own specific params and/or a `screen` param that will be a sub screen to navigat to.

### Passing Params

When setting up a Stack Navigator you have the options of passing **initialParams**, which is an object of parameters that will be passed when the screen in the stack is navigated to.

 ```jsx
<AuthStack.Navigator>
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{ title: "Sign In", animationTypeForReplace: "pop" }}
        initialParams={{ screenFunction: "signin" }}
      />
      <AuthStack.Screen
        name="CreateAccount"
        component={SignIn}
        options={{
          title: "Create Account",
          animationTypeForReplace: "pop"
        }}
        initialParams={{ screenFunction: "create" }}
      />
</AuthStack.Navigator>  
 ```

You can see in the above example, that I'm using the param **screenFunction** to determine what to show when this component is navigated to.  I'm using the same component for the *SignIn* and *CreateAccount* screens.

To access this param in the *SignIn* Component, you would need to access the route parameter that is passed into all screens

```jsx
const SignIn = ({ navigation, route }) => {
  let screenFunction = route.params?.screenFunction
  ...
}
```

Note the use of the *'?'* when getting the screenFunction.  This is the new [**optional chaining**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) feature in Javascript.  

You can also set Params when navigating to a new route

```jsx
...
navigation.navigate('signin', {screenFunction: 'create'})
...
```

**Summary**

- `navigate` and `push` accept an optional second argument to let you pass parameters to the route you are navigating to. For example: `navigation.navigate('RouteName', {paramName: 'value'})`.
- You can read the params through `route.params` inside a screen
- You can update the screen's params with `navigation.setParams`
- Initial params can be passed via the `initialParams` prop on `Screen`

### Stack options Object

You can configure your stack by passing a set of options via the **options** prop.

The options prop is an object with different options.  However, most of the time, you will want to pass a function that returns the options object.  The function you pass will be called with some parameters that are essential in dynamically setting some of the options.

Currently the parameters passed that I know of are:

#### navigation Parameter

The **navigation** parameter is passed to screens directly called by React Navigation.  If you need the navigation parameter in a component that doesn't get this parameter passed, you can use the hook `useNavigation` to get access to it.

```javascript
import { useNavigation } from "@react-navigation/native";
```

The most common thing you will use the **navigation** parameter for is to **navigate** to other screens.

The other is to access the **setOptions** and **setParams** functions.

#### navigation - setOptions

The **setOptions** is useful if you wanted to change the options (title, header icon, etc) from within your component.

```javascript
...
const ViewDetails = ({ navigation, route }) => {
  let movieId = route.params?.movieId;
  // Set the title to the current movie title
  navigation.setOptions({ title: movie.title });
  
  return (
    ...
    );
...    
```

#### navigation - setParams

The setParams function of the navigation parameter lets you set the Params for the Route that you are in.

```javascript
const ViewMovies = ({ navigation, route }) => {
  const { state, actions } = useOvermind();
  useEffect(() => {
    navigation.setParams({
      isFiltered: state.oSaved.filterData.tags.length > 0,
      numFilters: state.oSaved.filterData.tags.length,
    });
  }, [state.oSaved.filterData.tags.length]);
  return ( ... );
}
```





The resulting route object will look like this:

```javascript

routeObj = {
  "key": "ViewMovies-Riwdc770gfEQ4j2taPrcC",
  "name": "ViewMovies",
  "params": undefined,
  "state": Object {
    "index": 1,
    "key": "stack-4JjmGo70wv-Pvce1LTDDD",
    "routeNames": Array [
      "Movies",
      "Filter",
    ],
    "routes": Array [
      Object {
        "key": "Movies-aWZr8QGjN27WYObSQybXK",
        "name": "Movies",
        "params": Object {
          "isFiltered": false,
          "numFilters": 0,
        },
      },
      Object {
        "key": "Filter-Y5ms14pTYFFowAmqZ-a4x",
        "name": "Filter",
        "params": undefined,
      },
    ],
    "stale": false,
    "type": "stack",
  },
}
```





#### route Parameter

This is a route object.  The information in this route object varies depending on if the route you are on is a "stack" or a screen. 

 For example, I have a **ViewMovieStack** which contains two screens a View Movies screen and View Details screen.  However, the View Movies Screen is actually a stack with two screens within it.
When you first access the **ViewMovieStack** it's route object looks like this:

```json
{
  "key": "ViewMovies-j9eLVEtmovi",
  "name": "ViewMovies",
  "params": undefined,
}
```

But, once you navigate to another screen and come back to a specific screen like "movies", you will see this object:

```json
{
  "key": "ViewMovies-j9eLVEtmovi",
  "name": "ViewMovies",
  "params": undefined,
  "state": Object {
    "index": 0,
    "key": "stack-mE2AAHAyTdk",
    "routeNames": Array [
      "Movies",
      "Filter",
    ],
    "routes": Array [
      Object {
        "key": "Movies-p9XliDnxI_H",
        "name": "Movies",
        "params": undefined,
      },
    ],
    "stale": false,
    "type": "stack",
  },
}
```

Given this, if you want to set the header icon (done in options), you need to be aware of the different formats of the Route object.  Luckily **Optional Chaining** really helps us out here.  

Below is the function you would pass to the options parameter to set the right header to a different icon depending on which screen you are on.  Here is the example:

![image-20200412154856129](../assets/reactnavigation-v5-001.png)

Here is the JSX for the Stack

```jsx
<ViewStack.Navigator mode="modal">
      <ViewStack.Screen
        name="ViewMovies"
        component={ViewMoviesStack}
        options={viewMoviesOptions}
      />
      <ViewStack.Screen name="Details" component={ViewDetails} />
    </ViewStack.Navigator>
```

Here is the code for the options function:

```jsx
const viewMoviesOptions = ({ navigation, route }) => {
// Need to use optional chaining because on first show of this route (which is a stack), the route object looks like this:
  // ROUTE = {
  //   "key": "ViewMovies-j9eLVEtmovi",
  //   "name": "ViewMovies",
  //   "params": undefined,
  // }
// If optional chaining fails, it is assumed i am at the route of "Movies"
  let currentScreenName =
    route?.state?.routeNames[route.state.index] || "Movies";
  return {
    headerRight: () => {
      if (currentScreenName === "Movies") {
        return (
          <TouchableOpacity onPress={() => navigation.navigate("Filter")}>
            <FilterIcon color="black" size={30} style={{ marginRight: 15 }} />
          </TouchableOpacity>
        );
      } else if (currentScreenName === "Filter") {
        return (
          <TouchableOpacity onPress={() => navigation.navigate("Movies")}>
            <CloseIcon color="black" size={30} style={{ marginRight: 15 }} />
          </TouchableOpacity>
        );
      }
    }
  };
};
```



## Tab Navigator Icons

When you create a tab navigator, you most likely will want to have icons for each "tab".

You do this by setting them in the **screenOptions** prop on the **Tab.Navigator** component. Specifically, there is a property called **tabBarIcon**, which you will define a function for, which will return the icon for specified tab.

```jsx
<AppTabs.Navigator
      initialRouteName="ViewMovies"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "ViewMovies") {
            // Just showing how to use 'focused' var.  Once documented, then remove
            iconName = focused ? "movie" : "movie";
          } else if (route.name === "Search") {
            iconName = "search";
          }
          // You can return any component that you like here!
          return (
            <MaterialIcons
              name={iconName}
              size={size}
              color={color}
              style={{ marginTop: 5 }}
            />
          );
        }
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray"
      }}
    >
      <AppTabs.Screen
        name="ViewMovies"
        component={ViewStack}
        options={{ title: "View Movies" }}
      />
      <AppTabs.Screen name="Search" component={SearchStack} />
    </AppTabs.Navigator>
```

> Note: I will usually pull the whole *screenOptions* function out into a separate function.  It makes it easier to read.

It is important to note that **route** is one parameter that is passed to the main screenOptions function.  Now **route** can be used in any of the other function, like *tabBarIcon*.

The **tabBarIcon** property also accepts a function, some of its params are **focused**, **color**, **size**. 

**focused** - tells us if the **route.name** is currently focused.  You can imagine this function running every time the tab screen is rerendered.  If, one of the tabs is pressed, it runs through this function to reset the icons and focused state.  This is useful if you want to show a different icon or color for the focused tab.

**color** - This is either a defaulted to a system color or if you set **activeTintColor** and **inactiveTintColor** in **tabBarOptions**, those will be used.



## [Add Badges to Icons](https://reactnavigation.org/docs/tab-based-navigation#add-badges-to-icons)

