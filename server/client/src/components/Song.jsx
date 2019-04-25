import React, { Component } from 'react'

class Song extends Component {
	removeSongFromPlaylist(e) {
		this.props.removeSongFromPlaylist()
	}
	handleClick(e) {
		console.log(e.target)
		if (e.target.classList.contains('selected')) this.removeSongFromPlaylist(e)
		else this.props.addSongToPlaylist()
		e.target.classList.toggle('selected')
	}
	render = () => (
		<div className="song" onClick={(e) => this.handleClick(e)}>
			{this.props.name}
		</div>
	)
}
export default Song
