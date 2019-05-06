"use strict";

require('dotenv').config();

const env = {
  mode: 'production',
  api: {
    url: 'https://playlistdr.com'
  },
  redirect: {
    uri: 'https://playlistdr.com/api/auth'
  },
  app: {
    url: 'https://playlistdr.com'
  }
};
module.exports = {
  env
};