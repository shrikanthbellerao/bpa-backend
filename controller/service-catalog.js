const mongoose = require('mongoose');
const request = require('request').defaults({ rejectUnauthorized: false });
const ServiceCategorySchema = require('../model/category-service.model').ServiceCategorySchema;
const ServiceItemsSchema = require('../model/service-item.model').ServiceItemsSchema;
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
var functions = {};

functions.selectFavitems = (req) => {
        const ServiceItemsModel = connObj.model('service-item', ServiceItemsSchema);
        ServiceItemsModel.update({'_id':req.body.id},{$set:{'flag':true}},(err,data)=>{
            console.log('res1',err),
            console.log('res2',data);
        })
}      

functions.deleteFavitems = (req) => {
    const ServiceItemsModel = connObj.model('service-item', ServiceItemsSchema);
    ServiceItemsModel.update({'_id':req.body.id},{$set:{'flag':false}},(err,data)=>{
        console.log('res1',err),
        console.log('res2',data);
    })
}

functions.getServiceCategory = (req) => {
    return new Promise((resolve, reject) => {
        const ServiceCategoryModel = connObj.model('categories-service', ServiceCategorySchema);
        ServiceCategoryModel.find({}, {}, {}, (err, docs) => {
            console.log('Err: ', err);
            // console.log('Docs: ', docs);

            if (!err && docs && (docs.length > 0)) {

                console.log('\n Category Data is present in MongoDB');

                responseObj.status = 'Success';
                responseObj.msg = 'Successfully fetched Service Categories';
                responseObj.body = docs;
                resolve(responseObj);
            } else {
                console.log('\n  Category Data is not present in MongoDB');

            getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/service-categories?_page=1&_limit=200000`;
            getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;

            request(getRequestOptions, function (error, response, categoryList) {

                console.log('\nResponse Error: ', error);
                console.log('\nResponse Body: ', categoryList);

                if (error) {
                    responseObj.status = 'Error';
                    responseObj.msg = `Error Occurred while fetching service categories. Error Message: ${error}`;
                    responseObj.body = null;
                    reject(responseObj);
                    } else {
                        serviceCategoryLoop(categoryList, ServiceCategoryModel).then((ErrorFlag1) => {
                        if (ErrorFlag1) {
                            responseObj.status = 'Error';
                            responseObj.msg = 'Error Occurred while Inserting Service Categories into MongoDB';
                            responseObj.body = null;
                            resolve(responseObj);
                            } else {
                                responseObj.status = 'Success';
                                responseObj.msg = 'Successfully stored Service Categories in mongoDb';
                                responseObj.body = categoryList.data;
                                resolve(responseObj);
                            }
                        })
                    }

                });
            }
        });
    });
}

var serviceCategoryLoop = (categoryList, ServiceCategoryModel) => {
    return new Promise(async (resolve, reject) => {
        var categoryLength = categoryList.data.length
        var errorflag;
        for (category = 0; category < categoryLength ; category++) {
            var serviceCategoryObj = new ServiceCategoryModel({
                _id: categoryList.data[category]._id,
                name: categoryList.data[category].name,
                description: categoryList.data[category].description
            });
            console.log('service category object',serviceCategoryObj)
            errorflag = await dbSave(serviceCategoryObj)
            if (errorflag === true)
                break;
        }

        resolve(errorflag);
    })
}

var dbSave = (serviceCategoryObj) => {
    return new Promise((resolve, reject) => {
        serviceCategoryObj.save((error) => {
            if (error) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })

    })
}



exports.ServiceCatalogData = functions;