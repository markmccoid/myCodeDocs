---
id: typescript-basics
title: Typescript Basics
sidebar_label: Typescript Basics
---

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

## Install Typescript

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
  
}

// for classes, either JavaScript created or you created
if (someClass instanceOf Array) {
  
}
```

