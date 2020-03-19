const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const request = require('request').defaults({ rejectUnauthorized: false });
const cors = require('cors');
app.use(cors());
const GradesSchema = require('./sample_training.model').GradesSchema;
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

// Fetch Milestone of Active Services from Service Catalog microservice of BPA
router.post('/service-orders', (req, res) => {


  responseObj.status = 'success';
  responseObj.msg = 'Successfully fetched Service Orders';
  responseObj.body = {
    "status": "Success",
    "message": "Milestones List",
    "totalRecords": 10,
    "data": [
      {
        "_id": "5e72223b34ac5c0166164910",
        "updatedAt": "2020-03-18T13:29:31.773Z",
        "createdAt": "2020-03-18T13:29:31.773Z",
        "objectType": "service-catalog-order",
        "objectReference": "5e72223ae3c240015092efbb",
        "milestone": "Check-Sync I",
        "__v": 0,
        "status": "Complete"
      },
      {
        "_id": "5e72223c34ac5c0166164911",
        "updatedAt": "2020-03-18T13:29:32.152Z",
        "createdAt": "2020-03-18T13:29:32.152Z",
        "objectType": "service-catalog-order",
        "objectReference": "5e72223ae3c240015092efbb",
        "milestone": "Dryrun Review I",
        "__v": 0,
        "execution": {
          "type": "dryrun",
          "executionData": "5e722349104a5741c775e16a",
          "templateId": "Dry-Run"
        },
        "status": "Complete"
      },
      {
        "_id": "5e72223c34ac5c0166164912",
        "updatedAt": "2020-03-18T13:29:32.287Z",
        "createdAt": "2020-03-18T13:29:32.287Z",
        "objectType": "service-catalog-order",
        "objectReference": "5e72223ae3c240015092efbb",
        "milestone": "Peer review",
        "__v": 0,
        "execution": {
          "type": "peer-review",
          "executionData": "5e72223ae3c240015092efbb",
          "templateId": "Peer Review"
        },
        "status": "Complete"
      },
      {
        "_id": "5e72223c34ac5c0166164913",
        "updatedAt": "2020-03-18T13:29:32.397Z",
        "createdAt": "2020-03-18T13:29:32.397Z",
        "objectType": "service-catalog-order",
        "objectReference": "5e72223ae3c240015092efbb",
        "milestone": "Pre-change Validation",
        "__v": 0,
        "execution": {
          "type": "template-execution",
          "executionData": "[{\"deviceName\":\"USPALTWRR01DRE0001-PV01\",\"executionId\":\"5e7229f60d2df741cc8e510d\",\"overallTmplResult\":false}]",
          "templateId": "DC-MSC-Port-Turn-Down-Pre-Check-Validation"
        },
        "status": "Complete"
      }]
  };
  // }

  RedisClient.get(redisKey, (err, redisResponse) => {
    if (redisResponse != null) {

      console.log('\nServing data from Redis =>'); console.log(redisResponse);

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
// });


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
connObj = mongoose.createConnection(
  dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
);

