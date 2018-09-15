require("dotenv").config();
var request = require('request');

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

spotify.search({ type: 'track', query: 'In my feelings' }, function(err, data) {
    console.log(data); 
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 

});