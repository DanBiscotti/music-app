// api.js

const getArtist = function(id, name, description, update) {
    var req = new XMLHttpRequest()
    req.open("GET","http://localhost:8080/api/artist/"+id)
    req.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            if(req.responseText == "NO ALBUMS") {
                alert("This artist has no albums recorded in the database")
                return
            }
            if(req.responseText == "ERROR") {
                alert("Could not connect to Musicbrainz")
                return
            }
            var artist = {
                id: id,
                name: name,
                description: description,
                albums: JSON.parse(req.responseText),
            }
            update(false,null,artist,null)
            console.log("artist received")
        }
    }
    req.send()
}

const getAlbum = function(id, title, artist, update) {
    var req = new XMLHttpRequest()
    req.open("GET","http://localhost:8080/api/album/"+id)
    req.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var album = {
                id: id,
                title: title,
                artist: artist.name,
                artistId: artist.id,
                artistDescription: artist.description,
                tracklist: JSON.parse(req.responseText),
            }
            update(false,null,null,album)
        }
    }
    req.send()
}

const search = function(searchTerm,update) {
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            if(req.responseText == "ERROR") {
                alert("Could not connect to Musicbrainz")
                return
            }
            console.log("search results for '"+searchTerm+"' received")
            update(true,JSON.parse(req.responseText),null,null)
        }
    }
    req.open("GET","http://localhost:8080/search/"+searchTerm,true)
    req.send()
}

export {getArtist, getAlbum, search}
