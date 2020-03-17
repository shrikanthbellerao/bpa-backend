const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const request     = require('request').defaults({ rejectUnauthorized: false });
const redis = require("redis");



const RedisClient = redis.createClient();
RedisClient.on('connect', function() {
  console.log('Connected to Redis');
});

const GradesSchema = require('./sample_training.model').GradesSchema;

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

router.get('/', (req, res) => {
  res.send({
    msg: 'Hi There!'
  });
});

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

var broadcastMessage = 'Site is under construction. Please check later!'

// Validate User's credentials to access BPA
router.post('/login', (req, res) => {

  console.log('POST /login: ', req.body);

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

// Fetch Service Orders from Service Catalog microservice of BPA
router.post('/service-orders', (req, res) => {

  console.log('POST /service-orders: ', req.body);

  getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/service-orders`;
  getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;

  request(getRequestOptions, function (error, response, body) {

    console.log('\nResponse Error: ', error);
    console.log('\nResponse Body: ', body);

    if (error) {
      responseObj.status = 'error';
      responseObj.msg = `Error Occurred while fetching Service Orders. Error Message: ${error}`;
    } else {
      responseObj.status = 'success';
      responseObj.msg = 'Successfully fetched Service Orders';
      responseObj.body = body;
    }

    res.send(responseObj);
  });
});


router.post('/service-items', (req, res) => {

  console.log('POST /service-items: ', req.body);

  getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/service-items?_page=1&_limit=20&status=Active&order=asc`;
  getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;

  request(getRequestOptions, function (error, response, body) {

    console.log('\nResponse Error: ', error);
    console.log('\nResponse Body: ', body);

    if (error) {
      responseObj.status = 'error';
      responseObj.msg = `Error Occurred while fetching Service Items. Error Message: ${error}`;
    } else {
      responseObj.status = 'success';
      responseObj.msg = 'Successfully fetched Service Items';
      responseObj.body = body;
    }

    res.send(responseObj);
  });
});


//get Devices List for Device Manger Page
router.post('/device-manager', (req, res) => {

  // console.log('POST /device-manager: ', req.body);

  getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/device-manager/devices?limit=5000&page=1&nsoInstance=${req.body.nsoInstance}`;
  getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;
 

  request(getRequestOptions, function(error, response, body) {

    // console.log('\nResponse Error: ', error);
    // console.log('\nResponse Body: ', body);

    if (error) {
      responseObj.status  = 'error';
      responseObj.msg     = `Error Occurred while fetching data. Error Message: ${error}`;
    } else {
      responseObj.status  = 'success';
      responseObj.msg     = 'Fetched Data Successfully';
      responseObj.body    = body;
    }

    res.send(responseObj);
  });
});

// Ping Device from Device Manager

router.post('/ping-device', (req, res) => {

  // console.log('POST /ping-device: ', req.body);

  RedisClient.get('ping-result-'+req.body.pingDeviceInfo[0].name,(err,reply) =>
  {

    if(reply!=null){
      var sendData ={
        value:reply
      }
      res.send(sendData);
    }
    else{

      postRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/device-manager/devices/ping?nsoInstance=${req.body.nsoInstance}`;
      postRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;
      postRequestOptions.body = req.body.pingDeviceInfo;
    
    
      request(postRequestOptions, function(error, response, body) {

        // console.log('\nResponse Error: ', error);
        // console.log('\nResponse Body: ', body);

        if (error) {
          responseObj.status  = 'error';
          responseObj.msg     = `Error Occurred while Pinging Device. Error Message: ${error}`;
        } else {
          responseObj.status  = 'success';
          responseObj.msg     = 'Ping Successful';
          responseObj.body    = body;
        }
    
        res.send(body[0].result[0]);
        RedisClient.set('ping-result-'+req.body.pingDeviceInfo[0].name,body[0].result[0].value);
      });
      
    }
  });

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

  // const dbUrl = "mongodb+srv://bpa:bpa@bpa-mzccx.mongodb.net/sample_training";
  // const connObj = mongoose.createConnection(dbUrl);
  // const GradesModel = connObj.model('Grade', GradesSchema);

  // GradesModel.find({}, { }, { limit:2 }, (err, docs) => {
  //   console.log('Err: ', err);
  //   console.log('Docs: ', docs);
  // });
});