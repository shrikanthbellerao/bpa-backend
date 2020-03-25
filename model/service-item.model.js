const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceItemsSchema = new Schema({
  _id: String,
  name: String,
  description: String,
  tags:[{
    name:String,
    //_id:String
    }],
  categoryIds:[{
      description:String,
      _id:String,
      name:String
    }],
    flag:Boolean
});

const ServiceItemsModel = mongoose.model('service-item', ServiceItemsSchema);
module.exports = ServiceItemsSchema;
module.exports = ServiceItemsModel;
