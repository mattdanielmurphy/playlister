"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AddingSongs extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "render", () => _react.default.createElement("main", null, _react.default.createElement("div", {
      className: "heading top-heading no-nav-heading"
    }, _react.default.createElement("h1", null, "Adding Songs")), _react.default.createElement("div", {
      id: "content-wrapper"
    }, _react.default.createElement("p", null, "To add songs to Tracksimus, drag them into the ", _react.default.createElement("strong", null, "Apps/Tracksimus"), " folder inside your Dropbox."))));
  }

}

var _default = AddingSongs;
exports.default = _default;