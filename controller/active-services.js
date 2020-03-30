const mongoose = require('mongoose');
const request = require('request').defaults({ rejectUnauthorized: false });
// const cors = require('cors');
// const ServiceOrderSchema = require('./model/service-order.model').ServiceOrderSchema;
const MilestoneSchema = require('../model/milestone.model').MilestoneSchema;
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

methods.getMilestones = (req) => {
    return new Promise((resolve, reject) => {
        const MilestoneModel = connObj.model('milestone', MilestoneSchema);
        MilestoneModel.find({ _id: req.body.id }, {}, {}, (error, docs) => {
            console.log('Active Services : Milestone MongoDB Error - ', error);

            if (!error && docs && (docs.length > 0)) {

                console.log('Active Services : Serving Milestones from MongoDB');

                responseObj.status = 'Success';
                responseObj.msg = 'Successfully fetched milestones';
                responseObj.body = docs[0].milestone;
                resolve(responseObj);
            } else {
                console.log('Active Services : Milestone is not present in MongoDB');

                getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/milestones/?objectType=service-catalog-order&objectReference=${req.body.id}`;
                getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;


                request(getRequestOptions, function (error, response, milestone) {

                    console.log('Device Manager : Device List API Error - ', error);

                    if (error) {
                        responseObj.status = 'Error';
                        responseObj.msg = `Error Occurred while Fetching Milestone. Error Message: ${error}`;
                        responseObj.body = null;
                        resolve(responseObj);
                    } else {


                        DbDeviceLoop(milestone, MilestoneModel, req.body.id).then((ErrorFlag) => {
                            if (ErrorFlag) {
                                responseObj.status = 'Error';
                                responseObj.msg = 'Error Occurred while Inserting Device List into MongoDB';
                                responseObj.body = null;
                                console.log('Device Manager : Error Occurred while Inserting Device List into MongoDB');
                                reject(responseObj);
                            } else {
                                responseObj.status = 'Success';
                                responseObj.msg = 'Fetched Data Successfully';
                                responseObj.body = milestone.data;
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

var DbDeviceLoop = (milestone, MilestoneModel, id) => {
    return new Promise(async (resolve, reject) => {
        var milestoneObj = new MilestoneModel({
            milestone: milestone.data,
            _id: id
        });
        errorflag = await dbSave(milestoneObj)


        resolve(errorflag);
    })
}

var dbSave = (milestoneObj) => {
    return new Promise((resolve, reject) => {
        milestoneObj.save((error) => {
            if (error) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })

    })
}



exports.ActiveServiceData = methods;
