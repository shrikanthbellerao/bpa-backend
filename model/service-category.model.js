const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ServiceCategorySchema = new Schema({
  deviceName: String,
  pingResponse: String
});

const ServiceCategoryModel = mongoose.model('service-category', ServiceCategorySchema);
module.exports = ServiceCategorySchema;
module.exports = ServiceCategoryModel;
