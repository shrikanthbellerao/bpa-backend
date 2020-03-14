const express = require('express');
const app = express();
const mongoose = require('mongoose');

const GradesSchema = require('./sample_training.model').GradesSchema;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('Hi There!');
});

app.listen(8080, () => {

  console.log('Listening on port 8080!');

  const dbUrl = "mongodb+srv://bpa:bpa@bpa-mzccx.mongodb.net/sample_training";
  const connObj = mongoose.createConnection(dbUrl);
  const GradesModel = connObj.model('Grade', GradesSchema);

  GradesModel.find({}, { }, { limit:2 }, (err, docs) => {
    console.log('Err: ', err);
    console.log('Docs: ', docs);
  });
});