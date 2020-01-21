---
id: react-native
title: React Native
sidebar_label: React Native
---

# Creating Initial Application

You have two options for creating new application one is the **expo-cli**, the other is the **react-native-cli**.  We will be using the **expo-cli** as it includes a lot of stuff that you are going to need like icons, access to phone assets like the camera, etc.

To initialize a new project use:

```bash
$ npx expo-cli inti projectname
```

Choose a blank project and then enter the name of your project.

## Navigation

There are options for navigation, however, **[react-navigation]( https://reactnavigation.org/docs/en/getting-started.html)** is what I use.

![](..\assets\react-native-navigation001.png)

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

![react-native-navigation002](..\assets\react-native-navigation002.png)



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



## Passing Extra Data on Navigate

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



# Using and Displaying Icons

The expo-cli sets up a huge set of icons for us to use.  You will find the details here: [github.com/expo/vector-icons](github.com/expo/vector-icons).

But you most likely will just want the list of icons [https://expo.github.io/vector-icons/](https://expo.github.io/vector-icons/).

You will notice that each icon has a name and a brand or creator of the icons like AntDesign, FontAwesome, Ionicons, etc.  You will need both the icon name and the creator name to use the icon in your project.

It is very easy, simply import as follows:

```jsx
import { FontAwesome } from '@expo/vector-icons';

const SomeComponent = () => {
	return (
    	<View>
        	<FontAwesome name="search" size={30} />
        </View>
    )
}
```

Notice that I included the size prop, however, you could also add a style to the icon and set the fontSize.

```jsx
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SomeComponent = () => {
	return (
    	<View>
        	<FontAwesome name="search" style={styles.iconStyle} />
        </View>
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        fontSize: 30,
        alignSelf: 'center'
    }
})
```

# Text Input

You can use the React Native *TextInput* control. [TextInput Docs](https://facebook.github.io/react-native/docs/textinput)

```jsx
<TextInput
  style={styles.input}
  value={searchString}
  onChangeText={e => setSearchString(e)}
/>
```

Notice that the *onChangeText* function call the function with the value in the input box which is a bit different from the web implementation.

Some other useful settings on TextInput:

- onSubmitEditing - function to call when return key is pressed
- autoCapitalize - Can determine what to auto capitalize [autoCapitalizeDocs](https://facebook.github.io/react-native/docs/textinput#autocapitalize)
- autoComplete - Can provide hints for the type of field, like username, address, etc. you can turn it off by setting this to "off". There are some other useful settings here to.
- autoCorrect - When an input is auto corrected, it can be annoying, you can turn it off by setting this to {false}

# Text Component

Prety straight forward, but did find that to limit the number of lines, you pass the prop *numberOfLines*.

This will give you ellipes if the text is longer than 1 line.  Also note there is an *ellipsizeMode* that can be head, tail(*this is the default) or middle.  

```jsx
<Text numberOfLines={1} style={styles.title}>
  {movie.title}
</Text>
```





# FlatList Component

Used to render a list of items.  There are three main props:

1. **data** - an Array of data to be used in the FlatList
2. **keyExtractor** - Each item in the list needs a key, this prop expects a function to which it will pass a single item from the array of data.  You can then use this to construct a key for that item.  NOTE: this key MUST be a STRING.
3. **renderItems** - This is a function that takes an argument (destructured as *item*).  This *item* argument is one item from the array of data that you have passed the FlatList in the data prop.  The return will be a component that will be rendered in the FlatList

```jsx
<FlatList
  data={movies.data.results}
  keyExtractor={movie => movie.id.toString()}
  renderItem={({ item }) => {
    console.log("renderItem: ", item);
    return <MovieResultItem movie={item} />;
  }}
/>
```

> NOTE: You should always render you FlatList in a View with flex: 1.  This keeps the last item in the list from being hidden by the bottom of the screen.

Some useful props for the FlatList

- **onEndReached** (function) - when the end of the list is reached this function will be called.  There is a threshold prop also that lets you determine when the "end" is reached and thus when the function is called.
- **keyboardDismissMode** - Super useful if you are doing any type of auto querying based on entry in a list box.  If this is set to **on-drag**, then when you drag the FlatList, the keyboard dismisses.  This is also on the ScrollView.

## Styling a FlatList

Usually a FlatList will show one render item per column.  This leaves all the styling to the component used in the **renderItem** prop.  However, if you want to have multiple items on a column, you would set the **numColumns** prop to something greater than one.  

When you do this, you can pass another prop,**columnWrapperStyle** and with this you can style each row.

For example, you could center each render item using:

```javascript
<FlatList
  data={state.oSaved.getFilteredMovies}
  keyExtractor={(movie, idx) => movie.id.toString() + idx}
  //** Style each row, here we are centering the items **/
  columnWrapperStyle={{ justifyContent: "center" }}
  renderItem={({ item }) => {
    return <ViewMovieItem movie={item} />;
  }}
  numColumns={2}
/>
```



## Scroll To Top

When reloading a flatlist with data, such as when repopulating after a search, it will stay in the same position unless you tell it to go back to the top.  

To do this, you just need to create ref for the flatlist and then call a scroll to top function when the list is changed:

```jsx
function MyComponent() {
    const flatListRef = React.useRef()

    const scrollToTop = () => {
        // use current
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
	React.useEffect(() => {
    if (flatListRef.current) {
      scrollToTop();
    }
  }, [data_that_triggers_effect]);
  
    return (    
        <FlatList
            ref={flatListRef}
            data={...}
            ...
        />
    )
}
```



# Styling









# OLD STUFF

## App Creation

To create an app use the following:

```npm
	//Create the project -- this creates a directory of projectName
	react-native init projectName
	
	//Run the simulator
	react-native run-ios
```

## Initial App Setup
The entry points into a react native application are the *index.ios.js* and *index.andriod.js*.
The method Stephen Grider uses is to have both of these entries point be the same code. 

```javascript
	import { AppRegistry } from 'react-native';
	import App from './src/App';
	
	AppRegistry.registerComponent('manager', () => App);
```
The AppRegistry.registerComponent function has two arguments. The first must be the name you used when you ran the react-native init command. The next argument must be a function returning the a react component. Above, we are importing the App component from the src directory.

I believe that the first argument to the registerComponent function must be lower case and match the directory of the application.
The second function is redirecting to the root js file for the application.  Here we are using App.js as the root.

> NOTE: To get a view to scroll you need to put a style of flex: 1 on the top level view of the components you want to be scrollable:

```javascript
<View style={{ flex: 1 }}>
	<Header headerText='Albums!'/>
	<AlbumList />
</View>
```

## Boilerplate for a Redux application
### using react-native-router-flux for navigation
Below is the boilerplate code for an application using redux and navigation with [react-native-route-flux](https://github.com/aksonov/react-native-router-flux).

```javascript
	import React from 'react';
	import { View, Text } from 'react-native';
	import { Provider } from 'react-redux';
	import { createStore, applyMiddleware } from 'redux';
	import ReduxThunk from 'redux-thunk';
	import reducers from './reducers';
	import firebase from 'firebase';
	
	import Router from './Router';
	
	class App extends React.Component {
	  componentWillMount() {
	    // Initialize Firebase
	    const config = {
	      apiKey: 'AIzaSyBq6sapPRNHlRxaLU5UzwsnYpHJRnvwLMg',
	      authDomain: 'manager-642cb.firebaseapp.com',
	      databaseURL: 'https://manager-642cb.firebaseio.com',
	      storageBucket: 'manager-642cb.appspot.com',
	      messagingSenderId: '67690040094'
	    };
	    firebase.initializeApp(config);
	  }
	  render() {
	    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
	    //store.subscribe(()=> console.log(store.getState()));
	    return (
	      <Provider store={store}>
	          <Router />
	      </Provider>
	    );
	  };
	}
	
	export default App;
```


#### Redux setup
This example is creating the redux store in the app code.  Note that the reducers import is a folder with an index file that is exporting all of the specific reducer JS files.
The reducer index file is using the combineReducers() function to export a reducer for the store to use:

```javascript
	import { combineReducers } from 'redux';
	import AuthReducer from './AuthReducer';
	import EmployeeFormReducer from './EmployeeFormReducer';
	
	export default combineReducers({
	  auth: AuthReducer,
	  employeeForm: EmployeeFormReducer
	});
```

#### Navigation with react-native-router-flux
In this app, we have store our routes (Scenes) in a separate **Router.js** file.
```javascript
	import React from 'react';
	import { Scene, Router } from 'react-native-router-flux';
	import LoginForm from './components/LoginForm';
	import EmployeeList from './components/EmployeeList';
	import EmployeeCreate from './components/EmployeeCreate';
	import { Actions } from 'react-native-router-flux';
	
	const RouterComponent = () => {
	
	  return (
	    <Router sceneStyle={{ paddingTop: 65}}>
	      <Scene key="auth">
	        <Scene key="login" component={LoginForm} title="Please login" />
	      </Scene>
	      <Scene key="main">
	        <Scene
	          initial
	          rightTitle="Add"
	          onRight={() => Actions.employeeCreate()}
	          key="employeeList"
	          component={EmployeeList}
	          title="Employees"
	        />
	        <Scene key="employeeCreate" component={EmployeeCreate} title="Create Employee" />
	      </Scene>
	    </Router>
	  );
	};
	
	export default RouterComponent;
```

The top level component for navigation with this component is **\<Router\>**.
The children of this component will be **\<Scene\>** components.  Each Scene is a view/separate screen in your application.
Scenes can have nested scenes.  The top level Scenes are useful for grouping scenes together allowing navigation back to a group.  However, when navigating to a group, only the first scene OR the scene with the key of **initial** set to true will show.
For scenes to display, there are three required keys, they are:
- **key** - this is the name that you will reference to in the Actions call to show the scene.
- **component** - this is the actual component that will be shown.
- **title** - this is the title of the scene.

**Other useful keys:**
- **rightTitle** - this will display a title link in the right side of the header.
- **onRight** - this is a function that will be called when the rightTitle is pressed.


## Common React Native Components

- **View** - Anything shown on the screen must be wrapped in a view
- **Text** - Text to display on the screen
- **TouchableOpacity** - Wraps a Text component and allows it to be pressed.
- **Modal**


# Config / App Secrets File

You should create a file outside of your components directory that will hold some basic configuration and items you want hidden from users.

Configuration would include device screen dimensions, api URLs, api Keys.

For Firebase, you could keep your firebase config and api information in a file like this.

Below is an example that gets device dimensions.

```javascript
'use strict'

import Dimensions from 'Dimensions';

const window = Dimensions.get('window');

export default {
  windowHeight: window.height,
  windowWidth: window.width,

  windowHeightHalf: window.height * 0.5,
  windowHeightThird: window.height * 0.333,
  windowHeightTwoThirds: window.height * 0.666,
  windowHeightQuarter: window.height * 0.25,
  windowHeightFifth: window.height * 0.20,
  windowHeightThreeQuarters: window.height * 0.75,

  windowWidthHalf: window.width * 0.5,
  windowWidthThird: window.width * 0.333,
  windowWidthTwoThirds: window.width * 0.666,
  windowWidthQuarter: window.width * 0.25,
  windowWidthFifth: window.width * 0.20,
  windowWidthThreeQuarters: window.width * 0.75,
  windowWidthNineTenths: window.width * 0.9,

  apiUrl: 'https://newsapi.org/v1',
  apiKey: 'YOUR_API_KEY', // add your API key here

  /*
   * Create your own API key by signing up for newsapi.org: https://newsapi.org/
   * Plug it in here. We will explain how to use this in the next lesson
   */
}
```



# Third Party Components
## [react-native-navigation](https://wix.github.io/react-native-navigation/#/)
A native navigation solution from Wix.  Note that if you are using a create-react-native-app installation, you will need to eject before using Wix react native navigation.
The intallation can be a bit tricky.  You have to get into the xcode project, but I found their instructions to be sufficient.

## [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
Gives you access to icons to use within your application.  I have only used the Ionicons font.  You can view the available Ionicons at [Ionicons Available](https://ionicframework.com/docs/ionicons/).  Note that the name one the left is not the name to use, you must click on the icons to display the different names, usually prefixed with 'ios' or 'md'.

You can access an icon via the Icon component as follows:

```javascript
import Icon from 'react-native-vector-icons/Ionicons'

...
//View other component properties on their gitHub page
<Icon name='ios-arrow-forward' size={20} />
```

You can also use the Icon component to get a bitmapped image returned.  the getImageSource returns a promise.

```javascript
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const startTabs = () => {
  Promise.all([
    Icon.getImageSource('ios-albums', 30),
    Icon.getImageSource('ios-car', 30)  
  ]).then(sources => {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: 'car-tracker.ServiceListScreen',
          label: 'Service List',
          icon: sources[0],
          title: 'Service List'
        },
        {
          screen: 'car-tracker.CarScreen',
          label: 'Car Detail',
          icon: sources[1],
          title: 'Car List'
        },
      ]
    });
  });
}

export default startTabs;
```


## [react-native-communications](https://github.com/anarchicknight/react-native-communications)

Open a web address, easily call, email, text, iMessage (iOS only) someone in React Native

# React Native Playground

[Snack.io](https://snack.expo.io/)

This is a site that uses expo and allows you to test React Native code similar to codepen, jsbin, etc.

