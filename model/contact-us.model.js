const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FAQSchema = new Schema({
name: String,
email: String,
message: String
},
{
versionKey: false 
});
const contactUsModel = mongoose.model('contactUs', contactUschema);
module.exports = contactUsSchema;
module.exports = contactUsModel;