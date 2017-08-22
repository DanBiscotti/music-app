import React from 'react'
import PropTypes from 'prop-types'

const ArtistComponent = ({artist, loadAlbum, backToSearch}) => (
    <div>
        <span>
            <div>
                <h2>{artist.name}</h2>
                <p>{artist.description}</p>
                <button onClick={() => {backToSearch()}}>Back to search</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Album</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                        {artist.albums.map(({title, year, id},i) =>
                            <tr key={i}>
                                <td><a href="#" onClick={() => loadAlbum(id,title,artist)}>{title}</a></td>
                                <td>{year}</td>
                            </tr>
                        )}
                </tbody>
            </table>
        </span>
    </div>
)

export {ArtistComponent}
