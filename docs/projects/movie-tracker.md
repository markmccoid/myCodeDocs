---
id: movie-tracker
title: Movie Tracker
sidebar_label: Movie Tracker
---

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

Using tags to filter our list of Saved Movies is done by storing the user selected filter data in Overmind at **oSaved.filterData**

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