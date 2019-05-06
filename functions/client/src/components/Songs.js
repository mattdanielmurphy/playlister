"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _dropbox = _interopRequireDefault(require("./dropbox"));

var _Song = _interopRequireDefault(require("./Song"));

var _Loader = _interopRequireDefault(require("../components/Loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Songs extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      songs: []
    });

    _defineProperty(this, "render", () => this.state.songs.length < 1 ? _react.default.createElement(_Loader.default, {
      type: "inline"
    }) : _react.default.createElement("div", null, _react.default.createElement("div", {
      className: "heading"
    }, _react.default.createElement("h2", {
      className: "inline"
    }, "Songs"), _react.default.createElement(_reactRouterDom.Link, {
      to: "/adding-songs"
    }, "(Not sure how to add songs?)")), _react.default.createElement("div", {
      id: "songs"
    }, this.state.songs.map((song, i) => _react.default.createElement(_Song.default, {
      key: i,
      removeSongFromPlaylist: () => this.props.removeSongFromPlaylist(song),
      addSongToPlaylist: () => this.props.addSongToPlaylist(song),
      name: song.name,
      selected: this.isSongInPlaylist(song)
    })))));
  }

  isSongInPlaylist(song) {
    let songIsInPlaylist = false;

    for (let i = 0; i < this.props.playlistSongs.length; i++) {
      const playlistSong = this.props.playlistSongs[i];

      if (playlistSong.id === song.id) {
        songIsInPlaylist = true;
        break;
      }
    }

    return songIsInPlaylist;
  }

  componentDidMount() {
    _dropbox.default.getSongs().then(songs => this.setState({
      songs
    }));
  }

}

var _default = Songs;
exports.default = _default;