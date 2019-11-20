---
id: react-components
title: React Components
sidebar_label: React Components
---

## FocusManager

Sometimes the **onBlur** event on a single *div* or *component* isn't what you want.  Instead, you only want to perform a blur when focus leaves a group of HTML tags.

This article helped me build the **FocusManager** component. [Focus and Blur in Composite Widget]( https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b )

**FocusManger.js**

```jsx
import React, { useState, useRef, useEffect } from "react";

const FocusManager = ({ handleBlur, children }) => {
  let [isManagingFocus, setIsManagingFocus] = useState(true);
  let timeoutIdRef = useRef();

  const _onBlur = () => {
    timeoutIdRef.current = setTimeout(() => {
      if (isManagingFocus) {
        setIsManagingFocus(false);
      }
    }, 0);
  };
  const _onFocus = () => {
    clearTimeout(timeoutIdRef.current);
    if (!isManagingFocus) {
      setIsManagingFocus(true);
    }
  };
  useEffect(() => {
    if (isManagingFocus) {
      console.log("managing focus");
    } else {
      console.log("NOT managing focus");
      handleBlur();
    }
  }, [isManagingFocus, handleBlur]);
  return (
    <div onBlur={_onBlur} onFocus={_onFocus}>
      {children}
    </div>
  );
};

export default FocusManager;
```

Obviously, take out the console.log statements.  Just there so you can see when the events are firing.

Currently, I'm only accepting an **handleBlur** function that gets called when we *lose* focus.  If needed, you could also accept a **handleFocus** function if needed.

**From linked article**

> This behavior is achieved by waiting a “tick” on a blur event before toggling the isManagingFocus state to false. By a tick, I mean the next processing cycle in the main thread. We an wait a tick by using setTimeout to delay the state setting. The blur and focus events will happen in the same tick (under normal circumstances), allowing the component to cancel its reaction to the blur event if a focus event occurs in the next moment and clears the timeout. If no focus event from an element within the grid occurs (if the user has traversed out of the grid component), then the blur event will be processed in the next tick and the grid component will toggle isManagingFocus to false.
>
> Any time we use setTimeout/clearTimeout to manage order of operations, it feels icky. I freely admit this. It seems like a hack and admittedly this approach is that. But the DOM gives us scant tools to respond to focus and blur events. We’re often left with timing hacks and interpreting secondary effects to understand where focus is on the page and where it’s going to next.

## react-dates from air bnb

[react-dates](https://github.com/airbnb/react-dates)

Example usage of a SingleDatePicker and DateRangePicker

```javascript
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

class aComponent extends React.Component {
  onDatesChange = ({startDate, endDate}) => {
    this.props.dispatch(setStartDate(startDate));
    this.props.dispatch(setEndDate(endDate));
  }
  onFocusChange = (calendarFocused) => {
    this.setState(() => ({ calendarFocused }))
  }
render() {  
    <SingleDatePicker
    date={this.state.createdAt}
    onDateChange={this.onDateChange}
    focused={this.state.calendarFocused}
    onFocusChange={this.onFocusChange}
    numberOfMonths={1}
    isOutsideRange={(day) => false}
    />

    <DateRangePicker 
    startDate={this.props.filters.startDate}
    endDate={this.props.filters.endDate}
    onDatesChange={this.onDatesChange}
    focusedInput={this.state.calendarFocused}
    onFocusChange={this.onFocusChange}
    numberOfMonths={1}
    isOutsideRange={() => false}
    showClearDates
    />
  }
}
```

## React Select

Drop down list box. 

To install:

```
$ yarn add react-select@next
```

Here is the format for a single select drop down box:

```javascript
import Select from 'react-select'; 

const Component = (props) => {
  const filterOptions = [{value: 'date', label:'Date'}, {value: 'amount', label: 'Amount'}];
  
  return (<Select options={filterOptions} 
	defaultValue={filterOptions[0]}
	styles={{control: styles => ({ ...styles, minWidth: '150px' })}}
	value={filterOptions.find((filter) => filter.value === this.props.filters.sortBy)}
	onChange={(e) => {
    	if (e.value === 'date') {
        	this.props.dispatch(sortByDate());
       	} else {
        	this.props.dispatch(sortByAmount());
        }
	  }
	}
  />)
}

```

First, you pass the options as an array of objects with a  `value` and `label` property.

If this is going to be a select list that always has a value, meaning you don't null it out, then you can set a **defaultValue**. But the default value must be in the form of an object with a  `value` and `label` property.

Same deal with the **value** property.  You must send an object with a `value` and `label` property.

### onChange

the onChange event gets an object with a `value` and `label` property.  In the example above, I'm checking what the value is and dispatching a redux action based on the selected value.

If the Select component is set to be clearable `isClearable` option set to true, then the a null is passed instead of an object.  So, if you have a clearable select list, you will need to check if the passed value, **e** in this case, you must check to see if it is null:

```javascript
<Select options={carFilterOptions} 
	placeholder="Car Filter..."
	isClearable={true}
	styles={{control: styles => ({ ...styles, minWidth: '150px' })}}
	value={carFilterOptions.find((filter) => filter.value === this.props.filters.carIdFilter)}
	onChange={(e) => {
          console.log(e)
          let carFilter = e ? e.value : ''
          this.props.dispatch(setCarFilter(carFilter));
	}}
/>
```

I used to put a blank in the select list to allow the list to be "cleared", but this is cleaner.