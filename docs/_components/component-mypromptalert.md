---
id: component-mypromptalert
title: MyPromptAlert Component
sidebar_label: MyPromptAlert Component
---

The MyPromptAlert component is used to display a simple prompt alert with a configurable *Confirm* and *Cancel* button.

It utilizes the Children as a Function pattern to allow, you, the user to trigger the alert with any other HTML object or Component.

**Required**: Sweet Alert 2 module. [Sweet Alert 2 Site](https://sweetalert2.github.io/)

## Usage:

Below is a simple usage.  The child function gets an **onConfirm** function passed.  This function must be used on the trigger event, below, that event is the *onClick* handler.

Also, note the **onConfirm** prop being passed.  This is the function you want to run if the user clicks on the confirm button in the prompt.

```jsx
<MyPromptAlert
  title="Clear quote"
  onConfirm={clearInputs}
>
  {(onConfirm) => <Button onClick={onConfirm}> Clear </Button>}
</MyPromptAlert>
```

## MyPromptAlert

### Props

| **Prop**          | **Description**                                              | **Required** |
| ----------------- | ------------------------------------------------------------ | ------------ |
| title             | title of the prompt                                          | string, no   |
| text              | text under the title of the prompt                           | string, no   |
| type              | Sweetalert2 type icon. 5 options - <br />success, error, warning, info, question [Sweet Alert Docs](https://sweetalert2.github.io/#popup-types) | string, no   |
| confirmButtonText | confirm button text                                          | string, no   |
| cancelButtonText  | cancel button text                                           | string, no   |
| onConfirm         | confirm function to run if confirm button pressed            | function, no |
| onCancel          | cancel function to run if cancel button pressed              | function, no |

[**Download the code**](../assets/components/MyPromptAlert.js)

Below is the code for the component.

```javascript
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

const MyPromptAlert = (props) => {
  const confirmAlert = (confirmFunction) => swal({
    title: props.title ? props.title : 'Are you sure?',
    text: props.text ? props.text : null,
    type: props.type ? props.type : null,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: props.confirmButtonText,
    cancelButtonColor: '#d33',
    cancelButtonText: props.cancelButtonText
  }).then((result) => {
    if (result.value) {
      confirmFunction()
    } else {
      props.onCancel()
    }
  })

  const onConfirm = () => confirmAlert(props.onConfirm)
  return (
    props.children(onConfirm)
  );
};

MyPromptAlert.propTypes = {
  /* title of the prompt */
  title: PropTypes.string,
  /* text under the title of the prompt */
  text: PropTypes.string,
  /* Sweetalert2 type icon. 5 options - success, error, warning, info, question https://sweetalert2.github.io/#popup-types */
  type: PropTypes.string,
  /* confirm button */
  confirmButtonText: PropTypes.string,
  /* cancel button */
  cancelButtonText: PropTypes.string,
  /* confirm function to run if confirm button pressed */
  onConfirm: PropTypes.func,
  /* cancel function to run if cancel button pressed */
  onCancel: PropTypes.func,
}

MyPromptAlert.defaultProps = {
  title: 'Are you sure?',
  text: null,
  type: null,
  confirmButtonText: 'Ok',
  cancelButtonText: 'Cancel',
  onCancel: () => null,
}

export default MyPromptAlert;
```

