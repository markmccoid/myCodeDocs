---
id: react-native-moti
title: React Native Moti Animation
sidebar_label: Moti Animation
---



The best overview (much better than Moti docs) is this YouTube video: [React Native Moti](https://www.youtube.com/watch?v=ynSfSf9w99M&t=5s)

## Basics

Most of the animations can be done on a view.  You simply import the **MotiView** component and pass it a **from** and **animate** prop.

> This will perform the animation on MOUNTING of the component.

```jsx
<MotiView 
  from={{
    opacity: 0,
    translateY: -100
  }}
  animate={{
    opacity: 1,
    translateY: 0
  }}
  style={styles.shape}
/>
```

### Animate a Sequence

If you want one of your animate properties to be a sequence, pass an array of appropriate values.

```jsx
<MotiView 
  from={{
    opacity: 0,
    translateY: -100
  }}
  animate={{
    opacity: 1,
    translateY: [0, -50, 0]
  }}
  style={styles.shape}
/>
```

If you want more control over how each property animates, pass on object:

```jsx
<MotiView 
  from={{
    opacity: 0,
    translateY: -100
  }}
  animate={{
    opacity: 1,
    translateY: [
      0,
    	{
        value: -50,
        type: 'timing',
        duration: 500
      },
     0
    ]
  }}
  style={styles.shape}
/>
```

### Looping and Repeating

You can create a looping animation by passing the `loop: true` option to the transition prop, or maybe also to an object on a specific type.

Also with the looping animation, you can't change the styles dynamically or weird stuff will happen?!

```jsx
<MotiView 
  from={{
    opacity: 0,
    translateY: -100
  }}
  animate={{
    opacity: 1,
    translateY: 0
  }}
  translate={{
    type: 'timing',
    loop: true
  }}
  style={styles.shape}
/>
```

You can also use the `repeat: 4` keyword to repeat `x` number of times versus an infinite loop.

### AnimatePresence

When you wrap a component or item that is conditionally shown and hidden, this will allow you to add an Exit prop to your MotiVIew to tell it how to "exit" when it is being hidden.

If you want to animate between TWO items.  One showing while the other being hidden, you will need the **exitBeforeEnter** prop, which is a boolean.

[AnimatePresence YouTube Video](https://youtu.be/ynSfSf9w99M?t=3215)

Most important thing when using the exitBeoferEnter prop is make sure components within the **AnimatePresence** component have keys.

```jsx
const Box = ({color}) => {}
  return (<MotiView 
    from={{
      opacity: 0,
      scale: .9
    }}
    animate={{
      opacity: 1,
      scale: 1
    }}
    exit={{
        opacity: 0,
          scale: .9
      }}
    style={{backgroundColor: color}}
  />);
}

<AnimatePresence exitBeforeEnter>
	{shown && <Box key='#fff' color='#fff' />}
	{!shown && <Box key='#ff0080' color='#ff0080' />}
</AnimatePresence>
```

