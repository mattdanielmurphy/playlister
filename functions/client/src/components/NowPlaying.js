"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class NowPlaying extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "render", () => _react.default.createElement("div", {
      className: "now-playing"
    }, _react.default.createElement("div", {
      className: "item-wrapper"
    }, _react.default.createElement("div", {
      className: "item"
    })), _react.default.createElement("div", {
      className: "item-wrapper"
    }, _react.default.createElement("div", {
      className: "item"
    })), _react.default.createElement("div", {
      className: "item-wrapper"
    }, _react.default.createElement("div", {
      className: "item"
    }))));
  }

  componentDidMount() {
    let items = [].slice.call(document.querySelectorAll('.now-playing .item'));
    this.timer = null;

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    let random = items => {
      items.forEach(item => {
        let top = getRandomArbitrary(0, 70);
        item.style.top = top + '%';
      });
    };

    let start = () => {
      this.timer = setInterval(() => {
        random(items);
      }, 300);
    };

    start();
  }

  componentWillUnmount() {
    this.timer = null;
  }

}

var _default = NowPlaying;
exports.default = _default;