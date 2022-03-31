---
id: react-native
title: React Native
sidebar_label: React Native
---

## Creating Initial Application

You have two options for creating new application one is the **expo-cli**, the other is the **react-native-cli**.  We will be using the **expo-cli** as it includes a lot of stuff that you are going to need like icons, access to phone assets like the camera, etc.

To initialize a new project use:

```bash
$ npx expo-cli init projectname
```

Choose a blank project or TypeScript and then enter the name of your project.

You can also install expo-cli globally.  Thinking this may be the better way to go?  The command below will install or upgrade your expo-cli:

```bash
$ npm i -g expo-cli
```

### Upgrade the Expo SDK in a project

Run `expo upgrade` in your project directory (requires the latest version of `expo-cli`, you can update with `npm i -g expo-cli`).

When you install/upgrade the expo-cli, you should be given the option to upgrade your existing apps.  Alternatively you can runn the following commands:

```bash
$ expo client:install:ios
$ expo client:install:android
```

If you built a standalone app previously, [remember](https://docs.expo.io/versions/latest/workflow/publishing/#limitations) that you'll need to create a new build in order to update the SDK version. Run `expo build:ios` and/or `expo build:android` when you are ready to do a new build for submission to stores.

## Expo

[sdk 39 Changes](https://dev.to/expo/expo-sdk-39-is-now-available-1lm8)

### Selecting devices

You can now pick which device or simulator to run your app on.

After running `expo start`, press:

- **shift+i** to select an iOS simulator

- **shift+a** to select a connected Android device or emulator. You can also run your project on multiple Android devices at the same time.

### Publishing an iOS app

[Building Standalone Apps](https://docs.expo.io/distribution/building-standalone-apps/)

[Deploying To App Stores](https://docs.expo.io/distribution/app-stores/)

[Uploading Apps to App Stores](Uploading Apps to the Apple App Store) and [Apple's docs](https://help.apple.com/app-store-connect/#/devb1c185036)

To build an app for iOS and get it to app store or TestFlight, you need to make a stand alone app.  It will be an IPA file.

> Before you can build the IPA file, you will need to create the app, you will need to first create an App Identifier for it.  This is under the Certificates, Identifers & Profiles section on the Apple Developer account.
> ![2021-07-05_23-08-29](../assets/react-native_create-an-app-001.png)
>
> This will allow you to **build** your IPA file.  
>
> To be able to upload it via the Transporter application, you will also need to the **App Store Connect** section in the Apple Developer account, go to **My Apps** and click the + sign to create a new app.

Follow these steps:

1. **App.json** - Update version.  Not sure how important this is.

2. **Git** - check everything into git.  Don't know if it is necessary, but it makes sense.

3. **yarn start** - Open a console and start the app, *yarn start* or *expo start*

4. **build** - Build the ipa file

   ```bash
   $ expo build:ios -t archive 
   ```

5. **build cont.** - You will log in with your expo account and then your apple developer account. Also, let Expo create all the Provisiong Profiles and credentials.

6. **Download** - Go to the link provided because once it is done, you will want to download the *ipa* file.  

7. **Upload** - you will then upload this file to Apple using the Transporter app.

### Adding App To the App Store



## Using and Displaying Icons

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

## SectionList component

The SectionList component is similar to a FlatList or ScrollView, but has the effect of keeping the Section Headers visible while scrolling through each Sections data.

One of the Props that it needs is **sections**, this is the main data structure.

It is in the format of: 

```javascript
[
  {
    title: { whatever you need }
    data: ArrayofData[]
  },
 ...
]
```

The **keyExtractor** prop is the same as the FlatList and requires a string to be returned.

There are two props that render the data.  The **renderSectionHeader** renders the headers and teh  **renderItem** renders the items from the data array associated with each "title".

These two props take functions that return the JSX to render.

**Example data**

```javascript
sectionData = [
  {
    title: { seasonName: 'season 1', seasonNumber: 1 },
    data: [{ episodeNumber: 1, episodeName: 'num 1'}, { episodeNumber: 2, episodeName: 'ep 2'}]
  }, 
  {
    title: { seasonName: 'season 2', seasonNumber: 2 },
    data: [{ episodeNumber: 1, episodeName: 'num 1'}, { episodeNumber: 2, episodeName: 'ep 2'}]
  },
]
```



**renderSectionHeader**  - `({section}) => {}` The destructered section contains ONE object out of the list of *sections*.  So *section* will destructure to `ttle and data` for ONE object in the sectionData array.

**renderItem** - `({item, index, section, separators}) => {}` This function is rendering each item under a specific section.
*section* contains the title object for ONE of the objects in the list of sections.
*item* contains  ONE of the data objects in the *data* key for the given section.

**TypeScript definitions**

```typescript
/**
  * Default renderer for every item in every section. Can be over-ridden on a per-section basis.
*/
renderItem?: SectionListRenderItem<ItemT, SectionT>;

/**
  * Rendered at the top of each section. Sticky headers are not yet supported.
*/
renderSectionHeader?: (info: { section: SectionListData<ItemT, SectionT> }) => React.ReactElement | null;

/**
  * Rendered at the bottom of each section.
*/
renderSectionFooter?: (info: { section: SectionListData<ItemT, SectionT> }) => React.ReactElement | null;

/**
  * An array of objects with data for each section.
*/
sections: ReadonlyArray<SectionListData<ItemT, SectionT>>;
```



## Text Input

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

- **onSubmitEditing** - function to call when return key is pressed
- **autoCapitalize** - Can determine what to auto capitalize [autoCapitalizeDocs](https://facebook.github.io/react-native/docs/textinput#autocapitalize)
  - `characters`: all characters.
  - `words`: first letter of each word.
  - `sentences`: first letter of each sentence (*default*).
  - `none`: don't auto capitalize anything.
- **keyboardType** - determines which keyboard to open.  Here are the ones that work across all platforms:
  - `default`
  - `number-pad`
  - `decimal-pad`
  - `numeric`
  - `email-address`
  - `phone-pad`
- **autoCorrect** - (bool) When an input is auto corrected, it can be annoying, you can turn it off by setting this to {false}
- **returnKeyType** - Determines what the return key should say.  Be aware the if you use the "next" option, you will need to programatically make it go to the next field. 



### TextInput returnKeyType Changes Focus

This is not automatic.  It seems like if. you set the **returnKeyType** to the *next* option, React Native will automatically know what you want it to do.  Not the case!  It can't read your mind yet!

Luckily, every TextInput component has the **onSubmitEditing** prop.  This prop accepts a function that is called when the return key is pressed.

You can use **refs** to set a TextInput's focus state as described in the code below.

```jsx
import React, { useRef } from 'react'
...

const MyFormComponent = () => {
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  return (
    <>
      <TextInput
        placeholder="Input1"
        autoFocus={true}
        returnKeyType="next"
        onSubmitEditing={() => ref_input2.current.focus()}
      />
      <TextInput
        placeholder="Input2"
        returnKeyType="next"
        onSubmitEditing={() => ref_input3.current.focus()}
        ref={ref_input2}
      />
      <TextInput
        placeholder="Input3"
        ref={ref_input3}
      />
    </>
  )
}
```

### Keyboard Avoiding View + Keyboard.dismiss()

Even though the keyboard is needed, it's also a pain in the ass when it covers up your inputs.  Also, it would be nice to be able to dismiss the keyboard as it could be hiding an important button!

[React Native Docs on KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview)

The basic premise is that you will use a **TouchableWithoutFeedback** component to wrap a View and when this area is pressed, the keyboard will be hidden using the React Native **Keyboard** Object.

```jsx
import React from 'react';
import { View, TextInput, 
        TouchableWithoutFeedback, Keyboard, 
        KeyboardAvoidingView } from 'react-native';

const SomeComponent = (props) => {
  ...
  return (
  <View>
  	<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    	<KeyboardAvoidingView
        behavior={"padding"}
        style={styles.someViewStyle}
      >
        <TextInput ... />  
        <TextInput ... />  
      </KeyboardAvoidingView>      
    </TouchableWithoutFeedback>  
  </View>
  )
}
...
```



## Text Component

Prety straight forward, but did find that to limit the number of lines, you pass the prop *numberOfLines*.

This will give you ellipes if the text is longer than 1 line.  Also note there is an *ellipsizeMode* that can be head, tail(*this is the default) or middle.  

```jsx
<Text numberOfLines={1} style={styles.title}>
  {movie.title}
</Text>
```





## FlatList Component

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

- **onEndReached** (function) - when the end of the list is reached this function will be called.  There is a threshold prop also that lets you determine when the "end" is reached and thus when the function is called. This is useful when you want to load more data when the end of the list is reached.  
- **keyboardDismissMode** - Super useful if you are doing any type of auto querying based on entry in a list box.  If this is set to **on-drag**, then when you drag the FlatList, the keyboard dismisses.  This is also on the ScrollView.
- **ListHeaderComponent** - You can pass a component to this prop and it will render as the header to your FlatList.  You can also pass a style object via ListHeaderComponentStyle.  Not sure of the use case for the style prop as you can simply style the header component.
- **onContentSizeChange** - prop accepts a function that will be called when the content size changes.  Not really sure when it is called, but will be called whenever you change the data being sent to the FlatList that causes a rerender.
- **onScroll** - This prop accepts a function that will be called whenever an onScroll Event occurs.  You can throttle this using the **scrollEventThrottle** property.  Since scrolling will produce a lot of events, be aware of this.

### Styling a FlatList

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



### Scroll To Top

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

### What is getItemLayout

Since the FlatList is rendered parts at a time, you can't use functions like **scrollToIndex** by themselves.  You will need to create a **getItemLayout** function and pass it as a prop of the same name to your FlatList.

This function in essence is telling the flat list how large each item is and how far to scroll to get the item in question.

```jsx
const getItemLayout = (data, index) => {
  return {
    length: height,
    offset: height * index,
    index,
  };
};
```

I believe the getItemLayout function is called when scrolling and you are using scrolltoIndex.  It lets the app know where in the list to scroll because it has all the information.

This gets tought if the height of the items in the flatlist are variable heights.

### scrollToIndex - scrollToTop - etc.

To effectively use these functions you will need to assign a ref to use in a function (useEffect or otherwise).

```jsx
// This is used in the FlatList as the HeaderComponent
const ListHeader = (show) => {
  return (
    <View style={show ? {} : { display: 'none' }}>
      <SearchBar
        placeholder="Search..."
        platform="ios"
        onChangeText={(search) => console.log('search term', search)}
      />
    </View>
  );
};

const ViewMoviesScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const flatListRef = React.useRef();
  
  const getItemLayout = (data, index) => {
    let height = index === 1 ? 70 : 150;
    return {
      length: height,
      offset: height * index - 70,
      index,
    };
  };
  
  ...
  
 useEffect(() => {
    setTimeout(() => {
      flatListRef.current.scrollToIndex({ animated: true, index: 1 });
    }, 2000);
  }, []);

  <FlatList
        data={state.oSaved.getFilteredMovies}
        ref={flatListRef}
        getItemLayout={getItemLayout}
        // onContentSizeChange={() => {
        //   if (
        //     flatListRef?.scrollToIndex &&
        //     state.oSaved.getFilteredMovies?.length
        //   ) {
        //     flatListRef.current.scrollToIndex({
        //       index: 1,
        //     });
        //   }
        // }}
        keyboardDismissMode
        onScroll={(evt) => {
          // console.log(evt.nativeEvent.contentOffset);
          if (evt.nativeEvent.contentOffset.y < -10) {
            setShowSearch(true);
          }
        }}
        scrollEventThrottle={16}
        onContentSizeChange={
          () => {
            // console.log('onContet size');
            // if (refreshing) {
            //   setRefreshing(false);
            // } else {
            //   setShowSearch(false);
            // }
          }
          //flatListRef.current.scrollToIndex({ animated: true, index: 1 })
        }
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        // columnWrapperStyle={{ justifyContent: "space-around" }}
        // numColumns={2}
        ListHeaderComponent={() => ListHeader(showSearch)}
        renderItem={({ item, index }) => {
          return (
            <ViewMoviesListItem
              movie={item}
              setMovieEditingId={setMovieEditingId}
              movieEditingId={movieEditingId}
            />
          );
        }}
      />
}

```

### Changing numColumns on the Fly

If you have a 2 column FlatList, defined by using the **numColumns** prop and you want to dynamically change it to 1 column, you will get an error saying you need to change the key prop. 

To do this, just add a prop on the FlatList called **key** and set it to change when you change the number of columns.  This will force a rerender.

> Why this doesn't usually work the way you want.  When you rerender, you will be sent back to the top of the FlatList. 

Here is an example:

```jsx
...
  return (
    <View style={styles.containerForPortrait}>
      {showSearch ? <ListSearchBar /> : null}
      <FlatList
        data={state.oSaved.getFilteredMovies}
        ref={flatListRef}
        // getItemLayout={getItemLayout}
        keyboardDismissMode
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        key={movieEditingId ? 1 : 2}
        // columnWrapperStyle={{ justifyContent: "space-around" }}
        numColumns={movieEditingId ? 1 : 2}
        renderItem={({ item, index }) => {
          return (
            <ViewMoviesListItem
              movie={item}
              setMovieEditingId={setMovieEditingId}
              movieEditingId={movieEditingId}
            />
          );
        }}
      />
    </View>
  );
```



 

## Common Modules

[React Native Hooks](https://github.com/react-native-community/hooks) - Great module for accessing common things like dimensions, photo roll, etc.

### Getting Dimensions

```javascript
...
import { useDimensions } from "@react-native-community/hooks";
...
const MyComponent = () => {
	const { width, height } = useDimensions().window;  
  return (...)
}
```

Here I am just pulling the Window dimensions.  Here is what the full object would look like:

```javascript
const dimensions = useDimensions();
// dimensions Object
{
  "screen": Object {
    "fontScale": 1,
    "height": 896,
    "scale": 2,
    "width": 414,
  },
  "window": Object {
    "fontScale": 1,
    "height": 896,
    "scale": 2,
    "width": 414,
  },
}
```

### Measuring the Layout

I don't have a good handle on how this works and there is very little onilne about it.

One little glimpse into it is buried in this [animation tutorial](https://www.youtube.com/watch?v=ZiSN9uik6OY) at around the 10:30 minute mark.

I had trouble figuring out how/when to call the `measureLayout()` function.  It works based on `refs` that are set on the Item you want to measure and the ref of the containing parent.  So both of these refs must be set before you can get any information from the function call.

It looks like if you are creating your own component, you can use the `forwardRef()` function and wrap your component in it.

But once you have both refs you can do this:

```javascript
itemToMeasureRef.measureLayout(parentRef, (x,y,width,height) => {
  // do something with these values
  // maybe set state to use 
})
```



## Images

**Display an image from a URL**

```jsx
<Image
  style={{ width: 130, height: 200, marginRight: 10 }}
  source={{ uri: movie.posterURL }}
  resizeMode="contain"
/>
```



**Get Image asset to Display**

```jsx
<Image
   style={{ width: 130, height: 200, marginRight: 10 }}
   source={require('./placeholder.png')}
   resizeMode="contain"
  />
```



## Styling

### iOS Dark Mode Issues

When using `useColorScheme` hook with Expo, you will NEED to also update your app.json file to include the following:

```json
"userInterfaceStyle": "automatic", 
    "ios": {
      "userInterfaceStyle": "automatic",
      ...
    },
    "android": {
      "userInterfaceStyle": "automatic",
      ...
    },

```

Here is an example usage:

```javascript
import { useColorScheme } from "react-native";

const RootNav = () => {
  ...
  // scheme == 'dark' or 'light' or null
  const scheme = useColorScheme();
  
}
```





### Styled Components

You can use **styled-components** with React Native.



### StyleSheet

This is the traditional way to style your app.

### Shadows

```javascript
const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
  }
})
```

## Animation

React Native has the `Animated` library that is specifically designed to help you animate stuff.

It is often paired with the `PanResponder` library.  The `PanResponer` library is what tells you how the user is interacting with the screen.  It deals with *Gestures*.

The first big distinction is that the PanResponder does not animate anything, however it is intergal in telling you what the user is doing so that you CAN animate something in response to those gestures.

The `Animated` library can then use the gesture input to animate stuff. 

See more detail in the [react-native-animation doc](./react-native-animation)

## Deep Linking

Deep linking refers to being able to access specific pages / locations / routes within your app via a *deep link* usually in the format of **appname:///**

However, the other use is opening up a third party app from within your app.  For example, opening up the IMDB application to a specific movie or tv show page.  This is done with the **Linking** module from react native.

Here is some code that will open up a specific title in the IMDB app.  Notice that the **openURL** is a promise.  It will fail if the link is invalid.  If this is the case, we will use another function on the **Linking** module to open up a web page to the imdb app so the user can download it.

```javascript
import { Linking } from "react-native";

Linking.openURL(`imdb:///title/${movie.imdbId}`)
  .catch((err) => {
    Linking.openURL(
      "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
    );
  }
)
```

### Open up Local Route with Deep Link

A common scenario would be to schedule a notification that when clicked would link to a page/route within your application.

To be able to open a local route with deep linking is handled very well by React Navigation.  This is the only way that I have used deep linking within my app.

Wherever you are definining your root **NavigationContainer**, you will pass a linking object to the linking parameter.  This object will contain the routes. 

> If you are testing in Expo, you can create an additional prefix, along with the one for your app, so that when testing, expo will accept the link.  
> `const prefix = Linking.createURL("/");`

I have found that if I am linking from a notification or anywhere else, it is best to customize how your app handles the incoming links.

[Handling links into your app](https://docs.expo.dev/guides/linking/#handling-links-into-your-app)
There are two ways to handle URLs that open your app.

1. If the app is already open, the app is foregrounded and a Linking event is fired
You can handle these events with Linking.addEventListener('url', callback).
2. If the app is not already open, it is opened and the url is passed in as the initialURL
You can handle these events with Linking.getInitialURL -- it returns a Promise that resolves to the url, if there is one.

One big "gotcha" that I have found is that if you have an authorization layer, your deep link will get "swallowed" and all that will happen is that the application will start.

To deal with this, you can see in the custom `getINitialURL()`, I am storing the link in my global store.  I will always check this when navigating to the route in question.  I got this idea from [Deep Linking with Authentication](https://cur.at/OmmSOS?m=email&sid=NkshjkX).  It has a much better approach.

Here is a sample linking object:

```javascript
const prefix = Linking.createURL("/");

const App = () => {
  const linking = {
    prefixes: [prefix, "tvtracker://"],
    config: {
      screens: {
        AppNav: {
          screens: {
            Home: {
              screens: {
                // Search: "search/:title",
                SearchStack: {
                  screens: {
                    Search: {
                      path: "search/:name",
                      parse: {
                        //right now just dealing with spaces in names
                        name: (name) => name.replace(/%20/g, " "),
                      },
                    },
                  },
                },
                Tags: "tags",
                ViewTVShowsTab: {
                  screens: {
                    DetailsModal: {
                      screens: {
                        Details: {
                          path: "details/:tvShowId",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async getInitialURL() {
      // First, you may want to do the default deep link handling
      // Check if app was opened from a deep link
      let url = await Linking.getInitialURL();
      if (url != null) {
        return url;
      }

      // Handle URL from expo push notifications
      const response = await Notifications.getLastNotificationResponseAsync();
      url = response?.notification.request.content.data.url;
      // Store the url in overmind.  Will check it in AppNav
      overmind.actions.oAdmin.setDeepLink(url);
      return url;
    },
    subscribe(listener) {
      const onReceiveURL = ({ url }) => listener(url);

      // Listen to incoming links from deep linking
      Linking.addEventListener("url", onReceiveURL);

      // Listen to expo push notifications
      const subscription = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const url = response.notification.request.content.data.url;
          // Any custom logic to see whether the URL needs to be handled
          //...

          overmind.actions.oAdmin.setDeepLink(url);
          Linking.openURL(url);
          // Let React Navigation handle the URL
          listener(url);
        }
      );

      return () => {
        // Clean up the event listeners
        Linking.removeEventListener("url", onReceiveURL);
        subscription.remove();
      };
    },
  };
```



## Finite State Machines





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

