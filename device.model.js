const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DeviceSchema = new Schema({
    name: String,
    description: String,
    address: String,
    port: String,
    authgroup: String,
    admin_state: String,
    device_type: String,
    ned_id: String,
    protocol: String,
    latitude: String,
    longitude: String,
    ned_id: String,
    controller_id: String,
    sub_controller_id: String
  },
  {
    versionKey: false 
});

const DeviceModel = mongoose.model('device', DeviceSchema);
module.exports = DeviceSchema;
module.exports = DeviceModel;
