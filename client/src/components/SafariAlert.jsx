import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import Cookies from 'js-cookie'

class SafariAlert extends Component {
	handleClick() {
		Cookies.set('doNotAlertAboutSafari', true)
		this.props.onClose()
	}
	render = () => (
		<div className="react-confirm-alert-overlay">
			<div className="react-confirm-alert">
				<div className="react-confirm-alert-body">
					<h1>Slow playback on Safari</h1>
					<p>
						Each song will load much slower before it will be able to play if you're using Safari. Use
						Chrome instead to fix this.
					</p>
					<div className="react-confirm-alert-button-group">
						<Button onClick={() => this.handleClick()}>Don't remind me again</Button>
						<Button onClick={this.props.onClose}>OK</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SafariAlert
