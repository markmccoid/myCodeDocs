---
id: lib_xstate
title: XState
sidebar_label: XState
---

[XState Visualizer](https://xstate.js.org/viz/)

[XState Docs](https://xstate.js.org/viz/)

[XState Inspect](https://xstate.js.org/docs/packages/xstate-inspect/)

## Dev Tools / XState Inspect

XState has its own dev tools called xState inspect. 

To get inspect to work you need to run the inspect function and don't forget to pass the `devTools` flag in the config object in `useMachine`

```javascript
import { useMachine } from '@xstate/react';
import { inspect } from '@xstate/inspect';

import { timerMachine } from './timerMachine';

inspect({
  iframe: false,
});
export const Timer = () => {
  const [state, send] = useMachine(timerMachine, { devTools: true });	
    ...
}
```

## Targetless Events/ Action only states

If you have a state in a machine where you don't want to leave the state, but you want an action to happen when an event is sent, just leave the target as null.

Here is the state that has an event that doesn't changes state, but just causes an action.

```javascript
const timerMachine = createMachine({
  initial: 'idle',
  context: {
    duration: 60,
    elapsed: 0,
    interval: 0.1,
  },
  states: {
    idle: {
    },
    running: {
      on: {
        TOGGLE: 'paused',
        ADD_MINUTE: {
          target: undefined, // You can also omit the target and it will be assumed undefined
          actions: assign({
            duration: (context, event) => context.duration + 60,
          }),
        },
      },
    },
  },
});

```

Here is the full machine

```javascript
const timerMachine = createMachine({
  initial: 'idle',
  context: {
    duration: 60,
    elapsed: 0,
    interval: 0.1,
  },
  states: {
    idle: {
      // Reset duration and elapsed on entry
      entry: assign({
        duration: 60,
        elapsed: 0,
      }),
      on: {
        TOGGLE: {
          target: 'running',
        },
      },
    },
    running: {
      on: {
        TOGGLE: 'paused',
        ADD_MINUTE: {
          target: undefined,
          actions: assign({
            duration: (context, event) => context.duration + 60,
          }),
        },
      },
    },
    paused: {
      on: {
        TOGGLE: 'running',
        RESET: 'idle',
      },
    },
  },
});

```

## Parameterization of Actions

Actions do stuff.  One of the main things they do is modify context.  This is done with the `assign` function from XState. 

You pass assign an object and it will return a function.

You can have actions executed `onentry`, `onexit` and on transition using the `actions` property within an Event.

You can run multiple functions by passing an array of functions.

You can also parameterize your functions by passing a config object as the second argument to the `createMachine` function 

```javascript
const timerMachine = createMachine(
  {
    initial: 'idle',
    context: {
      duration: 60,
      elapsed: 0,
      interval: 0.1,
    },
    states: {
      idle: {
        // Reset duration and elapsed on entry
        entry: 'resetcontext',
        on: {
          TOGGLE: {
            target: 'running',
          },
        },
      },
      running: {
        on: {
          TOGGLE: 'paused',
          ADD_MINUTE: {
            target: undefined,
            actions: 'addMinute',
          },
        },
      },
      paused: {
        on: {
          TOGGLE: 'running',
          RESET: 'idle',
        },
      },
    },
  },
  {
    actions: {
      resetcontext: assign({
        duration: 60,
        elapsed: 0,
      }),
      addMinute: assign({
        duration: (context, event) => context.duration + 60,
      }),
    },
  }
);
```

**But Why** 

It does clean things up, but also allows you to make your machines more reusable.  The way this works is that you can **override** the actions when you call `useMachine` with whatever action is needed for the component.

For the above machine, we could have this in our React component and the `resetcontext ` passed to `useMachine` will instead be used.

```javascript
export const Timer = () => {
  const [state, send] = useMachine(timerMachine, {
    actions: {
      resetcontext: assign({
        duration: 0,
      }),
    },
  });
...
}
```

