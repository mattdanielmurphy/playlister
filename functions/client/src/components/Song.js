"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Song extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "render", () => _react.default.createElement("div", {
      className: `song ${this.props.selected && 'selected'}`,
      onClick: () => this.handleClick()
    }, this.props.name));
  }

  removeSongFromPlaylist(e) {
    this.props.removeSongFromPlaylist();
  }

  handleClick(e) {
    if (this.props.selected) this.removeSongFromPlaylist(e);else this.props.addSongToPlaylist();
  }

}

var _default = Song;
exports.default = _default;