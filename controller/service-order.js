const mongoose = require('mongoose');
const request = require('request').defaults({ rejectUnauthorized: false });
// const cors = require('cors');
const ServiceOrderSchema = require('../model/service-order.model').ServiceOrderSchema;
// const MilestoneSchema = require('./model/milestone.model').MilestoneSchema;
// app.use(cors({
// 	origin: 'http://localhost:4200' 
// }))

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


methods.getOrders = (vmIPAddress, accessToken) => {
    return new Promise((resolve, reject) => {
        const ServiceOrderModel = connObj.model('service-order', ServiceOrderSchema);
        ServiceOrderModel.find({}, {}, {}, (error, docs) => {
            console.log('Service Orders : Service Orders MongoDB Error - ', error);

            if (!error && docs && (docs.length > 0)) {

                console.log('Service Orders : Serving Service Orders from MongoDB');

                responseObj.status = 'Success';
                responseObj.msg = 'Successfully fetched Service Orders';
                responseObj.body = docs;
                resolve(responseObj);
            } else {
                console.log('\nData is not present in MongoDB');
                getRequestOptions.url = `https://${vmIPAddress}/bpa/api/v1.0/service-catalog/service-orders`;
                getRequestOptions.headers.Authorization = `Bearer ${accessToken}`;
                request(getRequestOptions, function (error, response, rowData) {
                    console.log('\nResponse Error: ', error);
                    console.log('\nResponse Body: ', serviceOrder);
                    if (error) {
                        responseObj.status = 'Error';
                        responseObj.msg = `Error Occurred while fetching service orders. Error Message: ${error}`;
                        responseObj.body = null;
                        reject(responseObj);
                    } else {


                        DbOrderLoop(rowData, ServiceOrderModel).then((ErrorFlag) => {
                            if (ErrorFlag) {
                                responseObj.status = 'Error';
                                responseObj.msg = 'Error Occurred while Inserting Service orders into MongoDB';
                                responseObj.body = null;
                                console.log('Service Orders : Error Occurred while Inserting Service orders into MongoDB');
                                reject(responseObj);
                            } else {
                                responseObj.status = 'Success';
                                responseObj.msg = 'Successfully fetched Service Orders';
                                responseObj.body = rowData.data;
                                console.log('Service Orders : Serving Service Orders from API and stored in MongoDB');
                                resolve(responseObj);
                            }
                        })
                    }

                });
            }
        });
    });
}

var DbOrderLoop = (rowData, ServiceOrderModel) => {
    return new Promise(async (resolve, reject) => {
        var orderLength = rowData.length
        var errorflag;
        for (i = 0; i < orderLength; i++) {
            // serviceOrder.data.forEach(order => {
            //     console.log('order res',serviceOrder);
            var serviceOrderObj = new ServiceOrderModel({
                orderNumber: rowData[i].orderNumber,
                _id: rowData[i]._id,
                processInstanceId: rowData[i].processInstanceId,
                description: rowData[i].description,
                action: rowData[i].action,
                item: rowData[i].item,
                formData:
                {
                    connectionRow: rowData[i].formData.connectionRow,
                    crq: rowData[i].formData.crq,
                    nser: rowData[i].nser,
                    pid: rowData[i].pid
                },
                createdAt: rowData[i].createdAt,
                updatedAt: rowData[i].updatedAt,
                userName: rowData[i].userName,
                status: rowData[i].status,
                useractions: rowData[i].useractions

            });

            errorflag = await dbSave(serviceOrderObj)
            if (errorflag === true)
                break;
        }

        resolve(errorflag);
    })
}

var dbSave = (serviceOrderObj) => {
    return new Promise((resolve, reject) => {
        serviceOrderObj.save((error) => {
            if (error) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })

    })
}



exports.ServiceOrderData = methods;
