import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import fetch from 'node-fetch'
import dropbox from '../components/dropbox'
import Loader from '../components/Loader'
import { env } from '../env'

const Playlist = ({ playlist }) => (
	<Link to={`/playlists/${playlist._id}`} className="playlist">
		{playlist.name}
	</Link>
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

class MyPlaylists extends Component {
	state = { playlists: [] }
	loading = true
	async componentDidMount() {
		const { account_id } = await dropbox.getUser()
		fetch(`${env.api.url}/api/${account_id}/playlists`).then(async (res) => {
			const playlist = await res.json()
			this.loading = false
			if (playlist.length === 0) this.setState({ noPlaylists: true })
			else this.setState({ playlists: this.state.playlists.concat(playlist) })
		})
	}
	render() {
		return (
			<main>
				<h1>My Playlists</h1>
				<div id="content-wrapper">
					{this.loading ? (
						<Loader type="inline" />
					) : this.state.noPlaylists ? (
						<NoPlaylists />
					) : (
						<div id="playlists">
							{this.state.playlists.map((playlist, i) => <Playlist key={i} playlist={playlist} />)}
						</div>
					)}
				</div>
			</main>
		)
	}
}

export default MyPlaylists
