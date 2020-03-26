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

const ServiceCategorySchema = require('./model/category-service.model').ServiceCategorySchema;
const ServiceItemsSchema = require('./model/service-item.model').ServiceItemsSchema;

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

// Fetch Service Orders from Service Catalog microservice of BPA
router.post('/service-orders', (req, res) => {

    responseObj.status = 'success';
    responseObj.msg = 'Successfully fetched Service Orders';
    responseObj.body = [
        {
            "_id": "5e717ee14b975001362bc72a",
            "updatedAt": "2020-03-18T01:54:36.720Z",
            "createdAt": "2020-03-18T01:52:33.957Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "22d7753b-68bb-11ea-838d-0242ac120008",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e705e209b5e31011d779cb9",
            "orderNumber": 199,
            "__v": 0,
            "rollbackIds": [
                "5e706aa207998241ac41d10c"
            ],
            "rollbackOrder": true,
            "formData": {
                "crq": "CRQ123456789012",
                "nser": "12345678",
                "pid": "123456",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/10",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e706bdf650525011c3d8f13",
            "updatedAt": "2020-03-17T06:23:38.325Z",
            "createdAt": "2020-03-17T06:19:11.665Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "37c11b1d-6817-11ea-bad9-0242ac120006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e705e209b5e31011d779cb9",
            "orderNumber": 198,
            "__v": 0,
            "rollbackIds": [
                "5e706aa207998241ac41d10c"
            ],
            "rollbackOrder": true,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "crq": "CRQ123456789012",
                "nser": "12345678",
                "pid": "123456",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/10",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback"
        },
        {
            "_id": "5e706b579b5e31011d779cbb",
            "updatedAt": "2020-03-17T06:18:32.966Z",
            "createdAt": "2020-03-17T06:16:55.284Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e7293cb0-6816-11ea-bad9-0242ac120006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e705e209b5e31011d779cb9",
            "orderNumber": 197,
            "__v": 0,
            "rollbackIds": [
                "5e706aa207998241ac41d10c"
            ],
            "rollbackOrder": true,
            "formData": {
                "crq": "CRQ123456789012",
                "nser": "12345678",
                "pid": "123456",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/10",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e705e209b5e31011d779cb9",
            "updatedAt": "2020-03-17T06:16:21.519Z",
            "createdAt": "2020-03-17T05:20:32.835Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "06614f0b-680f-11ea-bad9-0242ac120006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 196,
            "__v": 0,
            "rollbackIds": [
                "5e706aa207998241ac41d10c"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-321",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "mdix-auto": false,
                        "accessVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "801",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "Model Client",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "120",
                        "endpointType": "Model Client/User",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e6f9af7650525011c3d8f0f",
            "updatedAt": "2020-03-16T15:28:15.179Z",
            "createdAt": "2020-03-16T15:27:51.898Z",
            "item": "Enterprise IDE Switch Provisioning",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b354b9b0-679a-11ea-bad9-0242ac120006",
            "description": "This service will be used to refresh an existing Catalyst 6500 IDE Switches to Catalyst 4500 IDE Switches and Catalyst 3560 IDE Switches to Catalyst 3650 IDE Switches, Net new deployemnt of Catalyst 4500 and Catalyst 3650 IDE Switches.",
            "rollbackSourceOrderId": "",
            "orderNumber": 195,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "old_switch_name": "GAKNWTK01IDE12",
                "new_switch_name": "USGAKNWTK01IDE0012",
                "line_cards": 1,
                "provision_type": "refresh",
                "chassis_type": "auto",
                "uplinks": [
                    {
                        "ide_ip_address": "1.2.35.5",
                        "upstream_interface_name": "Te1/1",
                        "upstream_host_name": "USNCCLTCC15UDM0001",
                        "interface_name": "GigabitEthernet1/1/1"
                    },
                    {
                        "ide_ip_address": "1.2.3.3",
                        "upstream_interface_name": "Te1/2",
                        "upstream_host_name": "USNCCLTCC15UDM0002",
                        "interface_name": "GigabitEthernet1/1/2"
                    }
                ],
                "loopback0_ipv4_address": "1.1.1.1",
                "ospf_area": "007",
                "optic_type": "GLC-SX-MMD=",
                "multicast_network": "",
                "model_banking_server_type": "No model server",
                "model_banking_server": "",
                "zone": "EMEA & AMRS NORTH EAST",
                "redundant_supervisor": false,
                "port_channel": false
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e6f4cee9b5e31011d779cb8",
            "updatedAt": "2020-03-16T09:55:58.732Z",
            "createdAt": "2020-03-16T09:54:54.123Z",
            "item": "Enterprise IDE Switch Provisioning",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "2fad8064-676c-11ea-bad9-0242ac120006",
            "description": "This service will be used to refresh an existing Catalyst 6500 IDE Switches to Catalyst 4500 IDE Switches and Catalyst 3560 IDE Switches to Catalyst 3650 IDE Switches, Net new deployemnt of Catalyst 4500 and Catalyst 3650 IDE Switches.",
            "rollbackSourceOrderId": "",
            "orderNumber": 194,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "old_switch_name": "CALAXWD20IDE01",
                "new_switch_name": "USTXCLTCC01IDE0001",
                "line_cards": 1,
                "provision_type": "refresh",
                "chassis_type": "auto",
                "uplinks": [
                    {
                        "ide_ip_address": "30.1.1.5",
                        "upstream_interface_name": "Ethernet1/13",
                        "upstream_host_name": "USNCCLTCC15UDM0001",
                        "interface_name": "GigabitEthernet1/1/1"
                    },
                    {
                        "ide_ip_address": "30.1.2.5",
                        "upstream_interface_name": "Ethernet1/14",
                        "upstream_host_name": "USNCCLTCC15UDM0002",
                        "interface_name": "GigabitEthernet1/1/2"
                    }
                ],
                "loopback0_ipv4_address": "30.1.255.5",
                "ospf_area": "007",
                "optic_type": "GLC-SX-MMD=",
                "multicast_network": "",
                "model_banking_server_type": "No model server",
                "model_banking_server": "",
                "zone": "EMEA & AMRS NORTH EAST",
                "redundant_supervisor": false,
                "port_channel": false
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e6b8f9d650525011c3d8f0d",
            "updatedAt": "2020-03-13T13:51:46.887Z",
            "createdAt": "2020-03-13T13:50:21.650Z",
            "item": "Enterprise IDE Switch Provisioning",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "9515fbeb-6531-11ea-bad9-0242ac120006",
            "description": "This service will be used to refresh an existing Catalyst 6500 IDE Switches to Catalyst 4500 IDE Switches and Catalyst 3560 IDE Switches to Catalyst 3650 IDE Switches, Net new deployemnt of Catalyst 4500 and Catalyst 3650 IDE Switches.",
            "rollbackSourceOrderId": "",
            "orderNumber": 193,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "old_switch_name": "CALAXWD20IDE01",
                "new_switch_name": "USTXCLTCC01IDE0001",
                "line_cards": 1,
                "provision_type": "refresh",
                "chassis_type": "auto",
                "uplinks": [
                    {
                        "ide_ip_address": "30.1.1.5",
                        "upstream_interface_name": "Ethernet1/13",
                        "upstream_host_name": "USNCCLTCC15UDM0001",
                        "interface_name": "GigabitEthernet1/1/1"
                    },
                    {
                        "ide_ip_address": "30.1.2.5",
                        "upstream_interface_name": "Ethernet1/14",
                        "upstream_host_name": "USNCCLTCC15UDM0002",
                        "interface_name": "GigabitEthernet1/1/2"
                    }
                ],
                "loopback0_ipv4_address": "30.1.255.5",
                "ospf_area": "007",
                "optic_type": "GLC-SX-MMD=",
                "multicast_network": "",
                "model_banking_server_type": "No model server",
                "model_banking_server": "",
                "zone": "EMEA & AMRS NORTH EAST",
                "redundant_supervisor": false,
                "port_channel": false
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e6b8cab9b5e31011d779cb7",
            "updatedAt": "2020-03-13T13:38:35.893Z",
            "createdAt": "2020-03-13T13:37:47.591Z",
            "item": "Enterprise IDE Switch Provisioning",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "d39cacfc-652f-11ea-bad9-0242ac120006",
            "description": "This service will be used to refresh an existing Catalyst 6500 IDE Switches to Catalyst 4500 IDE Switches and Catalyst 3560 IDE Switches to Catalyst 3650 IDE Switches, Net new deployemnt of Catalyst 4500 and Catalyst 3650 IDE Switches.",
            "rollbackSourceOrderId": "",
            "orderNumber": 192,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "old_switch_name": "CAALIVA04IDE01",
                "new_switch_name": "USTXCLTCC01IDE0001",
                "line_cards": 1,
                "provision_type": "refresh",
                "chassis_type": "auto",
                "uplinks": [
                    {
                        "ide_ip_address": "30.1.1.5",
                        "upstream_interface_name": "Ethernet1/13",
                        "upstream_host_name": "USNCCLTCC15UDM0001",
                        "interface_name": "GigabitEthernet1/1/1"
                    },
                    {
                        "ide_ip_address": "30.1.2.5",
                        "upstream_interface_name": "Ethernet1/14",
                        "upstream_host_name": "USNCCLTCC15UDM0002",
                        "interface_name": "GigabitEthernet1/1/2"
                    }
                ],
                "loopback0_ipv4_address": "30.1.255.5",
                "ospf_area": "007",
                "optic_type": "GLC-SX-MMD=",
                "multicast_network": "",
                "model_banking_server_type": "No model server",
                "model_banking_server": "",
                "zone": "EMEA & AMRS NORTH EAST",
                "redundant_supervisor": false,
                "port_channel": false
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e6b1f82650525011c3d8f0b",
            "updatedAt": "2020-03-13T05:52:03.834Z",
            "createdAt": "2020-03-13T05:52:02.897Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "c3495aff-64ee-11ea-bad9-0242ac120006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 191,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111135",
                "workorderNumber": "hjgjhg",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e6a93019b5e31011d779cb6",
            "updatedAt": "2020-03-12T20:10:16.535Z",
            "createdAt": "2020-03-12T19:52:33.596Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "03ec084c-649b-11ea-bad9-0242ac120006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 190,
            "__v": 0,
            "rollbackIds": [
                "5e6a95d307998241ac41cf44"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-321",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "mdix-auto": false,
                        "accessVlan": "151",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "Test ATM",
                        "speed": "auto 100",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "151",
                        "endpointType": "ATM",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e6a8ea79b5e31011d779cb5",
            "updatedAt": "2020-03-12T19:35:25.644Z",
            "createdAt": "2020-03-12T19:33:59.552Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "6be3cfed-6498-11ea-bad9-0242ac120006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 189,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-3560",
                        "blc": "ASH-322",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/10",
                        "mdix-auto": false,
                        "accessVlan": "151",
                        "3650PolicyInput": "NA",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "US000000ATM0000/000000-1.2.3.4",
                        "speed": "auto 100",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "151",
                        "endpointType": "ATM",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "NA",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e6a1e4c9b5e31011d779cb4",
            "updatedAt": "2020-03-12T11:35:13.349Z",
            "createdAt": "2020-03-12T11:34:36.576Z",
            "item": "Enterprise IDE Switch Provisioning",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "73d1d2b3-6455-11ea-bad9-0242ac120006",
            "description": "This service will be used to refresh an existing Catalyst 6500 IDE Switches to Catalyst 4500 IDE Switches and Catalyst 3560 IDE Switches to Catalyst 3650 IDE Switches, Net new deployemnt of Catalyst 4500 and Catalyst 3650 IDE Switches.",
            "rollbackSourceOrderId": "",
            "orderNumber": 188,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "new_switch_name": "USTXCLTCC01IDE0001",
                "line_cards": 1,
                "provision_type": "netnew",
                "chassis_type": "WS-C3650-24PS-L",
                "redundant_supervisor": false,
                "port_channel": false,
                "uplinks": [
                    {
                        "ide_ip_address": "30.1.1.5",
                        "upstream_interface_name": "Ethernet1/13",
                        "upstream_host_name": "USNCCLTCC15UDM0001",
                        "interface_name": "GigabitEthernet1/1/1"
                    },
                    {
                        "ide_ip_address": "30.1.2.5",
                        "upstream_interface_name": "Ethernet1/14",
                        "upstream_host_name": "USNCCLTCC15UDM0002",
                        "interface_name": "GigabitEthernet1/1/2"
                    }
                ],
                "loopback0_ipv4_address": "30.1.255.5",
                "ospf_area": "1",
                "optic_type": "GLC-TE",
                "model_banking_server": "",
                "multicast_network": "",
                "zone": "AMRS EAST & CANADA",
                "switchportModeAccess": [],
                "switchportModeTrunk": [],
                "switchPortVlan": [
                    {
                        "subnet": "",
                        "ipv4_address": "",
                        "helper_addresses": "",
                        "vlan_name": "Voip_Only",
                        "vlan_id": "799"
                    },
                    {
                        "subnet": "",
                        "ipv4_address": "",
                        "helper_addresses": "",
                        "vlan_name": "Unused_Ports",
                        "vlan_id": "999"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e6a1d809b5e31011d779cb3",
            "updatedAt": "2020-03-12T11:31:49.489Z",
            "createdAt": "2020-03-12T11:31:12.672Z",
            "item": "Enterprise IDE Switch Provisioning",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "fa507a8c-6454-11ea-bad9-0242ac120006",
            "description": "This service will be used to refresh an existing Catalyst 6500 IDE Switches to Catalyst 4500 IDE Switches and Catalyst 3560 IDE Switches to Catalyst 3650 IDE Switches, Net new deployemnt of Catalyst 4500 and Catalyst 3650 IDE Switches.",
            "rollbackSourceOrderId": "",
            "orderNumber": 187,
            "__v": 0,
            "cancelReason": "test",
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "new_switch_name": "USTXCLTCC01IDE0001",
                "line_cards": 1,
                "provision_type": "netnew",
                "chassis_type": "WS-C3650-24PS-L",
                "redundant_supervisor": false,
                "port_channel": false,
                "uplinks": [
                    {
                        "ide_ip_address": "1.2.35.5",
                        "upstream_interface_name": "Te1/1",
                        "upstream_host_name": "USNCCLTCC15UDM0001",
                        "interface_name": "GigabitEthernet1/1/1"
                    },
                    {
                        "ide_ip_address": "1.2.3.3",
                        "upstream_interface_name": "Te1/2",
                        "upstream_host_name": "USNCCLTCC15UDM0002",
                        "interface_name": "GigabitEthernet1/1/2"
                    }
                ],
                "loopback0_ipv4_address": "30.1.255.5",
                "ospf_area": "1",
                "optic_type": "GLC-TE",
                "model_banking_server": null,
                "multicast_network": "",
                "zone": "default",
                "switchportModeAccess": [],
                "switchportModeTrunk": [],
                "switchPortVlan": [
                    {
                        "subnet": "",
                        "ipv4_address": "",
                        "helper_addresses": "",
                        "vlan_name": "Voip_Only",
                        "vlan_id": "799"
                    },
                    {
                        "subnet": "",
                        "ipv4_address": "",
                        "helper_addresses": "",
                        "vlan_name": "Unused_Ports",
                        "vlan_id": "999"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Cancelled"
        },
        {
            "_id": "5e689eae9f2986010c94a302",
            "updatedAt": "2020-03-12T07:51:18.609Z",
            "createdAt": "2020-03-11T08:17:50.382Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "cc610a1f-6370-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 186,
            "__v": 0,
            "rollbackIds": [
                "5e69e90ab2129541b166740b"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "4321",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "vlan946",
                        "vlanId": 946,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "blc": "ASH-322"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e689b9e9f2986010c94a301",
            "updatedAt": "2020-03-11T08:11:16.788Z",
            "createdAt": "2020-03-11T08:04:46.437Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "f919796a-636e-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 185,
            "__v": 0,
            "rollbackIds": [
                "5e689c913b242841c10b98a4"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "1234",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [
                    {
                        "interfaceId": "0/30",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-3560",
                        "blc": "ASH-321",
                        "isAddInterfaceToDescription": true,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet0/30",
                        "allowedVlan": "946",
                        "3650PolicyInput": "NA",
                        "voiceVlan": "",
                        "udld-port": "enable",
                        "description": "TestVLAN",
                        "nativeVlan": "120",
                        "endpointType": "New Switch Connection",
                        "switchportMode": "trunk",
                        "spanning-tree-portfast": false,
                        "3650PolicyOutput": "NA",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "vlan946",
                        "vlanId": "946",
                        "requestType": "Add",
                        "hostname": "Robot-3560",
                        "blc": "ASH-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e67fa199f2986010c94a300",
            "updatedAt": "2020-03-10T20:47:08.516Z",
            "createdAt": "2020-03-10T20:35:37.233Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b30ac20a-630e-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 184,
            "__v": 0,
            "rollbackIds": [
                "5e67fbc0d6989741bc145765"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "VLAN_11",
                        "vlanId": "11",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e67f4a40d18740112f340b5",
            "updatedAt": "2020-03-10T20:20:50.055Z",
            "createdAt": "2020-03-10T20:12:20.181Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "7259343a-630b-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 183,
            "__v": 0,
            "rollbackIds": [
                "5e67f6583b242841c10b983a"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "VLAN_9",
                        "vlanId": "9",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e67e8ad0d18740112f340b4",
            "updatedAt": "2020-03-10T19:32:10.025Z",
            "createdAt": "2020-03-10T19:21:17.682Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "50f42dd0-6304-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 182,
            "__v": 0,
            "rollbackIds": [
                "5e67ea53d6989741bc145758"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "VLAN_7",
                        "vlanId": "7",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e67e8259f2986010c94a2ff",
            "updatedAt": "2020-03-10T19:31:40.932Z",
            "createdAt": "2020-03-10T19:19:01.027Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ff86fdbd-6303-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 181,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "vlan947",
                        "vlanId": 947,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "blc": "ASH-322"
                    },
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "vlan944",
                        "vlanId": 944,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "blc": "ASH-322"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e67e1d00d18740112f340b3",
            "updatedAt": "2020-03-10T19:14:15.214Z",
            "createdAt": "2020-03-10T18:52:00.271Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "3978cfec-6300-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 180,
            "__v": 0,
            "rollbackIds": [
                "5e67e4e3d6989741bc145753"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "vlan951",
                        "vlanId": 951,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "blc": "ASH-322"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e67dc6e9f2986010c94a2fe",
            "updatedAt": "2020-03-10T18:40:45.035Z",
            "createdAt": "2020-03-10T18:29:02.548Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "044378da-62fd-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 179,
            "__v": 0,
            "rollbackIds": [
                "5e67de1cd6989741bc14574f"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test952",
                        "vlanId": 952,
                        "requestType": "Delete",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABC-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e67bc009f2986010c94a2fd",
            "updatedAt": "2020-03-10T16:21:47.454Z",
            "createdAt": "2020-03-10T16:10:40.911Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b01af4aa-62e9-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 178,
            "__v": 0,
            "rollbackIds": [
                "5e67bdb6d6989741bc145749"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e67afc69f2986010c94a2fc",
            "updatedAt": "2020-03-10T15:20:55.409Z",
            "createdAt": "2020-03-10T15:18:30.264Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "661822a1-62e2-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 177,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e67af6e9f2986010c94a2fb",
            "updatedAt": "2020-03-10T15:21:49.672Z",
            "createdAt": "2020-03-10T15:17:02.211Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "31b3a8ad-62e2-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 176,
            "__v": 0,
            "rollbackIds": [
                "5e67b0233b242841c10b9820"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test951",
                        "vlanId": "951",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-321"
                    },
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test952",
                        "vlanId": "952",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-321"
                    },
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test8",
                        "vlanId": "8",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e67af109f2986010c94a2fa",
            "updatedAt": "2020-03-10T15:15:52.334Z",
            "createdAt": "2020-03-10T15:15:28.792Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "f9ef89b1-62e1-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 175,
            "__v": 0,
            "cancelReason": "cancel",
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test951",
                        "vlanId": "951",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Cancelled"
        },
        {
            "_id": "5e67a9e20d18740112f340b2",
            "updatedAt": "2020-03-10T15:02:04.554Z",
            "createdAt": "2020-03-10T14:53:22.083Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e334526b-62de-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 174,
            "__v": 0,
            "rollbackIds": [
                "5e67aba03b242841c10b9818"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test952",
                        "vlanId": 952,
                        "requestType": "Delete",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABC-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e67a1830d18740112f340b1",
            "updatedAt": "2020-03-10T14:25:02.308Z",
            "createdAt": "2020-03-10T14:17:39.878Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e64ca78d-62d9-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 173,
            "__v": 0,
            "rollbackIds": [
                "5e67a30bd6989741bc145737"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "11110000",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e6740a20d18740112f340b0",
            "updatedAt": "2020-03-10T14:19:50.442Z",
            "createdAt": "2020-03-10T07:24:18.600Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "27992a24-62a0-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 172,
            "__v": 0,
            "rollbackIds": [
                "5e67427e3b242841c10b9810"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test951",
                        "vlanId": 951,
                        "requestType": "Delete",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABC-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e673d309f2986010c94a2f9",
            "updatedAt": "2020-03-10T07:12:28.762Z",
            "createdAt": "2020-03-10T07:09:36.980Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "1a15c2d6-629e-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 171,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test951",
                        "vlanId": 951,
                        "requestType": "Delete",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABC-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e673a890d18740112f340af",
            "updatedAt": "2020-03-10T07:01:08.749Z",
            "createdAt": "2020-03-10T06:58:17.046Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "84d20cc3-629c-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 170,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test951",
                        "vlanId": 951,
                        "requestType": "Delete",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABC-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e66899c0d18740112f340ae",
            "updatedAt": "2020-03-09T18:27:19.403Z",
            "createdAt": "2020-03-09T18:23:24.566Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "106463bf-6233-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 169,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "234",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "vlan944",
                        "vlanId": 944,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "blc": "AK1-503"
                    },
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test952",
                        "vlanId": 952,
                        "requestType": "Delete",
                        "hostname": "Robot-SW-3650",
                        "blc": "AK1-503"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e6682500d18740112f340ad",
            "updatedAt": "2020-03-09T18:29:58.702Z",
            "createdAt": "2020-03-09T17:52:16.268Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b6ccbcec-622e-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 168,
            "__v": 0,
            "rollbackIds": [
                "5e6689c03b242841c10b9806"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Atest",
                        "vlanId": 8,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "blc": "ASH-321"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e66583e0d18740112f340ac",
            "updatedAt": "2020-03-09T14:52:48.091Z",
            "createdAt": "2020-03-09T14:52:46.794Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "a3ba1ce8-6215-11ea-b1f6-0242c0a8c002",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 167,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "AK1-503"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "AK1-503"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e6634949f2986010c94a2f8",
            "updatedAt": "2020-03-09T12:32:17.656Z",
            "createdAt": "2020-03-09T12:20:36.393Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "6190730d-6200-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 166,
            "__v": 0,
            "rollbackIds": [
                "5e66367fd6989741bc1456c0"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560",
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "234",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "test946",
                        "vlanId": 946,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "blc": "AK1-503"
                    },
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "test946",
                        "vlanId": 946,
                        "requestType": "Delete",
                        "hostname": "Robot-SW-3650",
                        "blc": "AK1-503"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e6631180d18740112f340ab",
            "updatedAt": "2020-03-09T12:18:12.935Z",
            "createdAt": "2020-03-09T12:05:44.299Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "4e351321-61fe-11ea-b1f6-0242c0a8c002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 165,
            "__v": 0,
            "rollbackIds": [
                "5e6632e4d6989741bc1456b5"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560",
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "234",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "test946",
                        "vlanId": "946",
                        "requestType": "Add",
                        "hostname": "Robot-3560",
                        "blc": "AK1-503"
                    },
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "test946",
                        "vlanId": "946",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "blc": "AK1-503"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e619099b62b3b01463df3aa",
            "updatedAt": "2020-03-05T23:55:51.465Z",
            "createdAt": "2020-03-05T23:51:53.393Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "4a1ea4cb-5f3c-11ea-a65f-0242c0a8c006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e5e604ac20f3a00e7eb84f2",
            "orderNumber": 164,
            "__v": 0,
            "rollbackIds": [
                "5e5e6152fe9e8641c4ffb41e"
            ],
            "rollbackOrder": true,
            "formData": {
                "crq": "CRQ123456789012",
                "nser": "12345678",
                "pid": "123459",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/10",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e618c88b62b3b01463df3a9",
            "updatedAt": "2020-03-05T23:42:52.136Z",
            "createdAt": "2020-03-05T23:34:32.320Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "dd975b42-5f39-11ea-a65f-0242c0a8c006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e5e604ac20f3a00e7eb84f2",
            "orderNumber": 163,
            "__v": 0,
            "rollbackIds": [
                "5e5e6152fe9e8641c4ffb41e"
            ],
            "rollbackOrder": true,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "crq": "CRQ123456789012",
                "nser": "12345678",
                "pid": "123459",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/10",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e618b335007bb0147506f26",
            "updatedAt": "2020-03-05T23:28:51.636Z",
            "createdAt": "2020-03-05T23:28:51.061Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "12318123-5f39-11ea-a65f-0242c0a8c006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e5e604ac20f3a00e7eb84f2",
            "orderNumber": 162,
            "__v": 0,
            "rollbackIds": [
                "5e5e6152fe9e8641c4ffb41e"
            ],
            "rollbackOrder": true,
            "formData": {
                "vlanConfigRequests": [],
                "switchportModeTrunkRequests": [],
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "ASH-322",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/10"
                    }
                ],
                "crq": "CRQ123456789012",
                "pid": "123459",
                "nser": "12345678"
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e618a255007bb0147506f25",
            "updatedAt": "2020-03-05T23:24:22.205Z",
            "createdAt": "2020-03-05T23:24:21.768Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "71b02dbb-5f38-11ea-a65f-0242c0a8c006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e5e604ac20f3a00e7eb84f2",
            "orderNumber": 161,
            "__v": 0,
            "rollbackIds": [
                "5e5e6152fe9e8641c4ffb41e"
            ],
            "rollbackOrder": true,
            "formData": {
                "vlanConfigRequests": [],
                "switchportModeTrunkRequests": [],
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "ASH-322",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/10"
                    }
                ],
                "crq": "CRQ123456789012",
                "pid": "123459",
                "nser": "12345678"
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e612bca5007bb0147506f24",
            "updatedAt": "2020-03-05T16:41:46.987Z",
            "createdAt": "2020-03-05T16:41:46.841Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "3439990c-5f00-11ea-a65f-0242c0a8c006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 160,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "id": "83F7187E-2A8D-4BA9-943E-78D63340384E",
                        "hostname": "Robot-SW-3650",
                        "requestType": "Add",
                        "vlanId": "000",
                        "vlanName": "neg-test",
                        "addVlanToTrunk": false,
                        "trunkInterface": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e611caa5007bb0147506f23",
            "updatedAt": "2020-03-05T15:49:38.754Z",
            "createdAt": "2020-03-05T15:37:14.244Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "2ffa7e9e-5ef7-11ea-a65f-0242c0a8c006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e6118bcb62b3b01463df3a8",
            "orderNumber": 159,
            "__v": 0,
            "rollbackIds": [
                "5e611b3f38652141bd9f116e"
            ],
            "rollbackOrder": true,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "crq": "CRQ123456789123",
                "nser": "12345678",
                "pid": "111",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-3560 GigabitEthernet 0/15",
                        "service": "interface-cfs:interface-cfs"
                    },
                    {
                        "operation": "update",
                        "serviceKey": "Robot-3560 GigabitEthernet 0/17",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback"
        },
        {
            "_id": "5e6118bcb62b3b01463df3a8",
            "updatedAt": "2020-03-05T15:36:31.960Z",
            "createdAt": "2020-03-05T15:20:28.626Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "d8af26f4-5ef4-11ea-a65f-0242c0a8c006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 158,
            "__v": 0,
            "rollbackIds": [
                "5e611b3f38652141bd9f116e"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "111",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/15",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-3560",
                        "blc": "AKI-123",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/15",
                        "mdix-auto": false,
                        "accessVlan": "120",
                        "3650PolicyInput": "NA",
                        "voiceVlan": "801",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "LOB connection - VLAN 120",
                        "speed": "1000",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "120",
                        "endpointType": "Non-Model Client/User",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "NA",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    },
                    {
                        "interfaceId": "0/17",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-3560",
                        "blc": "AKI-123",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/17",
                        "mdix-auto": false,
                        "accessVlan": "120",
                        "3650PolicyInput": "NA",
                        "voiceVlan": "801",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "Model Client",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "120",
                        "endpointType": "Model Client/User",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "NA",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e5edcd0beb73c00e230c939",
            "updatedAt": "2020-03-03T22:41:30.712Z",
            "createdAt": "2020-03-03T22:40:16.732Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "f45c3bdc-5d9f-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 157,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Branch-2",
                        "vlanId": "9",
                        "requestType": "Add",
                        "hostname": "Robot-3560",
                        "id": "475CC06B-A18F-4C0A-9FC7-1634966015D6"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5ed28bbeb73c00e230c938",
            "updatedAt": "2020-03-03T21:56:27.510Z",
            "createdAt": "2020-03-03T21:56:27.229Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "d4fbe9ec-5d99-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 156,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "id": "7ED52F75-3F90-443B-BB9C-42074D0DC63C",
                        "hostname": "Robot-3560",
                        "requestType": "Add",
                        "vlanId": "9",
                        "vlanName": "abcdefghijklmnopqrstuvwxyzabcdefgh",
                        "addVlanToTrunk": false,
                        "trunkInterface": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5ea736c20f3a00e7eb84f4",
            "updatedAt": "2020-03-03T18:53:05.863Z",
            "createdAt": "2020-03-03T18:51:34.005Z",
            "item": "Common Service - Global Configuration v1.0.0",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "00e69592-5d80-11ea-bdf3-0242c0a80002",
            "description": "This service will be used for newly on-boarded devices and when the settings are updated and need to be pushed out to existing devices. As part of this process it will also perform compliance checks of the configuration to insure the configuration complies with the latest global configuration standards.",
            "rollbackSourceOrderId": "",
            "orderNumber": 155,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "operation": "Update",
                "nser": "01234567",
                "hosts": [
                    {
                        "hostname": "DC-N93180",
                        "AAA": "Not Applicable",
                        "config-services": [
                            "SNMP",
                            "Line Console",
                            "Line VTY",
                            "console Banners",
                            "Syslog"
                        ]
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e5e6e18c20f3a00e7eb84f3",
            "updatedAt": "2020-03-03T14:53:26.796Z",
            "createdAt": "2020-03-03T14:47:52.532Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "f5d37979-5d5d-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 154,
            "__v": 0,
            "rollbackIds": [
                "5e5e6eeafe9e8641c4ffb431"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-321",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e5e604ac20f3a00e7eb84f2",
            "updatedAt": "2020-03-03T13:55:33.547Z",
            "createdAt": "2020-03-03T13:48:58.094Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "bb26d94a-5d55-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 153,
            "__v": 0,
            "rollbackIds": [
                "5e5e6152fe9e8641c4ffb41e"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123459",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-322",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "mdix-auto": false,
                        "accessVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "801",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "Model Client",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "120",
                        "endpointType": "Model Client/User",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e5d9240beb73c00e230c937",
            "updatedAt": "2020-03-02T23:09:52.761Z",
            "createdAt": "2020-03-02T23:09:52.579Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ec60e456-5cda-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 152,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "id": "D0D6BB93-1CA7-435B-9C45-35290B4D4210",
                        "hostname": "Robot-SW-3650",
                        "requestType": "Add",
                        "vlanId": "1",
                        "vlanName": "neg-test",
                        "addVlanToTrunk": false,
                        "trunkInterface": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5d808ec20f3a00e7eb84f1",
            "updatedAt": "2020-03-02T21:55:37.912Z",
            "createdAt": "2020-03-02T21:54:22.437Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "603091d4-5cd0-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 151,
            "__v": 0,
            "cancelReason": "cancel",
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "neg-test",
                        "vlanId": "0",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "id": "BBF70667-6D34-4198-B613-C2F6F8BA1445"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Cancelled"
        },
        {
            "_id": "5e5d8003beb73c00e230c936",
            "updatedAt": "2020-03-02T21:53:29.733Z",
            "createdAt": "2020-03-02T21:52:03.655Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "0d7732db-5cd0-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 150,
            "__v": 0,
            "cancelReason": "cancel",
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "neg-test",
                        "vlanId": "000",
                        "requestType": "Add",
                        "hostname": "Robot-3560",
                        "id": "252CC1E7-7C86-44BE-99DD-2ECCF35FB6DB"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Cancelled"
        },
        {
            "_id": "5e5d788dc20f3a00e7eb84f0",
            "updatedAt": "2020-03-02T21:42:55.754Z",
            "createdAt": "2020-03-02T21:20:14.000Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "9b47ecd7-5ccb-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 149,
            "__v": 0,
            "rollbackIds": [
                "5e5d7c82fe9e8641c4ffb3ae"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "1234",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Atest",
                        "vlanId": "8",
                        "requestType": "Add",
                        "hostname": "Robot-3560",
                        "id": "1A0019B5-CD87-43BF-A0A6-318135B436C4"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e5d1b52beb73c00e230c935",
            "updatedAt": "2020-03-02T14:51:02.693Z",
            "createdAt": "2020-03-02T14:42:26.249Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "08ed3557-5c94-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 148,
            "__v": 0,
            "rollbackIds": [
                "5e5d1d2f5899e341c92019c9"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "1212",
                "crq": "CRQ121212121121",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Vlan-946",
                        "vlanId": 946,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "id": "B84B2525-0F62-4786-ABAC-43873BF4A4AE"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5d0949beb73c00e230c934",
            "updatedAt": "2020-03-02T14:29:53.388Z",
            "createdAt": "2020-03-02T13:25:29.597Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "49440210-5c89-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 147,
            "__v": 0,
            "rollbackIds": [
                "5e5d0c9d5899e341c92019ab"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "12121",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Vlan-946",
                        "vlanId": "946",
                        "requestType": "Add",
                        "hostname": "Robot-3560",
                        "id": "C267A7E6-2B06-48ED-BA42-633243F7D73F"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e5cf79fc20f3a00e7eb84ef",
            "updatedAt": "2020-03-02T14:27:36.002Z",
            "createdAt": "2020-03-02T12:10:07.769Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "c1fa91f6-5c7e-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 146,
            "__v": 0,
            "rollbackIds": [
                "5e5cfa21fe9e8641c4ffb322"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "1212",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "vlan946",
                        "vlanId": 946,
                        "requestType": "Delete",
                        "hostname": "Robot-3560",
                        "id": "64AB8DFC-8212-4569-9016-E21CC577A416"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e5c8735beb73c00e230c933",
            "updatedAt": "2020-03-02T04:25:40.002Z",
            "createdAt": "2020-03-02T04:10:29.695Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "c0f1a855-5c3b-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 145,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "q45678",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Anup_Test",
                        "vlanId": "947",
                        "requestType": "Add",
                        "hostname": "Robot-3560",
                        "id": "ADDC3C6F-0CD4-4B8B-9AF3-BDA32471BE82"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e599fecbeb73c00e230c932",
            "updatedAt": "2020-02-28T23:20:54.550Z",
            "createdAt": "2020-02-28T23:19:08.783Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b8a44b2f-5a80-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e5899a904ac6900b5183153",
            "orderNumber": 144,
            "__v": 0,
            "rollbackIds": [
                "5e589b29bc5b5041e37da453"
            ],
            "rollbackOrder": true,
            "formData": {
                "crq": "CRQ000000001234",
                "nser": "87654321",
                "pid": "11110000",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/12",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e599eccbeb73c00e230c931",
            "updatedAt": "2020-02-28T23:16:40.006Z",
            "createdAt": "2020-02-28T23:14:20.133Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "0c9a64c9-5a80-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e5899a904ac6900b5183153",
            "orderNumber": 143,
            "__v": 0,
            "rollbackIds": [
                "5e589b29bc5b5041e37da453"
            ],
            "rollbackOrder": true,
            "formData": {
                "crq": "CRQ000000004321",
                "nser": "87654321",
                "pid": "11110011",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/12",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e5940ddc20f3a00e7eb84ee",
            "updatedAt": "2020-02-28T16:33:33.287Z",
            "createdAt": "2020-02-28T16:33:33.031Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "0f6f77fc-5a48-11ea-bdf3-0242c0a80002",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 142,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "1234",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    },
                    {
                        "deviceName": "invalid123",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": ""
                    },
                    {
                        "deviceName": "invalid456",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "xyz",
                        "blc": ""
                    },
                    {
                        "deviceName": "abc",
                        "blc": ""
                    },
                    {
                        "deviceName": "opl",
                        "blc": ""
                    },
                    {
                        "deviceName": "ui89",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e593eefbeb73c00e230c930",
            "updatedAt": "2020-02-28T16:25:19.769Z",
            "createdAt": "2020-02-28T16:25:19.373Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e92ad44f-5a46-11ea-bdf3-0242c0a80002",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 141,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "123",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA03IDE0030",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU3650BR011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USGATL3550BR018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USGATL3550BR012",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e593c21beb73c00e230c92f",
            "updatedAt": "2020-02-28T16:13:22.155Z",
            "createdAt": "2020-02-28T16:13:21.937Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "3d92b71c-5a45-11ea-bdf3-0242c0a80002",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 140,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "123",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA03IDE0030",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU3650BR011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USGATL3550BR018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USGATL3550BR012",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5935f7c20f3a00e7eb84ed",
            "updatedAt": "2020-02-28T15:47:05.176Z",
            "createdAt": "2020-02-28T15:47:03.200Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "90896999-5a41-11ea-bdf3-0242c0a80002",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 139,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU3650BR011"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e592b66c20f3a00e7eb84ec",
            "updatedAt": "2020-02-28T15:11:34.713Z",
            "createdAt": "2020-02-28T15:01:58.111Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "44585086-5a3b-11ea-bdf3-0242c0a80002",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 138,
            "__v": 0,
            "rollbackIds": [
                "5e592cee5899e341c92016e0"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "11110000",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e58dd5204ac6900b5183154",
            "updatedAt": "2020-02-28T09:31:09.648Z",
            "createdAt": "2020-02-28T09:28:50.153Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ba7023ae-5a0c-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 137,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "2213123123",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "data",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5899a904ac6900b5183153",
            "updatedAt": "2020-02-28T04:49:28.508Z",
            "createdAt": "2020-02-28T04:40:09.159Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "664e3b6f-59e4-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 136,
            "__v": 0,
            "rollbackIds": [
                "5e589b29bc5b5041e37da453"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "11110000",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e58927504ac6900b5183152",
            "updatedAt": "2020-02-28T04:09:25.796Z",
            "createdAt": "2020-02-28T04:09:25.491Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "1b668010-59e0-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 135,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456768987",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "dot1xDeadVlan": "10",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "desc",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "10",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "10",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": false,
                        "blc": "asdqwer",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "id": "B98DF2FE-6BD2-4E35-8F2D-21234061AD15",
                        "hostname": "Robot-SW-3650",
                        "requestType": "Add",
                        "vlanId": "953",
                        "vlanName": "name953",
                        "addVlanToTrunk": true,
                        "trunkInterface": "GigabitEthernet1/0/15"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e588df775648800b06b4317",
            "updatedAt": "2020-02-28T03:54:44.649Z",
            "createdAt": "2020-02-28T03:50:15.048Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "6db64e35-59dd-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 134,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "name953",
                        "vlanId": "953",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "id": "69321668-297F-4CAB-951F-B78157044881"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e58896f75648800b06b4316",
            "updatedAt": "2020-02-28T03:40:30.129Z",
            "createdAt": "2020-02-28T03:30:55.749Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "bab6668b-59da-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 133,
            "__v": 0,
            "rollbackIds": [
                "5e588afbbc5b5041e37da429"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "11110000",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e58826e04ac6900b5183151",
            "updatedAt": "2020-02-28T23:00:01.145Z",
            "createdAt": "2020-02-28T03:01:02.229Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "8db4a168-59d6-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e587fa604ac6900b5183150",
            "orderNumber": 132,
            "__v": 0,
            "rollbackIds": [
                "5e588114b69f9841def9f133"
            ],
            "rollbackOrder": true,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "crq": "CRQ123456789012",
                "nser": "12345678",
                "pid": "1234",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/11",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback"
        },
        {
            "_id": "5e587fa604ac6900b5183150",
            "updatedAt": "2020-02-28T02:59:24.163Z",
            "createdAt": "2020-02-28T02:49:10.118Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e53c893c-59d4-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 131,
            "__v": 0,
            "rollbackIds": [
                "5e588114b69f9841def9f133"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "87654321",
                "pid": "1234",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-323",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    },
                    {
                        "interfaceId": "1/0/11",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-323",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/11",
                        "mdix-auto": false,
                        "accessVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "US123423232S0001-1.2.3.4",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "120",
                        "endpointType": "Model Server",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-auth"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e587f9c04ac6900b518314f",
            "updatedAt": "2020-02-28T03:02:51.974Z",
            "createdAt": "2020-02-28T02:49:00.925Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "dfc2b612-59d4-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 130,
            "__v": 0,
            "rollbackIds": [
                "5e588286b69f9841def9f13a"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "11110000",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e58778204ac6900b518314e",
            "updatedAt": "2020-02-28T02:14:26.912Z",
            "createdAt": "2020-02-28T02:14:26.489Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "0b4915a6-59d0-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 129,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "950",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": false,
                        "blc": "ABCDEFG",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e58759b04ac6900b518314d",
            "updatedAt": "2020-02-28T02:22:46.797Z",
            "createdAt": "2020-02-28T02:06:19.113Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e8ca7a34-59ce-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e5864d604ac6900b518314a",
            "orderNumber": 128,
            "__v": 0,
            "rollbackIds": [
                "5e5865a7bc5b5041e37da380"
            ],
            "rollbackOrder": true,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "crq": "CRQ123456789012",
                "nser": "12345678",
                "pid": "123456",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/10",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback"
        },
        {
            "_id": "5e586d0b75648800b06b4315",
            "updatedAt": "2020-02-28T01:32:41.386Z",
            "createdAt": "2020-02-28T01:29:47.462Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ce76ec50-59c9-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 127,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "11110000",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5869ef04ac6900b518314c",
            "updatedAt": "2020-02-28T01:37:33.277Z",
            "createdAt": "2020-02-28T01:16:31.036Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "f3c66252-59c7-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e5864d604ac6900b518314a",
            "orderNumber": 126,
            "__v": 0,
            "rollbackIds": [
                "5e5865a7bc5b5041e37da380"
            ],
            "rollbackOrder": true,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "crq": "CRQ123456789012",
                "nser": "12345678",
                "pid": "123456",
                "rollbackOperations": [
                    {
                        "operation": "update",
                        "serviceKey": "Robot-SW-3650 GigabitEthernet 1/0/10",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback"
        },
        {
            "_id": "5e58673604ac6900b518314b",
            "updatedAt": "2020-02-28T01:07:33.364Z",
            "createdAt": "2020-02-28T01:04:54.094Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "546c93e2-59c6-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 125,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11110000",
                "pid": "11110000",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ABCDEFG",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "mdix-auto": false,
                        "accessVlan": "950",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "120",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JackID1234",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "950",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5864d604ac6900b518314a",
            "updatedAt": "2020-02-28T01:01:10.147Z",
            "createdAt": "2020-02-28T00:54:46.324Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ea155504-59c4-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 124,
            "__v": 0,
            "rollbackIds": [
                "5e5865a7bc5b5041e37da380"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-322",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "mdix-auto": false,
                        "accessVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "130",
                        "duplex": "full",
                        "dot1x": true,
                        "description": "JACK",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "801",
                        "endpointType": "Data SRF Logical",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e585c2104ac6900b5183149",
            "updatedAt": "2020-02-28T00:17:37.808Z",
            "createdAt": "2020-02-28T00:17:37.599Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b9a587fb-59bf-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 123,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11110000",
                "pid": "123456",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "950",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": false,
                        "blc": "ABCDEFG",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e58571304ac6900b5183148",
            "updatedAt": "2020-02-27T23:56:03.834Z",
            "createdAt": "2020-02-27T23:56:03.256Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b64f10f5-59bc-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 122,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11110000",
                "pid": "123456",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "950",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": false,
                        "blc": "ABCDEFG",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5853c004ac6900b5183147",
            "updatedAt": "2020-02-27T23:41:52.625Z",
            "createdAt": "2020-02-27T23:41:52.425Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "bb0ad644-59ba-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 121,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11110000",
                "pid": "123456",
                "crq": "CRQ000000001234",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "950",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/12",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": false,
                        "blc": "ABCDEFG",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e58506f04ac6900b5183146",
            "updatedAt": "2020-02-27T23:27:43.874Z",
            "createdAt": "2020-02-27T23:27:43.747Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "c12e1abc-59b8-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e582e8875648800b06b4314",
            "orderNumber": 120,
            "__v": 0,
            "rollbackIds": [
                "5e583565bc5b5041e37da2e2"
            ],
            "rollbackOrder": true,
            "formData": {
                "vlanConfigRequests": [],
                "switchportModeTrunkRequests": [],
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "ASH-321",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/10"
                    }
                ],
                "crq": "CRQ123456789012",
                "pid": "123",
                "nser": "12345678"
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e58425404ac6900b5183145",
            "updatedAt": "2020-02-27T23:25:29.706Z",
            "createdAt": "2020-02-27T22:27:32.365Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "589e31ce-59b0-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e57d53f75648800b06b4311",
            "orderNumber": 119,
            "__v": 0,
            "rollbackIds": [
                "5e57d94eb69f9841def9f0af"
            ],
            "rollbackOrder": true,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "crq": "CRQ111111111111",
                "nser": "12345678",
                "pid": "12345678",
                "rollbackOperations": [
                    {
                        "operation": "delete",
                        "serviceKey": "Robot-SW-3650 953",
                        "service": "vlan-cfs:vlan-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback"
        },
        {
            "_id": "5e582e8875648800b06b4314",
            "updatedAt": "2020-02-27T21:35:11.473Z",
            "createdAt": "2020-02-27T21:03:04.778Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "8c1c12f0-59a4-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 118,
            "__v": 0,
            "rollbackIds": [
                "5e583565bc5b5041e37da2e2"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123",
                "crq": "CRQ123456789012",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "ASH-321",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/10",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e58050775648800b06b4313",
            "updatedAt": "2020-02-27T18:19:22.754Z",
            "createdAt": "2020-02-27T18:05:59.820Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "cf24e7da-598b-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 117,
            "__v": 0,
            "rollbackIds": [
                "5e580788b69f9841def9f0ca"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "1/0/1",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-SW-3650",
                        "blc": "asasa",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet1/0/1",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e57fd5475648800b06b4312",
            "updatedAt": "2020-02-27T18:10:07.187Z",
            "createdAt": "2020-02-27T17:33:08.472Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "381f8cab-5987-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e57d53f75648800b06b4311",
            "orderNumber": 116,
            "__v": 0,
            "rollbackIds": [
                "5e57d94eb69f9841def9f0af"
            ],
            "rollbackOrder": true,
            "formData": {
                "crq": "CRQ111111111111",
                "nser": "12345678",
                "pid": "12345678",
                "rollbackOperations": [
                    {
                        "operation": "delete",
                        "serviceKey": "Robot-SW-3650 953",
                        "service": "vlan-cfs:vlan-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback-In-Process"
        },
        {
            "_id": "5e57d53f75648800b06b4311",
            "updatedAt": "2020-02-27T15:03:27.568Z",
            "createdAt": "2020-02-27T14:42:07.472Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "54170cc5-596f-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 115,
            "__v": 0,
            "rollbackIds": [
                "5e57d94eb69f9841def9f0af"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "12345678",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test953",
                        "vlanId": "953",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "id": "87B1C323-B5DE-40C3-99DC-85646FE1319F"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e579cda75648800b06b4310",
            "updatedAt": "2020-02-27T11:01:36.996Z",
            "createdAt": "2020-02-27T10:41:30.556Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b7151f41-594d-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 114,
            "__v": 0,
            "rollbackIds": [
                "5e579e19bc5b5041e37da291"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-SW-3650"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "12345678",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": [
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test951",
                        "vlanId": "951",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "id": "81C3EE94-BC6C-47F4-AA90-BFD91DD9AE8C"
                    },
                    {
                        "trunkInterface": "",
                        "addVlanToTrunk": false,
                        "vlanName": "Test952",
                        "vlanId": "952",
                        "requestType": "Add",
                        "hostname": "Robot-SW-3650",
                        "id": "3DA37DCB-7F84-4EBF-846E-254C3ABC7A0C"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e57602975648800b06b430f",
            "updatedAt": "2020-02-27T06:47:38.820Z",
            "createdAt": "2020-02-27T06:22:33.024Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "89f35c30-5929-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "5e57029b75648800b06b430e",
            "orderNumber": 113,
            "__v": 0,
            "rollbackIds": [
                "5e5703bdb69f9841def9f086"
            ],
            "rollbackOrder": true,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "crq": "CRQ123456789912",
                "nser": "12345678",
                "pid": "123456",
                "rollbackOperations": [
                    {
                        "operation": "delete",
                        "serviceKey": "Robot-3560 GigabitEthernet 0/10",
                        "service": "interface-cfs:interface-cfs"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Rollback"
        },
        {
            "_id": "5e57029b75648800b06b430e",
            "updatedAt": "2020-02-27T06:22:18.377Z",
            "createdAt": "2020-02-26T23:43:23.486Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "c6ee73d2-58f1-11ea-b884-0242ac180007",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 112,
            "__v": 0,
            "rollbackIds": [
                "5e5703bdb69f9841def9f086"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "12345678",
                "pid": "123456",
                "crq": "CRQ123456789912",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/10",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-3560",
                        "blc": "AK1-503",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/10",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "NA",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "NA",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e567672b0051200b4ae8a99",
            "updatedAt": "2020-02-26T13:45:22.371Z",
            "createdAt": "2020-02-26T13:45:22.133Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "3bf6d2c7-589e-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 111,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111135",
                "workorderNumber": "test1234",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e564a7cb0051200b4ae8a98",
            "updatedAt": "2020-02-26T10:37:49.300Z",
            "createdAt": "2020-02-26T10:37:48.608Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "085a3c32-5884-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 110,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e564916c8ad6400b99b4ad4",
            "updatedAt": "2020-02-26T10:31:50.971Z",
            "createdAt": "2020-02-26T10:31:50.620Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "32fcce87-5883-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 109,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e55f455b0051200b4ae8a97",
            "updatedAt": "2020-02-26T04:30:14.118Z",
            "createdAt": "2020-02-26T04:30:13.692Z",
            "item": "Common Service CEWA",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "ae926961-5850-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 108,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "1234",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX3650IDE0010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKBR01FIE0011",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e54eee1b0051200b4ae8a96",
            "updatedAt": "2020-02-25T09:54:41.517Z",
            "createdAt": "2020-02-25T09:54:41.029Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "d7c51a73-57b4-11ea-b048-0242ac140005",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 107,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "2213123123",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "qerqwe",
                        "interfaceName": "GigabitEthernet0/1/45",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1/45"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e54c739c8ad6400b99b4ad3",
            "updatedAt": "2020-02-25T07:05:30.100Z",
            "createdAt": "2020-02-25T07:05:29.937Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "35117566-579d-11ea-b048-0242ac140005",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 106,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "1111",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Ent-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "description": "gggg",
                        "udld-port": "enable",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "allowedVlan": "1947",
                        "hostname": "Roboot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": true,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e542922b0051200b4ae8a95",
            "updatedAt": "2020-02-24T19:59:22.092Z",
            "createdAt": "2020-02-24T19:50:58.964Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "fa7a9dac-573e-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 105,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU01R01"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e53f9b2c8ad6400b99b4ad2",
            "updatedAt": "2020-02-24T16:36:53.998Z",
            "createdAt": "2020-02-24T16:28:34.940Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b411a117-5722-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 104,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e53f7c2c8ad6400b99b4ad1",
            "updatedAt": "2020-02-24T16:20:19.036Z",
            "createdAt": "2020-02-24T16:20:18.496Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "8c30ffed-5721-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 103,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU01R01"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e53f6e2c8ad6400b99b4ad0",
            "updatedAt": "2020-02-24T16:16:35.157Z",
            "createdAt": "2020-02-24T16:16:34.984Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "06f50685-5721-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 102,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USCASFO6500IDE0018"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e53f5e5c8ad6400b99b4acf",
            "updatedAt": "2020-02-24T16:12:21.731Z",
            "createdAt": "2020-02-24T16:12:21.630Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "6ff098f1-5720-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 101,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e53eef8b0051200b4ae8a94",
            "updatedAt": "2020-02-24T15:42:48.773Z",
            "createdAt": "2020-02-24T15:42:48.572Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "4f1c8099-571c-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 100,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e53eda8b0051200b4ae8a93",
            "updatedAt": "2020-02-24T15:37:12.474Z",
            "createdAt": "2020-02-24T15:37:12.252Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "86a8bc1a-571b-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 99,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e53ea08c8ad6400b99b4ace",
            "updatedAt": "2020-02-24T15:31:43.531Z",
            "createdAt": "2020-02-24T15:21:44.855Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "5de0492d-5719-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 98,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e53e929b0051200b4ae8a92",
            "updatedAt": "2020-02-24T15:18:01.619Z",
            "createdAt": "2020-02-24T15:18:01.463Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "d8b825d2-5718-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 97,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU3650BR011",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e53e587c8ad6400b99b4acd",
            "updatedAt": "2020-02-24T15:02:31.395Z",
            "createdAt": "2020-02-24T15:02:31.025Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ae241adc-5716-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 96,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USNCRDU4500IDE0019"
                    },
                    {
                        "deviceName": "Ent-3650"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001"
                    },
                    {
                        "deviceName": "Hostname1"
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e53e2abc8ad6400b99b4acc",
            "updatedAt": "2020-02-24T15:00:18.502Z",
            "createdAt": "2020-02-24T14:50:19.867Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "fa607871-5714-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 95,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU3650BR011"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e53d7d1b0051200b4ae8a91",
            "updatedAt": "2020-02-24T14:14:01.614Z",
            "createdAt": "2020-02-24T14:04:01.985Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "8298c51a-570e-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 94,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "crq": "CRQ121212121212",
                "workorderNumber": "80",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU3650BR011"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e5380ccb0051200b4ae8a90",
            "updatedAt": "2020-02-24T07:52:46.575Z",
            "createdAt": "2020-02-24T07:52:44.111Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "a3fbd22e-56da-11ea-b048-0242ac140005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 93,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e5378a5c8ad6400b99b4acb",
            "updatedAt": "2020-02-24T07:25:32.802Z",
            "createdAt": "2020-02-24T07:17:57.222Z",
            "item": "Data Center Modify Switch Config",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "c81a9751-56d5-11ea-b048-0242ac140005",
            "description": "This service will process Port turn Up/Turn Down and VLAN for Nexus & Arista devices",
            "rollbackSourceOrderId": "",
            "orderNumber": 92,
            "__v": 0,
            "rollbackIds": [
                "5e5379951fd34441360db841"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "DC-N5548"
            ],
            "formData": {
                "connectionRow": [
                    {
                        "deviceType": "Nexus_5K",
                        "operationType": "Port Turn Down",
                        "interface": "Ethernet1/7",
                        "hostname": "DC-N5548"
                    }
                ],
                "userId": "admin",
                "crq": "CRQ000000001234",
                "nser": "11110000"
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e4f9ab2c8ad6400b99b4aca",
            "updatedAt": "2020-02-21T08:54:10.793Z",
            "createdAt": "2020-02-21T08:54:10.642Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ba0e787a-5487-11ea-b048-0242ac140005",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 91,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "description": "dddddd",
                        "udld-port": "enable",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "allowedVlan": "33",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/11",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": true,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/11"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f98c7b0051200b4ae8a8f",
            "updatedAt": "2020-02-21T08:49:11.465Z",
            "createdAt": "2020-02-21T08:45:59.886Z",
            "item": "ee-CMS-P Site Commissioning Service Request",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "95889ada-5486-11ea-b048-0242ac140005",
            "description": "CMS-P Site Commissioning Service Request",
            "rollbackSourceOrderId": "",
            "orderNumber": 90,
            "__v": 0,
            "cancelReason": "eeee",
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/1",
                        "interfaceType": "GigabitEthernet",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/1",
                        "hostname": "Robot-3560",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "interfaceId": "0/11",
                        "interfaceType": "GigabitEthernet",
                        "isAddInterfaceToDescription": true,
                        "isAddDateToDescription": false,
                        "interfaceName": "GigabitEthernet0/11",
                        "hostname": "Robot-3560",
                        "allowedVlan": "33",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "voiceVlan": "",
                        "udld-port": "enable",
                        "description": "ddd",
                        "nativeVlan": "120",
                        "endpointType": "New Switch Connection",
                        "switchportMode": "trunk",
                        "spanning-tree-portfast": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "shutdown": false,
                        "authentication-host-mode": "multi-domain"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Cancelled"
        },
        {
            "_id": "5e4f9778b0051200b4ae8a8e",
            "updatedAt": "2020-02-21T08:40:24.931Z",
            "createdAt": "2020-02-21T08:40:24.767Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "cdca1d8b-5485-11ea-b048-0242ac140005",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 89,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "description": "dddddd",
                        "udld-port": "enable",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "allowedVlan": "11",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/11",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": true,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/11"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f954cb0051200b4ae8a8d",
            "updatedAt": "2020-02-21T08:31:08.327Z",
            "createdAt": "2020-02-21T08:31:08.162Z",
            "item": "ee-CMS-P Site Commissioning Service Request",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "820a4a5f-5484-11ea-b048-0242ac140005",
            "description": "CMS-P Site Commissioning Service Request",
            "rollbackSourceOrderId": "",
            "orderNumber": 88,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "description": "dddd",
                        "udld-port": "enable",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "allowedVlan": "11",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/11",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": true,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/11"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f93fbb0051200b4ae8a8c",
            "updatedAt": "2020-02-21T08:25:31.599Z",
            "createdAt": "2020-02-21T08:25:31.263Z",
            "item": "ee-CMS-P Site Commissioning Service Request",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b93971c9-5483-11ea-b048-0242ac140005",
            "description": "CMS-P Site Commissioning Service Request",
            "rollbackSourceOrderId": "",
            "orderNumber": 87,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f92cbc8ad6400b99b4ac9",
            "updatedAt": "2020-02-21T08:20:27.996Z",
            "createdAt": "2020-02-21T08:20:27.879Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "0463a786-5483-11ea-b048-0242ac140005",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 86,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f921dc8ad6400b99b4ac8",
            "updatedAt": "2020-02-21T08:17:34.375Z",
            "createdAt": "2020-02-21T08:17:33.766Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "9ca7b6aa-5482-11ea-b048-0242ac140005",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 85,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f9088c8ad6400b99b4ac7",
            "updatedAt": "2020-02-21T08:10:48.455Z",
            "createdAt": "2020-02-21T08:10:48.335Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "aaf52c3b-5481-11ea-b048-0242ac140005",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 84,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f8ffbc8ad6400b99b4ac6",
            "updatedAt": "2020-02-21T08:08:28.236Z",
            "createdAt": "2020-02-21T08:08:27.681Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "57558c34-5481-11ea-b048-0242ac140005",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 83,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f8eeac8ad6400b99b4ac5",
            "updatedAt": "2020-02-21T08:03:55.055Z",
            "createdAt": "2020-02-21T08:03:54.715Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b46c130e-5480-11ea-b048-0242ac140005",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 82,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f8d9cc8ad6400b99b4ac4",
            "updatedAt": "2020-02-21T07:58:20.489Z",
            "createdAt": "2020-02-21T07:58:20.324Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ed1c0eff-547f-11ea-b048-0242ac140005",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 81,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f8becc8ad6400b99b4ac3",
            "updatedAt": "2020-02-21T07:53:09.779Z",
            "createdAt": "2020-02-21T07:51:08.367Z",
            "item": "CMS-P Device Maintenance Mode on/off",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "eba51b14-547e-11ea-b048-0242ac140005",
            "description": "kk-CMS-P Device Maintenance Mode on/off",
            "rollbackSourceOrderId": "",
            "orderNumber": 80,
            "__v": 0,
            "cancelReason": "ddd",
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/1",
                        "interfaceType": "GigabitEthernet",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/1",
                        "hostname": "Robot-3560",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "Cancelled"
        },
        {
            "_id": "5e4f8a66b0051200b4ae8a8b",
            "updatedAt": "2020-02-21T07:44:38.611Z",
            "createdAt": "2020-02-21T07:44:38.434Z",
            "item": "branch-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "03363d01-547e-11ea-b048-0242ac140005",
            "description": "branch test",
            "rollbackSourceOrderId": "",
            "orderNumber": 79,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f89c9c8ad6400b99b4ac2",
            "updatedAt": "2020-02-21T07:42:01.798Z",
            "createdAt": "2020-02-21T07:42:01.670Z",
            "item": "branch-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "a5ca3888-547d-11ea-b048-0242ac140005",
            "description": "branch test",
            "rollbackSourceOrderId": "",
            "orderNumber": 78,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "description": "dddddd",
                        "udld-port": "enable",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "allowedVlan": "11",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/11",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": true,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/11"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f891bc8ad6400b99b4ac1",
            "updatedAt": "2020-02-21T07:39:07.562Z",
            "createdAt": "2020-02-21T07:39:07.403Z",
            "item": "common-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "3deae26d-547d-11ea-b048-0242ac140005",
            "description": "common cewa test",
            "rollbackSourceOrderId": "",
            "orderNumber": 77,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4f87d3b0051200b4ae8a8a",
            "updatedAt": "2020-02-21T07:36:45.196Z",
            "createdAt": "2020-02-21T07:33:39.453Z",
            "item": "common-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "7a73f93d-547c-11ea-b048-0242ac140005",
            "description": "common cewa test",
            "rollbackSourceOrderId": "",
            "orderNumber": 76,
            "__v": 0,
            "cancelReason": "yyy",
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/1",
                        "interfaceType": "GigabitEthernet",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/1",
                        "hostname": "Robot-3560",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "Cancelled"
        },
        {
            "_id": "5e4f86d0b0051200b4ae8a89",
            "updatedAt": "2020-02-21T07:30:59.865Z",
            "createdAt": "2020-02-21T07:29:20.449Z",
            "item": "common-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e0189795-547b-11ea-b048-0242ac140005",
            "description": "common cewa test",
            "rollbackSourceOrderId": "",
            "orderNumber": 75,
            "__v": 0,
            "cancelReason": "ssss",
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/1",
                        "interfaceType": "GigabitEthernet",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/1",
                        "hostname": "Robot-3560",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "Cancelled"
        },
        {
            "_id": "5e4f7b88b0051200b4ae8a88",
            "updatedAt": "2020-02-21T06:41:12.943Z",
            "createdAt": "2020-02-21T06:41:12.454Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "26b7fcbd-5475-11ea-b048-0242ac140005",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 74,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "33333",
                "crq": "CRQ111111111122",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4e82c8c3a3de00bf0cb135",
            "updatedAt": "2020-02-20T12:59:52.650Z",
            "createdAt": "2020-02-20T12:59:52.238Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e25b10c4-53e0-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 73,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4e7e9a29277c00be7997a1",
            "updatedAt": "2020-02-20T12:42:02.379Z",
            "createdAt": "2020-02-20T12:42:02.214Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "64878772-53de-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 72,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4e7c7f29277c00be7997a0",
            "updatedAt": "2020-02-20T12:33:03.849Z",
            "createdAt": "2020-02-20T12:33:03.724Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "239227b3-53dd-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 71,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4e6dbdc3a3de00bf0cb134",
            "updatedAt": "2020-02-20T11:30:06.096Z",
            "createdAt": "2020-02-20T11:30:05.781Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "57ba22db-53d4-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 70,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4e6c3ac3a3de00bf0cb133",
            "updatedAt": "2020-02-20T11:23:38.944Z",
            "createdAt": "2020-02-20T11:23:38.744Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "710cf1e8-53d3-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 69,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4e6a58c3a3de00bf0cb132",
            "updatedAt": "2020-02-20T11:15:36.606Z",
            "createdAt": "2020-02-20T11:15:36.432Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "5190e821-53d2-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 68,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4e51f829277c00be79979f",
            "updatedAt": "2020-02-20T09:31:37.091Z",
            "createdAt": "2020-02-20T09:31:36.903Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ca842f95-53c3-11ea-b313-0242c0a8e006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 67,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA03IDE0030"
                    },
                    {
                        "deviceName": "USGATL3550BR012",
                        "blc": "branch"
                    },
                    {
                        "deviceName": "USGATL3550BR018",
                        "blc": "branch"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011",
                        "blc": "branch"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4dba5229277c00be79979e",
            "updatedAt": "2020-02-19T22:44:34.669Z",
            "createdAt": "2020-02-19T22:44:34.519Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "6691bdac-5369-11ea-b313-0242c0a8e006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 66,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "123",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4db52c29277c00be79979d",
            "updatedAt": "2020-02-19T22:46:49.341Z",
            "createdAt": "2020-02-19T22:22:36.259Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "54dab3c5-5366-11ea-b313-0242c0a8e006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 65,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "crq": "",
                "workorderNumber": "1",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "YHH"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "YHH"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e4db30e29277c00be79979c",
            "updatedAt": "2020-02-19T22:20:12.723Z",
            "createdAt": "2020-02-19T22:13:34.887Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "122c810e-5365-11ea-b313-0242c0a8e006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 64,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "88888888",
                "crq": "CRQ123456789012",
                "workorderNumber": "1",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "ABCD"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "ABCD"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e4db09ac3a3de00bf0cb131",
            "updatedAt": "2020-02-19T22:03:06.673Z",
            "createdAt": "2020-02-19T22:03:06.429Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "9b9285d8-5363-11ea-b313-0242c0a8e006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 63,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/31",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/31"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "100",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/32",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/32"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/33",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/33"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Printer",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/37",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/37"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Parabit (Card Reader)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789CRD1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/38",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/38"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "UPS (Uninterrupted Power Source)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US1234789012UPS1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "1000",
                        "description": "US123456789NMP1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/13",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/13"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Telepresence unit (RVS)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789VTC1234-RVS",
                        "dot1x": true,
                        "udld-port": "enable",
                        "duplex": "auto",
                        "accessVlan": "950",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/14",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/14"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "trunk",
                        "endpointType": "Aruba Wireless iAP",
                        "nativeVlan": "1949",
                        "snmp-trap-link-status": false,
                        "speed": "",
                        "description": "MAP1234",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "spanning-tree-portfast-trunk": true,
                        "accessVlan": "",
                        "allowedVlan": "1947, 1948, 1949",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/15",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/15"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "speed": "",
                        "description": "Robot-SW-3650",
                        "udld-port": "enable",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "accessVlan": "",
                        "allowedVlan": "120, 130, 140",
                        "blc": "",
                        "hostname": "invalid",
                        "interfaceName": "GigabitEthernet1/0/30",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/30"
                    }
                ],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4db01dc3a3de00bf0cb130",
            "updatedAt": "2020-02-19T22:01:01.393Z",
            "createdAt": "2020-02-19T22:01:01.150Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "50e2cda4-5363-11ea-b313-0242c0a8e006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 62,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Standalone IP Phone",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Standalone IP phone",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "802",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet0/18",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "Ak1-503",
                        "hostname": "Robot-3560",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/18"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet0/19",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "Ak1-503",
                        "hostname": "Robot-3560",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/19"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4daf89c3a3de00bf0cb12f",
            "updatedAt": "2020-02-19T21:58:34.079Z",
            "createdAt": "2020-02-19T21:58:33.731Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "f908b8a3-5362-11ea-b313-0242c0a8e006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 61,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet0/11",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "Ak1-503",
                        "hostname": "Robot-3560",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/11"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Standalone IP Phone",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Standalone IP phone",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "802",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet1/0/13",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "Ak1-503",
                        "hostname": "Robot-SW-3650",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/13"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4dae84c3a3de00bf0cb12e",
            "updatedAt": "2020-02-19T21:54:13.131Z",
            "createdAt": "2020-02-19T21:54:12.923Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "5d8ea089-5362-11ea-b313-0242c0a8e006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 60,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "test",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/31",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/31"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "100",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "london",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/32",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/32"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "AK1-503",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/33",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/33"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "LOB connection - VLAN 120",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "test",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/34",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/34"
                    },
                    {
                        "authentication-host-mode": "multi-auth",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Server",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Us121234567S0001-1.2.3.4",
                        "dot1x": true,
                        "duplex": "auto",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "london",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/35",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/35"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Standalone IP Phone",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Standalone IP phone",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "802",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "AK1-503",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/36",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/36"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Printer",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "test",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/37",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/37"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Parabit (Card Reader)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789CRD1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "london",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/38",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/38"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "ATM",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "151",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789ATM1234/12345678 -1.2.3.4",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "151",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "AK1-503",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/10"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "JACE (Environmental device)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789JAM1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "test",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/11",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/11"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "UPS (Uninterrupted Power Source)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US1234789012UPS1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "london",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "1000",
                        "description": "US123456789NMP1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "AK1-503",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/13",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/13"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Telepresence unit (RVS)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789VTC1234-RVS",
                        "dot1x": true,
                        "udld-port": "enable",
                        "duplex": "auto",
                        "accessVlan": "950",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "test",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/14",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/14"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "trunk",
                        "endpointType": "Aruba Wireless iAP",
                        "nativeVlan": "1949",
                        "snmp-trap-link-status": false,
                        "speed": "",
                        "description": "MAP1234",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "spanning-tree-portfast-trunk": true,
                        "accessVlan": "",
                        "allowedVlan": "1947, 1948, 1949",
                        "mdix-auto": false,
                        "blc": "london",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/15",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/15"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "speed": "",
                        "description": "Robot-SW-3650",
                        "udld-port": "enable",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "accessVlan": "",
                        "allowedVlan": "120, 130, 140",
                        "blc": "AK1-503",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/16",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/16"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "speed": "",
                        "description": "Robot-SW-3650",
                        "udld-port": "enable",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "accessVlan": "",
                        "allowedVlan": "120, 130, 140",
                        "blc": "test",
                        "hostname": "invalid",
                        "interfaceName": "GigabitEthernet1/0/30",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/30"
                    }
                ],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4dab9ec3a3de00bf0cb12d",
            "updatedAt": "2020-02-19T21:41:51.121Z",
            "createdAt": "2020-02-19T21:41:50.852Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "a342a0d7-5360-11ea-b313-0242c0a8e006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 59,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/31",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/31"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "100",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/32",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/32"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/33",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/33"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "LOB connection - VLAN 120",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/34",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/34"
                    },
                    {
                        "authentication-host-mode": "multi-auth",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Server",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Us121234567S0001-1.2.3.4",
                        "dot1x": true,
                        "duplex": "auto",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/35",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/35"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Standalone IP Phone",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Standalone IP phone",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "802",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/36",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/36"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Printer",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/37",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/37"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Parabit (Card Reader)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789CRD1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/38",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/38"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "ATM",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "151",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789ATM1234/12345678 -1.2.3.4",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "151",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/10"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "JACE (Environmental device)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789JAM1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/11",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/11"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "UPS (Uninterrupted Power Source)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US1234789012UPS1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "1000",
                        "description": "US123456789NMP1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/13",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/13"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Telepresence unit (RVS)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789VTC1234-RVS",
                        "dot1x": true,
                        "udld-port": "enable",
                        "duplex": "auto",
                        "accessVlan": "950",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/14",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/14"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "trunk",
                        "endpointType": "Aruba Wireless iAP",
                        "nativeVlan": "1949",
                        "snmp-trap-link-status": false,
                        "speed": "",
                        "description": "MAP1234",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "spanning-tree-portfast-trunk": true,
                        "accessVlan": "",
                        "allowedVlan": "1947, 1948, 1949",
                        "mdix-auto": false,
                        "blc": "invalid",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/15",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/15"
                    }
                ],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4da8e8c3a3de00bf0cb12c",
            "updatedAt": "2020-02-19T21:30:17.083Z",
            "createdAt": "2020-02-19T21:30:16.932Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "05a6140f-535f-11ea-b313-0242c0a8e006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 58,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/31",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/31"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "100",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/32",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/32"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/33",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/33"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "LOB connection - VLAN 120",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/34",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/34"
                    },
                    {
                        "authentication-host-mode": "multi-auth",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Server",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Us121234567S0001-1.2.3.4",
                        "dot1x": true,
                        "duplex": "auto",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/35",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/35"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Standalone IP Phone",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Standalone IP phone",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "802",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/36",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/36"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Printer",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/37",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/37"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Parabit (Card Reader)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789CRD1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/38",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/38"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "ATM",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "151",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789ATM1234/12345678 -1.2.3.4",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "151",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/10"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "JACE (Environmental device)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789JAM1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/11",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/11"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "UPS (Uninterrupted Power Source)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US1234789012UPS1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "1000",
                        "description": "US123456789NMP1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/13",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/13"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Telepresence unit (RVS)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789VTC1234-RVS",
                        "dot1x": true,
                        "udld-port": "enable",
                        "duplex": "auto",
                        "accessVlan": "950",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/14",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/14"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "trunk",
                        "endpointType": "Aruba Wireless iAP",
                        "nativeVlan": "1949",
                        "snmp-trap-link-status": false,
                        "speed": "",
                        "description": "MAP1234",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "spanning-tree-portfast-trunk": true,
                        "accessVlan": "",
                        "allowedVlan": "1947, 1948, 1949",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/15",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/15"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "speed": "",
                        "description": "Robot-SW-3650",
                        "udld-port": "enable",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "accessVlan": "",
                        "allowedVlan": "120, 130, 140",
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/16",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/16"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "speed": "",
                        "description": "Robot-SW-3650",
                        "udld-port": "enable",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "accessVlan": "",
                        "allowedVlan": "120, 130, 140",
                        "blc": "",
                        "hostname": "invalid",
                        "interfaceName": "GigabitEthernet1/0/30",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/30"
                    }
                ],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4da3cf29277c00be79979b",
            "updatedAt": "2020-02-19T21:08:31.919Z",
            "createdAt": "2020-02-19T21:08:31.663Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "fbb73ad3-535b-11ea-b313-0242c0a8e006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 57,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "pid": "",
                "crq": "",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/31",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/31"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Data SRF Logical",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "100",
                        "description": "JackID1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "120",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/32",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/32"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/33",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/33"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Client/User",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "LOB connection - VLAN 120",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/34",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/34"
                    },
                    {
                        "authentication-host-mode": "multi-auth",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Server",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Us121234567S0001-1.2.3.4",
                        "dot1x": true,
                        "duplex": "auto",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "test",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/35",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/35"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Standalone IP Phone",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Standalone IP phone",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "802",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/36",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/36"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Printer",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/37",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/37"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Parabit (Card Reader)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789CRD1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/38",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/38"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "ATM",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "151",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789ATM1234/12345678 -1.2.3.4",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "151",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "london",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/10",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/10"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "JACE (Environmental device)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789JAM1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/11",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/11"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "UPS (Uninterrupted Power Source)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US1234789012UPS1234",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/12",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/12"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Non-Model Printer",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "140",
                        "snmp-trap-link-status": false,
                        "speed": "1000",
                        "description": "US123456789NMP1234",
                        "dot1x": true,
                        "duplex": "full",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "140",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/13",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/13"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Telepresence unit (RVS)",
                        "nativeVlan": "",
                        "dot1xDeadVlan": "950",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "US123456789VTC1234-RVS",
                        "dot1x": true,
                        "udld-port": "enable",
                        "duplex": "auto",
                        "accessVlan": "950",
                        "allowedVlan": "",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/14",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/14"
                    }
                ],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "trunk",
                        "endpointType": "Aruba Wireless iAP",
                        "nativeVlan": "1949",
                        "snmp-trap-link-status": false,
                        "speed": "",
                        "description": "MAP1234",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "spanning-tree-portfast-trunk": true,
                        "accessVlan": "",
                        "allowedVlan": "1947, 1948, 1949",
                        "mdix-auto": false,
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/15",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/15"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "speed": "",
                        "description": "Robot-SW-3650",
                        "udld-port": "enable",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "accessVlan": "",
                        "allowedVlan": "120, 130, 140",
                        "blc": "",
                        "hostname": "Robot-SW-3650",
                        "interfaceName": "GigabitEthernet1/0/16",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/16"
                    },
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "speed": "",
                        "description": "Robot-SW-3650",
                        "udld-port": "enable",
                        "duplex": "",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "accessVlan": "",
                        "allowedVlan": "120, 130, 140",
                        "blc": "",
                        "hostname": "invalid",
                        "interfaceName": "GigabitEthernet1/0/30",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "1/0/30"
                    }
                ],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d2cd029277c00be79979a",
            "updatedAt": "2020-02-19T12:40:49.178Z",
            "createdAt": "2020-02-19T12:40:48.871Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "0e661186-5315-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 56,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d2bfe29277c00be799799",
            "updatedAt": "2020-02-19T12:37:19.164Z",
            "createdAt": "2020-02-19T12:37:18.859Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "9140dd82-5314-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 55,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d2b8a29277c00be799798",
            "updatedAt": "2020-02-19T12:35:22.587Z",
            "createdAt": "2020-02-19T12:35:22.301Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "4bc452a5-5314-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 54,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d2b3629277c00be799797",
            "updatedAt": "2020-02-19T12:33:58.558Z",
            "createdAt": "2020-02-19T12:33:58.349Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "19bd776d-5314-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 53,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d2625c3a3de00bf0cb12b",
            "updatedAt": "2020-02-19T12:12:21.710Z",
            "createdAt": "2020-02-19T12:12:21.515Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "14c0f23f-5311-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 52,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d23dbc3a3de00bf0cb12a",
            "updatedAt": "2020-02-19T12:02:36.046Z",
            "createdAt": "2020-02-19T12:02:35.869Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b7a9bad4-530f-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 51,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d230729277c00be799796",
            "updatedAt": "2020-02-19T11:59:03.356Z",
            "createdAt": "2020-02-19T11:59:03.130Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "38da595d-530f-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 50,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d2282c3a3de00bf0cb129",
            "updatedAt": "2020-02-19T11:56:50.617Z",
            "createdAt": "2020-02-19T11:56:50.461Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e9c7e2c1-530e-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 49,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d21a8c3a3de00bf0cb128",
            "updatedAt": "2020-02-19T11:53:12.991Z",
            "createdAt": "2020-02-19T11:53:12.729Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "680a630d-530e-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 48,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4d209829277c00be799795",
            "updatedAt": "2020-02-19T11:48:40.279Z",
            "createdAt": "2020-02-19T11:48:40.105Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "c5843ece-530d-11ea-b313-0242c0a8e006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 47,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4c5fba29277c00be799794",
            "updatedAt": "2020-02-18T22:05:47.208Z",
            "createdAt": "2020-02-18T22:05:46.854Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "0a95bb70-4fa3-11ea-a176-8df1f836237a",
            "userName": "BPA-Admin",
            "processInstanceId": "d0cd2e0d-529a-11ea-b313-0242c0a8e006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 46,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12121212",
                "pid": "1234",
                "crq": "CRQ121212121212",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Model Client/User",
                        "dot1xDeadVlan": "120",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "Model Client",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "801",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "120",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet0/22",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "Ak1-503",
                        "hostname": "Robot-3560",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/22"
                    }
                ],
                "switchportModeTrunkRequests": [],
                "vlanConfigRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4b9667f9948400a8e0cd92",
            "updatedAt": "2020-02-18T09:19:02.362Z",
            "createdAt": "2020-02-18T07:46:47.280Z",
            "item": "common-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "d0d5f618-5222-11ea-afc7-0242c0a8a007",
            "description": "common cewa test",
            "rollbackSourceOrderId": "",
            "orderNumber": 45,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USGATL3550BR012",
                        "blc": "branch"
                    },
                    {
                        "deviceName": "USGATL3550BR018",
                        "blc": "branch"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011",
                        "blc": "branch"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e4a8f9a0e92c40100bb2f44",
            "updatedAt": "2020-02-17T13:05:30.780Z",
            "createdAt": "2020-02-17T13:05:30.572Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "2cbea3c1-5186-11ea-8a1b-0242c0a86006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 44,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet0/1",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "london",
                        "hostname": "Robot-3560",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/1"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4a7b6b0e92c40100bb2f43",
            "updatedAt": "2020-02-17T12:56:19.015Z",
            "createdAt": "2020-02-17T11:39:23.486Z",
            "item": "common-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "24f3aa79-517a-11ea-8a1b-0242c0a86006",
            "description": "common cewa test",
            "rollbackSourceOrderId": "",
            "orderNumber": 43,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e4a6dc90e92c40100bb2f42",
            "updatedAt": "2020-02-17T10:41:13.459Z",
            "createdAt": "2020-02-17T10:41:13.191Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "0489c286-5172-11ea-8a1b-0242c0a86006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 42,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4a6518e77843010141c380",
            "updatedAt": "2020-02-17T10:04:09.349Z",
            "createdAt": "2020-02-17T10:04:08.672Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "d6a2c218-516c-11ea-8a1b-0242c0a86006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 41,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4a55100e92c40100bb2f41",
            "updatedAt": "2020-02-17T13:30:31.467Z",
            "createdAt": "2020-02-17T08:55:44.118Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "481b924b-5163-11ea-8a1b-0242c0a86006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 40,
            "__v": 0,
            "rollbackIds": [
                "5e4a95414d1e144133f7484a"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "Robot-3560"
            ],
            "formData": {
                "nser": "11111111",
                "pid": "1111",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/11",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-3560",
                        "blc": "test",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/11",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4a53d00e92c40100bb2f40",
            "updatedAt": "2020-02-17T08:50:25.144Z",
            "createdAt": "2020-02-17T08:50:24.899Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "89de1819-5162-11ea-8a1b-0242c0a86006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 39,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "1111",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet0/10",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "test",
                        "hostname": "Robot-3560",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/10"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4a36fb0e92c40100bb2f3f",
            "updatedAt": "2020-02-17T07:35:40.609Z",
            "createdAt": "2020-02-17T06:47:23.154Z",
            "item": "common-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "59fdd6a2-5151-11ea-8a1b-0242c0a86006",
            "description": "common cewa test",
            "rollbackSourceOrderId": "",
            "orderNumber": 38,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00010",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e4a27430e92c40100bb2f3e",
            "updatedAt": "2020-02-17T05:52:52.737Z",
            "createdAt": "2020-02-17T05:40:19.462Z",
            "item": "common-rajesh",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "fbb3219a-5147-11ea-8a1b-0242c0a86006",
            "description": "common cewa test",
            "rollbackSourceOrderId": "",
            "orderNumber": 37,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "crq": "CRQ111111111111",
                "workorderNumber": "RAJESH112345",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e46bd5961683200b8bd327e",
            "updatedAt": "2020-02-14T15:50:47.988Z",
            "createdAt": "2020-02-14T15:31:37.895Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "1738706b-4f3f-11ea-8f03-0242ac1e0006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 36,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e46b7fea2bc3900bde4d5ea",
            "updatedAt": "2020-02-14T15:08:46.888Z",
            "createdAt": "2020-02-14T15:08:46.547Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e5e4240c-4f3b-11ea-8f03-0242ac1e0006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 35,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USGATL3550BR012",
                        "blc": "branch"
                    },
                    {
                        "deviceName": "USGATL3550BR018",
                        "blc": "branch"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011",
                        "blc": "branch"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e46ac9da2bc3900bde4d5e9",
            "updatedAt": "2020-02-14T14:20:14.152Z",
            "createdAt": "2020-02-14T14:20:13.902Z",
            "item": "ccccc",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "1dc593b1-4f35-11ea-8f03-0242ac1e0006",
            "description": "ccc",
            "rollbackSourceOrderId": "",
            "orderNumber": 34,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "crq": "CRQ111111111122",
                "workorderNumber": "RAJESH112345",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e46a8ff61683200b8bd327d",
            "updatedAt": "2020-02-14T14:04:47.438Z",
            "createdAt": "2020-02-14T14:04:47.305Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "f5797c82-4f32-11ea-8f03-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 33,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "crq": "CRQ111111111122",
                "workorderNumber": "RAJESH112345",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e46a6e861683200b8bd327c",
            "updatedAt": "2020-02-14T13:55:52.769Z",
            "createdAt": "2020-02-14T13:55:52.250Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b69289df-4f31-11ea-8f03-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 32,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "crq": "CRQ111111111122",
                "workorderNumber": "RAJESH",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE010",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e46a2a8a2bc3900bde4d5e7",
            "updatedAt": "2020-02-14T13:37:44.610Z",
            "createdAt": "2020-02-14T13:37:44.196Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "2e1a8aa8-4f2f-11ea-8f03-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 31,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e469436a2bc3900bde4d5e6",
            "updatedAt": "2020-02-14T12:36:06.789Z",
            "createdAt": "2020-02-14T12:36:06.562Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "92136ee4-4f26-11ea-8f03-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 30,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USGATL3550BR012",
                        "blc": "branch"
                    },
                    {
                        "deviceName": "USGATL3550BR018",
                        "blc": "branch"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011",
                        "blc": "branch"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e467bb361683200b8bd327b",
            "updatedAt": "2020-02-14T10:51:31.554Z",
            "createdAt": "2020-02-14T10:51:31.335Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "f5c3e741-4f17-11ea-8f03-0242ac1e0006",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 29,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "1111",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "Port Shutdown",
                        "dot1xDeadVlan": "999",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "NXC",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "999",
                        "mdix-auto": false,
                        "hostname": "Robot-3560",
                        "interfaceName": "GigabitEthernet0/11",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/11"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e46708261683200b8bd327a",
            "updatedAt": "2020-02-14T10:03:46.442Z",
            "createdAt": "2020-02-14T10:03:46.162Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "4a0855e2-4f11-11ea-8f03-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 28,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4637ce61683200b8bd3279",
            "updatedAt": "2020-02-14T06:08:44.859Z",
            "createdAt": "2020-02-14T06:01:50.531Z",
            "item": "Data Center Modify Switch Config",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "7df7e669-4eef-11ea-8f03-0242ac1e0006",
            "description": "This service will process Port turn Up/Turn Down and VLAN for Nexus & Arista devices",
            "rollbackSourceOrderId": "",
            "orderNumber": 27,
            "__v": 0,
            "rollbackIds": [
                "5e463896f97c894146c1ce32"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "DC-N5548"
            ],
            "formData": {
                "connectionRow": [
                    {
                        "deviceType": "Nexus_5K",
                        "operationType": "Port Turn Down",
                        "interface": "Ethernet1/7",
                        "hostname": "DC-N5548"
                    }
                ],
                "userId": "admin",
                "crq": "CRQ000000001234",
                "nser": "11110000"
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e46337c61683200b8bd3278",
            "updatedAt": "2020-02-14T05:50:39.789Z",
            "createdAt": "2020-02-14T05:43:24.880Z",
            "item": "Data Center Modify Switch Config",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "eb1176c5-4eec-11ea-8f03-0242ac1e0006",
            "description": "This service will process Port turn Up/Turn Down and VLAN for Nexus & Arista devices",
            "rollbackSourceOrderId": "",
            "orderNumber": 26,
            "__v": 0,
            "rollbackIds": [
                "5e463451405387414b91f15e"
            ],
            "rollbackOrder": false,
            "configuredDevices": [
                "DC-N5548"
            ],
            "formData": {
                "connectionRow": [
                    {
                        "deviceType": "Nexus_5K",
                        "operationType": "Port Turn Down",
                        "interface": "Ethernet1/7",
                        "hostname": "DC-N5548"
                    }
                ],
                "userId": "admin",
                "crq": "CRQ000000001234",
                "nser": "11110000"
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e45806461683200b8bd3277",
            "updatedAt": "2020-02-13T16:59:16.864Z",
            "createdAt": "2020-02-13T16:59:16.667Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "2b5224a1-4e82-11ea-8f03-0242ac1e0006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 25,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4565f5a2bc3900bde4d5e5",
            "updatedAt": "2020-02-13T15:06:29.469Z",
            "createdAt": "2020-02-13T15:06:29.228Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "69948244-4e72-11ea-8f03-0242ac1e0006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 24,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e456579a2bc3900bde4d5e4",
            "updatedAt": "2020-02-13T15:04:26.059Z",
            "createdAt": "2020-02-13T15:04:25.908Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "2013106a-4e72-11ea-8f03-0242ac1e0006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 23,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USNJEWRBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00010",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e45639fa2bc3900bde4d5e3",
            "updatedAt": "2020-02-13T14:56:31.242Z",
            "createdAt": "2020-02-13T14:56:31.089Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "0511e0df-4e71-11ea-8f03-0242ac1e0006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 22,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USAZPHX01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USMABOS01IDE0001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKNX9K001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USTXHOU01R01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": ""
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0014",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0010",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0016",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0019",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0015",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0017",
                        "blc": ""
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNYJFKBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00011",
                        "blc": ""
                    },
                    {
                        "deviceName": "USNJEWRBR01FIE00010",
                        "blc": ""
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e45628761683200b8bd3276",
            "updatedAt": "2020-02-13T14:51:52.675Z",
            "createdAt": "2020-02-13T14:51:51.804Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "5eb909bb-4e70-11ea-8f03-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 21,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e45469061683200b8bd3275",
            "updatedAt": "2020-02-13T12:52:32.744Z",
            "createdAt": "2020-02-13T12:52:32.465Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "b35f05e3-4e5f-11ea-a61b-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 20,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e452a57a2bc3900bde4d5e2",
            "updatedAt": "2020-02-13T10:52:08.069Z",
            "createdAt": "2020-02-13T10:52:07.955Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e125d519-4e4e-11ea-a61b-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 19,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    },
                    {
                        "deviceName": "Ent-3560",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e452a26a2bc3900bde4d5e1",
            "updatedAt": "2020-02-13T10:51:18.283Z",
            "createdAt": "2020-02-13T10:51:18.131Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "c3751fb1-4e4e-11ea-a61b-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 18,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    },
                    {
                        "deviceName": "Ent-3560",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e45153461683200b8bd3274",
            "updatedAt": "2020-02-13T09:24:34.491Z",
            "createdAt": "2020-02-13T09:21:56.818Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "47dec07f-4e42-11ea-a61b-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 17,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    },
                    {
                        "deviceName": "Ent-3560",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "Complete"
        },
        {
            "_id": "5e45144e61683200b8bd3273",
            "updatedAt": "2020-02-13T09:18:06.495Z",
            "createdAt": "2020-02-13T09:18:06.345Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "be7c0163-4e41-11ea-a61b-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 16,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    },
                    {
                        "deviceName": "Ent-3560",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4513bca2bc3900bde4d5e0",
            "updatedAt": "2020-02-13T09:15:40.641Z",
            "createdAt": "2020-02-13T09:15:40.313Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "6774a644-4e41-11ea-a61b-0242ac1e0006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 15,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    },
                    {
                        "deviceName": "Ent-3560",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4502cea2bc3900bde4d5df",
            "updatedAt": "2020-02-13T08:03:26.509Z",
            "createdAt": "2020-02-13T08:03:26.147Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "502681ac-4e37-11ea-a61b-0242ac1e0006",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 14,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "test"
                    },
                    {
                        "deviceName": "Ent-3560",
                        "blc": "test"
                    },
                    {
                        "deviceName": "Ent-3650",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e44f50d61683200b8bd3272",
            "updatedAt": "2020-02-13T07:04:45.745Z",
            "createdAt": "2020-02-13T07:04:45.134Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "1d6f63f1-4e2f-11ea-a61b-0242ac1e0006",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 13,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e4463185273220110b2f9fa",
            "updatedAt": "2020-02-12T20:42:00.472Z",
            "createdAt": "2020-02-12T20:42:00.256Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "1e38b984-4dd8-11ea-afa0-0242ac1a0005",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 12,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "pid": "234",
                "crq": "CRQ123456789123",
                "switchportModeAccessRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "spanning-tree-portfast": true,
                        "switchportMode": "access",
                        "endpointType": "ATM",
                        "dot1xDeadVlan": "151",
                        "snmp-trap-link-status": false,
                        "speed": "auto",
                        "description": "test",
                        "dot1x": true,
                        "duplex": "auto",
                        "voiceVlan": "799",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "accessVlan": "151",
                        "mdix-auto": false,
                        "interfaceName": "GigabitEthernet0/37",
                        "isAddDateToDescription": true,
                        "isAddInterfaceToDescription": false,
                        "blc": "AK1-503",
                        "hostname": "Robot-3560",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/37"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43feb4bf9893011148c744",
            "updatedAt": "2020-02-12T13:33:40.401Z",
            "createdAt": "2020-02-12T13:33:40.083Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "47b348a2-4d9c-11ea-afa0-0242ac1a0005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 11,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "london"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "london"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43df0dbf9893011148c743",
            "updatedAt": "2020-02-12T11:18:38.262Z",
            "createdAt": "2020-02-12T11:18:37.980Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "6a8dd6d8-4d89-11ea-afa0-0242ac1a0005",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 10,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "1111",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [],
                "switchportModeTrunkRequests": [
                    {
                        "authentication-host-mode": "multi-domain",
                        "shutdown": false,
                        "3650PolicyOutput": "LINK.OUTPUT.POLICY",
                        "spanning-tree-portfast": false,
                        "switchportMode": "trunk",
                        "endpointType": "New Switch Connection",
                        "nativeVlan": "120",
                        "description": "any",
                        "udld-port": "enable",
                        "voiceVlan": "",
                        "3650PolicyInput": "UPLINK.INPUT.POLICY",
                        "allowedVlan": "1947",
                        "interfaceName": "GigabitEthernet0/10",
                        "isAddDateToDescription": false,
                        "isAddInterfaceToDescription": true,
                        "blc": "eeee",
                        "hostname": "Robot-3560",
                        "interfaceType": "GigabitEthernet",
                        "interfaceId": "0/10"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43dc7c5273220110b2f9f9",
            "updatedAt": "2020-02-12T20:40:42.522Z",
            "createdAt": "2020-02-12T11:07:40.025Z",
            "item": "Branch Modify Switch Configuration",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "e24c0d8e-4d87-11ea-afa0-0242ac1a0005",
            "description": "Modify switch configuration service is initiated when commissioning the switch port configuration to turn up the port to allow connection to one of the following endpoints in Branch domain.",
            "rollbackSourceOrderId": "",
            "orderNumber": 9,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "11111111",
                "pid": "1111",
                "crq": "CRQ111111111111",
                "switchportModeAccessRequests": [
                    {
                        "interfaceId": "0/1",
                        "interfaceType": "GigabitEthernet",
                        "hostname": "Robot-3560",
                        "blc": "test",
                        "isAddInterfaceToDescription": false,
                        "isAddDateToDescription": true,
                        "interfaceName": "GigabitEthernet0/1",
                        "mdix-auto": false,
                        "accessVlan": "999",
                        "3650PolicyInput": "PARENT.VOICE.DATA.MEDIA.VLAN",
                        "voiceVlan": "799",
                        "duplex": "auto",
                        "dot1x": true,
                        "description": "NXC",
                        "speed": "auto",
                        "snmp-trap-link-status": false,
                        "dot1xDeadVlan": "999",
                        "endpointType": "Port Shutdown",
                        "switchportMode": "access",
                        "spanning-tree-portfast": true,
                        "3650PolicyOutput": "ACCESS.OUTPUT.POLICY",
                        "shutdown": true,
                        "authentication-host-mode": "multi-domain"
                    }
                ],
                "switchportModeTrunkRequests": []
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43db945273220110b2f9f8",
            "updatedAt": "2020-02-12T11:03:48.231Z",
            "createdAt": "2020-02-12T11:03:48.052Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "580afc62-4d87-11ea-afa0-0242ac1a0005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 8,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "london"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "london"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43da3cbf9893011148c742",
            "updatedAt": "2020-02-12T10:58:04.385Z",
            "createdAt": "2020-02-12T10:58:04.213Z",
            "item": "Common Service CEWA",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "8b14489b-4d86-11ea-afa0-0242ac1a0005",
            "description": "This service takes pre snapshot, and pre-check commands on devices within a site affected by a planned power upgrade.  After the upgrade has been completed, the service will capture post snapshot, and post-check commands and provide the user the ability to compare pre and post results.",
            "rollbackSourceOrderId": "",
            "orderNumber": 7,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ111111111111",
                "workorderNumber": "Abcde",
                "type": "CEWA",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "london"
                    },
                    {
                        "deviceName": "USCASNALL01IDE0001",
                        "blc": "london"
                    },
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0016"
                    },
                    {
                        "deviceName": "USTXHOU3650BR011"
                    },
                    {
                        "deviceName": "USNCRDU4500IDE0018"
                    },
                    {
                        "deviceName": "USWASEALL02IDE0002"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43d1b05273220110b2f9f7",
            "updatedAt": "2020-02-12T10:21:36.154Z",
            "createdAt": "2020-02-12T10:21:36.032Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "72d54205-4d81-11ea-afa0-0242ac1a0005",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 6,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "test1",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43d0abbf9893011148c741",
            "updatedAt": "2020-02-12T10:17:15.740Z",
            "createdAt": "2020-02-12T10:17:15.612Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "d79d8a57-4d80-11ea-afa0-0242ac1a0005",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 5,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USWASEALL03IDE0003",
                        "blc": "test"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43c3f35273220110b2f9f6",
            "updatedAt": "2020-02-12T09:22:59.504Z",
            "createdAt": "2020-02-12T09:22:59.282Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "42b28a30-4d79-11ea-afa0-0242ac1a0005",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 4,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": false,
                "hostnames": [
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43ae525273220110b2f9f5",
            "updatedAt": "2020-02-12T07:50:42.362Z",
            "createdAt": "2020-02-12T07:50:42.178Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "5e4ef1c0-4d6c-11ea-afa0-0242ac1a0005",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 3,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43ac6c5273220110b2f9f4",
            "updatedAt": "2020-02-12T07:42:36.898Z",
            "createdAt": "2020-02-12T07:42:36.626Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "3cf610e3-4d6b-11ea-afa0-0242ac1a0005",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 2,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        },
        {
            "_id": "5e43abe8bf9893011148c740",
            "updatedAt": "2020-02-12T07:40:24.603Z",
            "createdAt": "2020-02-12T07:40:24.414Z",
            "item": "Common Service Sushil",
            "orderedBy": "be6592c0-66d7-49ab-8b7e-2900faf92954",
            "userName": "admin",
            "processInstanceId": "ee21dd09-4d6a-11ea-afa0-0242ac1a0005",
            "description": "Common Service Sushil",
            "rollbackSourceOrderId": "",
            "orderNumber": 1,
            "__v": 0,
            "rollbackIds": [],
            "rollbackOrder": false,
            "formData": {
                "nser": "12345678",
                "crq": "CRQ123456789123",
                "workorderNumber": "testing",
                "type": "Health Check",
                "deviceAuthorization": true,
                "hostnames": [
                    {
                        "deviceName": "USTXDFW3560IDE0018",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USWASEALL01IDE0001",
                        "blc": "3560_v1"
                    },
                    {
                        "deviceName": "USCASFO6500IDE0018",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USWASEA6500IDE01",
                        "blc": "6500_v1"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0015",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USAZPHX3650IDE0019",
                        "blc": "3650_v2"
                    },
                    {
                        "deviceName": "USNCRDU01IDE001",
                        "blc": "4500_v2"
                    }
                ]
            },
            "instanceHistory": [],
            "status": "In-process"
        }
    ];

    res.send(responseObj);

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

// Fetch Milestone of Active Services from Service Catalog microservice of BPA
router.post('/milestone', (req, res) => {

    responseObj.status = 'success';
    responseObj.msg = 'Successfully fetched Milestones';
    responseObj.body = [
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
        }

    ];
    res.send(responseObj);
});

//get Devices List for Device Manger Page
router.post('/device-manager', async (req, res) => {

    var DeviceData = await deviceManager.getDevices(req.body.vmIPAddress,req.body.nsoInstance, req.body.accessToken);
    res.send(DeviceData);
  
  });

// Ping Device from Device Manager
router.post('/ping-device', async (req, res) => {

  var PingData = await deviceManager.pingDevice(req.body.pingDeviceInfo.name,req.body.vmIPAddress,req.body.nsoInstance, req.body.accessToken, req.body.pingDeviceInfo );
  res.send(PingData);

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

//Fetch service items from service catalog
router.post('/service-item', async(req, res) => {

    var itemData = await serviceItems.getServiceItems(req.body.vmIPAddress,req.body.nsoInstance,req.body.accessToken);
    res.send(itemData);
});
    // console.log('POST /service-item: ', req.body);
    // const ServiceItemsModel = connObj.model('service-item', ServiceItemsSchema);

    // ServiceItemsModel.find({}, {}, {}, (err, docs) => {
    //     var ErrorFlag2;
    //     console.log('Err: ', err);
    //     // console.log('Docs: ', docs);

    //     if (!err && docs && (docs.length > 0)) {

    //         console.log('\nData is present in MongoDB');

    //         responseObj.status = 'Success';
    //         responseObj.msg = 'Successfully fetched Service Items';
    //         responseObj.body = docs;
    //         res.send(responseObj);
    //     } else {
    //         console.log('\nData is not present in MongoDB');

    //         getRequestOptions.url = `https://${req.body.vmIPAddress}/bpa/api/v1.0/service-catalog/service-items?_page=1&_limit=20&status=Active&order=asc`;
    //         getRequestOptions.headers.Authorization = `Bearer ${req.body.accessToken}`;

    //         request(getRequestOptions, function (error, response, itemsList) {

    //             console.log('\nResponse Error: ', error);
    //             console.log('\nResponse Body: ', itemsList);

    //             if (error) {
    //                 responseObj.status = 'Error';
    //                 responseObj.msg = `Error Occurred while fetching service items. Error Message: ${error}`;
    //                 responseObj.body = null;
    //                 res.send(responseObj);
    //             } else {
    //                 itemsList.data.forEach(item => {
    //                     //console.log('name res',item);
    //                     var serviceItemsObj = new ServiceItemsModel({
    //                         _id:item._id,
    //                         name:item.name,
    //                         description:item.description,
    //                         tags:[{name:item.tags.length > 0 ? item.tags[0]['name'] : '-'}],
    //                         categoryIds:[{description:item.categoryIds[0]['description'],_id:item.categoryIds[0]['_id'],name:item.categoryIds[0]['name']}]  , 
    //                         flag:false
    //                     });
    //                     serviceItemsObj.save(function(err) {
    //                         if (err) {
    //                             ErrorFlag2 = true;
    //                         }
    //                         else {
    //                             ErrorFlag2 = false;
    //                         }
    //                     });
                        
    //                 });
    //                     if (ErrorFlag2) {
    //                         responseObj.status = 'Error';
    //                         responseObj.msg = 'Error Occurred while Inserting Service items into MongoDB';
    //                         responseObj.body = null;
    //                     } else {
    //                         responseObj.status = 'Success';
    //                         responseObj.msg = 'Successfully fetched Service Items';
    //                         responseObj.body = itemsList.data;
    //                     }
    //                 }
    //                 res.send(responseObj); 
    //         });
            
    //     }
    // });

// Fetch Milestone of Active Services from Service Catalog microservice of BPA
router.post('/milestone', (req, res) => {


    responseObj.status = 'success';
    responseObj.msg = 'Successfully fetched Milestones';
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
    }
    res.send(
        responseObj
    )
})

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
