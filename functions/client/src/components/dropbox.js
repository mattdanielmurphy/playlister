"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _dropbox = require("dropbox");

var _clientEnv = require("../client-env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DropboxObj {
  constructor() {
    var _this = this;

    _defineProperty(this, "getDbx", () => new _dropbox.Dropbox({
      accessToken: this.accessToken,
      fetch: _nodeFetch.default
    }));

    _defineProperty(this, "getUser",
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      return yield _this.getDbx().usersGetCurrentAccount().then(res => res);
    }));

    _defineProperty(this, "getSharedLinks",
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      return yield _this.getDbx().sharingListSharedLinks().then(({
        links
      }) => links);
    }));

    _defineProperty(this, "getLink",
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(function* (songPath) {
        // return await this.getDbx().filesGetTemporaryLink({ path: songPath }).then(({ link }) => link)
        return yield _this.getDbx().sharingCreateSharedLinkWithSettings({
          path: songPath,
          settings: {
            requested_visibility: {
              '.tag': 'public'
            }
          }
        }).then(res => {
          // report if resolved_visibility is not 'public': links won't be publically listenable
          return res.url;
        }).catch(rej => console.log('Rejected:', rej));
      });

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getSongs",
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      const songs = [];
      yield _this.getDbx().filesListFolder({
        path: ''
      }).then(res => {
        for (let i in res.entries) songs.push(res.entries[i]);
      }).catch(error => console.error(error));
      return songs;
    }));

    _defineProperty(this, "getAuthorizationUrl",
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      return yield (0, _nodeFetch.default)(`${_clientEnv.env.api.url}/api/get-auth-url`).then(
      /*#__PURE__*/
      function () {
        var _ref6 = _asyncToGenerator(function* (res) {
          const {
            url
          } = yield res.json();
          return url;
        });

        return function (_x2) {
          return _ref6.apply(this, arguments);
        };
      }());
    }));

    _defineProperty(this, "authenticate",
    /*#__PURE__*/
    function () {
      var _ref7 = _asyncToGenerator(function* (tokenOrHash) {
        return yield (0, _nodeFetch.default)(`${_clientEnv.env.api.url}/api/auth`, {
          method: 'post',
          body: JSON.stringify(tokenOrHash),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(
        /*#__PURE__*/
        function () {
          var _ref8 = _asyncToGenerator(function* (res) {
            const accessToken = yield res.json();
            if (accessToken) _this.accessToken = accessToken;
            return res;
          });

          return function (_x4) {
            return _ref8.apply(this, arguments);
          };
        }());
      });

      return function (_x3) {
        return _ref7.apply(this, arguments);
      };
    }());
  }

}

const dropbox = new DropboxObj();
var _default = dropbox;
exports.default = _default;