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

