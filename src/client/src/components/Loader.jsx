import React from 'react'

export default ({ type }) => (
	<div className={`loader ${type || ''}`}>
		<div />
	</div>
)

export const PlayLoader = ({ type }) => (
	<div className="play-loader-wrapper">
		<div className={`play-loader ${type || ''}`}>
			<div />
		</div>
	</div>
)
