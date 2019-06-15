---
id: tailwindcss
title: Tailwind CSS
sidebar_label: Tailwind CSS
---



[Tailwind CSS](<https://tailwindcss.com/>)

Tailwind CSS is a cool css library.  When integrating it with create, I wanted to use it with styled components, but since Tailwind is a bunch of classes, you need to use the **tailwind.macro** package to enable the use of it within styled components.

I still found the need to install the full Tailwind CSS and to build the tailwind.css even though the tailwind.macro seems to contain all the classes and/or builds it itself.  

However, I found that if I didn't include the tailwind.css in my project either importing it or including it in the HTML file, I lost some of the base setups that you really need to use this css framework.



## Installing Tailwind CSS with Create React App

This is my first take on it.  Simply go through the setup below and at the end we will run a command that will create the Tailwind.css file.  You will include this file into your application.

If you should change the tailwind configuration or anything, just rebuild it.

Here are the resources I used to get the install info:

>  [Tailwind With React](<https://itnext.io/how-to-use-tailwind-css-with-react-16e9d478b8b1>)
>
>  [CRA With Tailwind](<https://medium.com/@mikeeeeeeey/create-react-app-tailwind-css-feat-postcss-631d9e33ba8c>)
>
>  [CRA/Tailwind and Styled Components](https://wetainment.com/articles/tailwind-css-in-js/)

Let's get to it!

### Install Tailwind using Yarn or NPM

```bash
> yarn add tailwindcss --dev
```

### Create the Tailwind Source file

This is really simple, but it uses the Tailwind directive to load the needed files that will be complied into the final Tailwind.css file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Create the Tailwind Config file

This will allow you to customize colors, sizing, fonts, etc.  Don't need anything in it for initial compilation.

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

> NOTE: To get the tailwind CSS working with Styled Components and Babel Macros you will need to install the @next version of the tailwind.macro module.  
> This is as of June 2019 - "tailwind.macro": "^1.0.0-alpha.10"

[Tailwind babel plugin](https://github.com/bradlc/babel-plugin-tailwind-components)

```bash
$ yarn add tailwind.macro@next --dev
```

## Styled Components Usage

It is fairly straightforward, once you have the pattern.

```javascript
import styled from 'styled-components';
import tw from 'tailwind.macro';

// use tailwind classes the styled way
const Header = styled.header`
  ${tw`bg-black flex flex-col items-center justify-center text-xl text-white`};
`;
const Button = styled.button`
 ${tw`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`};
`;
```



