const app = require("../app");
const chai = require("chai");
var should = chai.should();
const sinon = require('sinon');
const myProfile = app.use(require('../controller/my-profile'));
const ProfileModel = require('../model/support-detail.model');
var httpMocks = require('node-mocks-http');

describe(' Testing Support APIs', function () {

    it('should fetch the admin details', function (done) {

        var req = httpMocks.createRequest({
            method: 'GET',
            url: '/admin',
            body: {}
        });
        var res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        myProfile(req, res);
        var ProfileMock = sinon.mock(ProfileModel);
        var expectedResult = {
            "Username": "abcd",
            "Role": "Developer"
        };
        ProfileMock.expects('findOne').withArgs({
            AccessType: "Admin"
        }).yields(null, expectedResult);
        ProfileModel.findOne({
            AccessType: "Admin"
        }, function (err, result) {
            ProfileMock.verify();
            ProfileMock.restore();
            should.equal(expectedResult, result);
            done();
        });
    })
    it('should fetch the demo user details', function (done) {

        var req = httpMocks.createRequest({
            method: 'GET',
            url: '/demo',
            body: {}
        });
        var res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        myProfile(req, res);
        var ProfileMock = sinon.mock(ProfileModel);
        var expectedResult = {
            "Username": "abcd",
            "Role": "Developer"
        };
        ProfileMock.expects('findOne').withArgs({
            AccessType: "User"
        }).yields(null, expectedResult);
        ProfileModel.findOne({
            AccessType: "User"
        }, function (err, result) {
            ProfileMock.verify();
            ProfileMock.restore();
            should.equal(expectedResult, result);
            done();
        });
    })
});