import React, { Component } from 'react'
import { Howl } from 'howler'
import Controls from '../components/Controls'
import PlayerSongs from './PlayerSongs'

class Player extends Component {
	state = {
		repeat: false,
		currentTime: 0,
		timeRemaining: '-:--',
		songSources: [],
		canPlayThrough: false,
		songLoading: true,
		playing: false
	}
	loadAudio(currentSongIndex = this.props.currentSongIndex) {
		const songs = this.props.songs
		const currentSong = songs[currentSongIndex]
		currentSong.sound = new Howl({
			src: currentSong.source,
			format: 'mp3',
			preload: true,
			onload: () => this.handleOnLoad(),
			onend: () => this.skip('next'),
			onplay: () => this.handleOnPlay(),
			onstop: () => this.handleOnStop()
		})
		this.props.setPlaylistState({ songs })
		if (this._isMounted) this.setState({ currentSong })
	}
	startTimeInterval = () => (this.timeInterval = setInterval(() => this.handleTimeUpdate(), 1000))
	stopTimeInterval = () => clearInterval(this.timeInterval)
	skip(direction) {
		let index = direction === 'prev' ? this.props.currentSongIndex - 1 : this.props.currentSongIndex + 1
		if (index < 0) index = this.props.songs.length - 1
		else if (index > this.props.songs.length - 1) index = 0
		this.changeSong(index)
	}
	changeSong(currentSongIndex) {
		this.state.currentSong.sound.stop()
		if (this._isMounted) this.setState({ songLoading: true, timeRemaining: '-:--' })
		this.props.setPlaylistState({ currentSongIndex })
		this.loadAudio(currentSongIndex)
		const seek = document.getElementById('seek')
		seek.value = 0
		if (!this.state.playWhenReady) this.setState({ playWhenReady: true })
	}
	playSong(currentSongIndex) {
		this.state.currentSong.sound.stop()
		this.props.setPlaylistState({ currentSongIndex })
		this.state.currentSong.sound.play()
	}
	toggleRepeat = () => (this._isMounted ? this.setState({ repeat: !this.state.repeat }) : null)
	play() {
		if (this.state.loading) {
			if (this._isMounted) this.setState({ playWhenReady: true })
		} else {
			this.state.currentSong.sound.play()
			if (this._isMounted) this.setState({ continuePlaying: true })
			if (this.state.playWhenReady) this.setState({ playWhenReady: false })
		}
	}
	pause() {
		if (this._isMounted) this.setState({ playing: false })
		this.state.currentSong.sound.pause()
	}
	togglePlayPause = () => (this.state.playing ? this.pause() : this.play())
	getTimeRemaining({ duration = this.state.currentSongDuration, currentTime = this.state.currentTime }) {
		const totalSecs = Math.floor(duration - currentTime)
		const secsRemaining = totalSecs % 60
		const minsRemaining = totalSecs < 60 ? 0 : (totalSecs - secsRemaining) / 60
		const leadingZero = (n) => (n < 10 ? `0${n}` : n)
		return `${minsRemaining}:${leadingZero(secsRemaining)}`
	}
	//
	// HANDLERS
	//
	handleOnPlay = () => {
		if (this._isMounted) this.setState({ playing: true, continuePlaying: true })
	}
	handleOnStop = () => {
		this.stopTimeInterval()
		if (this._isMounted) this.setState({ playing: false })
	}
	handleOnLoad() {
		const duration = this.state.currentSong.sound.duration()
		const seek = document.getElementById('seek')
		if (!seek) return null
		seek.max = duration
		const currentTime = 0
		this.startTimeInterval()
		if (this._isMounted)
			this.setState({
				songLoading: false,
				currentSongDuration: duration,
				timeRemaining: this.getTimeRemaining({ duration, currentTime }),
				canPlayThrough: true
			})
		if (this.state.playWhenReady && !this.state.currentSong.sound.playing()) this.play()
		else if (this.state.continuePlaying) this.play()
		else this.pause()
	}
	handleSeek = (e) => this.state.currentSong.sound.seek(e.target.value)
	handleTimeUpdate() {
		if (this._isMounted) this.setState({ currentTime: this.state.currentSong.sound.seek() })
		const seek = document.getElementById('seek')
		if (!seek) return null
		seek.value = this.state.currentSong.sound.seek()
		if (this._isMounted)
			this.setState({
				timeRemaining: this.getTimeRemaining({
					currentTime: this.state.currentSong.sound.seek()
				})
			})
	}
	// KEYBOARD HANDLERS
	handleKeyDown = (e) => {
		if (!this.keyHeld) {
			this.keyHeld = true
			if (e.key === ' ') this.state.playing ? this.pause() : this.play()
			else if (e.key === 'ArrowRight') this.skip('next')
			else if (e.key === 'ArrowLeft') this.skip('prev')
		}
	}
	handleKeyUp = (e) => (this.keyHeld = false)
	handleKeyboardControls() {
		window.addEventListener('keydown', (e) => this.handleKeyDown(e))
		window.addEventListener('keyup', (e) => this.handleKeyUp(e))
	}
	//
	// Lifecycle Methods
	//
	componentWillUnmount() {
		this._isMounted = false
		this.state.currentSong.sound.off()
		this.state.currentSong.sound.unload()
		this.stopTimeInterval()
		window.removeEventListener('keydown', (e) => this.handleKeyDown(e))
		window.removeEventListener('keyup', (e) => this.handleKeyUp(e))
	}
	componentDidMount = () => {
		this._isMounted = true
		this.loadAudio()
		this.handleKeyboardControls()
	}
	render = () => (
		<main id="playlist">
			<PlayerSongs
				changeSong={(i) => this.changeSong(i)}
				songs={this.props.songs}
				currentSongIndex={this.props.currentSongIndex}
				playing={this.state.playing}
				songLoading={this.state.songLoading}
			/>
			<Controls
				songLoading={this.state.songLoading}
				playing={this.state.playing}
				canPlayThrough={this.state.canPlayThrough}
				timeRemaining={this.state.timeRemaining}
				repeat={this.state.repeat}
				togglePlayPause={() => this.togglePlayPause()}
				skip={(direction) => this.skip(direction)}
				handleSeek={(e) => this.handleSeek(e)}
				toggleRepeat={(repeat) => this.toggleRepeat(repeat)}
			/>
		</main>
	)
}

export default Player
