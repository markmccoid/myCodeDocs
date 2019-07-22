---
id: tmdb-wrapper-api
title: TMDB Wrapper API Reference
sidebar_label: TMDB Wrapper API Reference
---



## TMDB Wrapper API Reference

TMDB Wrapper API is a JavaScript wrapper around the TMDB Rest API.  There is a set of what I call the Raw API functions (a set for TV and Movies) that are simple wrappers around the base APIs included in the TMPD Rest APIs.

Then there are the curated API functions which return a curated set of values as well as converting images to their full URLs whereas the Raw API images are simply the filenames.

## Installation

```bash
> npm install tmdb_api --save	
OR 
> yarn add tmdb-api
```

## Initialization

To use this wrapper you will need an API Key from TMDB.  This key will be passed to the initTMDB() function before you access any of the wrapper functions.

```javascript
import { initTMDB } from 'tmdb_api';

function App() {
  initTMDB('0e4935aa81b04529bsb647b04fe414d3')
  return (
    <div className="App">
      <header className="App-header">
          TMDB API Wrapper
      </header>
      <Main />
    </div>
  );
}
```

## Raw TV API Functions

All functions are named exports, which return **promises**.

The promises resolve to an object with the following shape:

```javascript
{
    data:
    apiCall:
}
```



### getConfig()

```json
data: {
  "images": {
    "base_url": "http://image.tmdb.org/t/p/",
    "secure_base_url": "https://image.tmdb.org/t/p/",
    "backdrop_sizes": [
      "w300",
      "w780",
      "w1280",
      "original"
    ],
    "logo_sizes": [
      "w45",
      "w92",
      "w154",
      "w185",
      "w300",
      "w500",
      "original"
    ],
    "poster_sizes": [
      "w92",
      "w154",
      "w185",
      "w342",
      "w500",
      "w780",
      "original"
    ],
    "profile_sizes": [
      "w45",
      "w185",
      "h632",
      "original"
    ],
    "still_sizes": [
      "w92",
      "w185",
      "w300",
      "original"
    ]
  },
  "change_keys": [
    "adult",
    "air_date",
    "also_known_as",
    "alternative_titles",
    "biography",
    "birthday",
    "budget",
    "cast",
    "certifications",
    "character_names",
    "created_by",
    "crew",
    "deathday",
    "episode",
    "episode_number",
    "episode_run_time",
    "freebase_id",
    "freebase_mid",
    "general",
    "genres",
    "guest_stars",
    "homepage",
    "images",
    "imdb_id",
    "languages",
    "name",
    "network",
    "origin_country",
    "original_name",
    "original_title",
    "overview",
    "parts",
    "place_of_birth",
    "plot_keywords",
    "production_code",
    "production_companies",
    "production_countries",
    "releases",
    "revenue",
    "runtime",
    "season",
    "season_number",
    "season_regular",
    "spoken_languages",
    "status",
    "tagline",
    "title",
    "translations",
    "tvdb_id",
    "tvrage_id",
    "type",
    "video",
    "videos"
  ]
},
apiCall: ""
```

## SearchTVByTitle(searchValue, page=1)

- searchValue (String) - text value to use as search criteria
- page (int) - Default is 1.  *data.total_pages* lets you know how many pages there are



### Return Values

```json
data: {
  "page": 1,
  "total_results": 5,
  "total_pages": 1,
  "results": [
    {
      "original_name": "",
      "id": 6474,
      "name": "",
      "vote_count": 0,
      "vote_average": 0,
      "poster_path": "/aXE2AwdMKBL86rg6YRT3kcuGu5E.jpg",
      "first_air_date": "1969-03-31",
      "popularity": 0.6,
      "genre_ids": [],
      "original_language": "en",
      "backdrop_path": null,
      "overview": "",
      "origin_country": []
    }
  ]
},
apiCall: ""
```

## getShowDetails(showID: int)

### Return Values

```json
data: {
    {
      "backdrop_path": "/jC1KqsFx8ZyqJyQa2Ohi7xgL7XC.jpg",
      "created_by": [
        {
          "id": 211962,
          "credit_id": "537523f9c3a3681ef4000177",
          "name": "Geoff Johns",
          "gender": 2,
          "profile_path": "/1hiQjkIkeFoiwvD4yIk2Dq6tnOa.jpg"
        },
      ],
      "episode_run_time": [],
      "first_air_date": "2014-10-07",
      "genres": [
        {
          "id": 18,
          "name": "Drama"
        },
      ],
      "homepage": "http://www.cwtv.com/shows/the-flash/",
      "id": 60735,
      "in_production": true,
      "languages": ["en"],
      "last_air_date": "2019-05-14",
      "last_episode_to_air": {
        "air_date": "2019-05-14",
        "episode_number": 22,
        "id": 1776182,
        "name": "Legacy",
        "overview": "",
        "production_code": "",
        "season_number": 5,
        "show_id": 60735,
        "still_path": "/61qsBdF6a8gXi7VnV1sty5rJhWp.jpg",
        "vote_average": 0,
        "vote_count": 0
      },
      "name": "The Flash",
      "next_episode_to_air": null,
      "networks": [
        {
          "name": "The CW",
          "id": 71,
          "logo_path": "/ge9hzeaU7nMtQ4PjkFlc68dGAJ9.png",
          "origin_country": "US"
        }
      ],
      "number_of_episodes": 114,
      "number_of_seasons": 5,
      "origin_country": ["US"],
      "original_language": "en",
      "original_name": "The Flash",
      "overview": "",
      "popularity": 349.464,
      "poster_path": "/fki3kBlwJzFp8QohL43g9ReV455.jpg",
      "production_companies": [
        {
          "id": 1957,
          "logo_path": "/nmcNfPq03WLtOyufJzQbiPu2Enc.png",
          "name": "Warner Bros. Television",
          "origin_country": "US"
        },
      ],
      "seasons": [
        {
          "air_date": "2016-04-19",
          "episode_count": 5,
          "id": 79954,
          "name": "Specials",
          "overview": "",
          "poster_path": "/hce9A21ANLi4n9QtBZEdPFD2eZk.jpg",
          "season_number": 0
        },
        {
          "air_date": "2014-10-07",
          "episode_count": 23,
          "id": 60523,
          "name": "Season 1",
          "overview": "",
          "poster_path": "/A3H6pewHfoy2bXmNhvycOe0xzlC.jpg",
          "season_number": 1
        },
        {
          "air_date": "2015-10-06",
          "episode_count": 23,
          "id": 66922,
          "name": "Season 2",
          "overview": "",
          "poster_path": "/8xWZPVX1cv9V5YD1RPeLj9QZDE9.jpg",
          "season_number": 2
        },
      ],
      "status": "Returning Series",
      "type": "Scripted",
      "vote_average": 6.6,
      "vote_count": 2658
    }
},
apiCall: ""
```

