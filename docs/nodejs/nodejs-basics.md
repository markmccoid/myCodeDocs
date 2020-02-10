---
id: nodejs-basics
title: Node JS Basics
sidebar_label: Node JS Basics
---

[Node.js](https://nodejs.org/en/) 

[Node.js - Path](https://nodejs.org/api/path.html)

[Node.js File System](https://nodejs.org/api/fs.html)

## Node Basics



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

### [Dotenv](https://github.com/motdotla/dotenv)

`dotenv` allows us to set environment variables from a `.env` file, instead of setting them on the command line. For example, if we creating a file called `.env` in the root of our project with the following contents:

```bash
ADMIN_PASSWORD=password123
JWT_SECRET=jwt123
MONGO_URI=mongodb+srv:...
```

For example, `dotenv` will make the `ADMIN_PASSWORD` in our .env file accessible to our app as: `process.env.ADMIN_PASSWORD`.

