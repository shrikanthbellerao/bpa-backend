const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const request = require('request').defaults({ rejectUnauthorized: false });
const redis = require("redis");
const deviceManager = require('./controller/device-manager').DeviceManagerData;
const appConfig = require('./controller/app-config')
const myProfile = require('./controller/my-profile')
const serviceItems = require('./controller/service-item').ServiceItemData;
const serviceCatalog = require('./controller/service-catalog').ServiceCatalogData;
const serviceOrder = require('./controller/service-order').ServiceOrderData;
const activeService = require('./controller/active-services').ActiveServiceData;
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:4200'
}))
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

var responseObj = {
    status: '',
    msg: '',
    body: null
};

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

        if (body.errCode === 403) {
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
router.post('/select-favourite', async(req, res) => {
    await serviceCatalog.selectFavitems(req);
    res.json({status:'service item successfully selected as favourite'})
});   

//Delete favourite items from Service Catalog microservice of BPA
router.post('/delete-favourite',async (req, res) => {
    await serviceCatalog.deleteFavitems(req);
    res.json({status:'service item successfully deleted from favourite list'})
});

//get Devices List for Device Manger Page
router.post('/device-manager', async (req, res) => {

    var DeviceData = await deviceManager.getDevices(req.body.vmIPAddress, req.body.nsoInstance, req.body.accessToken);
    res.send(DeviceData);

});

// Ping Device from Device Manager
router.post('/ping-device', async (req, res) => {

    var PingData = await deviceManager.pingDevice(req.body.pingDeviceInfo.name, req.body.vmIPAddress, req.body.nsoInstance, req.body.accessToken, req.body.pingDeviceInfo);
    res.send(PingData);

});

//get Orders List for Active Services Page
router.post('/service-orders', async (req, res) => {

    var OrderData = await serviceOrder.getOrders(req.body.vmIPAddress, req.body.accessToken);
    res.send(OrderData);

});

//get Milestones for Active Services Page
router.post('/milestone', async (req, res) => {

    var MilestoneData = await activeService.getMilestones(req);
    res.send(MilestoneData);

});

//Fetch service category from service catalog
router.post('/category-service', async (req, res) => {

    var CategoryData = await serviceCatalog.getServiceCategory(req);
    res.send(CategoryData);
});

//Fetch service items from service catalog
router.post('/service-item', async(req, res) => {

    var itemData = await serviceItems.getServiceItems(req.body.vmIPAddress,req.body.accessToken);
    res.send(itemData);
});

app.use('',appConfig);
app.use('',myProfile);

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
