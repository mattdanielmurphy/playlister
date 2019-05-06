import React, { Component } from 'react'
import { FaForward, FaPlay, FaPause, FaBackward, FaVolumeUp } from 'react-icons/fa'
import { PlayLoader } from './Loader'

const Controls = (props) => (
	<div id="player-wrapper">
		<div id="player">
			<LeftControls
				playing={props.playing}
				togglePlayPause={() => props.togglePlayPause()}
				skip={(direction) => props.skip(direction)}
				songLoading={props.songLoading}
			/>
			<Seeker
				timeRemaining={props.timeRemaining}
				disabled={!props.canPlayThrough}
				onChange={(e) => props.handleSeek(e)}
			/>
			<RightControls setVolume={(v) => props.setVolume(v)} />
		</div>
	</div>
)

const LeftControls = (props) => (
	<div id="controls-left">
		<PrevSong skip={() => props.skip('prev')} />
		<PlayPause
			playing={props.playing}
			togglePlayPause={() => props.togglePlayPause()}
			songLoading={props.songLoading}
		/>
		<NextSong skip={() => props.skip('next')} />
	</div>
)

const NextSong = (props) => (
	<button className="next-song" onClick={() => props.skip()}>
		<FaForward />
	</button>
)
const PlayPause = (props) =>
	props.songLoading ? (
		<PlayLoader as="button" />
	) : (
		<button className="play-pause" onClick={() => props.togglePlayPause()}>
			{props.playing ? <FaPause /> : <FaPlay />}
		</button>
	)

const PrevSong = (props) => (
	<button className="prev-song" onClick={() => props.skip()}>
		<FaBackward />
	</button>
)

class Seeker extends Component {
	render = () => (
		<div id="seek-display">
			<div id="seek-wrapper">
				<input
					type="range"
					id="seek"
					min="0"
					max="100"
					defaultValue="0"
					disabled={this.props.disabled}
					onChange={(e) => this.props.onChange(e)}
				/>
			</div>
			<div id="time-remaining">-{this.props.timeRemaining}</div>
		</div>
	)
}

class Volume extends Component {
	curve = (input, x = 1.5) => Math.pow(input, x) / Math.pow(100, x) * 100
	onChange(e) {
		const volume = this.curve(e.target.value) / 100
		this.props.setVolume(volume)
	}
	render = () => (
		<div id="volume-control">
			<FaVolumeUp />
			<input
				type="range"
				id="volume-input"
				min="0"
				max="100"
				defaultValue="100"
				onChange={(e) => this.onChange(e)}
			/>
		</div>
	)
}

const RightControls = (props) => (
	<div id="controls-right">
		<Volume setVolume={(v) => props.setVolume(v)} />
	</div>
)

export default Controls
