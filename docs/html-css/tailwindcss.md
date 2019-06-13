---
id: tailwindcss
title: Tailwind CSS
sidebar_label: Tailwind CSS
---



[Tailwind CSS](<https://tailwindcss.com/>)

## Installing Tailwind CSS with Create React App

This is my first take on it.  Simply go through the setup below and at the end we will run a command that will create the Tailwind.css file.  You will include this file into your application.

If you should change the tailwind configuration or anything, just rebuild it.

Here are the resources I used to get the install info:

>  [Tailwind With React](<https://itnext.io/how-to-use-tailwind-css-with-react-16e9d478b8b1>)
>
> [CRA With Tailwind](<https://medium.com/@mikeeeeeeey/create-react-app-tailwind-css-feat-postcss-631d9e33ba8c>)

Let's get to it!

### Install Tailwind using Yarn or NPM

```bash
> yarn add tailwind --dev
```

### Create the Tailwind Source file

This is really simple, but it uses the Tailwind directive to load the needed files that will be complied into the final Tailwind.css file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Create the Tailwind Config file

Haven't totally figured out what is contained in the config file, but you need, so let's create it

```bash
$ npx tailwind init tailwind.config.js
```

Execute the above in the root directory of your project.

### Create Package.json script

This script will be used to build the actual tailwind.css file.  You could set it to build every time you ran, but I think that is excessive, so I choose to just run when changes have been made to Tailwind config or something else has created a need to rebuild

```json
"tailwind:css": "tailwind build src/tailwind.src.css -c tailwind.config.js -o src/tailwind.css"
```

Remember that your script is being run in the root of your project, so all directories in above script are relative to that.

### Build the Tailwind.css file

```bash
$ yarn run tailwind:css
```

Now you have a tailwind.css file in your **src** directory. 

### Import into your application

Now you just need to include the **tailwind.css** file into your project.  Depending on where you have chosen to store the tailwind.css file you will need to import as so:

```javascript
import './tailwind.css';
```

### Use with Styled Components

There is a babel macro that will let you use the tailwind classes in styled components.  Make sure you also have the babel-plugin-macros install also.

> NOTE: haven't been able to get this to work yet.

[Tailwind babel plugin](https://github.com/bradlc/babel-plugin-tailwind-components)

```bash
$ yarn add tailwind.macro babel-plugin-macros --dev
```



