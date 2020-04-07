const sinon = require('sinon');
const expect = require('chai').expect;
const serviceItem = require('../controller/service-item').ServiceItemData;

let vmIPAddress = '10.122.32.86:9091';
let nsoInstance = 'RTP-Core-1,nso5-lsa3-rd';
let accessToken = 'accessToken';

let serviceitemsobj = [
    {
        _id: "5e43a666de78ef018a9948c4",
        name: "Refresh Cisco IP Phone",
        description: "Refresh Cisco IP Phone",
        tags:[
            {
              _id: "5e7e1307ee20442874cd653b",
              name: "collaboration"
            }
        ],
        categoryIds:[
            {
                description: "Services to update and add collaboration features",
                _id: "5e43a65d0a5e10018ff9cc07",
                name: "Collaboration Services"
            }
        ],
        flag: true,
        __v: 0
    }
]

let response = {
    status: '',
    msg: '',
};


describe('Service-Items Controller',() => {
    let getServiceItems = sinon.stub(serviceItem,'getServiceItems');
    it('should fetch Service Items- Success',(done) => {
        response.status = 'Success';
        response.msg = 'Fetching Successful';
        response.body = serviceitemsobj;
        getServiceItems.withArgs(vmIPAddress,accessToken).resolves(response);
        serviceItem.getServiceItems(vmIPAddress,accessToken).then( (result) => {
            expect(result).to.equal(response);
            done();
        }).catch((err) =>{
            done(err);
        });
    });

    it('should fetch Service Items- Error',(done) => {

        response.status = 'Error';
        response.msg = 'Error Occurred while fetching service items List.';
        getServiceItems.withArgs(vmIPAddress,accessToken).rejects(response);
        serviceItem.getServiceItems(vmIPAddress,accessToken).catch( (error) => {
            expect(error.status).to.equal('Error');
            done();
        });
    });
    
    })
