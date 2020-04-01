const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FAQSchema = require('../model/FAQ.model').FAQSchema;
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
const UserModel = connObj.model('faq', FAQSchema);
router.get('/FAQ', (req, res) => {
UserModel.find((err, user) => {
if (err) {
console.log('Failed to fetch Admin Details from the database');
} else {
res.send(user);
}
})

})
module.exports = router;