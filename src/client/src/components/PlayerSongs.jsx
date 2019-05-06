import React from 'react'
import NowPlaying from './NowPlaying'
import { PlayLoader } from './Loader'

export default ({ songs, currentSongIndex, playing, changeSong, songLoading }) => {
	if (!songs || songs.length === 0) return <div />
	return songs.map((song, i) => (
		<div key={i} className={`song ${currentSongIndex === i && 'current-song'}`} onClick={() => changeSong(i)}>
			<div className="now-playing-container">
				{songLoading && currentSongIndex === i ? (
					<PlayLoader type="inline" />
				) : playing && currentSongIndex === i ? (
					<NowPlaying />
				) : (
					<div className="song-number">{i + 1}.</div>
				)}
			</div>
			<div className={`song-name ${currentSongIndex === i && playing && 'now-playing'}`}>{song.name}</div>
		</div>
	))
}
