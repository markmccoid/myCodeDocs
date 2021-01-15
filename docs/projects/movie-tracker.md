---
id: movie-tracker
title: Movie Tracker
sidebar_label: Movie Tracker
---

## Data Structure

Data is stored internally using the Overmind library.  To persist data, we store items in Firestore and also a copy in local storage.

To keep from reading from Firestore every time app is opened, we instead read from local storage, then sync with Firestore once a day and also have a sync option in the side menu.

### Overmind

Data in Overmind is broken up into three distinct parts:

- oAdmin - login data (username, email) and app state data ( datasource: "local | firestore")
- oSaved - The main movie data.  The movies themselves as well as settings data, tag data, etc.
- oSearch - When search for a movie, this state helps us know what is being searched for and what state the load of the search data is in.

**oSaved**

- **currentSort** - current options for sorting.  The **active** property lets us know if it is being used to sort.

  > Order of the array is important.  It is the order the sort is applied

  ```javascript
  [
    {
      title: string,
      type: num | alpha | date,
      sortField: string
      sortDirection: desc | asc
      active: boolean
    },
    ...
  ]
  ```

- **filterData**

- **generated**

- **savedFilters**

- **savedMovies** - movies saved to database.

  ```javascript
  {
    backdropURL: string, // URL of backdrop
    budget: int,
    genres: [], //array of string,
    id: int,
    imdbId: string,
    imdbURL: string, // URL of imdb movie 
    overview: string,
    posterURL: string, // URL of poster
    releaseDate: {
      epoch: UNIX epoch (seconds from 1970),
      formatted,
    },
    revenue: int,
    runtime: int,
    savedDate: JS Date,
    status: string,
    tagLine: string,
    taggedWith: [],
    title: "The Master of Disguise",
    userRating: 1,
  };
  ```

  

- **settings**

- **tagData**

## imdb App Links

In the Movie Tracker app, there are a few places where you can open up the movie and cast members in IMDB.  I couldn't find any real documentation from IMDB on how to do this, but with some troubleshooting found out the following:

**Linking to a movie**

If we ever get to the catch, the assumption is that they don't have the imdb app loaded on their device, so send them to the app store.

```javascript
Linking.openURL(`imdb:///title/${imdbId}`)
  .catch((err) => {
     Linking.openURL("https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525");
   }
)
```

**Linking to a Person**

```javascript
getPersonDetails(person.personId)
  .then((res) => Linking.openURL(`imdb:///name/${res.data.imdbId}`))
  .catch((err) => {
    Linking.openURL("https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525");
   }
);
```

## Tags, Tagging and Filtering on Tags

Users are able to define as many tags as they need.  This data will be stored in Overmind on the **tagData** array.  It will hold an array of objects, each object representing a single tag:

```javascript
//oSaved.tagData
[
  {
    tagId: '896456454564-54466',
    tagName: 'Watched'
  },
  ...
]
```

These tags are applied to movies to help the user filter movies later.

When a movie is tagged, a new object property is added to the movie object in the **oSaved.savedMovies** array of objects.  This object property is called **taggedWith** and is an array of **tagIds**.

There are Overmind state functions (getters) that take these "applied" tags and convert them for use with the **TagCloud** component.

> NOTE: This is for storing and showing tags on individual movies.  See the **Filtering Tags** section for details on how we use tags to filter movies. 

The `getAllMovieTags` function accepts a movieId and returns a properly sorted array of tag objects in this form.  By properly sorted, I mean that we keep the tags in the order that the user has determined in the Tags tab.  

```javascript
{
  tagId,
  tagName,
  isSelected
}
```

The **isSelected** property allows the TagCloud component to know if the tag should be shown as being applied to the movie or not.

The Overmind **actions** to save and remove tags to movies are `addTagToMovie` and `removeTagFromMovie` respectively.

### Filtering Tags

Using tags to filter our list of Saved Movies is done by storing the user selected filter data in Overmind at **oSaved.filterData.**  This data is NOT stored in Firestore, but is only for the users current session.  See [Saved Filters](#saved_filters) for information on filters that get stored to Firestore.

```javascript
  filterData: {
    tagOperator: "OR",
    tags: [tagIds],
    excludeTagOperator: "AND",
    excludeTags: [tagIds]
    genreOperator: "OR",
    genres: [],
    searchFilter: undefined,
  },
```

While the **tags** and **excludeTags** are separate properties in the **oSaved** store, the application uses the `getAllFilterTags` state function to return an array of objects:

```javascript
{
  tagId,
  tagName,
  tagState, // 'include' or 'exclude' or 'inactive'
}
```

The TagCloudEnhanced component will use the tagState property to determine what the next state will be.  Currently it is **inactive -> include -> exclude**.

#### FilterByTagsContainer

This component encapsulates the **TagCloudEnhanced** component and obfuscates the properties so that it can be used for both the *creation* of saved filters as well as setting and applying an on the fly filter.

**Components** using **FilterByTagsContainer**

- ViewMoviesFitlerScreen
- CreateSavedFilterScreen

## Saved Filters

> NOTE: **actions.js** - review **hydrateStore** function for "//!" Comments.  They are above code that is used to ensure old datastore worked with new code.  This should be removed at some point.

The user is able to create any number of saved filters.

They are located in Overmind at **oSaved.savedFilters** and is an Array of Objects:

```javascript
{
  excludeTagOperator: "OR"
  excludeTags: [ ]
  id:"0047fdc6-6592-436e-b3a9-9cad7327c871"
  index: 0
  name: "Mark’s"
  showInDrawer: true
  tagOperator: "AND"
  tags: [ ]
}
```

The **index** property on each savedFilter object is needed for the drag and drop sort.  However, we make sure that whenever we store the savedFilters array to Overmind, disk and Firestore that **the array is sorted by the index**.

By doing this, we do not need to sort everytime another component needs to access the saved filters in their sorted order.

## Sorting Movies

There are predefined options for a user to choose to sort their movies by.

Currently these options consist of:

- **User Rating** - **oState.savedMovies.userRating**
- **Movie Title** - **oState.savedMovies.title**
- **Movie Release Date** - **oState.savedMovies.releaseDate.epoch**
- **Saved Date** - **oState.savedMovies.savedDate** // Date movie was added to users list

The data structure for each sort object is:

```javascript
{
  active: boolean, // Should it be used in sort
	id: "saveddate",
	index: 3,
	sortDirection: "desc" | "asc",
	sortField: "savedDate", //MUST be the same variable name as the field on the movie object state
	title: "Saved Date"
	type: "date" | "num" | "str"
}
```

Currently in Overmind there are two places where this sort data is stored.

- **oState.settings.defaultSort** - contains objects for each sort option
- **oState.currentSort** - duplicate of defaultSort

Why in two places?  My thought was that the default sort would be saved to the database and would be updated via settings.  Everytime you logged in, this would be the defaultSort.

But what if a user wanted to do a quick sort change?  I thought that if **currentSort** was where the application always looked to when sorting, then you could have both options of a default sort and an on the fly sort.

Currently in **getFilteredMovies**, it is using the **oState.currentSort** to sort the movies.  I haven't implemented an on the fly sort yet, but hopefully this will future proof this part.

The flow when loading data from Firestore/AsyncStorage is to load to **settings.defaultSort** and then copy that to **currentSort**.

### Where Sort Happens

Currently the only time the sorting is used is in the main movies screen.  The function is found in **store/oSaved/state.js** and is called **getFilteredMovies**.  This getter not only sorts, but also filters based on any **tags**, **genres**, or **title** filters that the user has set.

The sort itself is performed using the lodash **orderBy** function.  This is why it is so important that the **sortField** in each sort object matches the same name in the **savedMovies** object that is being search.