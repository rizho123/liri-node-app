require("dotenv").config();

var fs = require("fs")
var request = require("request")
var figlet = require("figlet")
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);
var chalk = require("chalk");
var align = require("align-text")

var command = process.argv[2];
var parameter = process.argv[3];

function title () {
figlet.text("Liri-Bot", {
    font: "Electronic",
    horizontalLayout: "default",
    verticalLayout: "default"
    }, function(err, data) {
        if (err) {
            align(console.log(chalk.bgRed.yellow.bold("ERROR--loading main title.")), 4)
            return;
        }
        console.log(chalk.blue(data))
        console.log(chalk.bgMagenta.bold("-------------------------------------------Richard Zhou-------------------------------------------"))
        console.log(chalk.cyan.underline("---------------A simple app that gathers information on songs, concerts, or artists!--------------"))
        console.log(chalk.green("------------------------------------------[Command-list]------------------------------------------"))
        console.log(chalk.green("-----[") + chalk.bgGreen("concert-this") + chalk.green("]: Concert name, Location's City/State & Country, Date.-------------------------"))
        console.log(chalk.green("-----[") + chalk.bgGreen("spotify-this-song") + chalk.green("]: Artist, Album, and preview link.----------------------------------------"))
        console.log(chalk.green("-----[") + chalk.bgGreen("movie-this") + chalk.green("]: Release Year, IMDB & Rotten Tomatoes ratings, Plot, and Actors info.-----------"))
        console.log(chalk.green("-----[") + chalk.bgGreen("do-what-it-says") + chalk.green("]: Reads any command(s) written in 'random.txt', located in the local folder."))
    }
    );
}

if (process.argv[3] == null) {
    title()
    return;
} else {
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
                eventLog(chalk.yellow.bgRed.bold('ERROR'));
                break;
    }
}


function bandsInTown(parameter) {
    if('concert-this') {
        var artist = "";
        for(var i = 3; i < process.argv.length; i++){
            artist+=process.argv[i];
        }

        figlet("BandsInTown", {
            font: "Reverse",
            horizontalLayout: "default",
            verticalLayout: "default"
        }, function(err, data){
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

            eventLog(chalk.bgCyan.bold("\n--------------------------BandsInTown--------------------------\n"))
            eventLog(chalk.bgCyan.underline("Name:") + " " + chalk.cyan(js[i].venue.name));
            eventLog(chalk.bgCyan.underline("City:") + " " + chalk.cyan(js[i].venue.city));
            if (js[i].venue.region !== "") {
                eventLog(chalk.bgCyan.underline("State|Region:") + " " + chalk.cyan(js[i].venue.region));
            }
            eventLog(chalk.bgCyan.underline("Country:") + " " + chalk.cyan(js[i].venue.country));
            eventLog(chalk.bgCyan.underline("Date:") + " " + chalk.cyan(fullDate));
            eventLog(chalk.bgCyan.bold("\n--------------------------BandsInTown--------------------------\n"))
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

    figlet.text("Spotify", {
        font: "Roman",
        horizontalLayout: "default",
        verticalLayout: "default"
    }, function(err,data) {
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
            eventLog(chalk.bgRed.yellow.bold("ERROR -- data unavailable"))
            return;
        } else {
            eventLog(chalk.bgGreen.bold("\n--------------------------Spotify--------------------------\n"))
            eventLog(chalk.bgGreen.underline("Artist:") + " " + chalk.green(data.tracks.items[0].artists[0].name))
            eventLog(chalk.bgGreen.underline("Song:") + " " + chalk.green(data.tracks.items[0].name))
            eventLog(chalk.bgGreen.underline("Preview:") + " " + chalk.green(data.tracks.items[3].preview_url))
            eventLog(chalk.bgGreen.underline("Album:") + " " + chalk.green(data.tracks.items[0].album.name))
            eventLog(chalk.bgGreen.bold("\n--------------------------Spotify--------------------------\n"))
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

    figlet("OMDB", {
        font: "3D-ASCII",
        horizontalLayout: "default",
        verticalLayout: "default"
    }, function(err, data) {
        if (err) {
            console.log(chalk.bgRed.yellow.bold("ERROR -- loading title"))
            return;
        } 
        console.log(chalk.magenta(data));
    })

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(err, response, body) {
        var js = JSON.parse(body);
        if(!err && response.statusCode === 200) {
            eventLog(chalk.bgMagenta.bold("\n--------------------------OMDB--------------------------\n"))
            eventLog(chalk.bgMagenta("Title:") + " " + chalk.magenta(js.Title))
            eventLog(chalk.bgMagenta("Release Year:") + " " + chalk.magenta(js.Year))
            eventLog(chalk.bgMagenta("IMDB Rating:") + " " + chalk.magenta(js.imdbRating))
            eventLog(chalk.bgMagenta("Rotten Tomatoes Rating:") + " " + chalk.magenta(js.Ratings[1].Value))
            eventLog(chalk.bgMagenta("Country:") + " " + chalk.magenta(js.Country))
            eventLog(chalk.bgMagenta("Language:") + " " + chalk.magenta(js.Language))
            eventLog(chalk.bgMagenta("Plot:") + " " + chalk.magenta(js.Plot))
            eventLog(chalk.bgMagenta("Actors:") + " " + chalk.magenta(js.Actors))
            eventLog(chalk.bgMagenta.bold("\n--------------------------OMDB--------------------------\n"))
        }
    })

}

function randomTxt() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            eventLog(chalk.bgRed.yellow.bold("ERROR"))
            return;
        }

        var query = data.split(",")
        if (query[0] === "spotify-this-song") {
            var song = query[1].trim().slice(1, -1)
            spotifySearch(song);
        }
    })
}

function eventLog(query) {
    console.log(query);
    fs.appendFile("log.txt", query + "\n", function(err) {
        if (err) return eventLog(chalk.bgRed("Error logging event.."));
    })
}
