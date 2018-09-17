require("dotenv").config();
var request = require('request');
var moment = require('moment');

// Step 3
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var log  = "";

var spotify = new Spotify(keys.spotify);
var apisearch = process.argv;
var term = "";

for (var i = 3; i < apisearch.length; i++) {

  if (i !== apisearch.length - 1) {
    term += apisearch[i] + " ";

  } else {
    // This will remove the last space in the string
    term += apisearch[i];

  }
}

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});


switch (apisearch[2]) {
  case "concert-this":
  concert(term);
 
    break;
  case "spotify-this-song":
     spotifySongs(term);
    
    break;
  case "movie-this":
    movie(term);
   
    break;
  case "do-what-it-says":
   doAsISay();

    break;
  default:
    console.log("oops mistakes were made!");
}

function logsearch(logdata){
  fs.appendFile('log.txt',logdata , function(err){
    if (err) throw err;
    console.log('The file has been updated/saved!');
    });
    
}



function spotifySongs(songs) {
  spotify.search({ type: 'track', query: songs, limit: 1 }, function (err, data) {
    var songInfo = {
      artist: data.tracks.items[0].album.artists[0].name,
      song_title: data.tracks.items[0].name,
      preview_song: data.tracks.items[0].album.artists[0].external_urls.spotify,
      album: data.tracks.items[0].album.name
    }
    log = JSON.stringify(songInfo);
    logsearch(log + "\n");
 

    // console.log(JSON.stringify(temp, null, 2));
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  });

}



function concert(artist) {
  url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
  //url= "https://rest.bandsintown.com/artists/drake/events?app_id=codingbootcamp"

  request(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    body = JSON.parse(body, null, 2)

    //console.log('body:', body); // Print the HTML for the Google homepage.
   


    var concertInfo = {
      venue_name: body[0].venue.name,
      city: body[0].venue.city,
      Time: moment(body[0].datetime).format("MM/DD/YYYY")
    }
    console.log(concertInfo);
    log = JSON.stringify(concertInfo);
    logsearch(log + "\n");
 
  });
}

function movie(title) {
  // Step 4 These steps remove API keys from Github
  if (title === "") {
    title = "Mr. Nobody"
  }
  url = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=" + keys.ombd.apikeys;

  console.log(url);

  request(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    body = JSON.parse(body, null, 2)
    movietitle = body.Title;
    console.log('body:', body); // Print the HTML for the Google homepage.
    // console.log(movietitle); // Print the HTML for the Google homepage.


    var movieInfo = {
      Title: body.Title,
      Year: body.Year,
      IMBDRating: body.Ratings[0].Value,
      RottenTomatoesRatings: body.Ratings[1].Value,
      Country: body.Country,
      Language: body.Language,
      Plot: body.Plot,

      Actors: body.Actors
    }
    console.log(movieInfo);
    log = JSON.stringify(movieInfo);
    logsearch(log + "\n");
  });
}
function doAsISay() {

  fs.readFile('./random.txt', function (err, data) {
    if (err) throw err;
    data = data.toString().split(",");
    spotifySongs(data[1]);
  });
}
