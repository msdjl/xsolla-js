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
    before('define responses', function () {
        chakram.addMethod('errorResponse', function (res, code) {
            expect(res)
                .to.have.schema(schemas.error)
                .to.have.status(code)
                .to.have.json('http_status_code', code);
        });
    });
    describe('Promotions', function () {
        before('define responses', function () {
            chakram.addProperty('createPromotionResponse', function (res) {
                expect(res)
                    .to.have.status(201)
                    .to.have.schema(schemas.createPromotionResponse);
            });
            chakram.addProperty('getPromotionResponse', function (res) {
                expect(res)
                    .to.have.status(200)
                    .to.have.schema(schemas.getPromotionResponse);
            });
            chakram.addProperty('getAllPromotionsResponse', function (res) {
                expect(res)
                    .to.have.status(200)
                    .to.have.schema(schemas.getAllPromotionsResponse);
            });
            chakram.addProperty('deletePromotionResponse', function (res) {
                expect(res).to.have.status(204);
                expect(res.body).to.be.empty;
            });
        });
        describe('Create promotion', function () {
            dd(testData.correctPromotionsOpts, function () {
                it('should return correct response schema when {description}', function (promotion) {
                    let postResponse = promotions.post(promotion.options);
                    return expect(postResponse).to.be.a.createPromotionResponse;
                });
            });
            dd(testData.incorrectPromotionsOpts, function () {
                it('should return error 400 when {description}', function (promotion) {
                    let postResponse = promotions.post(promotion.options);
                    return expect(postResponse).to.be.an.errorResponse(400);
                });
            });
        });
        describe('Get promotion', function () {
            let correctResponses = Array.from(testData.correctPromotionsOpts);
            before('create some data', function () {
                return co(function* () {
                    for (let i = 0; i < correctResponses.length; i++) {
                        let res = yield promotions.post(correctResponses[i].options);
                        correctResponses[i].id = res.body.id;
                    }
                });
            });
            dd(correctResponses, function () {
                it('should return correct response schema when {description}', function (promotion) {
                    let getResponse = promotions.get(promotion.id);
                    return expect(getResponse).to.be.a.getPromotionResponse;
                });
            });
            dd(correctResponses, function () {
                it('should return data that was posted when {description}', function (promotion) {
                    let getResponse = promotions.get(promotion.id);
                    let expectedJson = extend({}, promotion.options);
                    expectedJson.technical_name += '';
                    return expect(getResponse).to.comprise.of.json(expectedJson);
                });
            });
        });
        describe('Delete promotion', function () {
            it('should delete a promotion', co.wrap(function* () {
                let postResponse = yield promotions.post(testData.correctPromotionsOpts[0]['options']);
                let promotionId = postResponse.body.id;
                let deleteResponse = yield promotions.delete(promotionId);
                expect(deleteResponse).to.be.a.deletePromotionResponse;
                let getResponse = yield promotions.get(promotionId);
                expect(getResponse).to.be.an.errorResponse(404);
            }));
        });
        describe('Get list of promotions', function () {
            beforeEach('delete all promotions', function () {
                return promotions.deleteAll();
            });
            dd([ {val:0},{val:1},{val:2} ], function () {
                it('should return correct response schema (list of {val} item(s))', co.wrap(function* (count) {
                    let arrayOfOptions = testData.correctPromotionsOpts.slice(0, count.val).map( obj => obj.options );
                    yield promotions.postAll(arrayOfOptions);
                    let getAllResponse = yield promotions.getAll();
                    expect(getAllResponse).to.be.a.getAllPromotionsResponse;
                }));
            });
            dd([ {val:1},{val:2} ], function () {
                it('should return data that was posted (list of {val} item(s))', co.wrap(function* (count) {
                    let arrayOfOptions = testData.correctPromotionsOpts.slice(0, count.val).map( obj => obj.options );
                    let expectedIds = yield promotions.postAll(arrayOfOptions);
                    let getAllResponse = yield promotions.getAll();
                    expect(getAllResponse.body).to.have.length(count.val);
                    let actualIds = getAllResponse.body.map( obj => obj.id );
                    expect(actualIds.sort()).to.deep.equal(expectedIds.sort());
                }));
            });
        });
    });
});