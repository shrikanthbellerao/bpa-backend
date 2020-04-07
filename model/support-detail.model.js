const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SupportSchema = new Schema({
    _id: String,
    Heading: String,
    Caption: String,
    SoftwareHeader: String,
    SoftwareSupport: String,
    ProductHeader: String,
    ProductSupport: String,
    NetworkHeader: String,
    NetworkSupport: String,
    SolutionHeader: String,
    SolutionSupport: String
});

const SupportModel = mongoose.model('support-detail', SupportSchema);
module.exports = SupportSchema;
module.exports = SupportModel;