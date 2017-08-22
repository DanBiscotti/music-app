// search.js
import React from 'react'
import PropTypes from 'prop-types'
import {search} from './api'

class SearchComponent extends React.Component {
    
    displayName: "search"

    // Constructor
    constructor(props) {
        super(props)
        this.state = {
            searchTerm: null,
            loadArtist: props.loadArtist,
            update: props.update
        }
        this.submitSearch = this.submitSearch.bind(this)
        this.getSearchTerm = this.getSearchTerm.bind(this)
    }

    // Functions for submitting searches
    submitSearch() {
        var {results, searchTerm, update} = this.state
        if(searchTerm == null)
            alert("Please enter an artist")
        else
            results = search(searchTerm, update)
    }

    getSearchTerm(e) {
        this.state.searchTerm = e.target.value
    }

    // Render fucntion
    render() {
        return (
            <div>
                <SearchBar submitSearch={this.submitSearch} getSearchTerm={this.getSearchTerm} />
                {(this.props.results == "" ? <h3>{"No results for "+this.state.searchTerm}</h3> : <ResultsTable results={this.props.results} loadArtist={this.props.loadArtist} />)}
            </div>
        )
    }
}

// Search bar component
const SearchBar = ({submitSearch, getSearchTerm, loadArtist}) => (
    <span>
        <textarea placeholder="Enter artist here" onChange={getSearchTerm}></textarea>
        <button onClick={submitSearch}>Search</button>
    </span>
)

// results table component
const ResultsTable = ({results=null, loadArtist}) => ( results == null ? null : 
    <table>
        <thead>
            <tr>
                <th>Artist</th>
                <th>Description</th>
                <th>Country</th>
            </tr>
        </thead>
        <tbody>
            {results.map((r,i) => <Result key={i} info={r} loadArtist={loadArtist} />)}
        </tbody>
    </table>
)

// single result component
const Result = ({info, loadArtist}) => (
    <tr>
        <td><a href='#' onClick={()=>(loadArtist(info.id,info.artist,info.description))}>{info.artist}</a></td>
        <td>{info.description}</td>
        <td>{info.country}</td>
    </tr>
)       

export {SearchComponent}
