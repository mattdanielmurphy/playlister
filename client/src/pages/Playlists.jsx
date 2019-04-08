import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import fetch from 'node-fetch'

const Playlist = ({ playlist }) => (
	<div>
		<Link to={`/playlists/${playlist._id}`} className="playlist">
			{playlist.name}
		</Link>
	</div>
)

class NoPlaylists extends Component {
	render = () => (
		<div>
			<h2>You don't yet have any playlists on this account.</h2>
			<p>
				<a href="/playlists/new">Click here to make one!</a>
			</p>
		</div>
	)
}

class Playlists extends Component {
	state = {
		playlists: []
	}
	async componentDidMount() {
		const { account_id } = await this.props.dbx.usersGetCurrentAccount()
		fetch(`http://localhost/api/${account_id}/playlists`).then((res) => res.json()).then((playlist) => {
			if (playlist.length === 0) {
				this.setState({ noPlaylists: true })
			} else {
				this.setState({ playlists: this.state.playlists.concat(playlist) })
			}
		})
	}
	render() {
		return (
			<main>
				<h1>Playlists</h1>
				{this.state.noPlaylists ? (
					<NoPlaylists />
				) : (
					this.state.playlists.map((playlist, i) => <Playlist key={i} playlist={playlist} />)
				)}
			</main>
		)
	}
}

export default Playlists
