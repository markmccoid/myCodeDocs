---
id: nodejs-basics
title: Node JS Basics
sidebar_label: Node JS Basics
---

[Node.js](https://nodejs.org/en/) 

[Node.js - Path](https://nodejs.org/api/path.html)

[Node.js File System](https://nodejs.org/api/fs.html)

## Node Basics

## process

Node's **process** object is a `global` that provides information about, and control over, the current Node.js process. As a global, it is always available to Node.js applications without using `require()`.

You can access some useful things.  Primarily the `process.argv` value.  These are the command line values that are made available.

You can also get access to environment variables - `process.env`.

If you want to get access to **stdin, stdout and stderr**, you will access them via `process.stdin`, etc.

## Useful Utility Libraries

### Yargs

This is essential to any command line node program.  yargs helps you parse command line arguments and generate help documentation for your tool.

Here is an example of using Yargs to create documentation for your tool:

```javascript
require("yargs")
  .scriptName("pirate-parser")
  .usage("$0  [args]")
  .command(
    "hello [name]",
    "welcome to yargs!",
    yargs => {
      yargs.positional("name",
{
        type: "string",
        default: "Nate",
        describe: "the name to say hello to"
      });
    },
    function(argv) {
      console.log("hello",
argv.name, "welcome to yargs!");
    }
  )
  .help().argv;
```

Now, run this command `node example.js --help` and you will get this output:

```bash
pirate-parser <cmd> [args]

  Commands:
    pirate-parser hello [name]  welcome ter yargs!
    
  Options:
    --help  Show help                                                  
 [boolean]
```

### minimist

Yargs extends minimist, but both process command line arguments.



### [Dotenv](https://github.com/motdotla/dotenv)

`dotenv` allows us to set environment variables from a `.env` file, instead of setting them on the command line. For example, if we creating a file called `.env` in the root of our project with the following contents:

```bash
ADMIN_PASSWORD=password123
JWT_SECRET=jwt123
MONGO_URI=mongodb+srv:...
```

For example, `dotenv` will make the `ADMIN_PASSWORD` in our .env file accessible to our app as: `process.env.ADMIN_PASSWORD`.

## Included Libs

Node comes with a number of included packages that you can use to do many things.

### File Processing

- path = `const path = require('path')`
- fs - `const fs = require('fs')`
- zlib - `const zlib = require('zlib')` - Streaming GZip library

## Streams

Most likely you will be dealing with either a **readable** or **writable** stream.

You **pipe** a readable stream INTO a writable stream.

```javascript
var stream1; //readable
var stream2; //writable

// the return value from a pipe is a READABLE stream.
var stream3 = stream1.pipe(stream2)

// you can chain them
stream1.pipe(stream2).pipe(anotherwritablestream);
```

### File Streams

The `fs` module allows us to create read streams, which would be reading data from a file and write streams, which would write that data out to a file.

- `fs.createReadStream(PathAndFileToREAD)`
- `fs.createWriteStream(PathAndFileToWRITE)`

### Transform streams

```javascript
var Transform = require('stream').Transform;

var inStream = fs.createReadableStream('./files/hello.txt')
var upperStream = new Transform({
  transform(chunk, enc, next) {
    this.push(chunk.toString().toUpperCase());
    next();
  },
});
var targeStream = process.stdout;

inStream.pipe(upperStream).pipe(targeStream);
```

The `new Transform({})` function returns a new writeable stream.  This means that is can accept data from a readable stream.  The cool thing is that we get access to each `chunck` as it passes through the `transform(chunk, enc, next)` function that we create.

We can do whatever is needed and then send what we want that chunk to look like via the `this.push()` method.

In the example above we are uppercasing all text coming through, but you could look for bads words and remove/replace, etc.

## Using zlib (Streaming GZip)

Below is code that shows how to use zlib, but also shows how to deal with the Asynchronous nature of streams.

We created a `streamComplete()` function which returns a promise that is watching the stream events that are emitted for an 'end' event.  Once it gets that, it resolves.

NOTE:  If you need to be able to cancel a stream, I belive you will need to use Generators.  Kyle Simpson has a package called **CAF** that helps in this regard.

```javascript
var zlib = require('zlib');

function streamComplete(stream) {
  return new Promise((res) => {
    stream.on('end', res);
  });
}

async function processFile(inStream) {
  var outStream = inStream;
  // create a GUnzip stream if they want to unzip the file
  if (args.uncompress) {
    let gunzipStream = zlib.createGunzip();
    outStream = outStream.pipe(gunzipStream);
  }
  var upperStream = new Transform({
    transform(chunk, enc, next) {
      this.push(chunk.toString().toUpperCase());
      next();
    },
  });

  // uppercase inStream
  outStream = outStream.pipe(upperStream);

  // create a Gzip stream if they want to zip the file
  if (args.compress) {
    var gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`;
  }

  var targetStream;

  if (args.out) {
    targetStream = process.stdout;
  } else {
    targetStream = fs.createWriteStream(OUTFILE);
  }

  outStream.pipe(targetStream);
  await streamComplete(outStream);
  console.log('stream complete');
}
```

