---
id: lib_reactbeautifuldnd
title: React Beautiful DnD
sidebar_label: React Beautiful DnD
---

Easy to use React Drag and Drop library.

View their page [on GitHub](https://github.com/atlassian/react-beautiful-dnd) and also there is a [free course on egghead.io](https://egghead.io/courses/beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd).

This document is going to go over the very simple moving the position of an item in a single region to a new location in that same region.

It will be up to you to determine how many components you want to spread this over, however we will be working with two components.  The **ListHolder** and **ListItem**

Below is an image of the basic structure. 

A **Droppable** is an area where you can "drop" things.  Those things specifically being **Draggable** items.

All of the Droppable and Draggable pieces must be within a **DragDropContext**.  Each of these components are exported from the react-beautiful-dnd library.

![1573071668391](C:\Users\mark.mccoid\Documents\GitHub\myCodeDocs\docs\assets\react-beautifuldnd-001.png)

## Initial Components

**List.js**

```javascript
import React from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";

const listItems = [
  "Write Letter",
  "Walk Dog",
  "Eat Dinner",
  "Work Out",
  "Create Code"
];

const DropRegion = styled.div`
  border: 1px solid black;
  background-color: lightblue;
`;
const List = () => {
  return (
    <DragDropContext onDragEnd={() => console.log("dragg end")}>
      <Droppable droppableId="a">
        {provided => {
          return (
            <DropRegion ref={provided.innerRef} {...provided.droppableProps}>
              {listItems.map((listItem, idx) => (
                <ListItem key={listItem} listItem={listItem} index={idx} />
              ))}
              {provided.placeholder}
            </DropRegion>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

export default List;

```

**ListItem.js**

```javascript
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Wrapper = styled.div``;

const Item = styled.div`
  border: 1px solid black;
`;
const ListItem = props => {
  console.log(props);
  return (
    <Draggable draggableId={props.listItem} index={props.index}>
      {provided => {
        return (
          <Wrapper {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
            <Item>{props.listItem}</Item>
          </Wrapper>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
```

**Index.js**

```javascript
import React from "react";
import ReactDOM from "react-dom";
import List from "./List";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <List />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

```

