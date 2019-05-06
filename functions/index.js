"use strict";

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const cors = require('cors');

const functions = require('firebase-functions'); // production-mode specific


const apiRouter = require('./routes/api');

const {
  env
} = require('./server-env');

const app = express();
mongoose.connect(`mongodb+srv://mattmurphy:${env.db.password}@cluster0-1psk0.gcp.mongodb.net/test?retryWrites=true`, {
  dbName: 'playlister',
  useNewUrlParser: true
}).then(() => console.log('Database connected successfully')).catch(err => console.log(err));
mongoose.Promise = global.Promise; // override decprecated promise

app.use(cors({
  origin: true
}), bodyParser.json());
app.use('/api', apiRouter);
let api = functions.https.onRequest(app); // production-mode specific

module.exports = {
  api // production-mode specific

};