---
id: lib_overmind
title: Overmind
sidebar_label: Overmind
---

[Overmind Docs](https://www.overmindjs.org/guides?view=react&typescript=false)

## Installation

For use in react you need not only overmind, but also overmind-react:

```bash
$ yarn add overmind overmind-react
```

### DevTools

There are also nice **devTools** and a vsCode plugin.  The VSCode plugin I got working once.  The other way is to npx (run) or install the devtools.

```bash
$ npx overmind-devtools@latest
```

Or just npm install:

```bash
$ npm install overmind-devtools@latest
```

And then create a script in package.json to run it:

```json
"script": {
  ...
  "devtools": "overmind-devtools"
  ... 
}
```

When running on a Mac, you will need to initialize the overmind store giving it your local IP address.  Go to system pref, network and grab the IP from there.  Then when instantiating the store pass it in the devtools property:

```javascript
const overmind = createOvermind(config, { devtools: "192.168.1.9:3031" });
```

## Using

