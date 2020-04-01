const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceCategorySchema = new Schema({
  _id: String,
  name: String,
  description: String
});

const ServiceCategoryModel = mongoose.model('categories-service', ServiceCategorySchema);
module.exports = ServiceCategorySchema;
module.exports = ServiceCategoryModel;
