require("dotenv").config();

var fs = require("fs")
var request = require("request")
var figlet = require("figlet")
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new spotify(keys.spotify);

var command = process.argv[2];
var parameter = process.argv[3];