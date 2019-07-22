---
id: js-array-functions
title: JS Array Functions
sidebar_label: JS Array Functions
---

Here are some common JavaScript array functions.

- `map()`  => [map docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- `find()`  => [find docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- `findIndex()`  => [findIndex docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
- `filter()`  => [filter docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- `reduce()`  => [reduce docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=b)
- `concat()`  => [concat docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat?v=b)
- `slice()`  => [slice docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
- `splice()`  => [splice docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- `some()`  => [some docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- `every()` => [every docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)

## Search an Array with an Array

Many times you will have an array of criteria that you will want to search your source array with.

An example should help make some sense out of this.

You have an array of objects that hold people of the cars makes they own:

```javascript
owners = [{
  name: 'Bob',
  age: 44,
  carsOwned: ['chevy', 'ford']
},{
  name: 'Mark',
  age: 49,
  carsOwned: ['honda', 'hyudai', 'toyota']
},{
  name: 'Jim',
  age: 54,
  carsOwned: ['chevy', 'honda']
},{
  name: 'Haley',
  age: 24,
  carsOwned: ['hyundai']
}]
```

Now let's say that you want to search the above array of owners and return all owners whose `carsOwned` array matches another criteria array.

```javascript
criteriaArray = ['honda', 'toyota']
```

Before moving on, I see there being four different types of questions that could be asked:

1. Which owners **carsOwned** array has cars where one or more (*some*) match those in the **criteriaArray**
2. Which owners **carsOwned** array matches ALL (*every*) of those in the **criteriaArray**
3. Which owners **carsOwned** array have NO cars matching those in the **criteriaArray**.
4. Which owners **carsOwned** array is EQUAL to the **criteriaArray**

We'll tackle each one of these using JavaScript's awesome array built-in methods.

### Some values in the carsOwned array match those in the criteriaArray

Here we are scanning the **carsOwned** array and as soon as we find a single match between the **criteriaArray** and the **carsOwned** array we can include that owner in our result list.

Luckily, JavaScript has functions that we can use to make this fairly easy to compute:

```javascript
let someOwners = owners.filter(owner =>
      owner.carsOwned.some(car => criteriaArray.includes(car))
    );
```

We start by filtering the **owners** array of objects.  The filter function expects a True or False to be returned to determine whether or not to keep the passed array element.

So the function we pass to the filter will be passed an element in the owner array, which is an object that has the **carsOwned** array in it. `{name, age, carsOwned}`

We then look into the cars owned array and use the Array's *some* prototype function to return either True or False.  The cool thing is that the `some()` function will immediately return a `true` once a single car has been found in the **carsOwned** array.  This just means that we don't always need to iterate through every item in the **carsOwned** array to determine whether to include this owner in our result.

### All values in the criteriaArray are found in the carsOwned array

Here we are looking to find owners who own every make of car in the criteriaArray.  While the approach is similar, once we get into the filter, we are actually searching the criteriaArray!

```javascript
let everyCar = owners.filter(owner =>
        criteriaArray.every(car => owner.carsOwned.includes(car))
      );
```

We start by filtering the **owners** array of objects.  The filter function expects a True or False to be returned to determine whether or not to keep the passed array element.

So the function we pass to the filter will be passed an element in the owner array, which is an object that has the **carsOwned** array in it. `{name, age, carsOwned}`

The function inside the filter that is using the `every()` function, but it is being applied to the **criteriaArray**. We are doing this because we want to find owners where every item in the **criteriaArray** exists in the **owner.carsOwned** array.  

We are passing a simple function to the `every()` function that just checks if the make from the criteria array exists in the **owner.carsOwned** array.  We are doing this by using the `includes()` array function.

It's worth noting the the `some()`, `every()`, and `includes()` functions all return boolean values.

### No values from the criteriaArray are found in the carsOwned array

Next, let's find all the owners who do not have any items in their **carsOwned** array that match those in the **criteriaArray**.

```javascript
    let noOwners = owners.filter(owner =>
      criteriaArray.every(car => !owner.carsOwned.includes(car))
    );
```

We start by filtering the **owners** array of objects.  The filter function expects a True or False to be returned to determine whether or not to keep the passed array element.

So the function we pass to the filter will be passed an element in the owner array, which is an object that has the **carsOwned** array in it. `{name, age, carsOwned}`

The function inside the filter that is using the `every()` function, but it is being applied to the **criteriaArray**. We are doing this because we want to find owners where every item in the **criteriaArray** exists in the **owner.carsOwned** array.  