import React, { Component } from 'react'
import dropbox from '../components/dropbox'

class Authorize extends Component {
	state = {
		url: ''
	}
	authUrl = async () => {
		const url = await dropbox.getAuthorizationUrl()
		this.setState({ url })
	}
	componentDidMount() {
		this.authUrl()
	}
	render = () => (
		<main id="page-wrap">
			<h1>Authorization Required</h1>
			<div id="content-wrapper">
				<p>In order to use Playlist Dr, you must give permission for this app to use your Dropbox account.</p>
				{this.state.url && (
					<h3>
						<a href={this.state.url}>Click here to authorize.</a>
					</h3>
				)}
			</div>
		</main>
	)
}

export default Authorize
