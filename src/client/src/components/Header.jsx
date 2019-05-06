import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => (
	<nav>
		<div id="name">
			<a href="/">Playlist Dr</a>
		</div>
		<div id="page-links">
			<NavLink name="my-playlists" exact activeClassName="active" to="/playlists">
				My Playlists
			</NavLink>
			<NavLink name="new-playlist" exact activeClassName="active" to="/playlists/new">
				New Playlist
			</NavLink>
		</div>
	</nav>
)

export default Header
