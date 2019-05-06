import React, { Component } from 'react'
import Song from './PlaylistInProgressSong'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

class PlaylistInProgress extends Component {
	reorderSongs = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [ removed ] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)

		return result
	}
	onDragEnd(result) {
		if (!result.destination) return // dropped outside the list
		const songs = this.reorderSongs(this.props.songs, result.source.index, result.destination.index)
		this.props.updatePlaylistSongs(songs)
	}
	handleOnClick = (song) => this.props.removeSongFromPlaylist(song)
	render = () =>
		this.props.songs.length < 1 ? null : (
			<div>
				<h2>Playlist</h2>
				<DragDropContext onDragEnd={(result) => this.onDragEnd(result)}>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className={`playlist-in-progress-container`}
							>
								{this.props.songs.map((song, index) => (
									<Song
										handleOnClick={() => this.handleOnClick(song)}
										song={song}
										index={index}
										key={index}
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		)
}

export default PlaylistInProgress
