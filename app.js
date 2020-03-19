const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const request = require('request').defaults({ rejectUnauthorized: false });
const redis = require("redis");

const PingDeviceSchema = require('./ping-device.model').PingDeviceSchema;

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

    // console.log('\nResponse Error: ', error);
    // console.log('\nResponse Body: ', body);

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

    // console.log('\nResponse Error: ', error);
    // console.log('\nResponse Body: ', body);

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

//Select favourite items from Service Catalog microservice of BPA
router.post('/select-favourite', (req, res) => {

  //const urlActive = `https://${this.vmIPAddress}/bpa/api/v1.0/service-catalog/user-favorites`; 
  postRequestOptions.url= `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/user-favorites`;
  postRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;
  postRequestOptions.body={name:req.body.name}  ;
  request(postRequestOptions, function (error, response, body) {

    // console.log('\nResponse Error: ', error);
    // console.log('\nResponse Body: ', body);

    if (error) {
      responseObj.status = 'error';
      responseObj.msg = `Error Occurred while fetching Favourite items. Error Message: ${error}`;
    } else {
      responseObj.status = 'success';

      responseObj.msg = 'Successfully fetched Favourite Service Items';
      responseObj.body = body;
    }

    res.send(responseObj);
  });
});

//Delete favourite items from Service Catalog microservice of BPA
router.post('/delete-favourite', (req, res) => {

  console.log('DELETE /delete-favourite: ', req.body);

  deleteRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/user-favorites/${req.body.id}`;
  deleteRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;
  
  request(deleteRequestOptions, function (error, response, body) {

    console.log('\nResponse Error: ', error);
    console.log('\nResponse Body: ', body);

    if (error) {
      responseObj.status = 'error';
      responseObj.msg = `Error Occurred while deleting Favourite items. Error Message: ${error}`;
    } else {
      responseObj.status = 'success';
      responseObj.msg = 'Successfully deleted Favourite Service Items';
      responseObj.body = body;
    }

    res.send(responseObj);
  });
});

//Fetch list of favourite items from Service Catalog microservice of BPA
router.post('/get-favourite-items', (req, res) => {

  console.log('POST /get-favourite-items: ', req.body);

  getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/user-favorites`;
  getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;
  
  request(getRequestOptions, function (error, response, body) {

    console.log('\nResponse Error: ', error);
    console.log('\nResponse Body: ', body);

    if (error) {
      responseObj.status = 'error';
      responseObj.msg = `Error Occurred while fetching list of Favourite items. Error Message: ${error}`;
    } else {
      responseObj.status = 'success';
      responseObj.msg = 'Successfully fetched list of Favourite Service Items';
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


  request(getRequestOptions, function (error, response, body) {

    // console.log('\nResponse Error: ', error);
    // console.log('\nResponse Body: ', body);

    if (error) {
      responseObj.status = 'error';
      responseObj.msg = `Error Occurred while fetching data. Error Message: ${error}`;
    } else {
      responseObj.status = 'success';
      responseObj.msg = 'Fetched Data Successfully';
      responseObj.body = body;
    }

    res.send(responseObj);
  });
});

// Ping Device from Device Manager
router.post('/ping-device', (req, res) => {

  var responseObj = [{
    "jsonrpc": "2.0",
    "result": [{
      "name": "result",
      "value": "PING 10.122.32.63 (10.122.32.63) 56(84) bytes of data.\n64 bytes from 10.122.32.63: icmp_seq=1 ttl=254 time=0.665 ms\n\n--- 10.122.32.63 ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss, time 0ms\nrtt min/avg/max/mdev = 0.665/0.665/0.665/0.000 ms\n"
    }],
    "id": 3
  }];
  console.log('POST /ping-device: ', req.body);
  var redisKey = 'ping-result-' + req.body.pingDeviceInfo.name;

  RedisClient.get(redisKey, (err, redisResponse) => {
    if (redisResponse != null) {

      console.log('\nServing data from Redis =>');console.log(redisResponse);

      responseObj.status = 'success';
      responseObj.msg = 'Ping Successful';
      responseObj.body = {
        deviceName: req.body.pingDeviceInfo.name,
        pingResponse: redisResponse
      };
      res.send(responseObj);
    } else {
      console.log('\nData is not present in Redis');
      // var pingResponse = {"name":"result","value":"PING 10.122.32.71 (10.122.32.71) 56(84) bytes of data.\n64 bytes from 10.122.32.71: icmp_seq=1 ttl=254 time=0.588 ms\n\n--- 10.122.32.71 ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss, time 0ms\nrtt min/avg/max/mdev = 0.588/0.588/0.588/0.000 ms\n"};

      const PingDeviceModel = connObj.model('ping-device', PingDeviceSchema);

      PingDeviceModel.find({ deviceName: req.body.pingDeviceInfo.name }, {}, {}, (err, docs) => {

        console.log('Err: ', err);
        console.log('Docs: ', docs);

        if (!err && docs && (docs.length > 0)) {

          console.log('\nData is present in MongoDB');

          RedisClient.set(redisKey, JSON.stringify(docs[0].pingResponse));
          responseObj.status = 'success';
          responseObj.msg = 'Ping Successful';
          responseObj.body = docs[0];
          res.send(responseObj);
        } else {
          console.log('\nData is not present in MongoDB');

          postRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/device-manager/devices/ping?nsoInstance=${req.body.nsoInstance}`;
          postRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;
          postRequestOptions.body = [req.body.pingDeviceInfo];
          console.log(postRequestOptions);
          
          request(postRequestOptions, function (error, response, [body]) {
          
            console.log('\nResponse Error: ', error);
            console.log('\nResponse Body: ', body);
          
            if (error) {
              responseObj.status = 'error';
              responseObj.msg = `Error Occurred while Pinging Device. Error Message: ${error}`;
              responseObj.body = null;
              res.send(responseObj);
            } else {
              var pingObj = new PingDeviceModel({
                deviceName: req.body.pingDeviceInfo.name,
                pingResponse: body.result[0].value
              });

              pingObj.save(function (err) {
                if (err) {
                  responseObj.status = 'error';
                  responseObj.msg = `Error Occurred while Inserting Ping Device into MongoDB: ${err}`;
                  responseObj.body = null;
                  res.send(responseObj);
                } else {
                  responseObj.status = 'success';
                  responseObj.msg = 'Ping Successful';
                  responseObj.body = {
                    deviceName: req.body.pingDeviceInfo.name,
                    pingResponse: body.result[0].value
                  };
                  RedisClient.set(redisKey, body.result[0].value);
                  res.send(responseObj);
                }
              });
            }
          });
        }
      });
    }
  });
});

//Fetch Service Category from Service Catalog microservice of BPA
router.post('/service-category', (req, res) => {

  // console.log('POST /service-category: ', req.body);

  // getRequestOptions.url =`https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/service-categories?_page=1&_limit=200000`;
  // getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;

  // request(getRequestOptions, function (error, response, body) {

    // console.log('\n Response Error: ', error);
    // console.log('\n Response Body: ', body);

    // if (error) {
    //   responseObj.status = 'error';
    //   responseObj.msg = `Error Occurred while fetching Service Categories. Error Message: ${error}`;
    // } else {
    responseObj.status = 'success';
    responseObj.msg = 'Successfully fetched Service Categories';
    responseObj.body = [
    {
      "_id": "5e43a65d0a5e10018ff9cc06",
      "updatedAt": "2020-02-12T07:16:45.595Z",
      "createdAt": "2020-02-12T07:16:45.595Z",
      "name": "Enterprise Services",
      "description": "Enterprise Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65dde78ef018a9948c1",
      "updatedAt": "2020-02-12T07:16:45.634Z",
      "createdAt": "2020-02-12T07:16:45.634Z",
      "name": "Core Services",
      "description": "Core Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65d0a5e10018ff9cc07",
      "updatedAt": "2020-02-12T07:16:45.674Z",
      "createdAt": "2020-02-12T07:16:45.674Z",
      "name": "Collaboration Services",
      "description": "Services to update and add collaboration features",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65dde78ef018a9948c2",
      "updatedAt": "2020-02-12T07:16:45.731Z",
      "createdAt": "2020-02-12T07:16:45.731Z",
      "name": "Branch Services",
      "description": "Branch Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65d0a5e10018ff9cc08",
      "updatedAt": "2020-02-12T07:16:45.754Z",
      "createdAt": "2020-02-12T07:16:45.754Z",
      "name": "Common Services",
      "description": "Common Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65dde78ef018a9948c3",
      "updatedAt": "2020-02-12T07:16:45.801Z",
      "createdAt": "2020-02-12T07:16:45.801Z",
      "name": "Data Center Services",
      "description": "Data Center Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65d0a5e10018ff9cc09",
      "updatedAt": "2020-02-12T07:16:45.823Z",
      "createdAt": "2020-02-12T07:16:45.823Z",
      "name": "DMZ Services",
      "description": "DMZ Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    }
  ];
  
   res.send(responseObj);
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