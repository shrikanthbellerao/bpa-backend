const mongoose = require('mongoose');
const request = require('request').defaults({ rejectUnauthorized: false });
const ServiceItemsSchema = require('../model/service-item.model').ServiceItemsSchema;


// var postRequestOptions = {
//     url: '',
//     method: 'POST',
//     json: true,
//     headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: {},
// };

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

methods.getServiceItems = (vmIPAddress, nsoInstance, accessToken) => {

    return new Promise((resolve,reject) => {
        const ServiceItemsModel = connObj.model('service-item',ServiceItemsSchema);
        ServiceItemsModel.find({}, {}, {}, (err, docs) => {
            var ErrorFlag2;
            console.log('Err: ', err);
            console.log('Docs: ', docs);
    
            if (!err && docs && (docs.length > 0)) {
    
                console.log('\nData is present in MongoDB');
    
                responseObj.status = 'Success';
                responseObj.msg = 'Successfully fetched Service Items';
                responseObj.body = docs;
                resolve(responseObj);
            } else {
                console.log('\nData is not present in MongoDB');
    
                getRequestOptions.url = `https://${vmIPAddress}/bpa/api/v1.0/service-catalog/service-items?_page=1&_limit=20&status=Active&order=asc`;
                getRequestOptions.headers.Authorization = `Bearer ${accessToken}`;
    
                request(getRequestOptions, function (error, response, itemsList) {
    
                    // console.log('\nResponse Error: ', error);
                    // console.log('\nResponse Body: ', itemsList);
    
                    if (error) {
                        responseObj.status = 'Error';
                        responseObj.msg = `Error Occurred while fetching service items. Error Message: ${error}`;
                        responseObj.body = null;
                        reject(responseObj);
                    } else {
                        itemsList.data.forEach((item) => {
                            //console.log('name res',item);
                            var serviceItemsObj = new ServiceItemsModel({
                                _id:item._id,
                                name:item.name,
                                description:item.description,
                                tags:[{name:item.tags.length > 0 ? item.tags[0]['name'] : '-'}],
                                categoryIds:[{description:item.categoryIds[0]['description'],_id:item.categoryIds[0]['_id'],name:item.categoryIds[0]['name']}]  , 
                                flag:false
                            });
                            serviceItemsObj.save(function(err) {
                                if (err) {
                                    ErrorFlag2 = true;
                                }
                                else {
                                    ErrorFlag2 = false;
                                }
                            });
                            
                        });
                            if (ErrorFlag2) {
                                responseObj.status = 'Error';
                                responseObj.msg = 'Error Occurred while Inserting Service items into MongoDB';
                                responseObj.body = null;
                            } else {
                                responseObj.status = 'Success';
                                responseObj.msg = 'Successfully fetched Service Items';
                                responseObj.body = itemsList.data;
                            }
                        }
                        resolve(responseObj); 
                });
                
            }
        });
    });
}

exports.ServiceItemData = methods;
