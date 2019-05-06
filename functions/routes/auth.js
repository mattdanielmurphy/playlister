"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const fetch = require('node-fetch');

const {
  Dropbox
} = require('dropbox');

const Cryptr = require('cryptr');

const {
  env
} = require('../server-env');

const cryptr = new Cryptr(env.token.secret);

class Auth {
  getHashTokenFromCode(code) {
    return _asyncToGenerator(function* () {
      const dbx = new Dropbox({
        clientId: env.client.id,
        clientSecret: env.client.secret,
        fetch
      });
      const accessToken = yield dbx.getAccessTokenFromCode(`${env.api.url}/api/auth`, code);
      return cryptr.encrypt(accessToken);
    })();
  }

  decryptTokenHash(tokenHash) {
    return cryptr.decrypt(tokenHash);
  }

  setupUser(dbx) {
    return _asyncToGenerator(function* () {
      const {
        account_id
      } = yield dbx.usersGetCurrentAccount();
      const newUser = {
        _id: account_id // will create new user if not already there

      };
      fetch(`${env.api.url}/api/users`, {
        method: 'post',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(function* (res) {
          res = yield res.json();

          if (res.error) {
            // don't display error if duplicate key error (try to create new user but user already exists)
            if (!res.error.errmsg.includes('E11000')) console.log(res.error);
          } else console.log('New user created', account_id);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    })();
  }

  getAuthorizationUrl() {
    return _asyncToGenerator(function* () {
      return yield new Dropbox({
        clientId: env.client.id,
        fetch
      }).getAuthenticationUrl(env.redirect.uri, null, 'code');
    })();
  }

  authenticateToken(accessToken) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const dbx = new Dropbox({
        accessToken,
        fetch
      });
      return yield dbx.filesListFolder({
        path: ''
      }).then(
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        yield _this.setupUser(dbx);
        return accessToken;
      })).catch(err => {
        console.log('ERR', err);
        return null;
      });
    })();
  }

}

const auth = new Auth();
module.exports = auth;