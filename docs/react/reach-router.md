---
id: reach-router
title: Reach Router
sidebar_label: Reach Router
---

[Reach Router Website](https://reach.tech/router)

Example 

```javascript
import { React } from "react"
import { render } from "react-dom"
import { Router, Link } from "@reach/router"

let Home = () => (
  <div>
    <h1>Home</h1>
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="dashboard">Dashboard</Link>
    </nav>
  </div>
)

let Dash = () => <div>Dash</div>

render(
  <Router>
    <Home path="/" />
    <Dash path="dashboard" />
  </Router>
)
```

Notice that the components within the **Router** component are not Reach Router components.  In React Router, you would have those components inside a **Route** component.  In Reach Router, you instead include a **path** property.

Any component that is a direct child of the Router component gets some useful props.

- **path** - this is the relative path.  So if you have nested route components, this will not include the parent route paths.



## Styling Active Link with styled-components

Reach Router uses a prop **getProps**, which expects a function.  This function gets some props passed to it and the function you provide can return other props based on the props passed.  WTF??

Yes, it is confusing and I'm still confused, but, in regards to active links, review the docs here -> [Reach API](https://reach.tech/router/api/Link) and look for the **getProps()** section.

In the active example, I'm looking at the **isCurrent** prop that is being passed and want to return some styling props based on that.  You could just return a style object or you could return a className and then style it within styled-components.  

This however, was a bit more tricky that I expected.

Here is the solution I came up with:

```jsx
import React from 'react';
import { Link } from '@reach/router';
import styled from 'styled-components';
import { getApplicationNames } from '../../../fileAccessAPI/nativeFileAccess';

const RouterPath = styled.div`
  background: lightblue;
  color: black;
  margin-top: 10%;
  border: 1px dashed salmon;
`;

const Wrapper = styled.div`
  background: white;
`;

const Nav = styled.ul`
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  list-style: none;
  border-bottom: 1px solid gray;
  padding: 0;
  margin: 0;
  width: 100%;
`;

/**
* This Component accepts the props that are being sent to the NavLink
* component and returns a Reach Router Link component.
*/
const MyNavLink = props => {
    /**
    * This function accepts the props that are being sent to the NavLink
    * component and return a function that is to be passed to the getProps function
    */
    const appendClass = props => ({ isCurrent }) => {
    	let finalClass = props.className ? props.className + ' ' : '' ;
    	finalClass += isCurrent ? "active-link" : ""
    	return { className: finalClass }
  	}
  return <Link getProps={appendClass(props)} {...props} />
}
/**
* A styled component that is styling the Reach Router Link Component
* that is returned from the MyNavLink component
*/
const NavLink = styled(MyNavLink)`
  padding: 5px;
  display: block;
  
  &:hover {
    background: lightgray;
  }
  &.active-link {
    background: darkgray;
    color: white;
  }
`;

class VarSidebar extends React.Component {
  state = {
    applicationNames: []
  }
  componentDidMount() {
    getApplicationNames().then(result => this.setState({ applicationNames: result }))
  }
  
  render() {
    return (      
      <Wrapper>
        <Nav>
         {
           this.state.applicationNames.map(applicationName => (
             <NavItem key={applicationName}>
              <NavLink 
                to={applicationName.toLowerCase()}
              >{applicationName}</NavLink>
            </NavItem>
           ))
         }
        </Nav>
        <RouterPath>{this.props.routerPath}</RouterPath>
      </Wrapper>
    )
  }
}

export default VarSidebar;
```

## Dealing with Query Strings

Consider this path **"/mypath?query=name&something=5"**

All the stuff after the question mark is the query string.  With Reach Router, these guys are located in the ***location.search*** prop.  But, what you get is everything, question mark on.  So, given the above path, the ***location.search*** prop would equal **"?query=name&something=5"**. 

You could create your own parse function, however the *query-string* npm module is easier.

```javascript
import React from 'react';
import * as queryString from 'query-string';

const AuthorQuotes = (props) => {
  // assuming the location.search = ?query=name&something=5
  let { query, something } = queryString.parse(props.location.search);
  ...
```

Note, that the parse function returns an object with the properties being the query string parameters.

## Using in an Electron App

I haven't quite figured out all the issues with doing things this way, but it works.  First, the issue.  When you use Reach Router in an Electron application, everything works fine when testing using a http server.  But once I generated an executable, the routing stopped.

From what I could tell, it was seeing the source was a file and was using "C:/" as part of the path.

To be able to use Reach Router in an Electron application (compiled), I found I needed to create a "memory" router.

To do this I used:

- **LocationProvider** component - Sets up a listener to location changes.
- **createMemoryHistory() **- Create a history in memory
- **createHistory()** - pass your memoryHistory to this function to create the actual history.

Ok, so I don't really know what the hell is going on, but the below works:

```jsx
import {Router, createMemorySource, createHistory, LocationProvider } from '@reach/router';

class App extends React.Component {

  render() {
    let source = createMemorySource("/qvvar");
    let history = createHistory(source);
      
  return (
  <React.Fragment>
     <LocationProvider history={history}>
       <Router>
         <Main path="/" />
         <QvVariables path="/qvvar">
           <VarView path=":appId/" />
           <VarAdd path=":appId/varadd" />
           <VarExport path=":appId/varexport" />
         </QvVariables>
         <Settings path="/settings" />
         <Error default />
       </Router>
     </LocationProvider>
 </React.Fragment>
)

```

I have found that the componentDidMount() with a **navigate("/somePath")** didn't navigate.  Found that the navigate function doesn't work anywhere within the app after "compilation".