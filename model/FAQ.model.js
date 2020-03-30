const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FAQSchema = new Schema({
question: String,
answer: String
},
{
versionKey: false 
});
const FAQModel = mongoose.model('faq', FAQSchema);
module.exports = FAQSchema;
module.exports = FAQModel;