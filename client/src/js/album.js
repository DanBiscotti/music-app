import React from 'react'
import PropTypes from 'prop-types'

const AlbumComponent = ({album, backToArtist, backToSearch}) => (
    <div>
        <span>
            <div>
                <h2>{album.title+" "}<em>by</em>{" "+album.artist}</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>{'#'}</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                        {album.tracklist.map(({number, title},i) =>
                            <tr key={i}>
                                <td>{number}</td>
                                <td>{title}</td>
                            </tr>
                        )}
                </tbody>
            </table>
        </span>
        <span>
            <button onClick={() => backToSearch()}>Back to search</button>
            <button onClick={() => backToArtist(album.artistId,album.artist,album.artistDescription)}>Back to {album.artist}</button>
        </span>
    </div>
)

export {AlbumComponent}
