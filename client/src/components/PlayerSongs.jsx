import React from 'react'
import { FaVolume } from 'react-icons/fa'

const Songs = ({ songs, currentSongIndex, playSong }) => {
	if (!songs || songs.length === 0) return <div />
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
export default Songs
