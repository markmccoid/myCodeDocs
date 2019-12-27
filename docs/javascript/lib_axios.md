---
id: lib_axios
title: Axios
sidebar_label: Axios
---

[axios on Github](https://github.com/mzabriskie/axios) 

[axios CheatSheet](https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index)

[Make requests like a pro](https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/)

[Cool axios stuff](https://dev.to/napoleon039/do-you-know-how-to-use-these-useful-axios-features-4h9m)



## axios Basics

Axios has many features, but at its most basic, you can simply instantiate it and call it's *.get*, *.post*, etc functions to make async API requests.

> NOTE: The path/route that you pass through the first *get* parameter must URI Encoded.  You can use `encodeURIComponent('?searchparm=the ☻alking')` to do this for you.
>
> Seems like spaces will be encoded, but Unicode characters won't be.
>
> You will see that there are ways to get axios to do the encoding for you.

```javascript
import axios from 'axios';

axios.get('http://someapi.com/theApi?searchparm=test')
	.then(resp => console.log(resp));
// If you had unicode, you would have to makes sure to encode it
let searchParm = encodeURIComponent('the ☻alking')
axios.get(`http://someapi.com/theApi?searchparm=${searchParm}`)
	.then(resp => console.log(resp));
```

### The Config Object

While we can build the full URL with included search params, there is an easier and cleaner way to go about  this.  

You can pass a second parameter to the **get** function in axios and this parameter is a config object.  The key features I use are the params (stuff after the "?" in the URL) and the base URL.

```javascript
import axios from 'axios';

// equivalent to the first example.
axios.get('http://someapi.com/theApi', {
  params: {
    searchparm: "test"
  }
})
  .then(resp => console.log(resp));
```

We could also include the base URL in the config.  This would just be the part of the URL that stays the same throughout API Calls.

```javascript
import axios from 'axios';

// equivalent to the first example.
axios.get("/theApi", {
  baseURL: "http://someapi.com"
  params: {
    searchparm: "test"
  }
})
  .then(resp => console.log(resp));
```

### axios Instance (axios.create)

Let's say that you are using an API and there is some basic information that you always use when accessing.  Things like the base URL and certain params like a API Key.  You can bake this stuff into an **axios instance** and then just call your *get, put, etc* on the instance.

> NOTE: there is a bug in axios *0.19.0* that will not set ANY params that you put in your instance.  The workaround is to assign an request interceptor function.  Shown below.

```javascript
const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3/"
});
```

Since we can't set any params on the new instance during creation because of the fore mentioned bug, we will put a request interceptor function on the instance.

```javascript
const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3/"
});

axiosInstance.interceptors.request.use(config => {
  // console.log("Intercepting request", config);
  const params = config.params || {};
  config.params = { ...params, api_key: "0e4935aa81b04539beb687d04ff414e3" };
  //console.log("after intercept", config);
  return config;
});

axiosInstance
    .get("search/tv", {
      params: {
        page: 1,
        query: "The Walking"
      }
    })
    .then(resp => {
      console.log("2", resp.request.connection._httpMessage.res.responseUrl);
      console.log("3", resp.config);
    })
    .catch(err => console.log(`ERROr: ${err}`));
```

The request interceptor is run **AFTER** the config object gets initialized with stuff from the .get function call.  This is why we need to first check if there are any params and spread the ones that are passed.

### Response Object (What You Get Back)

When you issue a call to an API, axios sends you back an object:

```javascript
{
  // `data` is the response that was provided by the server
  // This is what you are looking for with 'get' calls
  data: {},
 
  // `status` is the HTTP status code from the server response
  status: 200,
 
  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',
 
  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {},
 
  // `config` is the config that was provided to `axios` for the request
  config: {},
 
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
```

## axios.all

Since API calls are asynchronous, there will be times when you want to make multiple calls, but not do any work until both API calls return or error.  

Luckily, axios has an **all** function built in that work much like the *promise.all* function.

```javascript
function axiosAll() {
  return axios.all([
    axios.get('https://api.github.com/users/mapbox'),
    axios.get('https://api.github.com/users/phantomjs')
  ])
  .then(axios.spread((user1, user2) => {
    console.log('Date created: ', user1.data.created_at);
    console.log('Date created: ', user2.data.created_at);
    //Do stuff with data and return what you need
    return neededData;
  }));  
}

```



## OLDER



I currently use this to make calls to site APIs that return JSON data.

I have been using the current format:

```javascript	
function getTVInfoById (tvShowID) {
	 var encodedtvShowID = encodeURIComponent(tvShowID);
	    var requestUrl = `${TVMAZESHOWSEARCH_URL}?q=${encodedtvShowID}`;
	
	    return axios.get(requestUrl).then(function(res){
	            if(res.data.cod && res.data.message) {
	                // console.log(res.data.message);
	                throw new Error(res.data.message);
	            } else {
	                // console.log (res.data);
	                //return res.data.main.temp;
	                return res.data;
	            }
	        }, function(res){
	            throw new Error(res.data.message);
	        });
	}
```

The above example is a return from a function. The function is going to return a promise.

**Note** that the if (res.data.cod &&...) stuff is specific to the return from the API. This API returns an error in the data response and thus we are checking for these to be populated and if they are throwing an error. If not, we return the data.

```javascript
axios.get() makes the request and waits for the return (thus the .then()...).
```

We return the promise the *axios.get()* returns, which we setup waiting for the reponse:

```javascript	
var showAPIData =   tvMaze.getTVInfoById(selectedShowId).then((theData) => {
		this.setState({
			showSelected: {
				showSelectedId: selectedShowId,
				tvMazeAPIData: theData
			}
		});
		}, function (e){
			console.log(e);
		}
	);
```

The variable **showAPIData** will have a promise stored in it as this is what the getTVInfoById is returning ( see above function ). Normally there is no need to store it in a variable, I'm not sure if there is a use, but currently I am not storing this. Just running it and getting the data I want back.

So, axios.get() will let you make a single call and get data back, but if you have multiple calls you want to make, you can use the axios.all() and axios.spread() functionality

```javascript
getTVInfoAndEpisodes: function (tvShowId) {
var encodedtvShowId = encodeURIComponent(tvShowId);
var requestUrl = `${TVMAZEIDSEARCH_URL}${encodedtvShowId}`;

return axios.all([
		axios.get(requestUrl),
		axios.get(`${requestUrl}/episodes`)
	])
	.then(axios.spread(function(showInfoResponse, episodeResponse){
		var showData = showInfoResponse.data;
		var episodeData = episodeResponse.data;
		var epObj;
		//Get array of unique seasons
		var seasons = _.uniq(episodeData.map((episode) => {
				return (episode.season);
		}));
		//Produce an Array of objects one for each season
		// [{
		//  season: 1,
		//  episodes: 12,
		//  episodeDetail: [{
		//      episodeNumber: 1,
		//      episodeName:'the name',
		//      episodeAirDate: '2009-03-18'
		//  },
		//  {...}]
		// },
		// {...}]
		var seasonArray = seasons.map((seasonNum) => {
				var seasonObj = {
						season: seasonNum,
						episodes: episodeData.filter((episode) => episode.season === seasonNum).length - 1,
						episodeDetail: episodeData.filter((episode) => episode.season === seasonNum)
								.map((episode) => {
												return ({
																episodeNumber: episode.number,
																episodeName: episode.name,
																episodeAirDate: episode.airdate
														});
										})
				};
				return seasonObj;
		});
	//Last step is to return the show data and the seasonData that we build above.
	return ({showData: showData,
		seasonData: seasonArray} );
	}));
}
```

To break this down, the first part is telling axios which "gets" you want to get:

```javascript
axios.all([
	axios.get(requestUrl),
	axios.get(`${requestUrl}/episodes`)
])
```

This allows you to run your API calls in parallel. However, the "then" function won't be run until data is back from both requests! I think this is a good thing. Takes a bit of the async pain away.

Now, once both requests finish and the "then" function is called, we will use the axios.spread() functionality to put each request's return data into separate parameters.

```javascript
	.then(axios.spread(function(showInfoResponse, episodeResponse){
	 ...
	}
```

This allows you to drop the return data into separate parameters. As far as I can tell, the order of the parameters should match the order of the .get call is the axios.all()'s array.

Note that the **JavaScript Promise** object has a .all method that behaves very similarly to the axios.all:

```javascript
const weather = new Promise((resolve) => {
	setTimeout(() => {
		resolve({ temp: 29, conditions: 'Sunny with Clouds'});
	}, 2000);
	});
	const tweets = new Promise((resolve) => {
		setTimeout(() => {
		resolve(['I like cake', 'BBQ is good too!']);
		}, 500);
		});
	Promise
		.all([weather, tweets])
		.then(responses => {
		const [weatherInfo, tweetInfo] = responses;
		console.log(weatherInfo, tweetInfo)
});
```