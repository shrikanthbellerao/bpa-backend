const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SupportSchema = require('../model/support-detail.model').SupportSchema;
const dbUser = 'bpa';
const dbPass = 'bpa';
const dbServer = 'bpa-mzccx.mongodb.net';
const dbName = 'bpa-db';
const dbUrl = `mongodb+srv://${dbUser}:${dbPass}@${dbServer}/${dbName}?retryWrites=true&w=majority`;
var connObj = mongoose.createConnection(
    dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
const SupportModel = connObj.model('support-detail', SupportSchema);
router.get('/techSupport', (req, res) => {
    SupportModel.find((err, content) => {
        if (err) {
            console.log('Failed to fetch Technical Support Details from the database');
        } else {
            res.send(content);
        }
    })

})
module.exports = router;