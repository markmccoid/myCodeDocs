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

## Context To Share Machine

[Global State with Context](https://stately.ai/blog/how-to-manage-global-state-with-xstate-and-react)

First we need to create the Context.  Usually best done from a separate file:

```jsx
import React, { createContext } from 'react';
import { useInterpret, useMachine } from '@xstate/react';
import globalStateMachine from './machines/globalstatemachine';
import { ActorRefFrom, State } from 'xstate';

// interface GlobalStateContextType {
//   stateService: ActorRefFrom<typeof globalStateMachine>;
// }

export const GlobalStateContext = createContext();

export const GlobalStateProvider = (props) => {
  // const [stateService, send] = useMachine(globalStateMachine);
  const stateService = useInterpret(globalStateMachine);
  console.log('usemachine', stateService);
  // console.log("STATE SERVICE", stateService, globalStateMachine);
  return (
    <GlobalStateContext.Provider value={{ stateService }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  return React.useContext(GlobalStateContext);
};

```

To use the context and get access to the global state machine, you can use the following:

> Note: to get access to the `send` function, you can use: `globalServices.authService.send`

```javascript
import React, { useContext } from "react";
import { GlobalStateContext } from "./globalState";
import { useActor } from "@xstate/react";

export const SomeComponent = (props) => {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.authService);

  return state.matches("loggedIn") ? "Logged In" : "Logged Out";
};
```

### [useSelector](https://xstate.js.org/docs/packages/xstate-react/#useselector-actor-selector-compare-getsnapshot)

If you only need a single piece of the state, you can use the `useSelector` hook from XState for this:

```jsx
import React, { useContext } from "react";
import { GlobalStateContext } from "./globalState";
import { useSelector } from "@xstate/react";

const selector = (state) => {
  return state.matches("loggedIn");
};

export const SomeComponent = (props) => {
  const globalServices = useContext(GlobalStateContext);
  const isLoggedIn = useSelector(globalServices.authService, selector);

  return isLoggedIn ? "Logged In" : "Logged Out";
};
```

> NOTE: If you return an **Object** or **Array**, you will get rerenders on every event, even if the context that you are returning didn't change.  This is because objects are always "new"

**Solution** is to pass the `compare` parameter and do a deep compare on it.  Easiest way is to use *lodash's* `.isEqual` function.

```javascript
import { useSelector } from '@xstate/react';
import { isEqual } from 'lodash';

const getConfigData = (state) => {
  return {
    breathReps: state.context.breathReps,
    holdTime: state.context.holdTime,
    breathRounds: state.context.breathRounds,
  };
};

const objCompare = (prevObj, nextObj) => isEqual(prevObj, nextObj);

const Component = () => {  
...
const { breathReps, holdTime, breathRounds } = useSelector(
    breathStateServices.breathStateService,
    getConfigData,
    objCompare
  );
...
}
```



## Guards

Guards allow you to set conditions for when an **event's** body should be enacted.



### [Custom Guards](https://xstate.js.org/docs/guides/guards.html#custom-guards)

Custom guards are interesting, in that you can send data to the via object keys on the condition:

```javascript
const searchMachine = createMachine(
  {
    // ...
    states: {
      idle: {
        on: {
          SEARCH: {
            target: 'searching',
            // Custom guard object
            cond: {
              type: 'searchValid',
              minQueryLength: 3 //** Here is the extra data
            }
          }
        }
      }
      // ...
    }
  },
  {
    guards: {
      //** The extra data is coming in because the cond object is passed via the "guardMeta" object.
      // guardMeta: { cond: original cond object, state: current machine state BEFORE transition }
      searchValid: (context, event, { cond }) => {
        // cond === { type: 'searchValid', minQueryLength: 3 }
        return (
          context.canSearch &&
          event.query &&
          event.query.length > cond.minQueryLength 
        );
      }
    }
  }
);
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

 
