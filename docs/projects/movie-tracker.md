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

