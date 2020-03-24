const mongoose = require('mongoose');
const redis = require("redis");
const request = require('request').defaults({ rejectUnauthorized: false });
const PingDeviceSchema = require('../model/ping-device.model').PingDeviceSchema;
const DeviceSchema = require('../model/device.model').DeviceSchema;


const DeviceRedisClient = redis.createClient();
DeviceRedisClient.on('connect', ()=>{ console.log('Device Manager : Connected to Redis')});
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
var methods = {};


methods.pingDevice = (deviceName, vmIPAddress, nsoInstance, accessToken, pingDeviceInfo) => {

    return new Promise((resolve, reject) => {
        const PingDeviceModel = connObj.model('ping-device', PingDeviceSchema);
        var redisKey = 'ping-result-' + deviceName;
        DeviceRedisClient.get(redisKey, (error, redisResponse) => {
            console.log('Device Manager : Ping Device Redis Error - ', error);

            if (redisResponse != null) {
                console.log('Device Manager : Serving Ping data from Redis');
                responseObj.status = 'Success';
                responseObj.msg = 'Ping Successful';
                responseObj.body = {
                    deviceName: deviceName,
                    pingResponse: redisResponse
                };
                resolve(responseObj);
            }
            else {
                PingDeviceModel.find({ deviceName: deviceName }, {}, {}, (error, docs) => {

                    console.log('Device Manager : Pind Device MongoDB Error - ', error);

                    if (!error && docs && (docs.length > 0)) {

                        console.log('Device Manager : Serving Ping data from MongoDB');
                        DeviceRedisClient.set(redisKey, JSON.stringify(docs[0].pingResponse));
                        responseObj.status = 'Success';
                        responseObj.msg = 'Ping Successful';
                        responseObj.body = docs[0];
                        resolve(responseObj)

                    }
                    else {

                        console.log('Device Manager : Ping Data is not present in MongoDB');
                        postRequestOptions.url = `https://${vmIPAddress}/bpa/api/v1.0/device-manager/devices/ping?nsoInstance=${nsoInstance}`;
                        postRequestOptions.headers.Authorization = `Bearer ${accessToken}`;
                        postRequestOptions.body = [pingDeviceInfo];

                        request(postRequestOptions, function (error, response, body) {
                            console.log('Device Manager : Ping Device API Error - ', error);
                            if (error) {
                                responseObj.status = 'Error';
                                responseObj.msg = `Error Occurred while Pinging Device. Error Message: ${error}`;
                                responseObj.body = null;
                                reject(responseObj);
                            }
                            else {
                                var pingObj = new PingDeviceModel({
                                    deviceName: deviceName,
                                    pingResponse: body[0].result[0].value
                                });

                                pingObj.save((error) => {
                                    if (error) {
                                        responseObj.status = 'Error';
                                        responseObj.msg = `Error Occurred while Inserting Ping Device data into MongoDB: ${error}`;
                                        responseObj.body = null;
                                        console.log(`Device Manager : Error Occurred while Inserting Ping Device data into MongoDB: ${error}`);
                                        reject(responseObj);
                                    } else {
                                        responseObj.status = 'Success';
                                        responseObj.msg = 'Ping Successful';
                                        responseObj.body = {
                                            deviceName: deviceName,
                                            pingResponse: body[0].result[0].value
                                        };
                                        DeviceRedisClient.set(redisKey, body[0].result[0].value);
                                        console.log('Device Manager : Serving Ping data from API and stored in MongoDB');
                                        resolve(responseObj);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

methods.getDevices = (vmIPAddress, nsoInstance, accessToken) => {
    return new Promise((resolve, reject) => {
        const DeviceModel = connObj.model('device', DeviceSchema);
        DeviceModel.find({}, {}, {}, (error, docs) => {
            console.log('Device Manager : Device List MongoDB Error - ', error);

            if (!error && docs && (docs.length > 0)) {

                console.log('Device Manager : Serving Device List from MongoDB');

                responseObj.status = 'Success';
                responseObj.msg = 'Fetching Successful';
                responseObj.body = docs;
                resolve(responseObj);
            } else {
                console.log('Device Manager : Device List is not present in MongoDB');

                getRequestOptions.url = `https://${vmIPAddress}/bpa/api/v1.0/device-manager/devices?limit=5000&page=1&nsoInstance=${nsoInstance}`;
                getRequestOptions.headers.Authorization = `Bearer ${accessToken}`;


                request(getRequestOptions, function (error, response, devicelist) {

                    console.log('Device Manager : Device List API Error - ', error);

                    if (error) {
                        responseObj.status = 'Error';
                        responseObj.msg = `Error Occurred while Fetching Device List. Error Message: ${error}`;
                        responseObj.body = null;
                        resolve(responseObj);
                    } else {


                        DeviceLoop(devicelist, DeviceModel).then((ErrorFlag) => {
                            if (ErrorFlag) {
                                responseObj.status = 'Error';
                                responseObj.msg = 'Error Occurred while Inserting Device List into MongoDB';
                                responseObj.body = null;
                                console.log('Device Manager : Error Occurred while Inserting Device List into MongoDB');
                                reject(responseObj);
                            } else {
                                responseObj.status = 'Success';
                                responseObj.msg = 'Fetched Data Successfully';
                                responseObj.body = devicelist;
                                console.log('Device Manager : Serving Device List from API and stored in MongoDB');
                                resolve(responseObj);
                            }
                        })
                    }

                });
            }
        });
    });
}

var DeviceLoop = (devicelist, DeviceModel) => {
    return new Promise(async (resolve, reject) => {
        var deviceLength = devicelist.length
        var errorflag;
        for (i = 0; i < deviceLength; i++) {
            var deviceObj = new DeviceModel({
                name: devicelist[i].name,
                description: devicelist[i].description,
                address: devicelist[i].address,
                port: '22',
                authgroup: devicelist[i].authgroup,
                admin_state: devicelist[i].admin_state,
                device_type: devicelist[i].device_type,
                ned_id: devicelist[i].ned_id,
                protocol: devicelist[i].protocol,
                latitude: devicelist[i].latitude,
                longitude: devicelist[i].longitude,
                ned_id: devicelist[i].ned_id,
                controller_id: devicelist[i].controller_id,
                sub_controller_id: devicelist[i].sub_controller_id
            });

            errorflag = await dbSave(deviceObj)
            if (errorflag === true)
                break;
        }

        resolve(errorflag);
    })
}

var dbSave = (deviceObj) => {
    return new Promise((resolve, reject) => {
        deviceObj.save((error) => {
            if (error) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })

    })
}



exports.DeviceManagerData = methods;

