"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _PlaylistInProgressSong = _interopRequireDefault(require("./PlaylistInProgressSong"));

var _reactBeautifulDnd = require("react-beautiful-dnd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PlaylistInProgress extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "reorderSongs", (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });

    _defineProperty(this, "handleOnClick", song => this.props.removeSongFromPlaylist(song));

    _defineProperty(this, "render", () => this.props.songs.length < 1 ? null : _react.default.createElement("div", null, _react.default.createElement("h2", null, "Playlist"), _react.default.createElement(_reactBeautifulDnd.DragDropContext, {
      onDragEnd: result => this.onDragEnd(result)
    }, _react.default.createElement(_reactBeautifulDnd.Droppable, {
      droppableId: "droppable"
    }, (provided, snapshot) => _react.default.createElement("div", _extends({}, provided.droppableProps, {
      ref: provided.innerRef,
      className: `playlist-in-progress-container`
    }), this.props.songs.map((song, index) => _react.default.createElement(_PlaylistInProgressSong.default, {
      handleOnClick: () => this.handleOnClick(song),
      song: song,
      index: index,
      key: index
    })), provided.placeholder)))));
  }

  onDragEnd(result) {
    if (!result.destination) return; // dropped outside the list

    const songs = this.reorderSongs(this.props.songs, result.source.index, result.destination.index);
    this.props.updatePlaylistSongs(songs);
  }

}

var _default = PlaylistInProgress;
exports.default = _default;