const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ServiceOrderSchema = new Schema({
    orderNumber: String,
    _id: String,
    processInstanceId: String,
    description: String,
    action: String,
    item: String,
    formData:
    {
        connectionRow: Schema.Types.Mixed,
        crq: String,
        nser: String,
        pid: String
    },
    createdAt: Date,
    updatedAt: Date,
    userName: String,
    status: String,
    useractions: String
});

const ServiceOrderModel = mongoose.model('service-order', ServiceOrderSchema);
module.exports = ServiceOrderSchema;
module.exports = ServiceOrderModel;
