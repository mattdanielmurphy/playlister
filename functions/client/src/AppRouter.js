"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _urlParse = _interopRequireDefault(require("url-parse"));

var _Header = _interopRequireDefault(require("./components/Header"));

var _dropbox = _interopRequireDefault(require("./components/dropbox"));

var _Loader = _interopRequireDefault(require("./components/Loader"));

var _Authorize = _interopRequireDefault(require("./pages/Authorize"));

var _MyPlaylists = _interopRequireDefault(require("./pages/MyPlaylists"));

var _Playlist = _interopRequireDefault(require("./pages/Playlist"));

var _NewPlaylist = _interopRequireDefault(require("./pages/NewPlaylist"));

var _AddingSongs = _interopRequireDefault(require("./pages/AddingSongs"));

var _NotFound = _interopRequireDefault(require("./pages/NotFound"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Routes extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "render", () => this.props.authenticated ? _react.default.createElement(_reactRouterDom.Switch, null, _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/",
      render: () => _react.default.createElement(_reactRouterDom.Redirect, {
        to: "/playlists"
      })
    }), _react.default.createElement(_reactRouterDom.Route, {
      path: "/auth",
      render: () => this.props.authenticated ? _react.default.createElement(_reactRouterDom.Redirect, {
        to: "/playlists"
      }) : _react.default.createElement(_Authorize.default, null)
    }), _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/playlists",
      component: _MyPlaylists.default
    }), _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/playlists/new",
      render: routeProps => _react.default.createElement(_NewPlaylist.default, _extends({}, this.props, routeProps))
    }), _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/playlists/:id",
      component: _Playlist.default
    }), _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/adding-songs",
      component: _AddingSongs.default
    }), _react.default.createElement(_reactRouterDom.Route, {
      component: _NotFound.default
    })) : _react.default.createElement(_reactRouterDom.Switch, null, _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/",
      component: _Authorize.default
    }), _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/auth",
      component: _Authorize.default
    }), _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/playlists",
      component: _Authorize.default
    }), _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/playlists/new",
      component: _Authorize.default
    }), _react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "/playlists/:id",
      component: _Playlist.default
    }), _react.default.createElement(_reactRouterDom.Route, {
      component: _NotFound.default
    })));
  }

}

class AppRouter extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      loading: true,
      authenticated: false
    });

    _defineProperty(this, "componentDidMount", () => {
      const tokenHash = _jsCookie.default.get('tokenHash') || (0, _urlParse.default)(window.location.href, true).query.tokenHash;
      if (tokenHash) this.authenticate(tokenHash);else this.setState({
        loading: false,
        authenticated: false
      });
    });

    _defineProperty(this, "render", () => {
      if (this.state.loading) return _react.default.createElement(_Loader.default, null);else return _react.default.createElement(_reactRouterDom.BrowserRouter, null, _react.default.createElement("div", null, _react.default.createElement(_Header.default, null), _react.default.createElement(Routes, {
        authenticated: this.state.authenticated
      })));
    });
  }

  authenticate(tokenHash) {
    console.log('tokenHash:', tokenHash);

    _dropbox.default.authenticate({
      tokenHash
    }).then(authenticated => {
      this.setState({
        loading: false,
        authenticated
      });
      if (authenticated) _jsCookie.default.set('tokenHash', tokenHash);
    });
  }

}

var _default = AppRouter;
exports.default = _default;