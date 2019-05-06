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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// class PlaylistInProgress extends Component {
// 	render = () =>
// 		this.props.songs.length === 0 ? null : (
// 			<div id="playlist-in-progress">
// 				<h2>Playlist</h2>
// 				<DragDropContext>
// 					<div>1</div>
// 					<div>2</div>
// 					{/* {Object.values(this.props.songs).map((song, i) => (
// 						<Song key={i} name={song.name} songObject={song} />
// 					))} */}
// 				</DragDropContext>
// 			</div>
// 		)
// }
// fake data generator
const getItems = count => Array.from({
  length: count
}, (v, k) => k).map(k => ({
  id: `item-${k}`,
  content: `item ${k}`
})); // a little function to help us with reordering the result


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => _objectSpread({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey'
}, draggableStyle);

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

class PlaylistInProgress extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      items: getItems(10)
    });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) return;
    const items = reorder(this.state.items, result.source.index, result.destination.index);
    this.setState({
      items
    });
  }

  handleOnClick(e) {} // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity


  render() {
    return _react.default.createElement(_reactBeautifulDnd.DragDropContext, {
      onDragEnd: () => this.onDragEnd
    }, _react.default.createElement(_reactBeautifulDnd.Droppable, {
      droppableId: "droppable"
    }, (provided, snapshot) => _react.default.createElement("div", _extends({}, provided.droppableProps, {
      ref: provided.innerRef,
      style: getListStyle(snapshot.isDraggingOver)
    }), this.state.items.map((item, index) => _react.default.createElement(_reactBeautifulDnd.Draggable, {
      key: item.id,
      draggableId: item.id,
      index: index
    }, (provided, snapshot) => _react.default.createElement("div", _extends({
      onClick: e => this.handleOnClick(e),
      ref: provided.innerRef
    }, provided.draggableProps, provided.dragHandleProps, {
      style: getItemStyle(snapshot.isDragging, provided.draggableProps.style)
    }), item.content))), provided.placeholder)));
  }

}

var _default = PlaylistInProgress;
exports.default = _default;