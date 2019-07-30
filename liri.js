require("dotenv").config();

var fs = require("fs")
var request = require("request")
var figlet = require("figlet")
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new spotify(keys.spotify);

var command = process.argv[2];
var parameter = process.argv[3];

function parameters () {

    switch (command) {
        case 'concert-this':
            bandsInTown(parameter);
            break;
        case 'spotify-this-song':
            spotifySong(parameter);
            break;
        case 'movie-this':
            omdbInfo(parameter);
            break;
        case 'do-what-it-says':
            randomTxt();
            break;

            default:
                display('ERROR');
                break;
    }
}

function bandsInTown(parameter) {
    if('concert-this') {
        var artist = "";
        for(var i = 3; i < process.argv.length; i++){
            artist+=process.argv[i];
        }

        figlet("BandsInTown", function(err, data){
            if (err) {
                console.log(chalk.yellow.bold.bgRed('ERROR'));
                return;
            }
            console.log(chalk.cyan(data))
        })
    }
    else {
        artist=parameter;
    }
}

var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

request(queryUrl, function(error, response, body){
    if(!error && response.statusCode === 200){
        var js = JSON.parse(body);
        for(i = 0; i<js.length; i++) {
            var date = js[i].datetime;
            var month = date.substring(5,7); //may need to convert using moment for cleaner format
            var year = date.substring(0,4);
            var day = date.substring(8,10);
            var fullDate = month + "/" + day + "/" + year;

            display(chalk.bgCyan("\n--------------------------BandsInTown--------------------------\n"))
            display(chalk.cyan("Name: " + js[i].venue.name));
            display(chalk.cyan("City: " + js[i].venue.city));
            if (js[i].venue.region !== "") {
                display(chalk.cyan("Country: " + js[i].venue.region));
            }
            display(chalk.cyan("Country: " + js[i].venue.country));
            display(chalk.cyan("Date: " + fullDate));
            display(chalk.bgCyan("\n--------------------------BandsInTown--------------------------\n"))
        }
    }
})

function spotifySearch(parameter) {
    var song;
    if(parameter === undefined) {
        console.log(chalk.bgRed.yellow.bold("Can't find song."));
    } else {
        song = parameter;
    }

    figlet("Spotify", function(err,data) {
        if (err) {
            console.log(chalk.bgRed.yellow.bold("ERROR"))
            return;
        }
        console.log(chalk.green(data));
    })

    spotify.search({
        type: "track",
        query: song
    }, function(err,data) {
        if (err) {
            display(chalk.bgRed.yellow.bold("ERROR"))
            return;
        } else {
            display(chalk.bgGreen("\n--------------------------Spotify--------------------------\n"))
            display(chalk.green("Artist: " + data.tracks.items[0].artists[0].name))
            display(chalk.green("Song: " + data.tracks.items[0].name))
            display(chalk.green("Preview: " + data.tracks.items[3].preview_url));
            display(chalk.green("Album: " + data.tracks.items[0].album.name))
            display(chalk.bgGreen("\n--------------------------Spotify--------------------------\n"))
        }
    })
}