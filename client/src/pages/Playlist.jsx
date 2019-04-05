import React, { Component } from 'react'
import fetch from 'node-fetch'
import { FaVolume, FaForward, FaPlay, FaPause, FaBackward } from 'react-icons/fa'

const Songs = ({ songs, currentSongIndex }) => {
	console.log(currentSongIndex)
	return (
		<ol>
			{songs.map((song, i) => (
				<li className="song" key={i}>
					<div className="now-playing">{currentSongIndex === i && <FaVolume />}</div>
					{song.name}
				</li>
			))}
		</ol>
	)
}

class Repeat extends Component {
	handleClick() {
		this.props.toggleRepeat()
	}
	render = () => <button onClick={(e) => this.handleClick(e)}>Repeat {this.props.repeat ? 'on' : 'off'}</button>
}

const NextSong = (props) => (
	<button onClick={() => props.nextSong()}>
		<FaForward />
	</button>
)
const PlayPause = (props) => (
	<button onClick={() => props.togglePlayPause()}>{props.playing ? <FaPause /> : <FaPlay />}</button>
)
const PrevSong = (props) => (
	<button onClick={() => props.prevSong()}>
		<FaBackward />
	</button>
)

class Player extends Component {
	state = { currentSongIndex: 0, repeat: false }
	async setSongSource(index) {
		let currentSongSource
		let currentSong = this.props.songs[index]
		const songPath = currentSong.path_lower
		await this.props.dbx.filesGetTemporaryLink({ path: songPath }).then(({ link }) => (currentSongSource = link))
		console.log('setting new source', index)
		this.setState({ currentSongSource, canPlayThrough: false })
	}
	handleCanPlayThrough() {
		this.setState({ canPlayThrough: true })
		if (this.state.continuePlaying) {
			this.play()
		} else if (this.state.waitingToPlay) {
			this.setState({ waitingToPlay: false })
			this.play()
		} else {
			console.log('not playing through')
			this.pause()
		}
	}
	handlePlaying() {
		this.setState({ playing: true, continuePlaying: true })
	}
	getNextSongIndex() {
		const lastSongIndex = this.props.songs.length - 1
		const lastSongOfPlaylist = this.state.currentSongIndex === lastSongIndex
		let currentSongIndex = lastSongOfPlaylist ? 0 : this.state.currentSongIndex + 1
		// continue playing is set to true only if it's not the last song in the playlist && repeat is on && is already true
		const continuePlayingIfAlreadyPlaying = this.state.continuePlaying ? true : false
		let continuePlaying = lastSongOfPlaylist && !this.state.repeat ? false : continuePlayingIfAlreadyPlaying
		this.setState({ currentSongIndex, continuePlaying })
		this.props.setCurrentSongIndex(currentSongIndex)
		return currentSongIndex
	}
	getPrevSongIndex() {
		const lastSongIndex = this.props.songs.length - 1
		const firstSongIndex = 0
		const firstSongOfPlaylist = this.state.currentSongIndex === firstSongIndex
		let currentSongIndex = firstSongOfPlaylist ? lastSongIndex : this.state.currentSongIndex - 1
		this.setState({ currentSongIndex })
		this.props.setCurrentSongIndex(currentSongIndex)
		return currentSongIndex
	}
	handleSongEnd() {
		this.nextSong()
	}
	nextSong() {
		const currentSongIndex = this.getNextSongIndex()
		this.setSongSource(currentSongIndex)
	}
	prevSong() {
		const currentSongIndex = this.getPrevSongIndex()
		this.setSongSource(currentSongIndex)
	}
	toggleRepeat() {
		this.setState({ repeat: !this.state.repeat })
	}
	play() {
		const audioEl = document.getElementsByTagName('audio')[0]
		audioEl.play()
		if (this.state.canPlayThrough) {
			this.setState({ playing: true })
		} else {
			this.setState({ waitingToPlay: true })
		}
	}
	pause() {
		this.setState({ playing: false })
		const audioEl = document.getElementsByTagName('audio')[0]
		audioEl.pause()
	}
	togglePlayPause() {
		if (this.state.playing) {
			this.pause()
		} else {
			this.play()
		}
	}
	render = () => {
		if (!this.props.songs || this.props.songs.length === 0) return <div>loading...</div>
		else if (!this.state.currentSongSource) {
			this.setSongSource(0)
			return <div>loading...</div>
		} else
			return (
				<div>
					<div>
						<Repeat toggleRepeat={(repeat) => this.toggleRepeat(repeat)} repeat={this.state.repeat} />
					</div>
					<PrevSong prevSong={() => this.prevSong()} />
					<PlayPause playing={this.state.playing} togglePlayPause={() => this.togglePlayPause()} />
					<NextSong nextSong={() => this.nextSong()} />
					<audio
						onEnded={() => this.handleSongEnd()}
						onCanPlayThrough={() => this.handleCanPlayThrough()}
						onPlaying={() => this.handlePlaying()}
						controls
						src={this.state.currentSongSource}
					/>
				</div>
			)
	}
}

class Playlist extends Component {
	state = {
		id: this.props.match.params.id,
		name: '',
		songs: [],
		currentSongIndex: 0
	}
	async fetchSongs() {
		let fetchedSongs
		await fetch(`http://localhost/api/playlists/${this.props.match.params.id}`)
			.then((res) => res.json())
			.then(({ songs, name, date }) => (fetchedSongs = songs))
		return fetchedSongs
	}
	setCurrentSongIndex(i) {
		this.setState({ currentSongIndex: i })
	}
	componentDidMount() {
		fetch(`http://localhost/api/playlists/${this.state.id}`).then((res) => res.json()).then((res) => {
			if (res) {
				const { songs, name, date } = res
				this.setState({
					songs: Object.values(songs),
					name,
					date
				})
			} else {
				this.setState({
					error: 'Error: Playlist not found!'
				})
			}
		})
	}
	componentDidUpdate() {
		console.log(this.state.songs)
	}
	render() {
		return (
			<main>
				{this.state.error ? (
					<h1>{this.state.error}</h1>
				) : (
					<div>
						<h1>Playlist: {this.state.name}</h1>
						<Songs songs={this.state.songs} currentSongIndex={this.state.currentSongIndex} />
						<Player
							songs={this.state.songs}
							dbx={this.props.dbx}
							setCurrentSongIndex={(i) => this.setCurrentSongIndex(i)}
						/>
					</div>
				)}
			</main>
		)
	}
}

export default Playlist
