let expect = require('chai').expect;
let sinon = require('sinon');
let activeService = require('../controller/active-services').ActiveServiceData;

let response = {
    status: '',
    msg: '',
};

let req = { 
vmIPAddress : '10.122.32.86:9091',
accessToken : 'accessToken',
id : '5e717ef2ab2d7e010498d423'
}

let milestoneObj = [
    {
        updatedAt: '2020-03-18T01:52:44.639Z',
        createdAt: '2020-03-18T01:52:44.639Z',
        objectType: 'service-catalog-order',
        objectReference: '5e717ee14b975001362bc72a',
        milestone: 'Device Check-Sync',
        __v: 0,
        status: 'Complete'
    },
    {
        _id: '5e717ef2ab2d7e010498d423',
        updatedAt: '2020-03-18T01:52:50.843Z',
        createdAt: '2020-03-18T01:52:50.843Z',
        objectType: 'service-catalog-order',
        objectReference: '5e717ee14b975001362bc72a',
        milestone: 'Rollback Dryrun Review',
        __v: 0,
        execution: {
            type: 'dryrun',
            executionData: '5e717f3c14291b41f86493de',
            templateId: 'Dry-Run'
        },
        status: 'Complete'
    }
]

    describe('Active-services Controller',() => {
        let getMilestone = sinon.stub(activeService,'getMilestones');
        it('should fetch milestone - Success',(done) => {
            response.status = 'Success';
            response.msg = 'Fetching Successful';
            response.body = milestoneObj;
            getMilestone.withArgs(req).resolves(response);
            activeService.getMilestones(req).then((result) => {
                expect(result).to.equal(response);
                done();
            }).catch((err) =>{
                done(err);
            });
        });

        it('should fetch Service Orders- Error',(done) => {

            response.status = 'Error';
            response.msg = 'Error Occurred while fetching milestone List.';
            getMilestone.withArgs(req).rejects(response);
            activeService.getMilestones(req).catch( (error) => {
                expect(error.status).to.equal('Error');
                done();
            });
        });
    })