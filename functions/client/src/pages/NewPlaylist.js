"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _Songs = _interopRequireDefault(require("../components/Songs"));

var _PlaylistInProgress = _interopRequireDefault(require("../components/PlaylistInProgress"));

var _dropbox = _interopRequireDefault(require("../components/dropbox"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _semanticUiReact = require("semantic-ui-react");

var _mongoKeyEscape = _interopRequireDefault(require("mongo-key-escape"));

var _clientEnv = require("../client-env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class NewPlaylist extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      playlist: {
        songs: []
      },
      error: undefined,
      loading: false,
      songIndex: -1
    });

    _defineProperty(this, "render", () => _react.default.createElement("main", {
      id: "create-playlist"
    }, _react.default.createElement("div", {
      className: "top-heading heading no-nav-heading"
    }, _react.default.createElement("h2", null, "creating"), _react.default.createElement("input", {
      className: "playlist-title-input",
      name: "playlist-name",
      type: "text",
      placeholder: "Click to set playlist title"
    })), _react.default.createElement("div", {
      id: "content-wrapper"
    }, _react.default.createElement(_Songs.default, {
      dbx: this.props.dbx,
      addSongToPlaylist: song => this.addSongToPlaylist(song),
      removeSongFromPlaylist: song => this.removeSongFromPlaylist(song),
      playlistSongs: this.state.playlist.songs
    }), _react.default.createElement(_PlaylistInProgress.default, {
      songs: this.state.playlist.songs,
      addSongToPlaylist: song => this.addSongToPlaylist(song),
      removeSongFromPlaylist: song => this.removeSongFromPlaylist(song),
      updatePlaylistSongs: songs => this.updatePlaylistSongs(songs)
    }), _react.default.createElement(_semanticUiReact.Form, {
      id: "create-playlist",
      onSubmit: e => this.handleSubmit(e)
    }, this.state.error && this.error(), this.state.added && // <p>
    // 	Playlist created! Listen to it <a href={this.state.link}>here</a>.
    // </p>
    _react.default.createElement(_reactRouterDom.Redirect, {
      to: this.state.link
    }), _react.default.createElement(_semanticUiReact.Button, {
      className: "button large-button",
      loading: this.state.loading
    }, "Create playlist")))));
  }

  addSongToPlaylist(song) {
    const playlist = this.state.playlist;
    playlist.songs.push(song);
    this.setState({
      playlist
    });
  }

  removeSongFromPlaylist(song) {
    const playlist = this.state.playlist;
    let index = playlist.songs.findIndex(v => v.id === song.id);
    playlist.songs.splice(index, 1);
    this.setState({
      playlist
    });
  }

  getSongLinks(songs) {
    return _asyncToGenerator(function* () {
      const existingLinks = yield _dropbox.default.getSharedLinks();
      songs.forEach(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(function* (song) {
          const matchedLink = existingLinks.find(link => link.id === song.id);
          song.source = matchedLink ? matchedLink.url : yield _dropbox.default.getLink(song.path_lower);
          song.source = song.source.replace(/\?dl=0/, '').replace(/www.dropbox/, 'dl.dropboxusercontent'); // make streamable as a file

          song.source += '?raw=1';
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      return songs;
    })();
  }

  createPlaylist(name, songs) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.setState({
        loading: true
      });

      songs = yield _this.getSongLinks(songs);
      const playlist = {
        name,
        songs
      };
      const {
        account_id
      } = yield _dropbox.default.getUser();
      (0, _nodeFetch.default)(`${_clientEnv.env.api.url}/api/${account_id}/playlists`, {
        method: 'POST',
        body: JSON.stringify(playlist),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(function* (res) {
          const {
            _id
          } = yield res.json();
          console.log('Playlist created', playlist);

          _this.setState({
            added: true,
            link: `/playlists/${_id}`,
            loading: false
          });
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }());
      if (_this.state.error) _this.setState({
        error: undefined
      });
    })();
  }

  handleSubmit(e) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      e.preventDefault(); // const name = e.target['playlist-name'].value.trim()

      const inputEl = document.getElementsByName('playlist-name')[0];
      const name = inputEl.value.trim();
      const songs = [];

      _this2.state.playlist.songs.forEach(song => {
        const thisSong = {};
        Object.keys(song).forEach(key => {
          const escapedKey = _mongoKeyEscape.default.escape(key);

          thisSong[escapedKey] = song[key];
        });
        songs.push(thisSong);
      });

      if (Object.values(_this2.state.playlist.songs).length === 0) {
        _this2.setState({
          error: 'Error: Playlist must contain at least one track.'
        });
      } else if (name.length < 1) {
        _this2.setState({
          error: 'Error: Playlist must have a name (set it at the top).'
        });
      } else {
        _this2.createPlaylist(name, songs);
      }
    })();
  }

  error() {
    return _react.default.createElement("div", {
      className: "error"
    }, this.state.error);
  }

  updatePlaylistSongs(songs) {
    const playlist = this.state.playlist;
    playlist.songs = songs;
    this.setState({
      playlist
    });
  }

}

var _default = NewPlaylist;
exports.default = _default;