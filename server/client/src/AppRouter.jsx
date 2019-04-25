import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import parse from 'url-parse'

import Header from './components/Header'
import Authorize from './pages/Authorize'
import Playlists from './pages/Playlists'
import Playlist from './pages/Playlist'
import NewPlaylist from './pages/NewPlaylist'
import NotFound from './pages/NotFound'
import dropbox from './components/dropbox'

class Routes extends Component {
	render = () =>
		this.props.authenticated ? (
			<Switch>
				<Route exact path="/" render={() => <Redirect to="/playlists" />} />
				<Route
					path="/auth"
					render={() => (this.props.authenticated ? <Redirect to="/playlists" /> : <Authorize />)}
				/>
				<Route exact path="/playlists" render={(routeProps) => <Playlists {...routeProps} />} />
				<Route
					exact
					path="/playlists/new"
					render={(routeProps) => <NewPlaylist {...this.props} {...routeProps} />}
				/>
				<Route exact path="/playlists/:id" render={(routeProps) => <Playlist {...routeProps} />} />
				<Route component={NotFound} />
			</Switch>
		) : (
			<Switch>
				<Route exact path="/" component={Authorize} />
				<Route exact path="/auth" component={Authorize} />
				<Route exact path="/playlists" component={Authorize} />
				<Route exact path="/playlists/new" component={Authorize} />
				<Route exact path="/playlists/:id" render={(routeProps) => <Playlist {...routeProps} />} />
				<Route component={NotFound} />
			</Switch>
		)
}

class AppRouter extends Component {
	state = { loading: true, authenticated: false }
	authenticate(tokenHash) {
		console.log('tokenHash:', tokenHash)
		dropbox.authenticate({ tokenHash }).then((authenticated) => {
			this.setState({ loading: false, authenticated })
			if (authenticated) Cookies.set('tokenHash', tokenHash)
		})
	}
	componentDidMount = () => {
		const tokenHash = Cookies.get('tokenHash') || parse(window.location.href, true).query.tokenHash
		if (tokenHash) this.authenticate(tokenHash)
		else this.setState({ loading: false, authenticated: false })
	}

	render = () => {
		if (this.state.loading) return <div id="loading">Loading...</div>
		else
			return (
				<Router>
					<div>
						<Header />
						<Routes authenticated={this.state.authenticated} />
					</div>
				</Router>
			)
	}
}

export default AppRouter
