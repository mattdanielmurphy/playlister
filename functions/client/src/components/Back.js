"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Back = props => {
  return _react.default.createElement("div", {
    className: "back-nav"
  }, _react.default.createElement("button", {
    className: "button",
    onClick: props.history.goBack
  }, props.text || 'Back'));
};

var _default = Back;
exports.default = _default;