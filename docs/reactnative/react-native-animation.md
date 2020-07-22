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

