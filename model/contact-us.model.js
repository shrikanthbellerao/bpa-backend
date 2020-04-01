const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactUsSchema = new Schema({
name: String,
email: String,
message: String
},
{
versionKey: false 
});
const contactUsModel = mongoose.model('contactform', contactUsSchema);
module.exports = contactUsSchema;
module.exports = contactUsModel;