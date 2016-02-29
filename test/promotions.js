"use strict";
const chakram = require('chakram'),
    expect = chakram.expect,
    dd = require('data-driven'),
    creds = require('../credentials'),
    testData = require('../testdata')(creds),
    schemas = require('../schemas'),
    extend = require('util')._extend,
    promotions = require('../src/api/wrapper/wrapper')(creds).promotions,
    co = require('co');

describe('Xsolla API', function () {
    describe('Promotions', function () {
        describe('Create/Get', function () {
            dd(testData.correctPromotionsOpts, function () {
                it('should create/get promotion when {description}', function (promotion) { return co(function* (){
                    let postResponse = yield promotions.post(promotion.options);
                    expect(postResponse)
                        .to.have.status(201)
                        .to.have.schema(schemas.createPromotionResponse);
                    let promotionId = postResponse.body.id;
                    let getResponse = yield promotions.get(promotionId);
                    let expectedJson = extend({}, promotion.options);
                    expectedJson.technical_name += '';
                    expect(getResponse)
                        .to.have.status(200)
                        .to.comprise.of.json(expectedJson)
                        .to.have.schema(schemas.getPromotionResponse);
                })});
            });
            dd(testData.incorrectPromotionsOpts, function () {
                it('should not create promotion when {description}', function (promotion) {
                    let postResponse = promotions.post(promotion.options);
                    return expect(postResponse)
                        .not.to.have.schema(schemas.createPromotionResponse)
                        .not.to.have.status(201);
                });
            });
        });
        describe('Delete', function () {
            it('should delete a promotion', function () { return co(function* () {
                let postResponse = yield promotions.post(testData.correctPromotionsOpts[0]['options']);
                let promotionId = postResponse.body.id;
                let deleteResponse = yield promotions.delete(promotionId);
                expect(deleteResponse).to.have.status(204);
                let getResponse = yield promotions.get(promotionId);
                expect(getResponse).to.have.status(404);
            })});
        });
        describe('Get list', function () {
            beforeEach('delete all promotions', function () {
                return promotions.deleteAll();
            });
            dd([ {val:0},{val:1},{val:2} ], function () {
                it('should return list with {val} item(s)', function (count) { return co(function* () {
                    let arrayOfOptions = testData.correctPromotionsOpts.slice(0, count.val).map( obj => obj.options );
                    let expectedIds = yield promotions.postAll(arrayOfOptions);
                    let getAllResponse = yield promotions.getAll();
                    expect(getAllResponse)
                        .to.have.status(200)
                        .to.have.schema(schemas.getAllPromotionsResponse);
                    expect(getAllResponse.body).to.have.length(count.val);
                    let actualIds = getAllResponse.body.map( obj => obj.id );
                    expect(actualIds.sort()).to.deep.equal(expectedIds.sort());
                })});
            });
        });
    });
});