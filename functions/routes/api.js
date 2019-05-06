"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const router = require('express').Router();

const {
  Playlist,
  User
} = require('../models/user');

const auth = require('./auth');

const uuid = require('short-uuid');

const {
  env
} = require('../server-env'); // dropbox


router.get('/auth',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    console.log('get auth');
    const code = req.query.code;

    if (code) {
      const tokenHash = yield auth.getHashTokenFromCode(code).catch(err => console.log('Err:', err));
      console.log(env.app.url);
      res.redirect(`${env.app.url}/?tokenHash=${tokenHash}`);
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/auth',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (req, res, next) {
    let token = req.body.token;
    const tokenHash = req.body.tokenHash;

    if (token) {
      const accessToken = yield auth.authenticateToken(token);
      res.json(accessToken);
    } else if (tokenHash) {
      token = auth.decryptTokenHash(tokenHash);
      const accessToken = yield auth.authenticateToken(token);
      res.json(accessToken);
    }
  });

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/get-auth-url',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (req, res, next) {
    const url = yield auth.getAuthorizationUrl();
    res.json({
      url
    });
  });

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()); // create new playlist

router.post('/:userId/playlists',
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (req, res, next) {
    const userId = req.params.userId;
    const playlist = req.body;
    playlist._id = uuid.generate();
    User.findById(userId).then(user => {
      user.playlists.push({
        _id: playlist._id
      });
      user.save();
      console.log('created playlist', playlist);
    });
    Playlist.create(playlist).then(data => res.json(data)).catch(err => res.json({
      error: err
    }));
  });

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()); // delete a playlist

router.delete('/:userId/playlists/:playlistId', (req, res, next) => {
  const userId = req.params.userId;
  const playlistId = req.params.playlistId;
  const tokenHash = req.body.tokenHash;
  User.updateOne({
    _id: userId
  }, {
    $pull: {
      playlists: {
        _id: playlistId
      }
    }
  }).then(data => res.json(data)).catch(next);
}); // replace playlist: PUT

router.put('/:userId/playlists/:playlistId', (req, res, next) => {
  const userId = req.params.userId;
  const playlistId = req.params.playlistId;
  const newPlaylist = req.body;
  newPlaylist._id = playlistId;
  User.findById(userId).then(user => {
    const oldPlaylist = user.playlists.id(playlistId).remove();
    user.playlists.push(newPlaylist);
    user.save();
  });
}); // get all playlists of user

router.get('/:userId/playlists', ({
  params
}, res, next) => {
  let playlistIds;
  User.findById(params.userId).then(user => {
    // if no playlists return an empty array
    playlistIds = user.playlists ? user.playlists : []; // playlistIds = playlistIds.map((playlistId) => playlistId)

    Playlist.find({
      _id: {
        $in: playlistIds
      }
    }, function (err, playlists) {
      playlists = playlists.sort((a, b) => b.date - a.date);
      res.json(playlists);
    });
  });
}); // get a playlist by its id

router.get('/playlists/:playlistId', ({
  params
}, res, next) => {
  const playlistId = params.playlistId;
  Playlist.findById(playlistId).then(playlist => res.json(playlist));
}); // create new user

router.post('/users',
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* ({
    body
  }, res, next) {
    // add IDs to each playlist if playlists object provided
    if (body.playlists) {
      body.playlists = body.playlists.map((playlist, i) => {
        playlist._id = i + 1;
        return playlist;
      });
    }

    User.create(body).then(data => res.json(data)).catch(err => res.json({
      error: err
    }));
  });

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;