---
id: baby-redux
title: Simple Redux Package
sidebar_label: Simple Redux Package
---

This is a sample Redux implementation to help me understand the internals of how the real redux package works.

```javascript
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

// Action Creators
function addToDo(todo) {
  return {
    type: ADD_TODO,
    todo
  };
}
function removeToDo(id) {
  return {
    type: REMOVE_TODO,
    id
  };
}
function toggleToDo(id) {
  return {
    type: TOGGLE_TODO,
    id
  };
}

function addGoal(goal) {
  return {
    type: ADD_GOAL,
    goal
  };
}
function removeGoal(id) {
  return {
    type: REMOVE_GOAL,
    id
  };
}

// App Reducer
function app (state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  };
}

// Reducer
function todos (state = [], action) {
  switch(action.type) {
    case ADD_TODO:
      return [...state, action.todo];
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) => todo.id !== action.id ? todo : { ...todo, complete: !todo.complete })
    default:
      return state;
  }  
}

function goals (state =[], action) {
  switch (action.type) {
    case ADD_GOAL:
      return [...state, action.goal];
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}



function createStore(reducer) {
  // Parts of the store
  // 1. The state
  // 2. Get the state
  // 3. Listen to changes in the state
  // 4. Update the state

  let state;
  let listeners = [];

  // 2. get the state
  const getState = () => state;
  // 3. listen
  const subscribe = (listener) => {
    listeners.push(listener);
    // Return an "unsubscribe" function
    // which just filters out the subscribed function
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    }
  };

  // 4. update the state
  const dispatch = (action) => {
    // call our reducer(s)
    state = reducer(state, action);
    // loop over all listeners and invoke them
    listeners.forEach((listener) => listener())

  };

  return {
    getState,
    subscribe,
    dispatch,
  }
}

// create the store, passing in the main reducer
const store = createStore(app);

store.subscribe(() => console.log('CurrentState: ', store.getState()));

store.dispatch(addToDo(
  {
    id: 1,
    name: 'walk the dog',
  }
  ));

store.dispatch(addToDo({
    id: 2,
    name: 'Brain feeding',
  }
  ));

store.dispatch(toggleToDo(2))

store.dispatch(addGoal({id: 0, goal: 'Be Happy'}))

// // Actions
// {
//   type: ADD_TODO,
//   todo: {
//     id: 1,
//     name: 'walk the dog',
//   }
// }

// {
//   type: REMOVE_TODO,
//   id: 1
// }

// {
//   type: TOGGLE_TODO,
//   id: 1
// }
```

