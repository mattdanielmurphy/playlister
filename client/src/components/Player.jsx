import React, { Component } from 'react'
import { FaVolume, FaForward, FaPlay, FaPause, FaBackward } from 'react-icons/fa'
import { FiRepeat } from 'react-icons/fi'

const Songs = ({ songs, currentSongIndex, playSong }) => {
	return (
		<ol>
			{songs.map((song, i) => (
				<li className="song" key={i} onClick={() => playSong(i)}>
					<div className="now-playing">{currentSongIndex === i && <FaVolume />}</div>
					{song.name}
				</li>
			))}
		</ol>
	)
}

class Repeat extends Component {
	handleClick() {
		let repeatButton = document.getElementById('repeat-button')
		repeatButton.classList.toggle('repeat-on')
		this.props.toggleRepeat()
	}
	render = () => (
		<button id="repeat-button" onClick={() => this.handleClick()}>
			<FiRepeat />
		</button>
	)
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
	state = { repeat: false, currentTime: 0, timeRemaining: '-:--' }
	async setSongSource(index) {
		let currentSongSource
		let currentSong = this.props.songs[index]
		const songPath = currentSong.path_lower
		await this.props.dbx.filesGetTemporaryLink({ path: songPath }).then(({ link }) => (currentSongSource = link))
		this.setState({ currentSongSource, canPlayThrough: false })
		return true
	}
	handleCanPlayThrough() {
		this.setState({ canPlayThrough: true })
		if (this.state.continuePlaying) {
			this.play()
		} else if (this.state.waitingToPlay) {
			this.setState({ waitingToPlay: false })
			this.play()
		} else {
			this.pause()
		}
	}
	handlePlaying() {
		this.setState({ playing: true, continuePlaying: true })
	}
	getNextSongIndex() {
		const lastSongIndex = this.props.songs.length - 1
		const lastSongOfPlaylist = this.props.currentSongIndex === lastSongIndex
		let currentSongIndex = lastSongOfPlaylist ? 0 : this.props.currentSongIndex + 1
		// continue playing is set to true only if it's not the last song in the playlist && repeat is on && is already true
		const continuePlayingIfAlreadyPlaying = this.state.continuePlaying ? true : false
		let continuePlaying = lastSongOfPlaylist && !this.state.repeat ? false : continuePlayingIfAlreadyPlaying
		this.setState({ continuePlaying })
		this.props.setCurrentSongIndex(currentSongIndex)
		return currentSongIndex
	}
	getPrevSongIndex() {
		const lastSongIndex = this.props.songs.length - 1
		const firstSongIndex = 0
		const firstSongOfPlaylist = this.props.currentSongIndex === firstSongIndex
		let currentSongIndex = firstSongOfPlaylist ? lastSongIndex : this.props.currentSongIndex - 1
		this.setState({ currentSongIndex })
		this.props.setCurrentSongIndex(currentSongIndex)
		return currentSongIndex
	}
	handleSongEnd() {
		this.nextSong()
	}
	nextSong() {
		const currentSongIndex = this.getNextSongIndex()
		this.props.setCurrentSongIndex(currentSongIndex)
		this.setSongSource(currentSongIndex)
	}
	prevSong() {
		const currentSongIndex = this.getPrevSongIndex()
		this.props.setCurrentSongIndex(currentSongIndex)
		this.setSongSource(currentSongIndex)
	}
	playSong(index) {
		this.props.setCurrentSongIndex(index)
		this.setSongSource(index).then(() => this.play())
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
	handleSeek(e) {
		const audioEl = document.getElementsByTagName('audio')[0]
		audioEl.currentTime = e.target.value
	}
	getTimeRemaining({ duration = this.state.currentSongDuration, currentTime = this.state.currentTime }) {
		const totalSecs = Math.floor(duration - currentTime)
		const secsRemaining = totalSecs % 60
		const minsRemaining = totalSecs < 60 ? 0 : (totalSecs - secsRemaining) / 60
		const leadingZero = (n) => (n < 10 ? `0${n}` : n)
		return `${minsRemaining}:${leadingZero(secsRemaining)}`
	}
	handleDurationChange(e) {
		const duration = e.target.duration
		const seek = document.getElementById('seek')
		seek.max = duration
		const currentTime = 0
		this.setState({
			currentSongDuration: duration,
			timeRemaining: this.getTimeRemaining({ duration, currentTime })
		})
	}
	handleTimeUpdate(e) {
		this.setState({ currentTime: e.target.currentTime })
		const seek = document.getElementById('seek')
		seek.value = e.target.currentTime
		this.setState({ timeRemaining: this.getTimeRemaining({ currentTime: e.target.currentTime }) })
	}
	render = () => {
		if (!this.props.songs || this.props.songs.length === 0) return <div>loading...</div>
		else if (!this.state.currentSongSource) {
			this.setSongSource(0)
			return <div>loading...</div>
		} else
			return (
				<div>
					<Songs
						playSong={(i) => this.playSong(i)}
						songs={this.props.songs}
						currentSongIndex={this.props.currentSongIndex}
					/>
					<div id="player-wrapper">
						<div id="player">
							<div id="controls-left">
								<PrevSong prevSong={() => this.prevSong()} />
								<PlayPause
									playing={this.state.playing}
									togglePlayPause={() => this.togglePlayPause()}
								/>
								<NextSong nextSong={() => this.nextSong()} />
							</div>
							<div id="seek-display">
								<div id="seek-wrapper">
									<input
										type="range"
										id="seek"
										min="0"
										max="100"
										defaultValue="0"
										disabled={!this.state.canPlayThrough}
										onChange={(e) => this.handleSeek(e)}
									/>
								</div>
								<div id="time-remaining">-{this.state.timeRemaining}</div>
							</div>
							<div id="controls-right">
								<Repeat
									toggleRepeat={(repeat) => this.toggleRepeat(repeat)}
									repeat={this.state.repeat}
								/>
							</div>
							<audio
								onEnded={() => this.handleSongEnd()}
								onCanPlayThrough={() => this.handleCanPlayThrough()}
								onPlaying={() => this.handlePlaying()}
								src={this.state.currentSongSource}
								onDurationChange={(e) => this.handleDurationChange(e)}
								onTimeUpdate={(e) => this.handleTimeUpdate(e)}
							/>
						</div>
					</div>
				</div>
			)
	}
}

export default Player
