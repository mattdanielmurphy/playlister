import React from 'react'
import NowPlaying from './NowPlaying'

const Songs = ({ songs, currentSongIndex, playing, playSong }) => {
	if (!songs || songs.length === 0) return <div />
	return (
		<div>
			{songs.map((song, i) => (
				<div key={i}>
					<div className="song" onClick={() => playSong(i)}>
						<div className="now-playing-container">
							{playing && currentSongIndex === i ? (
								<NowPlaying />
							) : (
								<div className="song-number">{i + 1}.</div>
							)}
						</div>
						<div className="song-name">{song.name}</div>
					</div>
				</div>
			))}
		</div>
	)
}
export default Songs
