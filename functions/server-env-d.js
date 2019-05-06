"use strict";

let {
  env
} = require('./client/src/client-env');

Object.assign(env, {
  db: {
    password: process.env.DB_PASSWORD
  },
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  token: {
    secret: process.env.TOKEN_SECRET
  }
});
module.exports = {
  env
};