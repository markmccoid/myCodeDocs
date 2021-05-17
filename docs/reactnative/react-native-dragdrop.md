---
id: react-native-dragdrop
title: React Native Drag and Drop
sidebar_label: React Native Drag and Drop
---

# Drag and Drop with Reanimated 2

Trying to encapsulate this functionality into something could be put into an npm package.

## Base Components

These are the components used to facilitate the dragging and dropping.

- **DragDropEntry.tsx** - Layout component.  This is the entry point. It contains a ScrollView that will contain the drag/drop items.
- **MovieableItem.tsx** - Contains the logic for moving via Reanimated and Pan Gesture handler

Both of these components need precise information about the size of the scrollview and the item height.

If the height of the Scrollview is greater than the avaible screen size, then you won't be able to scroll to those items.

To get this information, in the **DragDropEntry.tsx** file, on the ScrollView, I set a state variable called **containerHeight** using the **onLayout** prop of the ScrollView:

```jsx
<Animated.ScrollView
	ref={scrollViewRef}
	onScroll={handleScroll}
	scrollEventThrottle={16}
	style={{ width: 200, borderWidth: 1, borderColor: "red" }}
	onLayout={(e) => {
  	setContainerHeight(e.nativeEvent.layout.height);
	}}	
	contentContainerStyle={{height: items.length * ITEM_HEIGHT}}
  > 
  ... 
</Animated.ScrollView>
```

Notice in the above that we also set teh **contentContainerStyle** and set the height to the number of items times the ITEM height.  This ensures that the content area of the scrollview can accomodate all of the items.  

> NOTE: The content height is the height of all of the content of the scroll view.  Contrast this to the containerHeight set in the onLayout.  containerHeight is the visible height of the ScrollView.

Here is a visual of these heights:

![2021-05-16_23-57-06](../assets/react-native-drag-drop-001.png)