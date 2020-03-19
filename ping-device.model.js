const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PingDeviceSchema = new Schema({
  deviceName: String,
  pingResponse: String
},
{
  versionKey: false 
});

const PingDeviceModel = mongoose.model('ping-device', PingDeviceSchema);
module.exports = PingDeviceSchema;
module.exports = PingDeviceModel;
