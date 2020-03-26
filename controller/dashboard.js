const mongoose = require('mongoose');
const redis = require("redis");
const request = require('request').defaults({ rejectUnauthorized: false });
const ServiceItemsSchema = require('../model/service-item.model').ServiceItemsSchema;
const ServiceOrdersSchema = require('../model/service-order.model'.ServiceOrdersSchema);

const DeviceRedisClient = redis.createClient();
DeviceRedisClient.on('connect', ()=>{ console.log('Dashboard : Connected to Redis')});
var postRequestOptions = {
    url: '',
    method: 'POST',
    json: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: {},
};

var getRequestOptions = {
    url: '',
    method: 'GET',
    json: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
};

var responseObj = {
    status: '',
    msg: '',
    body: null
};

const dbUser = 'bpa';
const dbPass = 'bpa';
const dbServer = 'bpa-mzccx.mongodb.net';
const dbName = 'bpa-db';

const dbUrl = `mongodb+srv://${dbUser}:${dbPass}@${dbServer}/${dbName}?retryWrites=true&w=majority`;

var connObj = mongoose.createConnection(
    dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
);

