import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

const Song = ({ song, index, handleOnClick }) => (
	<Draggable key={song.id} draggableId={song.id} index={index}>
		{(provided, snapshot) => (
			<div
				onClick={() => handleOnClick()}
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				style={provided.draggableProps.style}
				className={`song playlist-in-progress-song ${snapshot.isDragging && 'being-dragged'}`}
			>
				<div className="now-playing-container">
					<div className="song-number">{index + 1}.</div>
				</div>
				<div className="song-name">{song.name}</div>
			</div>
		)}
	</Draggable>
)
export default Song
