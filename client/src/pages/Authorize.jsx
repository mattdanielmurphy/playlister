import React, { Component } from 'react'
import fetch from 'node-fetch'
import { Dropbox } from 'dropbox'

class Authorize extends Component {
	authUrl = () =>
		new Dropbox({ clientId: 'kp2273iqykx8esz', fetch }).getAuthenticationUrl('http://localhost:3000/auth')
	render = () => (
		<main>
			<h1>Authorization Required</h1>
			<a href={this.authUrl()}>Click here to authorize.</a>
		</main>
	)
}

export default Authorize
