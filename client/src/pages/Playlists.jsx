import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import fetch from 'node-fetch'

const Playlist = ({ playlist }) => (
	<div>
		<Link to={`/playlists/${playlist.index}`} className="playlist">
			{playlist.name}
		</Link>
	</div>
)

class Playlists extends Component {
	state = {
		playlists: []
	}
	componentDidMount() {
		fetch('http://localhost/api/playlists').then((res) => res.json()).then((playlist) => {
			this.setState({ playlists: this.state.playlists.concat(playlist) })
		})
	}
	render() {
		return (
			<main>
				<h1>Playlists</h1>
				{this.state.playlists.map((playlist, i) => <Playlist key={i} playlist={playlist} />)}
			</main>
		)
	}
}

export default Playlists
