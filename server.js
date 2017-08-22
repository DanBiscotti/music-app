// server.js
var express = require('express')
var app = express()
var path = require('path')
var request = require('request')
var xml2js = require('xml2js').parseString
var fs = require('fs')

// server listens on port 8080
var port = 8080

var router = express.Router()

// ROUTES

// entry
router.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html')
})

// API
// artist url
router.get('/api/artist/:id', function(req, res) {
    filename = __dirname+'/data/artist/'+req.params.id+'.json'
    fs.stat(filename, function(err, stat) {
        if(err==null){
            res.sendFile(filename)
        }
        else if(err.code=='ENOENT') {
            options = {
                url: 'http://www.musicbrainz.org/ws/2/release/?artist='+req.params.id+'&type=album&limit=100',
                headers: {
                    'User-Agent': "Dan's test music app/1.0.0 danielscott886@gmail.com",
                }
            }
            callback = function(error, response, body) {
                xml2js(response.body, function(err,result) {
                    albums = result.metadata['release-list'][0].release
                    if(albums == undefined) {
                        res.send("NO ALBUMS")
                        return
                    }
                    albumArray =[]
                    albumNameArray = []
                    for(var i=1;i<=albums.length;i++) {

                        albumArray.push({
                            id: albums[i-1]['$'].id,
                            title: albums[i-1].title[0],
                            year: albums[i-1].date == undefined ? "" : albums[i-1].date[0],
                        })
                    }
                    compare = function(a,b) {
                        if(a.year < b.year)
                            return -1
                        if(a.year > b.year)
                            return 1
                        return 0
                    }
                    albumArray.sort(compare)
                    albumArray2 = []
                    for(var i=1;i<=albumArray.length;i++) {
                        if(!albumNameArray.includes(albumArray[i-1].title) && albumArray[i-1].year != "") {
                            albumArray2.push(albumArray[i-1])
                            albumNameArray.push(albumArray[i-1].title)
                        }
                    }
                    res.send(albumArray2)
                    fs.writeFile(filename, JSON.stringify(albumArray2), function(err) {
                        if(err)
                            console.log(err)
                    })
                })
            }
            request(options,callback)
        }
        else {
            console.log("OTHER ERROR")
            console.log(err)
        }
    })
})

router.get('/api/album/:id', function(req, res) {
    filename = __dirname+'/data/album/'+req.params.id+'.json'
    fs.stat(filename, function(err, stat) {
        if(err==null){
            res.sendFile(filename)
        }
        else if(err.code=='ENOENT') {
            options = {
                url: 'http://www.musicbrainz.org/ws/2/recording/?release='+req.params.id,
                headers: {
                    'User-Agent': "Dan's test music app/1.0.0 danielscott886@gmail.com",
                }
            }
            callback = function(error, response, body) {
                xml2js(response.body, function(err,result) {
                    tracklist = result.metadata['recording-list'][0].recording
                    tracklistArray = []
                    for(var i=1;i<=tracklist.length;i++) {
                        tracklistArray.push({
                            number: i,
                            title: tracklist[i-1].title
                        })
                    }
                    res.send(tracklistArray)
                    fs.writeFile(filename, JSON.stringify(tracklistArray), function(err) {
                        if(err)
                            console.log(err)
                    })
                })
            }
            request(options,callback)
        }
        else {
            console.log("OTHER ERROR")
            console.log(err)
        }
    })
})

// search
router.get('/search/:searchTerm', function(req, res) {
    options = {
        url: 'http://www.musicbrainz.org/ws/2/artist/?query=artist:'+req.params.searchTerm,
        headers: {
            'User-Agent': "Dan's test music app/1.0.0 danielscott886@gmail.com",
        }
    }
    callback = function(error, response, body) {
        if(error) {
            res.send("ERROR")
            return
        }
        var searchResult = []
        xml2js(response.body, function(err,result) {
            var artistList = result.metadata['artist-list'][0]['artist']
            if(artistList != undefined) {
                for(var i=1;i<=20&&i<=artistList.length;i++) {
                    desc = artistList[i-1]['disambiguation']
                    coun = artistList[i-1]['country']
                    searchResult.push({
                        id: artistList[i-1]['$'].id,
                        artist: artistList[i-1]['name'][0],
                        description: desc == undefined ? '' : desc[0],
                        country: coun == undefined ? '' : coun[0],
                    })
                }
            }
            res.send(searchResult)
        })
    }
    request(options,callback)
})

// Allow request to bundle.js
app.use(express.static(path.join(__dirname,'/client/dist')))

app.use('/',router)

// Start server
app.listen(port)
console.log('listening on port: '+port)
