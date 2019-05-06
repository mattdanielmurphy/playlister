"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fa = require("react-icons/fa");

var _Loader = require("./Loader");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Controls = props => _react.default.createElement("div", {
  id: "player-wrapper"
}, _react.default.createElement("div", {
  id: "player"
}, _react.default.createElement(LeftControls, {
  playing: props.playing,
  togglePlayPause: () => props.togglePlayPause(),
  skip: direction => props.skip(direction),
  songLoading: props.songLoading
}), _react.default.createElement(Seeker, {
  timeRemaining: props.timeRemaining,
  disabled: !props.canPlayThrough,
  onChange: e => props.handleSeek(e)
}), _react.default.createElement(RightControls, {
  setVolume: v => props.setVolume(v)
})));

const LeftControls = props => _react.default.createElement("div", {
  id: "controls-left"
}, _react.default.createElement(PrevSong, {
  skip: () => props.skip('prev')
}), _react.default.createElement(PlayPause, {
  playing: props.playing,
  togglePlayPause: () => props.togglePlayPause(),
  songLoading: props.songLoading
}), _react.default.createElement(NextSong, {
  skip: () => props.skip('next')
}));

const NextSong = props => _react.default.createElement("button", {
  className: "next-song",
  onClick: () => props.skip()
}, _react.default.createElement(_fa.FaForward, null));

const PlayPause = props => props.songLoading ? _react.default.createElement(_Loader.PlayLoader, {
  as: "button"
}) : _react.default.createElement("button", {
  className: "play-pause",
  onClick: () => props.togglePlayPause()
}, props.playing ? _react.default.createElement(_fa.FaPause, null) : _react.default.createElement(_fa.FaPlay, null));

const PrevSong = props => _react.default.createElement("button", {
  className: "prev-song",
  onClick: () => props.skip()
}, _react.default.createElement(_fa.FaBackward, null));

class Seeker extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "render", () => _react.default.createElement("div", {
      id: "seek-display"
    }, _react.default.createElement("div", {
      id: "seek-wrapper"
    }, _react.default.createElement("input", {
      type: "range",
      id: "seek",
      min: "0",
      max: "100",
      defaultValue: "0",
      disabled: this.props.disabled,
      onChange: e => this.props.onChange(e)
    })), _react.default.createElement("div", {
      id: "time-remaining"
    }, "-", this.props.timeRemaining)));
  }

}

class Volume extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "curve", (input, x = 1.5) => Math.pow(input, x) / Math.pow(100, x) * 100);

    _defineProperty(this, "render", () => _react.default.createElement("div", {
      id: "volume-control"
    }, _react.default.createElement(_fa.FaVolumeUp, null), _react.default.createElement("input", {
      type: "range",
      id: "volume-input",
      min: "0",
      max: "100",
      defaultValue: "100",
      onChange: e => this.onChange(e)
    })));
  }

  onChange(e) {
    const volume = this.curve(e.target.value) / 100;
    this.props.setVolume(volume);
  }

}

const RightControls = props => _react.default.createElement("div", {
  id: "controls-right"
}, _react.default.createElement(Volume, {
  setVolume: v => props.setVolume(v)
}));

var _default = Controls;
exports.default = _default;