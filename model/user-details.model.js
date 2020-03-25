const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    userName: String,
    password: String,
});

const UserModel = mongoose.model('user-detail', UserSchema);
module.exports = UserSchema;
module.exports = UserModel;
