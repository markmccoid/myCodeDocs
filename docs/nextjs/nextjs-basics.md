---
id: nextjs_basics
title: NextJS Basics
sidebar_label: NextJS Basics
---

# Installing

You can use `creat-next-app` to get started very quickly.

**npm** or **yarn**

```shell
$ npx create-next-app
# OR
$ yarn create next-app
```

The scripts in `package.json` are

```json
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
```

So what do these commands do?

`next` Will start Next.js in dev mode with hot reloading.

`next build` Will build your project and ready it for production.

`next start` Will start your built app, used in production.

The following is from the [FrontEnd Masters Next JS Course Website](https://hendrixer.github.io/nextjs-course/)

# Routing with Pages

You don't need to interact with a router directly to create pages. Next.js has built on conventions to make creating routes as easy as creating a file 🤙🏾.

To get started, create a directory on your called `/pages`. Next.js will associate any file in this directory as a route. The file names determine the route name or pattern, and whatever component is exported is the actual page.

Now let's create an index route by creating a file: `/pages/index.jsx`.

Next, let's create a component and export it:

```jsx
import React from 'react'

export default () => <h1>Index Page</h1>
```

Start your dev server:

**npm**

```shell
npm run dev
```

**yarn**

```shell
yarn dev
```

We should now be able to navigate the browser to the index route of our app and see our h1's content. I really appreciate conventions like this that make developing apps that much more fun!

Ok, big deal, we created an index page, but what about paths like `myapp.com/project/settings` and `myapp.com/user/1` where `1` is a parameter? Don't even trip; Next.js has you covered there.

## Folders and routes

To create a path like `/project/settings` we can use folders in our `/pages` directory. For our note taking app, we need the following routes for now:

```text
index => /
all notes => /notes
one note => /notes/:id
```

We already created the index route; let's create the all notes route:

```text
pages
  notes
    index.jsx
```

By adding an `index` page in a folder, we're telling Next.js that we want this component to be the index route for this path. So in this case, navigating to `/notes` will render the `pages/notes/index.jsx` component.

Here's a placeholder component for that page that you can use.

```jsx
import React from 'react'

export default () => <h1>Notes</h1>
```

> 🧠  **reminder**: We'll fill these pages out later with some excellent copy and pasting.

## Dynamic routes

Next.js makes it easy to create dynamic routes. Depending on if and how you want those pages to be prerendered will determine how you set them up. We're going to focus on creating dynamic routes that will not be built at build time but instead at run time on the server.

> 🧠  **reminder**: We'll cover prerendering later, so don't overthink right now.

So to create a dynamic route, we can create a file that looks like this:

```text
[id].jsx
```

Where `id` is the name of the parameter. You can name it whatever you want. Those brackets are not a typo or a placeholder; that's the syntax to create a dynamic route using file name conventions in the pages directory. So let's create our note route:

```text
pages
  notes
    index.jsx
    [id].jsx
```

We can access the `id` param inside our page component using the `useRouter` hook from the `next/route` module. This comes for free with Next.js.

```jsx
import React from 'react'
import { useRouter } from 'next/router'

export default () => {
  const router = useRouter()
  const { id }= router.query

  return (
    <h1>Note: {id} </h1>
  )
}
```

There param name on the query object is the same name as the param name in the file for that page.

```text
router.query.id
             |
             |
            [id].jsx
```

### Catch-all routes

There's a beautiful feature that Next.js that allows us to define catch-all routes for when we're too lazy to make a page for each one.

> 👍🏾 **tip**: A lazy developer is a good developer, well, ...sometimes 🙄

What's a catch-all route, you say? Think of a glob.

```text
this/folder/**
```

Where `**` means everything inside `folder`. We can do the same with our dynamic routes! All we need is to create a file in our pages directory like this:

```text
docs/[...param].jsx
```

So the ellipsis `...` is used in this example to same that this file will represent and route that matches `/docs/a` or `docs/a/b` or `docs/a/b/c/d/a/b`. You get the point. You can then access all the params the same way you do with a single route param. The only difference is the value will be an array of the params in order.

```jsx
import React from 'react'
import { useRouter } from 'next/router'

// file => /docs/[...params].jsx
// route => /docs/a/b/c

export default () => {
  const router = useRouter()
  const { params }= router.query

  // params === ['a', 'b', 'c']

  return (
    <h1>hello</h1>
  )
}
```

If you want to include the parent path in your catch-all route, you can use an optional catch-all route.

```text
docs/[[...param]].jsx
```

Just add another set of `[ ]` over your catch-all, and now `/docs` will be matched with all of its children. The params value on the `router.query` for the parent path will just be an empty object `{}`.

So when would you use catch-all routes? I find them useful for when you have a bunch of pages that have pretty similar if not identical layouts and style but have different content and need their own URL. Such things like docs and wikis are a perfect use case.

## Non-pages

So pages are special, but what about when you just need a component? Next.js doesn't have any conventions or opinions about that. The community usually creates a `/src/components` folder where all the components live.

# Navigation

## 

Next.js has a few tricks up its sleeve to help us navigate between pages.

## Link component

Similar to an `<a>` tag, we can use the `Link` component from then `next/link` module.

```jsx
<Link href="/settings">
  <a>settings</a>
</Link>
```

There Link component allows you to do **client-side** routing. This is important because if you don't want that or are linking to another site, then you should just use an `a` tag instead.

You must have an `a` tag as the child of the `Link` component, but the `href` lives on the `Link`.

> 👍🏾 **tip**: Update your linter to not error out because your `<a>` tag does not have an href.

The `href` prop takes a page name as it is in the pages directory. For dynamic routes, you will need the `as` prop as well.

```jsx
<Link href="/user/[id].js" as={`/user/${user.id}`}>
  <a>user</a>
</Link>
```

Let's link our pages together!

```jsx
// pages/index.jsx
import React from 'react'
import Link from 'next/link'

export default () => (
  <div>
    <h1>Index page</h1>

    <Link href="/notes">
      <a>Notes</a>
    </Link>
  </div> 
)
// pages/notes/index.jsx
import React from 'react'
import Link from 'next/link'

export default () => {
  const notes = new Array(15).fill(1).map((e, i) => ({id: i, title: `Note: ${i}`}))

  return (
    <div>
      <h1>Notes</h1>

      {notes.map(note => (
        <div>
          <Link key={note.id} href="/notes/[id]" as={`/notes/${note.id}`}>
            <a>
              <strong>{note.title}</strong>
            </a>
          </Link>
        </div>
      ))}
    </div>
  )
}
// pages/notes/[id].jsx
import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default () => {
  const router = useRouter()
  const { id }= router.query

  return (
    <div>
      <h1>Note: {id} </h1>

      <Link href="/notes">
        <a>Notes</a>
      </Link>
    </div>
  )
}
```

## Programmatic routing

For when you need to route between pages programmatically, you can use the router to do so. There are [many methods](https://nextjs.org/docs/routing/introduction) on the router that you can use, so we'll focus on the ones we'll use in this course.

Just like the `Link` component, use the router for client-side routing. To navigate to a page, you can use the `push` method, which works like `href` on the `Link` component.

```jsx
import React from 'react'
import { useRouter } from 'next/router'

export default () => {
  const router = useRouter()
  const id = 2

  return (
    <div>
      <button onClick={e => router.push('/')}>
        Go Home
      </button>

      <button onClick={e => router.push('/user/[id]', `/user/${id}`)}>
        Dashboard
      </button>
          <spanonClick={() => {router.push({
	        		  pathname: '/post/[pid]',
  	    		    query: { pid: post.id },
    			    })
  	  	  	}}
	    >
      Click here to read more
    </span>
    </div>
  )
}
```

And that's all there is to routing! Our app doesn't look much like an app, no worries, we're going to fix that next.

# Styling

## 

Next.js comes with some styling conventions baked in, and they're pretty good. Because Next.js uses React, you can also use any other mechanism that works with React to style your apps.

> 👍🏾 **tip** You might have to extend Next.js tp support your styling approach. More on that later.

When it comes to styling, you have global styles and component styles. For global CSS, you have to import them at the entry point of your app. Wait, where is the entrance to my Next.js app? It's actually created for you, but you can and have to create your own now that you want global styles.

Create an `pages/_app.jsx` file and add this:

```jsx
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

This automatically gets created for you by default with the same code. In the `_app.jsx` you can import any CSS file, and the styles will be global now.

```jsx
import 'flexbox.css'
import '../mystyles.css'
```

Now, when you don't want global CSS, Next.js supports [css modules](https://github.com/css-modules/css-modules). This will scope your CSS, avoiding collisions.

> 🕳  **deep dive**: a unique class name is created every import to reuse the same CSS class names

You can import a CSS module file anywhere in your app. To create a CSS module, you have to use a special syntax in the file name.

```
styles.module.css
```

This makes CSS modules a perfect solution to styling components.

```text
components
  button.jsx
  button.module.css
```

> 👍🏾  **tip** You can use a CSS pre-processor by extending Next.js. We'll cover that later.

I prefer to use a different solution when styling all my React apps, which we're going to use today.

# Theme UI

## 

The following section is not entirely specific to Next.js and takes on how I prefer to style my React apps. I recommend checking out to this branch if you don't want to copy and paste or follow this section.

[theme ui](https://theme-ui.com/) is a library that allows you to create theme objects and use them in your components. It also handles scoping and injecting the CSS into your app—pretty dope stuff.

> 📏  **TLDR;** create an object representing a theme and use that theme for all your components

Let's get our app looking like an app. First, install some things.

**npm**

```shell
npm i theme-ui @theme-ui/presets --save
```

**yarn**

```shell
yarn add theme-ui @theme-ui/presets
```

Next, we'll create a theme. Make a file on the root of your app.

```text
theme.js
```

Now add this theme:

```js
import { roboto } from '@theme-ui/presets'

const theme = {
  ...roboto,
  containers: {
    card: {
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      border: '1px solid',
      borderColor: 'muted',
      borderRadius: '4px',
      p: 2,
    },
    page: {
      width: '100%',
      maxWidth: '960px',
      m: 0,
      mx: 'auto',
    }
  },
  styles: {
    ...roboto.styles
  }
}

export default theme
```

This object uses a preset theme with some extras I added. Throw in a `console.log(theme)` to see what's in there.

Next we'll create a Navigation component at `src/components/nav.jsx`

```jsx
/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

const Nav = () => (
  <header sx={{height: '60px', width: '100vw', bg: 'primary', borderBottom: '1px solid', borderColor: 'primary'}}>
    <nav sx={{display: 'flex', alignItems: 'center',  justifyContent: 'space-between', variant: 'containers.page', height: '100%'}}>
      <Link href="/">
        <a sx={{fontWeight: 'bold', fontSize: 4, cursor: 'pointer'}}>Note App</a>
      </Link>

      <Link href="/notes">
        <a sx={{color: 'text', fontSize: 3, cursor: 'pointer'}}>notes</a>
      </Link>

    </nav>
  </header>
)

export default Nav
```

A few subtle but **powerful** things here. First, lets talk about this:

```jsx
/** @jsx jsx */
import { jsx } from 'theme-ui'
```

Ummm, what is that, and how does this component render JSX without importing React? That comment is something called `JSX pragma`. Its a hint to the compiler how to compile this file. The comment combined with the JSX import from `theme-ui` tells the compiler, babel, in this case, of what JSX tool to use to handle JSX in this file. It's the same reason you had to import React in your JSX files.

We need the theme-ui JSX to use the `sx` prop on all of our components. The `sx` prop allows us to add inline styles to components using CSS properties and values and values from our theme object that we created. It's **BEAUTIFUL** 💋.

And now, our pages.

```jsx
// pages/index.jsx
/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

export default () => (
  <div sx={{ height: `calc(100vh - 60px)`}}>
    <div sx={{variant: 'containers.page', display: 'flex', alignItems: 'center', height: '100%'}}>
      <h1 sx={{fontSize: 8, my: 0}}>This is a really dope note taking app.</h1>
    </div>
  </div> 
)
// pages/notes/index.jsx
/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

export default () => {
  const notes = new Array(15).fill(1).map((e, i) => ({id: i, title: `This is my note ${i}`}))

  return (
    <div sx={{variant: 'containers.page'}}>
      <h1>My Notes</h1>

      <div sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
        {notes.map(note => (
          <div sx={{width: '33%', p: 2}}>
            <Link key={note.id} href="/notes/[id]" as={`/notes/${note.id}`}>
              <a sx={{textDecoration: 'none', cursor: 'pointer'}}>
                <div sx={{variant: 'containers.card',}}>
                  <strong>{note.title}</strong>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
// pages/[id].jsx
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default () => {
  const router = useRouter()
  const { id }= router.query

  return (
    <div sx={{variant: 'containers.page'}}>
      <h1>Note: {id} </h1>
    </div>
  )
}
```

We now need to wrap our app in the Theme UI provider. We have two options:

- wrap every page individually
- wrap the root component

Because we want to use Theme UI in our entire app, its safe to wrap the root. So in the `pages/_app.jsx` file:

```jsx
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { ThemeProvider } from 'theme-ui'
import theme from '../theme'
import Nav from '../src/components/nav'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Nav />
        <Component {...pageProps} />
      </div>      
    </ThemeProvider>
  )
}
```

Theme UI is profound, and we barely scratched the surface. I highly recommend checking it out.

# Customizing Next.js config

## 

If you want to change the build system's behavior, extend Next.js's features, or add ENV variables, you can do this easily in the `next-config.js` file.

Either export and objet:

```js
module.exports = {
  webpack: {
    // webpack config properties
  },
  env: {
    MY_ENV_VAR: process.env.SECRET
  }
}
```

Or a function:

```js
const { PHASE_PRODUCTION_SERVER } = require('next/constants')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {
      ...defaultConfig,
      webpack: {
        plugins: [new BundleAnalyzerPlugin()]
      }
    }
  }

  return defaultConfig
} 
```

Above I'm adding the bundle analyzer webpack plugin during a prod build of Next.js. You can check out all the [different phases](https://github.com/vercel/next.js/blob/canary/packages/next/next-server/lib/constants.ts#L1-L4) of Next.js.

Next.js is production-ready and handles almost everything, but don't be scared to reach to that config and extend what you need.

# Plugins

## 

The `next.config.js` file gives us the ability to do some powerful stuff. Because the config file has a convention, you should be able to use changes written by others. These are Next.js plugins.

They look like this:

```js
// next.config.js
const withOffline = require('next-offline')
const config = {
  // your next config
}

module.exports = withOffline(config)
```

Most plugins follow the `withPluginName` format. They also usually take your custom Next.js config, if any, to ensure its returned and consumed by Next.js. This allows you to compose plugins:

```js
// next.config.js
const withPlugins = require('next-compose-plugins')
const withOffline = require('next-offline')
const withReactSvg = require('next-react-svg')
const config = {
  env: {
    MY_ENV: process.env.MY_ENV
  }
}

module.exports = withPlugins([
  withOffline,
  [withReactSvg, {
    // config for reactSvgPlugin
  }]
], config)
```

## Environment Variables

[NextJS env Docs](https://nextjs.org/docs/basic-features/environment-variables)

Remember that environment variables will not automatically be available in the browser code.  Not sure what distinguishes browser from backend, but if you want to initialize a library, do it in the **_app.js_** file in a **useEffect(() => {}, [])**

### Didn't get the below to work.

We're going to install and env plugin that makes it super simple to use env vars in our app.

First, let's install the modules we need.

**npm**

```shell
npm i next-env dotenv-load --dev
```

**yarn**

```shell
yarn add next-env dotenv-load
```

In your `next.config.js` file:

```js
const nextEnv = require('next-env')
const dotenvLoad = require('dotenv-load')

dotenvLoad()

const withNextEnv = nextEnv()
module.exports = withNextEnv()
```

Next, create a `.env` file on the root and add some envs.

```text
HELP_APP_URL=https://google.com
```

> ⚠️  **warning**: don't check .env files into git

Now, we'll use the env in our app. Go to the Nav component and add an `a` tag to link to the external app.

```jsx
// src/components/nav.jsx
<a sx={{
    color: 'text',
    fontSize: 3,
    cursor: 'pointer'
  }}
  href={process.env.HELP_APP_URL}
>
  Help
</a>
```

# API Routes

## 

Next.js is a full-stack framework. Fullstack, as in it, has a server, not just for development, for rendering components on your server, but also for an API!

Yes, you can legit ship an API right next to your App with no setup. Let's see how.

All we have to do is create an `api` folder in our `pages` director. The file names and paths work just like pages do. However, instead of building components in those files, we'll create API handlers.

```text
pages
  api
    hello.js
```

> 👍🏾  **tip**: Next.js API routes are not the same as Vercel's Serverless API functions, although the setup is similar.

# API Handlers

## 

Now let's create some API handlers to handle data for our Notes app. The handlers are based on [Connect](https://www.npmjs.com/package/connect), which [Express](https://expressjs.com/).

> 👍🏾  **tipe**: You can learn more about [Express and APIs with Node.js](https://frontendmasters.com/courses/api-design-nodejs-v3/) from Frontend Masters

A handler looks like this:

```js
// pages/api/data.js
// route => /api/data

export default (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ message: 'hello' }))
}
```

By default, this handler will respond to all requests to `/api/data`. We need to split our logic based on the methods (GET, PUT, DELETE, etc.). We also need some way to use connect-based middleware, which would make building out these handlers much simpler.

We can quickly look at the incoming request and get the method, and we can create some HOF's to handle middleware, but I landed on an excellent package that helps with this.

```js
// pages/api/data
import nc from 'next-connect';
import cors from 'cors'

const handler = nc()
  // use connect based middleware
  .use(cors())
  // express like routing for methods
  .get((req, res) => {
    res.send('Hello world')
  })
  .post((req, res) => {
    res.json({ hello: 'world' })
  })
  .put(async (req, res) => {
    res.end('hello')
  })
  
export default handler;
```

Pretty clean! Now, let's create some API routes for our Notes app. We need some basic CRUD:

```text
create note => POST /api/note
update note => PATCH /api/note/:id
delete note => DELETE /api/note/:id
get one note => DELETE /api/note/:id
get all notes => DELETE /api/note/
```

So from above, we only have 2 routes: `/api/note/:id`

```
/api/note/
```

First, let's create a place to store our data. We'll stick to in memory for now.

```js
// src/data/data.js
const notes = []

module.exports = notes
```

Next, we'll create the routes in the `page/api/` directory.

```text
pages
  api
    note
      [id].js
      index.js
// pages/api/note/index.js
import nc from 'next-connect'
import notes from '../../../src/data/data'

const handler = nc()
  .get((req, res) => {
    res.json({data: notes})
  })
  .post((req, res) => {
    const id = Date.now()
    const note = {...req.body, id}

    notes.push(note)
    res.json({data: note})
  })
export default handler
// pages/api/note/[id].js
import nc from 'next-connect'
import notes from '../../../src/data/data'

const getNote = id => notes.find(n => n.id === parseInt(id))

const handler = nc()
  .get((req, res) => {
    
    const note = getNote(req.query.id)

    if (!note) {
      res.status(404)
      res.end()
      return
    }

    res.json({data: note})
  })
  .patch((req, res) => {
    const note = getNote(req.query.id)

    if (!note) {
      res.status(404)
      res.end()
      return
    }
    
    const i = notes.findIndex(n => n.id === parseInt(req.query.id))
    const updated = {...note, ...req.body}

    notes[i] = updated
    res.json({data: updated})
  })
  .delete((req, res) => {
    const note = getNote(req.query.id)

    if (!note) {
      res.status(404)
      res.end()
      return
    }
    const i = notes.findIndex(n => n.id === parseInt(req.query.id))
    
    notes.splice(i, 1)

    res.json({data: req.query.id})
  })

export default handler
```

We can access the URL params on `req.query.paramName` just like with the client-side router.