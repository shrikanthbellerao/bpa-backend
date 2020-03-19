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

// Fetch Milestone of Active Services from Service Catalog microservice of BPA
router.post('/service-orders', (req, res) => {

  //   console.log('POST /service-orders: ', req.body);

  //   getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/service-orders`;
  //   getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;

  //   request(getRequestOptions, function (error, response, body) {

  //     console.log('\nResponse Error: ', error);
  //     console.log('\nResponse Body: ', body);

  //     if (error) {
  //       responseObj.status = 'error';
  //       responseObj.msg = `Error Occurred while fetching Service Orders. Error Message: ${error}`;
  //     } else {
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

  res.send(responseObj);
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
