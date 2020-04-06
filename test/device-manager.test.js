let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let device_manager = require('../controller/device-manager').DeviceManagerData;


let response = {
    status: '',
    msg: '',
};

let vmIPAddress = '10.122.32.86:9091';
let nsoInstance = 'RTP-Core-1,nso5-lsa3-rd';
let accessToken = 'accessToken'

let deviceInfo = {
    _id: '5e7cb01313c1900b70c0cca7',
    name: 'Ent-6509',
    description: 'physical_WS-C6509-E',
    address: '10.122.32.71',
    port: '22',
    authgroup: 'enterprise_local',
    ned_id: 'cisco-ios-cli-6.38:cisco-ios-cli-6.38',
    protocol: 'ssh',
    latitude: '',
    longitude: '',
    controller_id: 'RTP-Core-1',
    sub_controller_id: 'nso5-lsa3-re'
    };

   let wrongDeviceInfo = {
       name:'Ent-9999'
   }


describe('device-manager', () => {
    let editDevice = sinon.stub(device_manager, 'editDevice');
    let pingDevice = sinon.stub(device_manager, 'pingDevice');
    let getDevices = sinon.stub(device_manager, 'getDevices');
    it('Edit Details of Devices in Mongo DB - Success' ,(done) => {
        response.status = 'Success';
        response.msg = 'Update Document Success';
        editDevice.withArgs(deviceInfo).resolves(response);
        device_manager.editDevice(deviceInfo).then( (result) => {
            expect(result.status).to.equal('Success');
            done();
        }).catch((err) =>{
            done(err);
        });
});
    it('Edit Details of Devices in Mongo DB - Error' ,(done) => {
        response.status = 'Error';
        response.msg = 'Error Occurred while Updating Document';
        editDevice.withArgs(wrongDeviceInfo).rejects(response);
        device_manager.editDevice(wrongDeviceInfo).catch( (error) => {
            expect(error.status).to.equal('Error');
            done();
        });
});

    it('Fetch Ping Response of Device - Success',(done) => {

        response.status = 'Success';
        response.msg = 'Ping Successful';
        response.body = {
            deviceName: deviceInfo.name,
            pingResponse: 'PING 10.122.32.71 (10.122.32.71) 56(84) bytes of data.64 bytes from 10.122.32.71: icmp_seq=1 ttl=254 time=0.498 ms--- 10.122.32.71 ping statistics ---1 packets transmitted, 1 received, 0% packet loss, time 0msrtt min/avg/max/mdev = 0.498/0.498/0.498/0.000 ms'
                };
        pingDevice.withArgs(deviceInfo).resolves(response);
        device_manager.pingDevice(deviceInfo).then( (result) => {
            expect(result.body.deviceName).to.equal(deviceInfo.name);
            done();
        }).catch((err) =>{
            done(err);
        });
    });
    it('Fetch Ping Response of Device - Error',(done) => {

        response.status = 'Error';
        response.msg = 'Error Occurred while Pinging Device.';
        pingDevice.withArgs(wrongDeviceInfo).rejects(response);
        device_manager.pingDevice(wrongDeviceInfo).catch( (error) => {
            expect(error.status).to.equal('Error');
            done();
        });
    });

    it('Fetch Device List - Success',(done) => {

        response.status = 'Success';
        response.msg = 'Fetching Successful';
        response.body = deviceInfo;
        getDevices.withArgs(vmIPAddress, nsoInstance, accessToken).resolves(response);
        device_manager.getDevices(vmIPAddress, nsoInstance, accessToken).then( (result) => {
            expect(result).to.equal(response);
            done();
        }).catch((err) =>{
            done(err);
        });
    });

    it('Fetch Device List - Error',(done) => {

        response.status = 'Error';
        response.msg = 'Error Occurred while Fetching Device List.';
        getDevices.withArgs(vmIPAddress, nsoInstance, accessToken).rejects(response);
        device_manager.getDevices(vmIPAddress, nsoInstance, accessToken).catch( (error) => {
            expect(error.status).to.equal('Error');
            done();
        });
    });
});
