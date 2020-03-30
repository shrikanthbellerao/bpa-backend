// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;


// const OrderSchema = new Schema({
//   // device_type: String,
//   // action: String,
//   // vlan_type: String,
//   // vlan_id: String,
//   // vlan_name: String,
//   // vlan_description: String,
//   // mtu: String,
//   // ip_address: String,
//   // peer_ip_address: String,
//   // hsrp_number: String,
//   // hsrp_ip: String,
//   // hostname: String,
//   // peer_hostname: String,
//   // dhcp_server: String,
//   // interface:String,
//   formDetails : Schema.Types.Mixed
//   })


// const OrderModel = mongoose.model('order', OrderSchema);
// // module.exports = OrderSchema;
// module.exports = OrderModel;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
formDetails : Schema.Types.Mixed
})
const OrderModel = mongoose.model('myOrders', OrderSchema);
module.exports = OrderSchema;
module.exports = OrderModel;
