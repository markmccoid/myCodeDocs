---
id: react-native-animation
title: React Native Animation
sidebar_label: React Native Animation
---

## Expo App Using ReAnimated

This will take you through setting up an application to use the Reanimated animation library as laid out by William Candillon from [start-react-native.com](start-react-native.com)

### Create your project

First you need create your project.  The command below will invoke expo to create a project.

It will ask what type of project, simply choose one.  

```bash
$ npx expo-cli init name-of-project
$ cd name-of-project
```

### Modify the tsconfig.json

This is a link to the tsconfig that William Candillon uses

[tsconfig additions](https://github.com/wcandillon/react-native-gestures-and-animations-workshop/blob/master/tsconfig.json)

The are the additional items that can be added to the default.

```json
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
```

### eslint add ons

```bash
$ yarn add eslint eslint-config-react-native-wcandillon --dev

NOT SURE about these @react-native-community/eslint-config eslint-plugin-import
```

### Create .eslintrc

add the following to .eslintrc

```json
{
  "extends": "react-native-wcandillon"
}
```

### eslint scripts

Change in `package.json` the "lint" script and change the max warnings:

```json
    "lint": "eslint --ext .ts,.tsx .",
    "tsc": "tsc",
    "ci": "yarn lint && yarn tsc"
```

### React Navigation / Reanimated / gesture handler / Redash

Here is the basics need for react navigation

```bash
//# Redash is a utility application that is used in reanimated animations
$ yarn add react-native-redash
//# Just the base React Navigation V5 installs
$ yarn add @react-navigation/native @react-navigation/stack
//# Reanimated and the gesture handler
$ expo install react-native-gesture-handler react-native-reanimated 
//# some other installes that are useful
$ expo install react-native-screens react-native-safe-area-context @react-native-community/masked-view
//# 
$ expo install expo-asset expo-font expo-constants
```

## Reanimated Transitions

[Reanimated Docs For Transitions](https://docs.swmansion.com/react-native-reanimated/docs/transitions)

## Reanimated Timing Animations

These would be animations where you need a value to vary over time so that you have animate a style property to animate it.

## Pan Gesture Handler

[Pan Gesture Handler Docs](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan)

You will need to make sure you have installed this using:

```bash
$ expo install react-native-gesture-handler
```

In your code you will use the following import:

```javascript
// PanGestureHandler is a components and State are contants that we can compare to the real state.
import { PanGestureHandler, State } from "react-native-gesture-handler";
```

To use the *PanGestureHandler* you will need to wrap it around the component(s) you want to control/capture gestures for.

Here is an example:

**Capture Gestures**

```jsx
<PanGestureHandler
	onHandlerStateChange={myGestureEvent}
	onGestureEvent={myGestureEvent}
>
	<Animated.View
		style={{
			transform: [{ translateX }, { translateY }],
		}}
	>
		<Card />
	</Animated.View>
</PanGestureHandler>
```

Most likely the view inside will be an **Animated.View** as you probably want to move something with the gesture.

You will need to properties on the **PanGestureHandler** to capture and use the gestures movement.

**onHandlerStateChange**, **onGestureEvent**

Can't find a clear definition of what they are, but if you want to move something, you need them both.  **myGestureEvent** is defined as an Animated event.  What I can tell with an Animated.event is that they map what the handler returns to variables which can then be used in translations to move a view.

### Redash Helper for PanGestureHandler

The *react-native-redash* package has a helper that returns all the event handlers needed by the PanGestureHandler.

**Import and Use onGestureEvent**

```jsx
import { onGestureEvent } from "react-native-redash";
...
// This is from redash and would take care of the long hand way we did things
// <PanGestureHandler {...gestureHandler}> ... </PanGestureHandler>
const gestureHandler = onGestureEvent({
  state,
  translationX,
  translationY,
});
...
return (
  <View style={styles.container}>
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          transform: [{ translateX }, { translateY }],
        }}
      >
        <Card />
      </Animated.View>
    </PanGestureHandler>
  </View>
);

```

We are just spreading the return object from the **onGestureEvent**.

Here is the full example that shows how to get a card to move on the screen while saving the last value it was at when the gesture stopped.  This lets the movement pick up where it left off.

```jsx
import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { block, multiply } from "react-native-reanimated";
import { diffClamp, onGestureEvent } from "react-native-redash";

import Card from "../useTransition/Card";

const { Value, cond, set, eq, add, event } = Animated;
const { width, height } = Dimensions.get("window");

const withOffset = (
  value: Animated.Value<number>,
  state: Animated.Value<State>
) => {
  const offset = new Value(0);
  return cond(
    eq(state, State.END),
    [set(offset, add(offset, value)), offset],
    add(offset, value)
  );
};
const PanGesture = () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 200;
  0;
  // This is from redash and would take care of the long hand way we did things
  // <PanGestureHandler {...gestureHandler}> ... </PanGestureHandler>
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
  });

  // Long hand way to create the event
  // the event (Animated.event) maps the values in the inner object
  // to those variables for use in styles to transform (move) a view
  const myGestureEvent = event([
    {
      nativeEvent: {
        state,
        translationX,
        translationY,
      },
    },
  ]);
  const translateX = diffClamp(
    withOffset(translationX, state),
    0,
    width - CARD_WIDTH
  );
  const translateY = diffClamp(
    withOffset(translationY, state),
    35,
    height - CARD_HEIGHT
  );
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            transform: [{ translateX }, { translateY }],
          }}
        >
          <Card />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default PanGesture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
  },
});
```

**Some Notes**

The **diffClamp** function sets boundaries for your values.  Here that would be the translateX and translateY values.

> Use the **diffClamp** from **redash** and NOT reanimated.

From what I can tell the translateX and Y values of a view are the **top left** of the container.

![image-20200802235601734](/Users/markmccoid/Documents/Programming/myCodeDocs/docs/assets/react-native-animations-clamp-001.png)

## CSS Overlays

Many times you will want to line up objects on top of one another.  The stanard style in React Native to do this is:

```javascript
styles = StyleSheet.create({
  overlay: {
		position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  }
})
```

This is used so often, React Native has a helper for it. `StyleSheet.absoluteFillObject`. It returns the exact object from above, so you can spread it in your styles variable.

```javascript
styles = StyleSheet.create({
  overlay: {
		...StyleSheet.absoluteFillObject
  }
})
```

### Rotating Overlayed Views

This can be applied to a number of different things and not just overlayed views.  It shows how the transform array in a style is applied.

It looks like it is in the order that the transforms are specified.  Below we have three cards that are overlayed.  We rotate them with this code and get:

```jsx
<View style={styles.container}>
  // Cards is an array with 3 empty values so that we get 3 cards.
      {cards.map((id, i) => {
    	 //directions lets us dynamically assign a different angle for each card.
        let direction = 0;
        if (i === 0) {
          direction = -1;
        } else if (i === 2) {
          direction = 1;
        }
        const rotate = direction * (toggled ? Math.PI / 6 : 0);

        return (
          <Animated.View
            key={i * id}
            style={[
              styles.overlay,
              {
                transform: [
                  { translateX: -150 },
                  { rotate: rotate + "rad" },
                  { translateX: 150 },
                ],
              },
            ]}
          >
            <Card index={i} />
          </Animated.View>
        );
      })}
      <View style={{ marginBottom: 40 }}>
        <Button
          title={toggled ? "Reset" : "Start"}
          onPress={() => setToggled(toggled ? 0 : 1)}
        />
      </View>
    </View>
  );
```

![image-20200727234854343](../assets/react-native-animation-overlays-001.png)

However, if you did not apply the translateX transforms you would get this:

![image-20200727235037173](../assets/react-native-animation-overlays-002.png)

So the translateX moves the axis that the rotation will be performed around