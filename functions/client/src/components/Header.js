"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Header = () => _react.default.createElement("nav", null, _react.default.createElement("div", {
  id: "name"
}, _react.default.createElement("a", {
  href: "/"
}, "Playlist Dr")), _react.default.createElement("div", {
  id: "page-links"
}, _react.default.createElement(_reactRouterDom.NavLink, {
  name: "my-playlists",
  exact: true,
  activeClassName: "active",
  to: "/playlists"
}, "My Playlists"), _react.default.createElement(_reactRouterDom.NavLink, {
  name: "new-playlist",
  exact: true,
  activeClassName: "active",
  to: "/playlists/new"
}, "New Playlist")));

var _default = Header;
exports.default = _default;