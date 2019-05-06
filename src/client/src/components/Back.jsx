import React from 'react'

const Back = (props) => {
	return (
		<div className="back-nav">
			<button className="button" onClick={props.history.goBack}>
				{props.text || 'Back'}
			</button>
		</div>
	)
}

export default Back
