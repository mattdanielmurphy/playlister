import React, { Component } from 'react'
import { FaForward, FaPlay, FaPause, FaBackward } from 'react-icons/fa'
import { FiRepeat } from 'react-icons/fi'

class Controls extends Component {
	render = () => (
		<div id="player-wrapper">
			<div id="player">
				<LeftControls
					prevSong={() => this.props.prevSong()}
					playing={this.props.playing}
					togglePlayPause={() => this.props.togglePlayPause()}
					nextSong={() => this.props.nextSong()}
				/>
				<Seeker
					timeRemaining={this.props.timeRemaining}
					disabled={!this.props.canPlayThrough}
					onChange={(e) => this.props.handleSeek(e)}
				/>
				<RightControls toggleRepeat={(repeat) => this.props.toggleRepeat(repeat)} repeat={this.props.repeat} />
			</div>
		</div>
	)
}

const LeftControls = (props) => (
	<div id="controls-left">
		<PrevSong prevSong={() => props.prevSong()} />
		<PlayPause playing={props.playing} togglePlayPause={() => props.togglePlayPause()} />
		<NextSong nextSong={() => props.nextSong()} />
	</div>
)

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

const Seeker = (props) => (
	<div id="seek-display">
		<div id="seek-wrapper">
			<input
				type="range"
				id="seek"
				min="0"
				max="100"
				defaultValue="0"
				disabled={props.disabled}
				onChange={(e) => props.onChange(e)}
			/>
		</div>
		<div id="time-remaining">-{props.timeRemaining}</div>
	</div>
)

const RightControls = (props) => (
	<div id="controls-right">
		<Repeat toggleRepeat={(repeat) => props.toggleRepeat(repeat)} repeat={props.repeat} />
	</div>
)

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

export default Controls
