---
id: react-navigation-v4
title: React Navigation V4
sidebar_label: React Navigation V4
---

## Navigation - React Navigation v4

There are options for navigation, however, **[react-navigation]( https://reactnavigation.org/docs/en/getting-started.html)** is what I use.

![](/Users/markmccoid/Documents/Programming/myCodeDocs/docs/reactnative/../assets/react-native-navigation001.png)

You will need to install react-navigation using the following:

```bash
$ npx expo-cli install react-native-gesture-handler react-native-reanimated react-navigation-stack react-navigation react-navigation-hooks
```

There a number of different types of navigators.

- Stack Navigator
- Tab Navigator
- Switch Navigator
- Drawer Navigator

Most of the time you will nest the different navigators to get the route structure that you want.  For example, if your app requires a login/auth before getting to the main application route, you would set up a switch navigator that would you a login route and a main route.  

The main route may be a tab navigator with each of its associated screens actually being stack navigators.

Some Videos:

[Combining Navigators v3](https://www.youtube.com/watch?v=w24FE9PZpzk)

[More Combining Navigators v4](https://www.youtube.com/watch?v=0VfzgFZt-AI)

### Switch Navigator

The purpose of SwitchNavigator is to only ever show one screen at a time. By default, it does not handle back actions and it resets routes to their default state when you switch away. This is the exact behavior that we want from the [authentication flow](https://reactnavigation.org/docs/en/auth-flow.html).

The authentication flow docs from React Navigation are good.

From their exampe:

```javascript
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
```

Notice the AuthLoading route.  The point of this screen is to check to see if the user is already logged in (either a token stored in AsyncStorage) and if so, then direct to the Main App route, if not, send the user to the Auth route where they can sign in or sign up.

Here is an example AuthLoadingScreen component:

```jsx
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
```

Notice it really is just displaying and ActivityIndicator until it determines if the user is logged in.

### Stack Navigator

[Stack Navigator Docs](https://reactnavigation.org/docs/en/stack-navigator.html)

You can change your App.js file that the expo-cli creates and replace it with your navigation.

```javascript
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SearchScreen from './screens/SearchScreen';

const navigator = createStackNavigator({
    Search: SearchScreen
}, {
    initialRouteName: 'Search',
    defaultNavigationObjects: {
        title: 'My App Name'
    }
});

export default createAppContainer(navigator)

```

The **createStackNavigator** function takes two objects as arguments.  The first is a list of screens (**RouteConfig Object**) and the seconds is an object of options (**StackNavigatorConfig Object**).

`createStackNavigator(RouteConfigs, StackNavigatorConfig);`

If you want to have more options for each route name (Search in the case above), you can pass an object to each route key:

```javascript
const navigator = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      title: 'Search Screen'
    }
  }
},{
  ...
})
```

I like the above so that I can explicity name each screen in the stack navigator.  However, if you prefer, you can define the navigation object in the component itself by adding it to the component as follows:

```jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DetailScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Detail Screen</Text>
    </View>
  );
};
// Here we are overriding the navigationOptions property
DetailScreen.navigationOptions = {
  title: "Details"
};
export default DetailScreen;
```

> NOTE: By doing this, you will override what is in the route config object.

The last line `export default createAppContainer(navigator)` boots up our app.

### Adding Items to Navigation Header

Many times you will want to add an icon, text or something that will cause an action in the header of your screen.  Like the **+** button in the header below.

![react-native-navigation002](/Users/markmccoid/Documents/Programming/myCodeDocs/docs/reactnative/../assets/react-native-navigation002.png)



To do this we do the following on the screen where we want the button:

```jsx
IndexScreen.navigationOptions = ({ navigation }) => {
    return {
        headerRight: (
        	<TouchableOpacity onPress={() => navigation.navigate('Create')}>
            	<Feather name="plus" size={30} style={{ marginRight: 10 }} />
            </TouchableOpacity>
        )
    }
}
```

Example of a dynamic header icon which changes based on if a modal screen is showing.

[example](#headerright-dynamic-icon-example)

The headerRight, among other options in navigationOptions can be functions:

```jsx
IndexScreen.navigationOptions = ({ navigation }) => {
    return {
          title: "View Movies",
          headerRight: () => {
            if (routeName === "ViewMoviesFilter") {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ViewMoviesScreen")}
                >
                  <AntDesign
                    name="close"
                    size={30}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            } else ...
    }
}
```

But let's say you need to **access your store via a hook**.  You can't do that in the above function directly, but what you can do is create a functional component that does all that stuff and use it inside the headerRight function.

```jsx
navigationOptions: ({ navigation }) => {
  let movie = navigation.getParam("movie");
  // Get number of tags for movieId

  // console.log("DETAIL PARAMS", numberOfTags);
  return {
    title: movie.title,
    headerTitleStyle: { fontSize: 22 },
    headerRight: () => {
      let routeName =
          navigation.state.routes[navigation.state.index].routeName;
      if (routeName === "MovieDetailTagEdit") {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("MovieDetailScreen")}
            >
            <AntDesign
              name="close"
              size={30}
              style={{ marginRight: 10 }}
              />
          </TouchableOpacity>
        );
      } else {
        return (
          <MovieDetailHeaderRight
            navigate={navigation.navigate}
            movie={movie}
            />
        );
      }
    }
  };
}
```

Notice the **MovieDetailHeaderRight** functional component:

```jsx
import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Badge } from "react-native-elements";
import { useOvermind } from "../store/overmind";

export const MovieDetailHeaderRight = props => {
  let { state } = useOvermind();
  const numberOfTags = state.oSaved.getMovieTags(props.movie.id).length;
  return (
    <TouchableOpacity
      onPress={() =>
        props.navigate("MovieDetailTagEdit", { movie: props.movie })
      }
    >
      <Feather name="tag" size={30} style={{ marginRight: 10 }} />
      {numberOfTags ? (
        <Badge
          status="success"
          value={numberOfTags}
          containerStyle={{
            position: "absolute",
            top: -5,
            right: 10
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};
```



### Tab Navigator

There are a couple of Tab Navigators

- [createBottomTabNavigator](https://reactnavigation.org/docs/en/bottom-tab-navigator.html)
- [createMaterialBottomTabNavigator](https://reactnavigation.org/docs/en/material-bottom-tab-navigator.html)
- [createMaterialTopTabNavigator](https://reactnavigation.org/docs/en/material-top-tab-navigator.html)

I will go over creating the Bottom Tab Navigator.

[Tab Navigator Scenarios](https://reactnavigation.org/docs/en/tab-based-navigation.html)

While each tab in the tab navigator is associated to a screen, it can also (and usually will be) associated with a Stack Navigator.  This does two things for you, first, it gives you a title and second it give you a safe area on top.  You can also integrate buttons into this top area.

You will need to make sure you have imported the `react-navigation-tabs` module

```bash
$ yarn add react-navigation-tabs
```

You will also then import:

```javascript
import { createBottomTabNavigator } from 'react-navigation-tabs';
```

It's function arguments are similar to the Stack Navigator, you will pass a Route Config and Options:

`createBottomTabNavigator(RouteConfigs, TabNavigatorConfig);`

Here is a sample Tab Navigator

```jsx
const TabNavigator = createBottomTabNavigator(
  {
    ViewMovies: {
      screen: HomeStack,
      navigationOptions: ({ navigation }) => {
        console.log(
          "home tab nav",
          navigation.state.routes[navigation.state.index]
        );
        return {
          tabBarLabel: "View Movies",
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons
              name="movie"
              color={tintColor}
              size={24}
              style={{ marginTop: 5 }}
            />
          )
        };
      }
    },
    Search: {
      screen: SearchStack,
      navigationOptions: {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons
            name="search"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      }
    },
    Tags: {
      screen: TagScreen,
      navigationOptions: {
        tabBarLabel: "Tags",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            name="tags"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "red",
      inactiveTintColor: "gray"
    }
  }
);
//

export default createAppContainer(TabNavigator);
```

Notice that each Screen in the tab navigator can/should have its own navigationOptions object.  You can the details of what these options are here:

[Tab Navigator navigationOptions](https://reactnavigation.org/docs/en/bottom-tab-navigator.html#navigationoptions-for-screens-inside-of-the-navigator)

Setting navigationOptions is tricky in understanding what you are setting.  From what I can see, you set the navigationOptions on the child you want it set on.

[Docs for Navigation Options](https://reactnavigation.org/docs/en/navigation-options-resolution.html)

Some of these options can be configured with a function that receive props that allow you to dynamically set stuff.

For example, the *tabBarIcon* property in *navigationOptions* on each tab "screen" can be a function.  This function can accept the **tintColor** from the overall *tabBarOptions* (either *activeTintColor* or *inactiveTinColor*) or you could set it to whatever you want.

```jsx
tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            name="tags"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )	
```

 ### Understanding navigationOptions

Still don't understand fully, but they are definitely powerful and confusing.  Read [Docs for Navigation Options](https://reactnavigation.org/docs/en/navigation-options-resolution.html)

From what I can tell, all navigators (Stack, Tab, etc) take a navigationOptions property, as well as all screens within a navigator.  What gets confusing, is that just because all of these will take a navigationOptions property, doesn't mean it will always get called.  

I found that a base tabNavigator with a navigationOptions property doesn't get looked at, however, the screens within that tabNavigator can each have a navigationOptions property that does get "run".

Here is a scenario, I have a main tab navigator (TabNavigator) with three tabs, when the **Tags** tab is selected, we hide this main tab navigator and the new route will be another tab navigator (TagTabNavigator) with an icon in the headerRight that will "close" or navigate back to the main tab navigator.

![image-20191229234439385](/Users/markmccoid/Documents/Programming/myCodeDocs/docs/assets/react-native-navoptions001.png)

![image-20191229234538083](/Users/markmccoid/Documents/Programming/myCodeDocs/docs/assets/react-native-navoptions002.png)

Here is the code for the TagTabNavigator

```jsx
let TagTabNavigator = createBottomTabNavigator(
  {
    TagView: {
      screen: TagScreen,
      navigationOptions: () => {
        console.log("in TagView Tag Screen");
      }
    },
    TagEdit: {
      screen: TagEditScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      console.log("inMAINTagTab - HeaderRight");
      return {
        headerRight: (
          <TouchableOpacity onPress={() => navigation.navigate("ViewMovies")}>
            <Feather name="plus" size={30} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        )
      };
    }
  }
);
```

Here is the code for the TabNavigator.  Notice that we have the code to hide the TabNavigator on the screen that when focused we want to hide the main Tab Navigator.  We are using the **navigation.isFocused()** function to determine if this route is selected (the Tags route).

```jsx
const TabNavigator = createBottomTabNavigator({
  ViewMovies: {
    screen: HomeStack,
    navigationOptions: ({ navigation }) => {
      // console.log(
      //   "home tab nav",
      //   navigation.state.routes[navigation.state.index]
      // );
      return {
        tabBarLabel: "View Movies",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons
            name="movie"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      };
    }
  },
  Search: {
    screen: SearchStack,
    navigationOptions: ({ navigation }) => {
      console.log(
        "in searchStack",
        navigation
        // navigation.state.routes[navigation.state.index]
      );
      console.log("isfocused", navigation.isFocused());
      return {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons
            name="search"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      };
    }
  },
  Tags: {
    screen: TagStack,
    navigationOptions: ({ navigation }) => {
      // console.log(
      //   "in TagStack",
      //   navigation.state
      //   // navigation.state.routes[navigation.state.index]
      // );
      return {
        tabBarVisible: !navigation.isFocused(),
        tabBarLabel: "Tags",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            name="tags"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      };
    }
  }
});
```

#### Route in Nav Options

Still a bit hazy on this, but if you have navigationOptions in a Navigator that doesn't directly show a screen, but instead references another Navigator (Stack, Tab, etc), then to get to Params, etc, you will need to use the following syntax:

```javascript
...
navigationOptions: ({ navigation }) => {
        let params = navigation.state.routes[navigation.state.index].params;
        let routeName =
          navigation.state.routes[navigation.state.index].routeName;
        //console.log("PARAMS", params);
        let isFiltered = params ? params.isFiltered : false;
        let numFilters = params ? params.numFilters : undefined;
        console.log(
          "MOVIE TAB NAV",
          navigation.state.routes[navigation.state.index]
        );
}
...
```

Notice you will use the `navigation.state.index` to look inside the `navigation.state.routes` object to get at any params, etc.

The `navigation.state.routes` array looks like this:

```javascript
[
  Object {
    "key": "id-1579582094912-0",
    "params": Object {
      "isFiltered": false,
      "numFilters": 0,
    },
    "routeName": "ViewMoviesScreen",
  },
]
```

Depending on how many screens/routes are in the associated navigator, you will have multiple rows in the array.

If you are at the screen, that code will NOT work.  You must access it directly like this:

```javascript
navigation.state.params
// or to get the route object
navigation.state
```

The route object `navigation.state` looks like this:

```javascript
{
  "key": "id-1579582094912-0",
  "params": Object {
    "isFiltered": false,
    "numFilters": 0,
  },
  "routeName": "ViewMoviesScreen",
}
```

#### headerRight Dynamic icon example

This is an example where the ViewMovieStack referenced in the ViewMovies property has a main screen and a model.  If the modal is showing, a close icon shows in the header, if not, then a filter icon is shown.

To make this work, the modal is set to not have a header.

```jsx
const MainMovieStack = createStackNavigator(
  {
    ViewMovies: {
      screen: ViewMovieStack,
      navigationOptions: ({ navigation }) => {
        let params = navigation.state.routes[navigation.state.index].params;
        let routeName =
          navigation.state.routes[navigation.state.index].routeName;
        //console.log("PARAMS", params);
        let isFiltered = params ? params.isFiltered : false;
        let numFilters = params ? params.numFilters : undefined;
        console.log(
          "MOVIE TAB NAV",
          navigation.state.routes,
          navigation.state.index
        );
        // console.log(
        //   "MOVIE TAB PARAMS",
        //   navigation.state.routes[navigation.state.index].params
        // );
        return {
          title: "View Movies",
          headerRight: () => {
            if (routeName === "ViewMoviesFilter") {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ViewMoviesScreen")}
                >
                  <AntDesign
                    name="close"
                    size={30}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ViewMoviesFilter")}
                >
                  <Feather
                    name="filter"
                    size={30}
                    style={{
                      marginRight: 15,
                      color: isFiltered ? "green" : "black"
                    }}
                  />
                  {numFilters ? (
                    <Badge
                      status="success"
                      value={numFilters}
                      containerStyle={{
                        position: "absolute",
                        top: -5,
                        right: 10
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            }
          }
        };
      }
    },
    ...
```

Here is the **ViewMovieStack**

```jsx
const ViewMovieStack = createStackNavigator(
  {
    ViewMoviesScreen: {
      screen: ViewMovieScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerRight: (
            <TouchableOpacity
              onPress={() => navigation.navigate("ViewMoviesFilter")}
            >
              <AntDesign name="close" size={30} style={{ marginRight: 10 }} />
            </TouchableOpacity>
          )
        };
      }
    },
    ViewMoviesFilter: {
      screen: ViewMoviesFilterScreen
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);
```



### Drawer Navigator

A Drawer Navigator is one that can be pulled out from the side of the phone and has routes on it that can be selected.

Usually when you have a Drawer, you will put a menu icon in the upper left hand corner so the user has something to touch to access the drawer.

The big question is where do you place this icon, on the Drawer navigator, on the Screen or if you have a stack of screens on the stack??

Probably depends on other stuff, but if you have a drawer with one of its routes being a Stack of screens, you can set the icon (headerLeft) in the *defaultNavigationOptions* on the stack.  BUT, usually in a stack, that means you will be accessing other screens within the stack.  By setting the drawer menu icon on the main stack, it will cover up the go back icon you get by default when navigating within a stack.  

You can conquer this by checking which screen/route within the stack is active and show/hide based on this OR  you could just put it in the navigation Options for the screen you want to view it on.

Here is the code for the Drawer Navigator:

```jsx
import { createDrawerNavigator } from "react-navigation-drawer";
import ViewMovieStack from "./ViewMovieStack";

// Drawer Navigator
const ViewMovieDrawerNavigator = createDrawerNavigator({
  ALL: {
    screen: ViewMovieStack,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Ionicons name="md-home" style={{ color: tintColor }} />
      ),
      drawerLabel: "HomeAll"
    }
  },
  Favorites: {
    screen: ViewMovieStack,
    params: { folder: "favs" },
    navigationOptions: ({ navigation }) => {
      return {
        params: { folder: "favs" },
        drawerIcon: ({ tintColor }) => (
          <Ionicons name="ios-heart" style={{ color: tintColor }} />
        ),
        drawerLabel: "Favorites"
      };
    }
  }
});

export default ViewMovieDrawerNavigator;
```

![image-20191231131153354](/Users/markmccoid/Library/Application Support/typora-user-images/image-20191231131153354.png)

But now, how do we get the menu to show only on the first page of the MovieStack?

This is done inside the MovieStack creation.  You can either do it in the *navigationOptions* for the screen you want to see the menu icon in or in the *defaultNavigationOptions* if you want to turn it off/on for screens.

```jsx
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";
import ViewMovieScreen from "../screens/ViewMovieScreen";
import MovieDetailScreen from "../screens/MovieDetailScreen";

const ViewMovieStack = createStackNavigator(
  {
    ViewMovies: {
      screen: ViewMovieScreen,
      params: { folder: "all" },
      navigationOptions: ({ navigation }) => {
        return {
          title: "View Movies",
          headerLeft: ({ tintColor }) => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="md-menu" style={{ color: tintColor }} size={24} />
            </TouchableOpacity>
          )
        };
      }
    },
    ViewMoviesFav: {
      screen: ViewMovieScreen,
      params: { folder: "fav" },
      navigationOptions: {
        title: "View Favorite Movies"
      }
    },
    MovieDetail: {
      screen: MovieDetailScreen
    }
  },
  {
    initialRouteName: "ViewMovies"
    // defaultNavigationOptions: ({ navigation }) => {
    //   console.log("defaultNavnav", navigation);
    //   let showDrawerMenu = true;
    //   if (navigation.state.routeName === "MovieDetail") {
    //     showDrawerMenu = false;
    //   }
    //   return {
    //     headerLeft: showDrawerMenu
    //       ? ({ tintColor }) => (
    //           <TouchableOpacity onPress={() => navigation.openDrawer()}>
    //             <Ionicons
    //               name="md-menu"
    //               style={{ color: tintColor }}
    //               size={24}
    //             />
    //           </TouchableOpacity>
    //         )
    //       : "",
    //     drawerLabel: "Home"
    //   };
    // }
  }
);

export default ViewMovieStack;
```

The commented out *defaultNavigationOptions* show how to do it by turning the menu icon on/off.

### Hooks

[Hooks Docs](https://github.com/react-navigation/hooks)



### Passing Extra Data on Navigate

To pass data when you navigate to a new screen, you can pass a second parameter when calling **navigation.navigate**. This parameter will be an object that contains the data you want passed:

```jsx
<TouchableOpacity onPress={() => navigation.navigate('Show', { id: item.id })}>
// stuff to be pressed
</TouchableOpacity>
```

Now, you need to access that data in the **Show** screen.  This data is embedded in the navigation prop, however, there is a function on the navigation prop that makes getting this data easy - **navigation.getParam()**

```javascript
const ShowScreen = ({ navigation }) => {
	const id = navigation.getParam("id");
    ...
}
```

### Navigating Without the Navigation prop

Sometimes you need to navigate from a screen without the navigation prop.  One example is when setting up a listener for Firestore that determines if a user is logged in.  The **onAuthStateChanged** function.

To do this I needed to implement in the main App function where I was initiating the main navigation loop.

You end up setting up a NavigationService.js file that dispatches actions.

[React Navigation Docs](https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)

**NavigationService.js**

```javascript
import { NavigationActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator
};
```

Here is where I implemented on the App component and used the functions.

**App.js**

```jsx
import React from "react";
import { createAppContainer } from "react-navigation";
import { YellowBox } from "react-native";
import { initTMDB } from "tmdb_api";
import { config } from "./src/store/overmind";
import { Provider } from "overmind-react";
import { createOvermind } from "overmind";
import NavigationService from "./src/navigators/NavigationService";
import Firebase from "./src/storage/firebase";
// import MainTabNavigator from "./src/navigators/MainTabNavigator";
import AppSwitchNavigator from "./src/navigators/AppSwitchNavigator";

//import "./src/storage/firebase";

const App = createAppContainer(AppSwitchNavigator);
// suppress require cycle warning coming from tmdb_api package
YellowBox.ignoreWarnings(["Require cycle:"]);
export default () => {
  initTMDB("0e4935aa81b04539beb687d04ff414e3");
  // Sets up Listener for Auth state.  If logged
  const overmind = createOvermind(config, { devtools: "192.168.1.22:3031" });
  React.useEffect(() => {
    let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        NavigationService.navigate("App");
      } else {
        NavigationService.navigate("SignIn");
      }
    });
    return () => unsubscribe();
  });
  return (
    <Provider value={overmind}>
      <App
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </Provider>
  );
};
```









Version 5 of React Navigation breaks out each navigation component into different packages that you will import.  For most navigation scenarios, I use the following:

```bash
$ yarn add @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer 
```

You will also need to install some other dependencies.  If you are using **Expo**, then run this:

```bash
$ expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

If you are not using **Expo**, then check out the docs on installing dependencies for a [bare React Native Project](https://reactnavigation.org/docs/getting-started#installing-dependencies-into-a-bare-react-native-project).

## Hooks

**useNavigation**

```jsx
import * as React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function MyBackButton() {
  const navigation = useNavigation();

  return (
    <Button
      title="Back"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
}
```


