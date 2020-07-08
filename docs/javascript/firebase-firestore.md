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

## Inserting and Updating

When using Firestore, remember that it goes **Collection** -> **Document** -> **Collection** -> **Document** and on and on.

Meaning, you can have multiple documents in a Collection, but you cannot embed a Document in another Document.  BUT, you can have a Collection in a Document.

Usually you will have a users **Collection** at the root of your project.  Each user will have their own **Document**.  Here is the important thing to remember, Documents are limited to 1 mb of data, so you can't just plop all your data in a single document (if it will exceed 1mb).

I believe each read of a document counts as 1 read.  So, when you read the users document, that is one, then if you have a collection within that document and you read 1000 documents from that collection, that is 1000 reads.

Since, I like to read all the data in at once, everytime the app starts, I will have a lot of reads.  

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

When you have an array of objects, as above, it looks as if you will need to send the whole array of objects.  There is not a way to update an individual object or append an object to the array that I have found.  However, if you simply have an array of types (string, number, etc) you can use ArrayUnion.

[Array Firebase Docs](https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array)

Another way to organize the schema for Arrays of Objects would be to simply take the key of each object in the array and make that a key:

```javascript
users.uid.tagData = {
  'adfdadifdadf': 'Favorite',
  '23fjkadfda;3': 'Watched'
}
```

### Updating

You need to be careful with updating.  If you just grab a ref and then use something like `ref.update({fieldToUpdate: 'new val'})` , it will overwrite anything else in that Map (Object).

If you just want to update a single key you would something like:

```javascript
let dbRef = await firestore.collection('users').doc(uid);
let tagID = 30018;
return userDocRef.update({
  'userData.settings.defaultFilter': userDefaultFilterId,
});
```

This will update an object that has the following shape while leaving the other keys intact:

```javascript
userData: {
  settings: {
    defaultFilter: '',
    otherStuff: ''
  }
}
```

If you have a dynamic key you want to update, just use this format:

````javascript
let dbRef = await firestore.collection('users').doc(uid);
let tagID = 30018;
return userDocRef.update({
  [`userData.tags.${tagID}`]: userDataSettings,
});
````

> the Set function also has a merge flag 

**Summary**

- `set` without `merge` will overwrite a document or create it if it doesn't exist yet
- `set` with `merge` will update fields in the document or create it if it doesn't exists
- `update` will update fields but will fail if the document doesn't exist
- `create` will create the document but fail if the document already exists

There's also a difference in the kind of data you provide to `set` and `update`.

For `set` you always have to provide document-shaped data:

```
set(
  {a: {b: {c: true}}},
  {merge: true}
)
```

With `update` you can also use field paths for updating nested values:

```
update({
  'a.b.c': true
})
```



## Query Helpers

### Read an Array of Docs

If you had a schema with a parent collection with a number of docs underneath it and you had an array of those doc "ids", here is how you could get at them all:

```javascript
const readIds = async(collection, ids) => {
  const reads = ids.map(id => collection.doc(id).get());
  const result = await Promise.all(reads);
  return result.map(v => v.data());
};

// call the above
readIds(db.collection('products'), ['ProdOne', 'ProdTwo', 'ProdThree'])
```

[Reference Video](https://www.youtube.com/watch?v=35RlydUf6xo&t=382s)



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

In my MovieTracker appliction there was a need to create some default Tags.  I create a cloud function that ran whenever a user was created in Firestore.

Here is a good [starter Video](https://www.youtube.com/watch?v=DYfP-UIKxH0&t=330s) on the setup.  

**Install Firebase Tools Globally**

These tools will facilitate creating and deploying your projects.

```bash
$ npm install -g firebase-tools
```

**Create a Project Directory**

While you most likely could create a project folder inside your main application folder, I think keeping it separate may be a good idea.  But who knows.

Anyway, create a directory for your cloud functions project:

cd into that new directory and **Login Into Firebase**. 

> Very important to log into firebase via the CLI. 

```bash
$ firebase login
```

**Initialize your project**

Remember, you are in your project directory.  From here you will type

```bash
$ firebase init	
```

This will create your project scaffolding.  It will ask you what type of project you want to setup.  I just wanted Functions, so that is what I chose.  Lastly, it will ask you which Firebase project (database) you want to use for the project.

You will find a **functions** which contains your **index.js** file.  This is where your functions will reside.

Here is an example function.  Note that we gain access to our firestore instance by using the **admin** object.

`let db = admin.firestore()`

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.newUserSetup = functions.auth.user().onCreate((user) => {
  // Create some default tags for new users
  const uid = user.uid;
  // setup our default tags
  let tags = [
    { tagId: "001a", tagName: "Favorites" },
    { tagId: "002a", tagName: "Watched" },
    { tagId: "003a", tagName: "Next Up" },
  ];
  console.log("NewUserSetup", admin);
  return admin
    .firestore()
    .collection("users")
    .doc(uid)
    .update({ tagData: tags });
  //return userDocRef.update({ tagData: tags });
});
```

