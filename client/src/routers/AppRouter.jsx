import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Header from '../components/Header'
import Authorize from '../pages/Authorize'
import Playlists from '../pages/Playlists'
import Playlist from '../pages/Playlist'
import NewPlaylist from '../pages/NewPlaylist'
import AddSongs from '../pages/AddSongs'
import NotFound from '../pages/NotFound'

import auth from '../components/auth'

class Routes extends Component {
	state = { dbx: this.props.dbx }
	render = () =>
		this.state.dbx ? (
			<Switch>
				<Route exact path="/" render={() => <Redirect to="/playlists" />} />
				<Route path="/auth" render={() => (this.state.dbx ? <Redirect to="/playlists" /> : <Authorize />)} />
				<Route exact path="/playlists" render={(routeProps) => <Playlists {...this.state} {...routeProps} />} />
				<Route
					exact
					path="/playlists/new"
					render={(routeProps) => <NewPlaylist {...this.props} {...routeProps} />}
				/>
				<Route
					exact
					path="/playlists/:id"
					render={(routeProps) => <Playlist {...this.state} {...routeProps} />}
				/>
				{/* <Route exact path="/add-songs" component={AddSongs} /> */}
				<Route component={NotFound} />
			</Switch>
		) : (
			<Switch>
				<Route path="/" component={Authorize} />
			</Switch>
		)
}

class AppRouter extends Component {
	state = { loading: true, isAuthenticated: false }
	componentDidMount = () => auth.authenticate().then((dbx) => this.setState({ loading: false, dbx }))
	render = () => {
		if (this.state.loading) return <div id="loading">Loading...</div>
		else
			return (
				<Router>
					<div>
						<Header />
						<Routes dbx={this.state.dbx} />
					</div>
				</Router>
			)
	}
}

export default AppRouter
