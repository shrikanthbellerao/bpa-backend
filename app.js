const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const request = require('request').defaults({ rejectUnauthorized: false });
const redis = require("redis");
const deviceManager = require('./controller/device-manager').DeviceManagerData;
const serviceItems = require('./controller/service-item').ServiceItemData;
const serviceOrder = require('./controller/service-order').ServiceOrderData;

const ServiceCategorySchema = require('./model/category-service.model').ServiceCategorySchema;
const OrderSchema = require('./model/order.model').OrderSchema;
const ServiceItemsSchema = require('./model/service-item.model').ServiceItemsSchema;
const Schema = mongoose.Schema;
const activeService = require('./controller/active-services').ActiveServiceData;

// const RedisClient = redis.createClient();
// RedisClient.on('connect', function() {
//   console.log('Connected to Redis');
// });

const dbUser = 'bpa';
const dbPass = 'bpa';
const dbServer = 'bpa-mzccx.mongodb.net';
const dbName = 'bpa-db';

const dbUrl = `mongodb+srv://${dbUser}:${dbPass}@${dbServer}/${dbName}?retryWrites=true&w=majority`;

var connObj = null;

// Build the Redis Client
const RedisClient = redis.createClient();
RedisClient.on('connect', function () {
    console.log('Connected to Redis');
});


app.use(bodyParser.json({ limit: '10mb' }));    // limit : 10mb is required for File upload
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "PUT");
    next();
});
app.use(compression());
app.use('/', router);

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

var deleteRequestOptions = {
    url: '',
    method: 'DELETE',
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

var broadcastMessage = 'Site is under construction. Please check later!'



// Test Router
router.get('/', (req, res) => {
    res.send({
        msg: 'Hi There!'
    });
});

// Validate User's credentials to access BPA
router.post('/login', (req, res) => {

    // console.log('POST /login: ', req.body);

    postRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/login`;
    postRequestOptions.headers.Authorization = `Basic ${req.body.base64Credential}`;

    request(postRequestOptions, function (error, response, body) {

        console.log('\nResponse Error: ', error);
        console.log('\nResponse Body: ', body);

        if (error) {
            responseObj.status = 'error';
            responseObj.msg = `Error Occurred while validating User's credentials. Error Message: ${error}`;
        } else {
            responseObj.status = 'success';
            responseObj.msg = 'Successfully validated user credentials';
            responseObj.body = body;
        }

        res.send(responseObj);
    });
});

//Select favourite items from Service Catalog microservice of BPA
router.post('/select-favourite', (req, res) => {

    console.log('POST /select-favourite: ', req.body);
    const ServiceItemsModel = connObj.model('service-item', ServiceItemsSchema);
    ServiceItemsModel.update({ '_id': req.body.id }, { $set: { 'flag': true } }, (err, data) => {
        console.log('res1', err),
            console.log('res2', data);
        res.json({ status: 'service item successfully selected as favourite' })
    })

});
router.post('/delete-favourite', (req, res) => {

    console.log('POST /delete-favourite: ', req.body);
    const ServiceItemsModel = connObj.model('service-item', ServiceItemsSchema);
    ServiceItemsModel.update({ '_id': req.body.id }, { $set: { 'flag': false } }, (err, data) => {
        console.log('res1', err),
            console.log('res2', data);
        res.json({ status: 'service item successfully deleted from favourite list' })
    })
});

//get Devices List for Device Manger Page
router.post('/device-manager', async (req, res) => {

    var DeviceData = await deviceManager.getDevices(req.body.vmIPAddress, req.body.nsoInstance, req.body.accessToken);
    res.send(DeviceData);

});

//get formdata from Order page
router.post('/orders',(req,res)=>{
        console.log(req.body);
        const myModel = connObj.model('myOrders', OrderSchema);
        var OrderData= req.body;
                           var orderdetails = new myModel({
                           formDetails: OrderData.formData,
                        
                        });
                
                orderdetails.save(function(err, order){
                console.log('ganesh',err,order);
                res.json({orderNumber : order._id});
           
            });
       
});

// Ping Device from Device Manager
router.post('/ping-device', async (req, res) => {

    var PingData = await deviceManager.pingDevice(req.body.pingDeviceInfo.name, req.body.vmIPAddress, req.body.nsoInstance, req.body.accessToken, req.body.pingDeviceInfo);
    res.send(PingData);

});

//get Orders List for Active Services Page
router.post('/service-order', async (req, res) => {

    var OrderData = await serviceOrder.getOrders(req.body.vmIPAddress, req.body.accessToken);
    res.send(OrderData);
    console.log('aaaa')
});

//get Milestones for Active Services Page
router.post('/milestone', async (req, res) => {

    var MilestoneData = await activeService.getMilestones(req);
    res.send(MilestoneData);

});

//Fetch service category from service catalog
router.post('/category-service', (req, res) => {

    console.log('POST /category-service: ', req.body);
    const ServiceCategoryModel = connObj.model('category-service', ServiceCategorySchema);

    ServiceCategoryModel.find({}, {}, {}, (err, docs) => {
        var ErrorFlag1;
        console.log('Err: ', err);
        // console.log('Docs: ', docs);

        if (!err && docs && (docs.length > 0)) {

            console.log('\nData is present in MongoDB');

            responseObj.status = 'Success';
            responseObj.msg = 'Successfully fetched Service Categories';
            responseObj.body = docs;
            res.send(responseObj);
        } else {
            console.log('\nData is not present in MongoDB');

            getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/service-categories?_page=1&_limit=200000`;
            getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;

            request(getRequestOptions, function (error, response, categoryList) {

                console.log('\nResponse Error: ', error);
                console.log('\nResponse Body: ', categoryList);

                if (error) {
                    responseObj.status = 'Error';
                    responseObj.msg = `Error Occurred while fetching service categories. Error Message: ${error}`;
                    responseObj.body = null;
                    res.send(responseObj);
                } else {
                    categoryList.data.forEach(category => {
                        var serviceCategoryObj = new ServiceCategoryModel({
                            _id: category._id,
                            name: category.name,
                            description: category.description
                        });
                        serviceCategoryObj.save(function (err) {
                            if (err) {
                                ErrorFlag1 = true;
                            }
                            else {
                                ErrorFlag1 = false;
                            }
                        });

                    });
                    if (ErrorFlag1) {
                        responseObj.status = 'Error';
                        responseObj.msg = 'Error Occurred while Inserting Service Category into MongoDB';
                        responseObj.body = null;
                    } else {
                        responseObj.status = 'Success';
                        responseObj.msg = 'Successfully fetched Service Categories';
                        responseObj.body = categoryList.data;
                    }
                }
                res.send(responseObj);
            });

        }
    });
});

//Select favourite items from Service Catalog microservice of BPA
router.post('/select-favourite', (req, res) => {

    console.log('POST /select-favourite: ', req.body);
    const ServiceItemsModel = connObj.model('service-item', ServiceItemsSchema);
    ServiceItemsModel.update({'_id':req.body.id},{$set:{'flag':true}},(err,data)=>{
        console.log('res1',err),
        console.log('res2',data);
        res.json({status:'service item successfully selected as favourite'})
    })
    
});
router.post('/delete-favourite', (req, res) => {

    console.log('POST /delete-favourite: ', req.body);
    const ServiceItemsModel = connObj.model('service-item', ServiceItemsSchema);
    ServiceItemsModel.update({'_id':req.body.id},{$set:{'flag':false}},(err,data)=>{
        console.log('res1',err),
        console.log('res2',data);
        res.json({status:'service item successfully deleted from favourite list'})
    })
    
});

//Fetch service items from service catalog
router.post('/service-item', async(req, res) => {

    var itemData = await serviceItems.getServiceItems(req.body.vmIPAddress,req.body.nsoInstance,req.body.accessToken);
    res.send(itemData);
});


// Return the Broadcast message
router.get('/broadcast-message', (req, res) => {

    console.log('GET /broadcast-message: ', req.body);

    res.send({ broadcastMessage });
});

// Update the Broadcast Message
router.put('/broadcast-message', (req, res) => {

    console.log('PUT /broadcast-message: ', req.body);

    broadcastMessage = req.body.broadcastMessage;
    res.send({ broadcastMessage });

});

app.listen(8080, () => {

    console.log('\n\n');
    console.log('***********************');
    console.log('Listening on port 8080!');
    console.log('***********************');

    connObj = mongoose.createConnection(
        dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    );
});
