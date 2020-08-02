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

You will need to make sure you have installed this using:

```bash
$ expo install react-native-gesture-handler
```



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