import React, { Component } from 'react'

class Song extends Component {
	removeSongFromPlaylist(e) {
		this.props.removeSongFromPlaylist()
	}
	handleClick(e) {
		if (this.props.selected) this.removeSongFromPlaylist(e)
		else this.props.addSongToPlaylist()
	}
	render = () => (
		<div className={`song ${this.props.selected && 'selected'}`} onClick={() => this.handleClick()}>
			{this.props.name}
		</div>
	)
}
export default Song
