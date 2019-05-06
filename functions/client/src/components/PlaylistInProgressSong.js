"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBeautifulDnd = require("react-beautiful-dnd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Song = ({
  song,
  index,
  handleOnClick
}) => _react.default.createElement(_reactBeautifulDnd.Draggable, {
  key: song.id,
  draggableId: song.id,
  index: index
}, (provided, snapshot) => _react.default.createElement("div", _extends({
  onClick: () => handleOnClick(),
  ref: provided.innerRef
}, provided.draggableProps, provided.dragHandleProps, {
  style: provided.draggableProps.style,
  className: `song playlist-in-progress-song ${snapshot.isDragging && 'being-dragged'}`
}), _react.default.createElement("div", {
  className: "now-playing-container"
}, _react.default.createElement("div", {
  className: "song-number"
}, index + 1, ".")), _react.default.createElement("div", {
  className: "song-name"
}, song.name)));

var _default = Song;
exports.default = _default;