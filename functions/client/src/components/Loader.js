"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayLoader = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = ({
  type
}) => _react.default.createElement("div", {
  className: `loader ${type || ''}`
}, _react.default.createElement("div", null));

exports.default = _default;

const PlayLoader = ({
  type
}) => _react.default.createElement("div", {
  className: "play-loader-wrapper"
}, _react.default.createElement("div", {
  className: `play-loader ${type || ''}`
}, _react.default.createElement("div", null)));

exports.PlayLoader = PlayLoader;