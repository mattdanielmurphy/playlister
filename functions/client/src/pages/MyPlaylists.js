"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _fa = require("react-icons/fa");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _dropbox = _interopRequireDefault(require("../components/dropbox"));

var _Loader = _interopRequireDefault(require("../components/Loader"));

var _clientEnv = require("../client-env");

var _dateString = _interopRequireDefault(require("../components/dateString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Playlist = ({
  playlist
}) => _react.default.createElement("div", {
  className: "playlist"
}, _react.default.createElement(_reactRouterDom.Link, {
  to: `/playlists/${playlist._id}`
}, playlist.name), _react.default.createElement("div", {
  className: "playlist-date"
}, (0, _dateString.default)(playlist.date)));

class NoPlaylists extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "render", () => _react.default.createElement("div", null, _react.default.createElement("h2", null, "You don't yet have any playlists on this account."), _react.default.createElement("p", null, _react.default.createElement("a", {
      href: "/playlists/new"
    }, "Click here to make one!"))));
  }

}

class MyPlaylists extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      playlists: [],
      sortReversed: false
    });

    _defineProperty(this, "loading", true);

    _defineProperty(this, "reverseSort", () => this.setState({
      playlists: this.state.playlists.reverse(),
      sortReversed: !this.state.sortReversed
    }));
  }

  componentDidMount() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const {
        account_id
      } = yield _dropbox.default.getUser();
      (0, _nodeFetch.default)(`${_clientEnv.env.api.url}/api/${account_id}/playlists`).then(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(function* (res) {
          const playlist = yield res.json();
          _this.loading = false;
          if (playlist.length === 0) _this.setState({
            noPlaylists: true
          });else _this.setState({
            playlists: _this.state.playlists.concat(playlist)
          });
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    })();
  }

  render() {
    return _react.default.createElement("main", {
      id: "playlists"
    }, _react.default.createElement("div", {
      className: "top-heading heading no-nav-heading"
    }, _react.default.createElement("h1", null, "My Playlists")), _react.default.createElement("div", {
      id: "content-wrapper"
    }, this.loading ? _react.default.createElement(_Loader.default, {
      type: "inline"
    }) : this.state.noPlaylists ? _react.default.createElement(NoPlaylists, null) : _react.default.createElement("div", null, _react.default.createElement("button", {
      className: "button date-sort",
      onClick: () => this.reverseSort()
    }, "Date", ' ', _react.default.createElement("span", {
      className: "sort-icon"
    }, this.state.sortReversed ? _react.default.createElement(_fa.FaCaretUp, null) : _react.default.createElement(_fa.FaCaretDown, null))), this.state.playlists.map((playlist, i) => _react.default.createElement(Playlist, {
      key: i,
      playlist: playlist
    })))));
  }

}

var _default = MyPlaylists;
exports.default = _default;