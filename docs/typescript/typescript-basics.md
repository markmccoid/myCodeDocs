---
id: typescript-basics
title: Typescript Basics
sidebar_label: Typescript Basics
---

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

## Install Typescript

### Using Create React App

The one thing that I have found is that create-react-app installs TypeScript 4.x, but doesn't get the updated react types installed.

So after create-react-app finishes, you will need to run the following:

```bash
$ npm i --save-dev @types/react
```

[Article about TypeScript and React 17](https://medium.com/projectwt/create-react-app-17-with-typescript-4-1-3a2169be71ce)

### Manually

To get started we need to install Typescript.

```bash
$ npm install -g typescript
```

Note, you can also install `ts-node` for a command line tool to play with typescript without much tooling.

However, if you want to compile Typescript, you should only need to install Typescript.

To compile

```bash
$ tsc index.ts
```

## Typescript configuration

Usually you will want to configure how Typescript works within your project.  To do that you need a `tsconfig.json` file.

The easiest way to get this created is to run the following:

```bash
$ tsc --init
// message TS6071: Successfully created a tsconfig.json file.
```

> If you make any changes to the tsconfig.json (and you will!), you may need to restart any command prompts you are in to get the compiler to see the changes.

### Common Configuration Changes

- **outDir** - where to output the complied code
- **rootDir** - where to find the source code.

Now if you run just `tsc` at the command line, it will compile everything in the defined **rootDir** and put the built files in **outDir**

It is also useful to run `tsc` in watch mode.  This just means it will watch for changes and recompile when it sees them.

```bash
$ tsc -w
```

However,  a better way to run is to init the directory with *npm* and install nodemon and concurrently

```bash
$ npm init -y
$ npm install nodemon concurrently
```

Then in package.json, you will need to add the following scripts section:

```json
  "scripts": {
    "start:build": "tsc -w",
    "start:run": "nodemon build/index.js",
    "start": "concurrently npm:start:*"
  },
```

## TypeScript Classes

First course taken on Typescript focuses on usage in classes

### Public Constructor Arguments

If you have a class that accepts arguments and these arguments are public there is some shorthand syntax.  Here is the non shorthand:

```javascript
class Sorter {
  public collection: number[];

  constructor(collection: number[]) {
    this.collection = collection;
  }
}
```

This can be shortened to:

```javascript
class Sorter {
  constructor(public collection: number[]) {}
}
```



## Type Guards

A type guard comes in handy when you have union operators for your types.  For example, if you could accept and Array or a string.  In your function, you would be limited to only those properties that were the same between Arrays and strings, but if you use a type guard, Typescript will know what you are doing and will not throw an error.

```javascript
class Sorter {
  constructor(public collection: number[] | string) {}

  sort(): void {
    const length = this.collection.length;

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length - i - 1; j++) {
        if (this.collection[j] > this.collection[j + 1]) {
          if (this.collection instanceof Array) { // type guards
            const temp = this.collection[j];
            this.collection[j] = this.collection[j + 1];
            this.collection[j + 1] = temp;
          }
        }
      }
    }
  }
}
```

The ` if (this.collection instanceof Array){}` is the type guard.  This isn't any facing Typescript, it is JavaScript that Typescript understands and interprets. 

You will use the `instanceOf` for any value that is created with a constructor function and `typeof` for primitives:

```javascript
// for number, string, boolean and symbols
if (typeof myVariable === 'number'){
  ...
}

// for classes, either JavaScript created or you created
if (someClass instanceOf Array) {
  ...
}
```

## React and Typescript

### Generating a TypeScript React Project 

````bash
$ npx create-react-app tstest --template typescript
````

### Typing React Components and Props

If a component has Props, you should create an **Interface** for it.

```typescript
interface ComponentProps {  
    color: string 
}
```

You now need to apply that Interface and it can be done in a couple of ways.

**Apply it to the Props**

```typescript
const SomeComponent = ({ color }: ComponentProps) => {
    return (<div>Hi</div>)
}
```

If you do it the above way, you are only typing YOUR props.  But since it is a React component, react has some static variables that can exist and also if you try to pass children into the above, it will break.   **Use the below method for React components**

**Define it as a Generic** on the Component. This will also be typing the component as a React component.

```typescript
const SomeComponent: React.FC  = ({ color }) => { 
    return (<div>Hi</div>)
}
```

**React.FC** means that this is a **Functional Component**.  So you could instead type it as **React.FunctionComponent**

### Function Typing

How to type a function in an object:

```typescript
interface myInterface {
    color: string;
    onClick: () => void
}
```

### State

Usually when using **useState**, TypeScript will infer the type, however with Object and Arrays, it can't do this.

Use the following syntax:

```typescript
import { useState } from 'react';

...
const [list, setList] = useState<string[]>([]);
```

What about state that can be undefined or an object?

```typescript
const UserSearch: React.FC = () => {
  const [name, setName] = useState('');
  const [user, setUser] = useState<{ name: string; age: number } | undefined>();
  ...
  // OR you could use an interface or type
  interface UserInterface {
  name: string,
  age: number
}
const [user, setUser] = useState< UserInterface | undefined>();
```

### Events

To find out what type to use for an event, hover over the HTML element event

![img](C:\Users\Markm\Documents\GitHub\myCodeDocs\docs\typescript\typescript-basics-001.gif)

In the Image above, you can see that when you hover over the HTML Elements **onChange** event it tells you what you should type your **function** with.

If you hover over the inline function, you can find out how to type the function parameters.

[React Event Types](https://www.carlrippon.com/React-event-handlers-with-typescript)



