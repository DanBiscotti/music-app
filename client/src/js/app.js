// app.js
import React from 'react'
import {render} from 'react-dom'
import PropTypes from 'prop-types'
import {SearchComponent} from './search'
import {ArtistComponent} from './artist'
import {AlbumComponent} from './album'
import {getArtist, getAlbum} from './api'

class App extends React.Component {
    
    displayName: 'app'

    constructor(props) {
        super(props)
        this.loadArtist = this.loadArtist.bind(this)
        this.loadAlbum = this.loadAlbum.bind(this)
        this.backToArtist = this.backToArtist.bind(this)
        this.update = this.update.bind(this)
        this.results = null
        this.state = {
            searchView: <SearchComponent loadArtist={this.loadArtist} update={this.update} results={this.results} message={"created"}/>,
            artistView: null,
            albumView: null,
        }

    }

    loadArtist(id, name, description) {
        getArtist(id, name, description, this.update)
    }

    loadAlbum(id, title, artist) {
        console.log("reached 1")
        getAlbum(id, title, artist, this.update)
    }

    backToArtist(id, name, description) {
        getArtist(id, name, description, this.update)
    }

    update(search=true,resultList=null,artist=null,album=null) {
        if(search) {
            this.results = resultList
            this.setState({ 
                searchView: <SearchComponent loadArtist={this.loadArtist} update={this.update} results={this.results} message={"created"}/>,
                artistView: null,
                albumView: null,
            })
        }
        else if(artist != null) {
            this.setState({ 
                searchView: null,
                artistView: <ArtistComponent artist={artist} loadAlbum={this.loadAlbum} backToSearch={this.update} />,
                albumView: null,
            })
        }
        else if(album != null) {
            this.setState({ 
                searchView: null,
                artistView: null,
                albumView: <AlbumComponent album={album} backToArtist={this.backToArtist} backToSearch={this.update} />
            })
        }
    }


    render() {
        return (
            <div>
                <Header />
                {this.state.searchView}
                {this.state.artistView}
                {this.state.albumView}
                <Footer />
            </div>
        )
    }
}

// Header component
const Header = () => <h1>{"Dan's Album Browser App"}</h1>

const Footer = () => <h5>{"Powered by musicbrainz.org"}</h5>

render(<App results={null}/>, document.getElementById('app'))
