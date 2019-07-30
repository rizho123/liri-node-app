require("dotenv").config();

var fs = require("fs")
var request = require("request")
var figlet = require("figlet")


var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);
var chalk = require("chalk");

var command = process.argv[2];
var parameter = process.argv[3];

function parameters () {

    switch (command) {
        case 'concert-this':
            bandsInTown(parameter);
            break;
        case 'spotify-this-song':
            spotifySearch(parameter);
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

var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

request(queryUrl, function(error, response, body){
    if(JSON.parse(body) == "") {
        console.log(chalk.red.bgWhite.bold("No concerts for this artist was found/available."))
    } else if(!error && response.statusCode === 200){
        var js = JSON.parse(body);
        for(i = 0; i<js.length; i++) {
            var date = js[i].datetime;
            var month = date.substring(5,7); //may need to convert using moment for cleaner format
            var year = date.substring(0,4);
            var day = date.substring(8,10);
            var fullDate = month + "/" + day + "/" + year;

            display(chalk.bgCyan.bold("\n--------------------------BandsInTown--------------------------\n"))
            display(chalk.bgCyan.underline("Name:") + " " + chalk.cyan(js[i].venue.name));
            display(chalk.bgCyan.underline("City:") + " " + chalk.cyan(js[i].venue.city));
            if (js[i].venue.region !== "") {
                display(chalk.bgCyan.underline("Country:") + " " + chalk.cyan(js[i].venue.region));
            }
            display(chalk.bgCyan.underline("Country:") + " " + chalk.cyan(js[i].venue.country));
            display(chalk.bgCyan.underline("Date:") + " " + chalk.cyan(fullDate));
            display(chalk.bgCyan.bold("\n--------------------------BandsInTown--------------------------\n"))
        }
    }
})
}

function spotifySearch(parameter) {
    var song;
    if(parameter === undefined) {
        console.log(chalk.bgRed.yellow.bold("Can't find song, we'll provide one for you!"));
        song = "Ace of Base The Sign"
    } else {
        song = parameter;
    }

    figlet("SPOTIFY", function(err,data) {
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
            display(chalk.bgGreen.bold("\n--------------------------Spotify--------------------------\n"))
            display(chalk.bgGreen.underline("Artist:") + " " + chalk.green(data.tracks.items[0].artists[0].name))
            display(chalk.bgGreen.underline("Song:") + " " + chalk.green(data.tracks.items[0].name))
            display(chalk.bgGreen.underline("Preview:") + " " + chalk.green(data.tracks.items[3].preview_url))
            display(chalk.bgGreen.underline("Album:") + " " + chalk.green(data.tracks.items[0].album.name))
            display(chalk.bgGreen.bold("\n--------------------------Spotify--------------------------\n"))
        }
    })
}

function omdbInfo(parameter) {
    var movie;
    if(parameter === undefined) {
        movie = "Mr. Nobody";
    } else {
        movie = parameter;
    }

    figlet("OMDB", function(err, data) {
        if (err) {
            console.log(chalk.bgRed.yellow.bold("ERROR"))
            return;
        } 
        console.log(chalk.magenta(data));
    })

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(err, response, body) {
        var js = JSON.parse(body);
        if(!err && response.statusCode === 200) {
            display(chalk.bgMagenta.bold("\n--------------------------OMDB--------------------------\n"))
            display(chalk.bgMagenta("Title:") + " " + chalk.magenta(js.Title))
            display(chalk.bgMagenta("Release Year:") + " " + chalk.magenta(js.Year))
            display(chalk.bgMagenta("IMDB Rating:") + " " + chalk.magenta(js.imdbRating))
            display(chalk.bgMagenta("Rotten Tomatoes Rating:") + " " + chalk.magenta(js.Ratings[1].Value))
            display(chalk.bgMagenta("Country:") + " " + chalk.magenta(js.Country))
            display(chalk.bgMagenta("Language:") + " " + chalk.magenta(js.Language))
            display(chalk.bgMagenta("Plot:") + " " + chalk.magenta(js.Plot))
            display(chalk.bgMagenta("Actors:") + " " + chalk.magenta(js.Actors))
            display(chalk.bgMagenta.bold("\n--------------------------OMDB--------------------------\n"))
        }
    })

}

function randomTxt() {
    fs.readFile("random.txt", function(err,data) {
        if (err) {
            console.log(chalk.bgRed.yellow.bold("ERROR"))
            return;
        }

        var query = data.split(",")
        if (query[0] === "spotify-this-song") {
            var song = query[1].trim().slice(1, -1)
            spotifySearch(song);
        }
    })
}

function display(query) {
    console.log(query);
    fs.appendFile("eventlog.txt", query + "\n", function(err) {
        if (err) return display(chalk.bgRed("Logging error..."));
    })
}

parameters();