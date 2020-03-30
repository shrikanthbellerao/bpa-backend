const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserSchema = require('../model/user-detail.model').UserSchema;
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
const UserModel = connObj.model('user-detail', UserSchema);
router.get('/admin', (req, res) => {
    UserModel.findOne({
        AccessType: "Admin"
    }, (err, user) => {
        if (err) {
            console.log('Failed to fetch Admin Details from the database');
        } else {
            res.send(user);
        }
    })
});

router.get('/demo', (req, res) => {

    UserModel.findOne({
        AccessType: "User"
    }, (err, user) => {
        if (err) {
            console.log('Failed to fetch Demo User Details from the database');
        } else {
            res.send(user);
        }
    })

});

module.exports = router;