import React, { Component } from 'react'
import Song from './PlaylistInProgressSong'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

// class PlaylistInProgress extends Component {
// 	render = () =>
// 		this.props.songs.length === 0 ? null : (
// 			<div id="playlist-in-progress">
// 				<h2>Playlist</h2>
// 				<DragDropContext>
// 					<div>1</div>
// 					<div>2</div>
// 					{/* {Object.values(this.props.songs).map((song, i) => (
// 						<Song key={i} name={song.name} songObject={song} />
// 					))} */}
// 				</DragDropContext>
// 			</div>
// 		)
// }

// fake data generator
const getItems = (count) =>
	Array.from({ length: count }, (v, k) => k).map((k) => ({
		id: `item-${k}`,
		content: `item ${k}`
	}))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list)
	const [ removed ] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? 'lightgreen' : 'grey',

	// styles we need to apply on draggables
	...draggableStyle
})

const getListStyle = (isDraggingOver) => ({
	background: isDraggingOver ? 'lightblue' : 'lightgrey',
	padding: grid,
	width: 250
})

class PlaylistInProgress extends Component {
	state = {
		items: getItems(10)
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) return

		const items = reorder(this.state.items, result.source.index, result.destination.index)

		this.setState({ items })
	}
	handleOnClick(e) {}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		return (
			<DragDropContext onDragEnd={() => this.onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided, snapshot) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							style={getListStyle(snapshot.isDraggingOver)}
						>
							{this.state.items.map((item, index) => (
								<Draggable key={item.id} draggableId={item.id} index={index}>
									{(provided, snapshot) => (
										<div
											onClick={(e) => this.handleOnClick(e)}
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
										>
											{item.content}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		)
	}
}

export default PlaylistInProgress
