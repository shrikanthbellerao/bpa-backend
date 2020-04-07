const request = require('request');
const sinon = require('sinon');
const expect = require('chai').expect;
const ServiceItemData = require('../controller/service-item').getServiceItems;
const Serviceitemsmodel = require('../model/service-item.model').Serviceitemsmodel
describe('with Mock: data present in DB',() => {
    it('should fetch data from mock DB',(done) => {
        const serviceitemsobj = [
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
            },
            {
                _id: "5e43a66c0a5e10018ff9cc0b",
                name: "Link Route Away/Restore Management",
                description: "This service provides core link route away and route restore operations.",
                tags:[
                    {
                        _id: "5e7e1307ee20442874cd653c",
                        name: "core service"
                    }
                ],
                categoryIds:[
                    {
                        description: "Core Services",
                        _id: "5e43a65dde78ef018a9948c1",
                        name: "Core Services"
                    } 
                ],
                flag: false,
                __v: 0
            },
            {
                _id: "5e43a6940a5e10018ff9cc11",
                name: "Enterprise IDE Switch Provisioning",
                description: "This service will be used to refresh an existing Catalyst 6500 IDE Switches to Catalyst 4500 IDE Switches and Catalyst 3560 IDE Switches to Catalyst 3650 IDE Switches, Net new deployemnt of Catalyst 4500 and Catalyst 3650 IDE Switches.",
                tags: [
                    {
                        _id: "5e7e1307ee20442874cd6544",
                        name: "enterprise"
                    }
                ],
                categoryIds: [
                    {
                        description: "Enterprise Services",
                        _id: "5e43a65d0a5e10018ff9cc06",
                        name: "Enterprise Services"
                    }
                ],
                flag: true,
                __v: 0
            }
        ]
        var responseObj = {
            status: '',
            msg: '',
            body: null
        };

        responseObj = await ServiceItemData.getServiceItems(null,null).then((items) => {
            items.
        })
        
       });
    })
