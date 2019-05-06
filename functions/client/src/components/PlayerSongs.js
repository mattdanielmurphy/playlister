"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _NowPlaying = _interopRequireDefault(require("./NowPlaying"));

var _Loader = require("./Loader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = ({
  songs,
  currentSongIndex,
  playing,
  changeSong,
  songLoading
}) => {
  if (!songs || songs.length === 0) return _react.default.createElement("div", null);
  return songs.map((song, i) => _react.default.createElement("div", {
    key: i,
    className: `song ${currentSongIndex === i && 'current-song'}`,
    onClick: () => changeSong(i)
  }, _react.default.createElement("div", {
    className: "now-playing-container"
  }, songLoading && currentSongIndex === i ? _react.default.createElement(_Loader.PlayLoader, {
    type: "inline"
  }) : playing && currentSongIndex === i ? _react.default.createElement(_NowPlaying.default, null) : _react.default.createElement("div", {
    className: "song-number"
  }, i + 1, ".")), _react.default.createElement("div", {
    className: `song-name ${currentSongIndex === i && playing && 'now-playing'}`
  }, song.name)));
};

exports.default = _default;