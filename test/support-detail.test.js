const app = require("../app");
const chai = require("chai");
var should = chai.should();
const sinon = require('sinon');
const techSupport = app.use(require('../controller/tech-support'));
const SupportModel = require('../model/support-detail.model');
var httpMocks = require('node-mocks-http');

describe(' Testing Support APIs', function () {

    it('should fetch the support details', function (done) {

        var req = httpMocks.createRequest({
            method: 'GET',
            url: '/techSupport',
            body: {}
        });
        var res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        techSupport(req, res);
        var SupportMock = sinon.mock(SupportModel);
        var expectedResult = [{
            "SupportHeading": "Software Support",
            "Content": "Software Support Content"
        }];
        SupportMock.expects('find').yields(null, expectedResult);
        SupportModel.find(function (err, result) {
            SupportMock.verify();
            SupportMock.restore();
            should.equal(expectedResult, result);
            done();
        });
    })
});