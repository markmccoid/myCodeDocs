---
id: lib_formik
title: Formik
sidebar_label: Formik
---



[Formik Site](https://jaredpalmer.com/formik/docs/overview)

There are two ways to use Formik (before hooks comes out).  One is with the **Formik** component the other is using the **withFormik()** Higher Order function.

The **Formik** component is a render prop component.  So it's format is:

```jsx
<Formik initialValues={{name, etc}}>
{({a, bunch, of, props}) => (
	<form>
  	....
  </form>
)}
</Formik>
```



I went with the **withFormik()** function.

Andrew Mead has a great video to get you up and running [Better React Forms with Formik](https://www.youtube.com/watch?v=yNiJkjEwmpw)

I also used Ant Design components, which pose a few issues.  Ben Awad attacks this [Coding React Form with Formik and Ant Design](https://www.youtube.com/watch?v=pbCrDBQFU_A)

## Component Setup

Usually with a form you are going to have a user enter data and then you will use it!  Maybe send to server to save, etc.

I chose to have one component to house the **"what I want to do" / Submit** logic , which wraps the component that is created by the **useFormik()** function.

Visually and simple code:

![1570201808954](C:\Users\mark.mccoid\Documents\GitHub\myCodeDocs\docs\assets\formik_1570201808954.png)

```jsx
//FormContainerComponent.js
function FormContainerComponent(props) {
  //Submit Logic, etc
  Return (
  	<FormikFormComponent submit={submitLogic} initalFieldValue={} ... />
  )
} 

function FormComponent(props) {
  return (
  	<form>
     ....
    </form>
  )
}

const FormikFormComponent = withFormik({
  //config option
})(FormComponent);
```

## withFormik Configuration

There are a lot of options for configuration, so be sure to check out the [API docs](https://jaredpalmer.com/formik/docs/api/withformik)

The ones that I used were:

- mapPropsToValues(props) - Used to initialize your forms.  Accepts any props from calling component, in the case above **FormContainerComponent**
- validationSchema - uses **yup** to validate fields.
- handleSubmit(values, formikBag) - This is the submit logic that will run when the form is submitted.  Since you will most likely be passing the "real" submit logic from the calling component, you need to know that the **formikBag** object has a props object in it that you can use to access any props from the calling component.