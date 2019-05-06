"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _dropbox = _interopRequireDefault(require("../components/dropbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Authorize extends _react.Component {
  constructor(...args) {
    var _this;

    super(...args);
    _this = this;

    _defineProperty(this, "state", {
      url: ''
    });

    _defineProperty(this, "authUrl",
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      const url = yield _dropbox.default.getAuthorizationUrl();

      _this.setState({
        url
      });
    }));

    _defineProperty(this, "render", () => _react.default.createElement("main", null, _react.default.createElement("h1", null, "Authorization Required"), _react.default.createElement("div", {
      id: "content-wrapper"
    }, this.state.url && _react.default.createElement("a", {
      href: this.state.url
    }, "Click here to authorize."))));
  }

  componentDidMount() {
    this.authUrl();
  }

}

var _default = Authorize;
exports.default = _default;