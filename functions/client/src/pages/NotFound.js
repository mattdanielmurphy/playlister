"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NotFound = () => _react.default.createElement("div", null, _react.default.createElement("h1", null, "404: Page Not Found"), _react.default.createElement("div", {
  id: "content-wrapper"
}, _react.default.createElement("p", null, "Sorry about that.")));

var _default = NotFound;
exports.default = _default;