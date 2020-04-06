const app = require("../app");
var appConfig = app.use(require('../controller/app-config'));
const chai = require("chai");
var should = chai.should();
var httpMocks = require('node-mocks-http');

describe(' Testing Broadcast APIs', function(){

  it('should fetch the broadcast message',function(done){
    var req = httpMocks.createRequest({
      method:'GET',
      url: '/broadcast-message',
      body: {}
    });
    var res = httpMocks.createResponse({
      eventEmitter:require('events').EventEmitter,
      body: {
        broadcastMessage: 'hello'
      }
    });
    appConfig(req,res);
    res.on('end',function(){
      res.statusCode.should.be.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('broadcastMessage').contain('hello')
    });
    done();
  })

  it('should update the broadcast message',function(done){
    var req = httpMocks.createRequest({
      method:'PUT',
      url: '/broadcast-message',
      body: {
        broadcastMessage: "hi"
      }
    });
    var res = httpMocks.createResponse({
      eventEmitter:require('events').EventEmitter
    });
    appConfig(req,res);
    res.on('end',function(){
      res.statusCode.should.be.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('broadcastMessage').contain('hi')
    });
    done();
  });
})
