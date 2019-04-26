import React from 'react'

class NowPlaying extends React.Component {
	componentDidMount() {
		let items = [].slice.call(document.querySelectorAll('.now-playing .item'))

		this.timer = null
		function getRandomArbitrary(min, max) {
			return Math.random() * (max - min) + min
		}

		let random = (items) => {
			items.forEach((item) => {
				let top = getRandomArbitrary(0, 70)
				item.style.top = top + '%'
			})
		}

		let start = () => {
			this.timer = setInterval(() => {
				random(items)
			}, 300)
		}

		start()
	}
	componentWillUnmount() {
		this.timer = null
	}
	render = () => (
		<div className="now-playing">
			<div className="item-wrapper">
				<div className="item" />
			</div>
			<div className="item-wrapper">
				<div className="item" />
			</div>
			<div className="item-wrapper">
				<div className="item" />
			</div>
		</div>
	)
}

export default NowPlaying
