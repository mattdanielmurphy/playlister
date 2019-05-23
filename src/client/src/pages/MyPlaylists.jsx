import React, { Component } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import fetch from 'node-fetch'
import dropbox from '../components/dropbox'
import Loader from '../components/Loader'
import { env } from '../client-env'
import showDateString from '../components/dateString'

const Playlist = ({ playlist }) => (
	<div className="playlist">
		<div className="playlist-name">
			<a href={`/playlists/${playlist._id}`}>{playlist.name}</a>
		</div>
		<div className="playlist-date">{showDateString(playlist.date)}</div>
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

class MyPlaylists extends Component {
	state = { playlists: [], sortReversed: false }
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
	reverseSort = () =>
		this.setState({ playlists: this.state.playlists.reverse(), sortReversed: !this.state.sortReversed })
	render() {
		return (
			<div>
				<div id="page-heading">
					<h1>My Playlists</h1>
				</div>
				<main id="playlists">
					<div id="content-wrapper">
						{this.loading ? (
							<Loader type="inline" />
						) : this.state.noPlaylists ? (
							<NoPlaylists />
						) : (
							<div>
								<button className="button date-sort" onClick={() => this.reverseSort()}>
									Date{' '}
									<span className="sort-icon">
										{this.state.sortReversed ? <FaCaretUp /> : <FaCaretDown />}
									</span>
								</button>
								{this.state.playlists.map((playlist, i) => <Playlist key={i} playlist={playlist} />)}
							</div>
						)}
					</div>
				</main>
			</div>
		)
	}
}

export default MyPlaylists
