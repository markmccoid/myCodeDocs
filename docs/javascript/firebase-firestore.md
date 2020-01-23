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

