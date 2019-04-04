import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => (
	<nav>
		<NavLink exact activeClassName="currentPage" to="/playlists">
			Playlists
		</NavLink>
		<NavLink exact activeClassName="currentPage" to="/playlists/new">
			New Playlist
		</NavLink>
		<NavLink exact activeClassName="currentPage" to="/add-songs">
			Add Songs
		</NavLink>
	</nav>
)

export default Header
