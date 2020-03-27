const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    _id: String,
    FullName: String,
    Role: String,
    Username: String,
    AccessType: String,
    WorkType: String,
    EmployeeID: Number,
    Department: String,
    Manager: String,
    Location: String,
    Email: String,
    WorkPhone: String,
    PersonalPhone: String

});

const UserModel = mongoose.model('user-detail', UserSchema);
module.exports = UserSchema;
module.exports = UserModel;
