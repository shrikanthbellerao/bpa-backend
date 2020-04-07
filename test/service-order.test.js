let expect = require('chai').expect;
let sinon = require('sinon');
let serviceOrder = require('../controller/service-order').ServiceOrderData;

let response = {
    status: '',
    msg: '',
};

let vmIPAddress = '10.122.32.86:9091';
let nsoInstance = 'RTP-Core-1,nso5-lsa3-rd';
let accessToken = 'accessToken';

var serviceordersobj = [
    {
      formData: [
        {
          crq: "CRQ111111111135"
        }
      ],
      orderNumber: 191,
      item: "Common Service CEWA",
      createdAt: "2020-03-13T05:52:02.897Z",
      updatedAt: "2020-03-13T05:52:03.834Z",
      status: "In-process",
    }
]

    describe('Service-orders Controller',() => {
        let getOrders = sinon.stub(serviceOrder,'getOrders');
        it('should fetch service-orders - Success',(done) => {
            response.status = 'Success';
            response.msg = 'Fetching Successful';
            response.body = serviceordersobj;
            getOrders.withArgs(vmIPAddress,accessToken).resolves(response);
            serviceOrder.getOrders(vmIPAddress,accessToken).then( (result) => {
                expect(result).to.equal(response);
                done();
            }).catch((err) =>{
                done(err);
            });
        });

        it('should fetch Service Orders- Error',(done) => {

            response.status = 'Error';
            response.msg = 'Error Occurred while fetching service orders List.';
            getOrders.withArgs(vmIPAddress,accessToken).rejects(response);
            serviceOrder.getOrders(vmIPAddress,accessToken).catch( (error) => {
                expect(error.status).to.equal('Error');
                done();
            });
        });
    })