"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _Player = _interopRequireDefault(require("../components/Player"));

var _Loader = _interopRequireDefault(require("../components/Loader"));

var _clientEnv = require("../client-env");

var _Back = _interopRequireDefault(require("../components/Back"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Playlist extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      id: this.props.match.params.id,
      name: '',
      songs: [],
      currentSongIndex: 0
    });

    _defineProperty(this, "setCurrentSongIndex", i => this.setState({
      currentSongIndex: i
    }));

    _defineProperty(this, "setPlaylistState", state => this.setState(state));

    _defineProperty(this, "componentWillMount", () => {
      this.getSongs();
    });

    _defineProperty(this, "render", () => this.state.error ? _react.default.createElement("div", {
      className: "top-heading heading"
    }, _react.default.createElement(_Back.default, {
      history: this.props.history
    }), _react.default.createElement("h1", null, this.state.error)) : !this.state.songs || this.state.songs.length === 0 ? _react.default.createElement(_Loader.default, null) : _react.default.createElement("div", null, _react.default.createElement("div", {
      className: "top-heading heading"
    }, _react.default.createElement("a", {
      href: "/playlists",
      className: "button"
    }, "Back to My Playlists"), _react.default.createElement("h1", null, this.state.name)), _react.default.createElement("div", {
      id: "content-wrapper"
    }, _react.default.createElement(_Player.default, {
      currentSongIndex: this.state.currentSongIndex,
      songs: this.state.songs,
      setCurrentSongIndex: i => this.setCurrentSongIndex(i),
      setPlaylistState: state => this.setPlaylistState(state)
    }))));
  }

  getSongs() {
    var _this = this;

    (0, _nodeFetch.default)(`${_clientEnv.env.api.url}/api/playlists/${this.state.id}`).then(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (res) {
        const {
          songs,
          name,
          date
        } = yield res.json();

        _this.setState({
          songs: Object.values(songs),
          name,
          date
        });
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()).catch(() => this.setState({
      error: 'Error: Playlist not found!'
    }));
  }

}

var _default = Playlist;
exports.default = _default;