import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { slide as Menu } from 'react-burger-menu'

class BurgerMenu extends Component {
	state = {
		menuOpen: false
	}

	// This keeps your state in sync with the opening/closing of the menu
	// via the default means, e.g. clicking the X, pressing the ESC key etc.
	handleStateChange(state) {
		this.setState({ menuOpen: state.isOpen })
	}

	// This can be used to close the menu, e.g. when a user clicks a menu item
	closeMenu(e) {
		e.target.blur()
		this.setState({ menuOpen: false })
	}

	// This can be used to toggle the menu, e.g. when using a custom icon
	// Tip: You probably want to hide either/both default icons if using a custom icon
	// See https://github.com/negomi/react-burger-menu#custom-icons
	toggleMenu() {
		this.setState((state) => ({ menuOpen: !state.menuOpen }))
	}

	render = () => (
		<Menu
			pageWrapId={'page-wrap'}
			outerContainerId={'outer-container'}
			disableAutoFocus
			isOpen={this.state.menuOpen}
			onStateChange={(state) => this.handleStateChange(state)}
		>
			<NavLink
				onClick={(e) => this.closeMenu(e)}
				name="my-playlists"
				exact
				activeClassName="active"
				to="/playlists"
			>
				My Playlists
			</NavLink>
			<NavLink
				onClick={(e) => this.closeMenu(e)}
				name="new-playlist"
				exact
				activeClassName="active"
				to="/playlists/new"
			>
				New Playlist
			</NavLink>
		</Menu>
	)
}

const Header = () => (
	<div>
		<MediaQuery maxWidth={600}>
			<BurgerMenu />
		</MediaQuery>
		<div id="header">
			<MediaQuery minWidth={600}>
				<div id="page-links">
					<NavLink name="my-playlists" exact activeClassName="active" to="/playlists">
						My Playlists
					</NavLink>
					<NavLink name="new-playlist" exact activeClassName="active" to="/playlists/new">
						New Playlist
					</NavLink>
				</div>
			</MediaQuery>
			<div id="logo-container">
				<a href="/">
					<svg
						width="34px"
						height="34px"
						viewBox="0 0 34 34"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Artboard</title>
						<desc>Created with Sketch.</desc>
						<g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
							<path
								d="M3,0 L31,0 C32.6568542,-3.04359188e-16 34,1.34314575 34,3 L34,31 C34,32.6568542 32.6568542,34 31,34 L3,34 C1.34314575,34 2.02906125e-16,32.6568542 0,31 L0,3 C-2.02906125e-16,1.34314575 1.34314575,3.04359188e-16 3,0 Z M17.652133,17.4680088 C17.652133,16.5860044 17.5004109,15.7700221 17.1969623,15.0200374 C16.8935136,14.2700527 16.4661863,13.6226037 15.9149677,13.077671 C15.363749,12.5327383 14.699791,12.1057872 13.9230738,11.7968047 C13.1463566,11.4878222 12.2847423,11.3333333 11.3382052,11.3333333 L6.61111111,11.3333333 L6.61111111,23.6111111 L11.3382052,23.6111111 C12.2847423,23.6111111 13.1463566,23.4580266 13.9230738,23.1518531 C14.699791,22.8456796 15.363749,22.4187284 15.9149677,21.8709868 C16.4661863,21.3232452 16.8935136,20.6743918 17.1969623,19.9244071 C17.5004109,19.1744224 17.652133,18.3556312 17.652133,17.4680088 Z M14.7624253,17.4680088 C14.7624253,18.0803559 14.6844763,18.6308982 14.5285761,19.1196523 C14.3726759,19.6084063 14.1485727,20.0227175 13.8562597,20.3625982 C13.5639468,20.7024789 13.2062168,20.9637056 12.783059,21.1462861 C12.3599013,21.3288667 11.8782881,21.4201556 11.3382052,21.4201556 L9.45070826,21.4201556 L9.45070826,13.5242889 L11.3382052,13.5242889 C11.8782881,13.5242889 12.3599013,13.6155778 12.783059,13.7981583 C13.2062168,13.9807389 13.5639468,14.2419656 13.8562597,14.5818463 C14.1485727,14.921727 14.3726759,15.3360381 14.5285761,15.8247922 C14.6844763,16.3135463 14.7624253,16.8612797 14.7624253,17.4680088 Z M23.2812167,17.1056585 L22.1453779,17.1056585 L22.1453779,13.4653016 L23.2812167,13.4653016 C24.0106071,13.4653016 24.54929,13.6169816 24.8972816,13.9203462 C25.2452732,14.2237108 25.4192664,14.6450442 25.4192664,15.184359 C25.4192664,15.4540164 25.3802919,15.705412 25.3023418,15.9385533 C25.2243917,16.1716947 25.0991166,16.3753391 24.9265127,16.5494929 C24.7539089,16.7236466 24.5325896,16.8598777 24.2625481,16.9581903 C23.9925066,17.0565029 23.6653994,17.1056585 23.2812167,17.1056585 Z M29.2777778,23.6111111 L26.6887333,19.3387478 C26.5606724,19.1421226 26.4159101,18.9721848 26.254442,18.8289293 C26.0929739,18.6856738 25.9203727,18.566296 25.7366331,18.4707923 C26.1319515,18.31911 26.4813299,18.1252967 26.7847785,17.8893465 C27.0882272,17.6533962 27.3429532,17.3851473 27.5489642,17.0845916 C27.7549752,16.784036 27.9108731,16.4568004 28.0166626,16.102875 C28.122452,15.7489497 28.1753459,15.3725585 28.1753459,14.9736902 C28.1753459,14.451229 28.0862614,13.9681 27.9080897,13.5242889 C27.729918,13.0804777 27.4445692,12.6956599 27.0520347,12.3698238 C26.6595002,12.0439878 26.1528321,11.7897833 25.5320151,11.6072028 C24.9111981,11.4246222 24.1609395,11.3333333 23.2812167,11.3333333 L19.3224842,11.3333333 L19.3224842,23.6111111 L22.1453779,23.6111111 L22.1453779,19.0690917 L22.8636289,19.0690917 C23.0807757,19.0690917 23.2478091,19.1042029 23.3647343,19.1744261 C23.4816595,19.2446494 23.5874473,19.3556006 23.682101,19.5072828 L25.7032261,23.071799 C25.9092371,23.4313422 26.2488718,23.6111111 26.7221403,23.6111111 L29.2777778,23.6111111 Z"
								id="logo"
								fill="#FFFFFF"
							/>
						</g>
					</svg>
				</a>
			</div>
		</div>
	</div>
)

export default Header
