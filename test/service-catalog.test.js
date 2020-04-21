let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let service_catalog = require('../controller/service-catalog').ServiceCatalogData;


let response = {
    status: '',
    msg: '',
};

let req = { 
    vmIPAddress : '10.122.32.86:9091',
    accessToken : 'accessToken',
    }


let category_record = [
    {
      "_id": "5e43a65d0a5e10018ff9cc06",
      "updatedAt": "2020-02-12T07:16:45.595Z",
      "createdAt": "2020-02-12T07:16:45.595Z",
      "name": "Enterprise Services",
      "description": "Enterprise Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65dde78ef018a9948c1",
      "updatedAt": "2020-02-12T07:16:45.634Z",
      "createdAt": "2020-02-12T07:16:45.634Z",
      "name": "Core Services",
      "description": "Core Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65d0a5e10018ff9cc07",
      "updatedAt": "2020-02-12T07:16:45.674Z",
      "createdAt": "2020-02-12T07:16:45.674Z",
      "name": "Collaboration Services",
      "description": "Services to update and add collaboration features",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65dde78ef018a9948c2",
      "updatedAt": "2020-02-12T07:16:45.731Z",
      "createdAt": "2020-02-12T07:16:45.731Z",
      "name": "Branch Services",
      "description": "Branch Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    },
    {
      "_id": "5e43a65d0a5e10018ff9cc08",
      "updatedAt": "2020-02-12T07:16:45.754Z",
      "createdAt": "2020-02-12T07:16:45.754Z",
      "name": "Common Services",
      "description": "Common Services",
      "__v": 0,
      "status": "Active",
      "parentId": "0"
    }];


describe('service-catalog controller', () => {
    let serviceCategory = sinon.stub(service_catalog, 'getServiceCategory');
    let selectFav = sinon.stub(service_catalog, 'selectFavitems');
    let deleteFav = sinon.stub(service_catalog, 'deleteFavitems');

    it('Fetch service categories - Success' ,(done) => {
        response.status = 'Success';
        response.msg = 'Successfully fetched service categories';
        response.body = category_record;
        serviceCategory.withArgs(req).resolves(response);
        service_catalog.getServiceCategory(req).then( (result) => {
            expect(result).to.equal(response);
            done();
        }).catch((err) =>{
            done(err);
        });
});
    it('Fetch service categories - Error' ,(done) => {
        response.status = 'Error';
        response.msg = 'Error Occurred while fetching service categories';
        response.body = category_record;
        serviceCategory.withArgs(req).rejects(response);
        service_catalog.getServiceCategory(req).catch( (error) => {
            expect(error.status).to.equal('Error');
            done();
        });
});

    it('Select service item as favourite- Success',(done) => {

        response.status = 'Success';
        response.msg = 'Successfuly added to favourites';
        selectFav.withArgs(req).resolves(response);
        service_catalog.selectFavitems(req).then( (result) => {
            expect(result.status).to.equal('Success');
            done();
        }).catch((err) =>{
            done(err);
        });
    });

    it('Select service item as favourite - Error',(done) => {

        response.status = 'Error';
        response.msg = 'Error Occurred while adding service to favourites';
        selectFav.withArgs(req).rejects(response);
        service_catalog.selectFavitems(req).catch( (error) => {
            expect(error.status).to.equal('Error');
            done();
        });
    });

    it('Delete service item from favourites- Success',(done) => {

        response.status = 'Success';
        response.msg = 'Successfuly deleted from favourites';
        deleteFav.withArgs(req).resolves(response);
        service_catalog.deleteFavitems(req).then( (result) => {
            expect(result.status).to.equal('Success');
            done();
        }).catch((err) =>{
            done(err);
        });
    });

    it('Delete service item from favourites- Error',(done) => {

        response.status = 'Error';
        response.msg = 'Error Occurred while deleting services from favourites';
        deleteFav.withArgs(req).rejects(response);
        service_catalog.deleteFavitems(req).catch( (error) => {
            expect(error.status).to.equal('Error');
            done();
        });
    });

});
