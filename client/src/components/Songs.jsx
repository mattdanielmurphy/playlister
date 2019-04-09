import React, { Component } from 'react'
import dropbox from './dropbox'
import Song from './Song'

class Songs extends Component {
	state = {
		songs: []
	}
	componentDidMount() {
		dropbox.getSongs().then((songs) => this.setState({ songs }))
	}
	render = () => (
		<main>
			<h2>Songs</h2>
			<div id="songs">
				{this.state.songs.map((song, i) => (
					<Song
						key={i}
						removeSongFromPlaylist={() => this.props.removeSongFromPlaylist(song)}
						addSongToPlaylist={() => this.props.addSongToPlaylist(song)}
						name={song.name}
						songObject={song}
					/>
				))}
			</div>
		</main>
	)
}
export default Songs
