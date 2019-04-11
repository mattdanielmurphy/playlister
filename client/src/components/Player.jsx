import React, { Component } from 'react'
import dropbox from './dropbox'
import { Howl, Howler } from 'howler'
import Controls from '../components/Controls'
import PlayerSongs from './PlayerSongs'

class Player extends Component {
	state = {
		repeat: false,
		currentTime: 0,
		timeRemaining: '-:--',
		songSources: [],
		canPlayThrough: false
	}
	async setSongSource(index) {
		const songPath = this.props.songs[index].path_lower
		const songSources = this.state.songSources
		songSources[index] = await dropbox.getTempLink(songPath)
		this.setState({ songSources })
		return songSources[index]
	}
	async preloadSongSources() {
		// without this an infinite loop occurs
		if (!this.state.preloading) {
			let max = this.props.songs.length - 1
			this.setState({ preloading: true })
			this.setSongSource(0).then((src) => this.loadAudio(src))
			for (let i = 1; i <= max; i += 1) this.setSongSource(i)
		}
	}
	loadAudio(src) {
		this.sound = new Howl({
			src,
			format: 'mp3',
			preload: true,
			onload: () => this.handleOnLoad(),
			onend: () => this.handleSongEnd(),
			onplay: () => this.handleOnPlay(),
			onstop: () => this.handleOnStop()
		})
	}
	startTimeInterval() {
		this.timeInterval = setInterval(() => {
			this.handleTimeUpdate()
		}, 1000)
	}
	stopTimeInterval() {
		clearInterval(this.timeInterval)
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
	skip(direction) {
		let index = 0
		if (direction === 'prev') {
			index = this.state.currentSongIndex - 1
			if (index < 0) {
				index = this.props.songs.length - 1
			}
		}
	}
	nextSong() {
		this.sound.stop()
		this.setState({ isLoaded: false, timeRemaining: '-:--' })
		const currentSongIndex = this.getNextSongIndex()
		this.props.setCurrentSongIndex(currentSongIndex)
		this.loadAudio(this.state.songSources[currentSongIndex])
		// set current time to 0
		const seek = document.getElementById('seek')
		seek.value = 0
	}
	prevSong() {
		this.sound.stop()
		this.setState({ isLoaded: false, timeRemaining: '-:--' })
		const currentSongIndex = this.getPrevSongIndex()
		this.props.setCurrentSongIndex(currentSongIndex)
		this.loadAudio(this.state.songSources[currentSongIndex])
	}
	playSong(index) {
		this.state.songSources[this.state.currentSongIndex].stop()
		this.props.setCurrentSongIndex(index)
		if (this.state.songSources[index]) this.play()
		else this.setSongSource(index).then(() => this.play())
	}
	toggleRepeat() {
		this.setState({ repeat: !this.state.repeat })
	}
	play() {
		if (this.state.isLoaded) {
			this.sound.play()
			this.setState({ continuePlaying: true })
			if (this.state.playWhenReady) this.setState({ playWhenReady: false })
		} else {
			this.setState({ playWhenReady: true })
		}
	}
	pause() {
		this.setState({ playing: false })
		this.sound.pause()
	}
	togglePlayPause() {
		if (this.state.playing) {
			this.pause()
		} else {
			this.play()
		}
	}
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
		this.setState({ playing: true, continuePlaying: true })
	}
	handleOnStop = () => {
		this.stopTimeInterval()
		this.setState({ playing: false })
	}
	handleOnLoad() {
		const duration = this.sound.duration()
		const seek = document.getElementById('seek')
		seek.max = duration
		const currentTime = 0
		this.startTimeInterval()
		this.setState({
			currentSongDuration: duration,
			timeRemaining: this.getTimeRemaining({ duration, currentTime }),
			canPlayThrough: true,
			isLoaded: true
		})
		if (this.state.playWhenReady && !this.sound.playing()) this.play()
		else if (this.state.continuePlaying) this.play()
		else this.pause()
	}
	handleSongEnd() {
		this.nextSong()
	}
	handleSeek = (e) => this.sound.seek(e.target.value)
	handleTimeUpdate() {
		this.setState({ currentTime: this.sound.seek() })
		const seek = document.getElementById('seek')
		seek.value = this.sound.seek()
		this.setState({ timeRemaining: this.getTimeRemaining({ currentTime: this.sound.seek() }) })
	}
	// KEYBOARD HANDLERS
	handleKeyDown = (e) => {
		if (!this.keyHeld) {
			this.keyHeld = true
			if (e.key === ' ') this.state.playing ? this.pause() : this.play()
			else if (e.key === 'ArrowRight') this.nextSong()
			else if (e.key === 'ArrowLeft') this.prevSong()
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
		window.removeEventListener('keydown', (e) => this.handleKeyDown(e))
		window.removeEventListener('keyup', (e) => this.handleKeyUp(e))
		this.stopTimeInterval()
	}
	componentDidUpdate() {
		if (!this.state.songSources[0]) this.preloadSongSources()
	}
	render = () => {
		if (!this.props.songs || this.props.songs.length === 0 || !this.state.songSources[0])
			return <div>loading...</div>
		else {
			this.handleKeyboardControls()
			return (
				<div>
					<PlayerSongs
						playSong={(i) => this.playSong(i)}
						songs={this.props.songs}
						currentSongIndex={this.props.currentSongIndex}
					/>
					<Controls
						playing={this.state.playing}
						canPlayThrough={this.state.canPlayThrough}
						timeRemaining={this.state.timeRemaining}
						repeat={this.state.repeat}
						togglePlayPause={() => this.togglePlayPause()}
						prevSong={() => this.prevSong()}
						nextSong={() => this.nextSong()}
						handleSeek={(e) => this.handleSeek(e)}
						toggleRepeat={(repeat) => this.toggleRepeat(repeat)}
					/>
				</div>
			)
		}
	}
}

export default Player
