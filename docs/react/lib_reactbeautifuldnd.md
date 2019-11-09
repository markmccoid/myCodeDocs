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

![1573071668391](..\assets\react-beautifuldnd-001.png)

##  Initial Components

The **List.js** component contains the **DragDropContext** and the **Droppable** area.

The **ListItem.js** component contains the **Draggable** items.

Both the **Draggable** and **Droppable** components use render props.  This just means that the  children must be a function.  Both of the render props functions have the **provided** argument that contains all the stuff needed to make the drag/drop work.

Also, you must create a function that is run **onDragEnd** whose job is to reorder the array of items being displayed.

**List.js**

```jsx
import React from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";

let listItems = [
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
  // This is the function that will reorder your array
  // make sure to update the array that is being displayed
  const onDragEnd = result => {
    //destructor the result
    const { destination, source, draggableId } = result;
    //if there is no destination OR the item was moved to the
    //same position, do nothing
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Create a new array to work with instead of mutating existing array
    const newListItems = Array.from(listItems);
    //remove the item that is being moved
    newListItems.splice(source.index, 1);
    //add the removed item back in at the destination index
    newListItems.splice(destination.index, 0, listItems[source.index]);
    //replace the array that is being displayed
    listItems = newListItems;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="a">
        {provided => {
          return (
            <DropRegion ref={provided.innerRef} {...provided.droppableProps}>
              {listItems.map((listItem, idx) => (
                <ListItem key={listItem} listItem={listItem} index={idx} />
              ))}
              //!!** Don't forget to put this placeholder in
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

