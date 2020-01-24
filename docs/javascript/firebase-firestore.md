---
id: firebase_firestore
title: Firebase Firestore
sidebar_label: Firestore
---

I used to think of Firebase as a single thing, a cloud database, but **Firebase** is a group of products by Google.

They have two specific database products.

- Firebase Realtime Database -  structured as a JSON tree
- Firebase Cloud Firestore - A document database storing data in collections and documents within those collections.

This document is focused on Cloud Firestore.

## Initializing Firestore

This document will focus on the Web version of Firebase. 

After you have created your project, you will need to get the Firebase web configuration details and create your `firebase.js` file.  This will be the file that initializes Firebase.

```javascript
import firebase from "firebase";
import "@firebase/firestore";
import env from "../env.js";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  databaseURL: env.DATABASE_URL,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGE_SENDER_ID,
  appId: env.APP_ID
};
// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export default Firebase;
```

The **default export** is **Firebase**, which is a reference to ALL of the firebase functions.  It will be used for Auth or any other functions above the firestore database.

The other is a **named export**, which you can call anything, but is called **db** in the above example.

This is the Firestore database reference.  It will be used to access the collections and documents in the database.

## Auth

The most difficult thing about Auth is how you implement the flow in you application.  From the Firebase side, it is relatively easy.

### Set up an onAuthStateChanged() listener

The first thing we need is a way to tell if a user is logged in or not.  This is usually done near the root of your application so that you can determine which routes the user will have access to.

Here is a simple example in an applications root file App.js

```jsx
import React from "react";
import Firebase from "./storage/firebase";
import SignIn from "./components/Auth/SignIn";

function App() {
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <SearchMovie />
          <SavedMovies />
          <br />
          <ViewMovies />
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default App;
```

Notice in the **useEffect** function, we are setting this to only run once when the application mounts, since has set up a listener that will fire whenever the user's auth status changes.

When the auth status changes, the function passed to **onAuthStateChanged()** will be executed.

Don't forget to get the **unsubscribe** method and return it as the cleanup function (if you are using useEffect).

### Sign In/Sign Up

If our app requires a user to be logged in, then if their auth status is not logged in, we will redirect to a Sign In page.  This page should also have a link so that the user can Sign Up if they have not done so before.

If you want to keep profile information on a user, you can request this at SignUp and create the users profile as they sign up.

Here is a sign up function with the assumption that email and password are being set elsewhere in component.

```javascript
  const signUp = () => {
    // Firebase.auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .then(resp => console.log("SIGNED UP ", resp));
    //-------
    // If you wanted to create a initial user profile upon user creation 
    // you could do this:
    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {
        return fsDB
          .collection("users")
          .doc(resp.user.uid)
          .set({ email });
      });
  };
```

You don't have to do anything (create a user doc) upon creation, but it is an option.

Here is a Sign In Method:

```javascript
const signIn = () => {
    Firebase.auth().signInWithEmailAndPassword(email, password);
  };
```

These are just the base Firebase functions to get you logged in, however, you will most likely want to store the user's **uid** somewhere globally or where you database writes/reads/updates are going to happen, as you will want it when you perform DB operations.

If you need the **uid**, you can also request it at any time using the following:

```javascript
firebase.auth().currentUser
```

### Insert and Results

Here are some examples of inserts and their results:

```javascript
    firestore
      .collection("users")
      .doc(uid)
      .set({ tagData: fbTagData });
```

**Result**

![1579899491222](..\assets\firestore-query-001.png)



## Design Decisions

Good video on [Design Decisions](https://www.youtube.com/watch?v=lW7DWV2jST0)

A few things to think about when designing the structure of your database.

First, understand that you can embed Sub-Collections in your documents.  When you query, Firestore does so "Shallowly", which means it will only return the topmost documents, not the sub collections contained in those returned documents.

![img](..\assets\firestore_001.png)

In the above example, you could store the reviews inside the Restaurant collection documents.

```javascript
{
  name: 'restaurant 1',
  address: 'the address',
  reviews: [
  {
    reviewId: 1,
    rating: 4  
  },
  {
    reviewId: 2,
    rating: 1  
  }, 
 ...
  ]
}
```



- Firestore charges based on documents returned, so you can see that it would cost more to have a separate collection for the reviews.  However, that is not your only consideration.  If reviews are only shown when requested, having them separately could be best as then the user is not downloading a bunch of unused data.
- 

## Design with All Data Under User

If you are designing an app where the users will not interact with each other, or there will be data that is private to a user, you can think of have a Users collection and then each user will have sub collections that contain their pertinent data.

```javascript
/database/documents/users/savedMovies
/database/documents/users/tagData
/database/documents/users/userData
```



## Firebase Tools

Firebase comes with an SDK and CLI that you can install globally on your machine. 

This gives you access to things like `firebase init` to initialize projects.

``` bash
$ npm install --global firebase-tools
```



## Cloud Functions

Functions that are run based on something that happens to your data.  For example, whenever a restaurant changes it name, you want to update all the orders that have the restaurant name in them updated also.   

