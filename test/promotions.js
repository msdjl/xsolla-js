var chakram = require('chakram'),
    expect = chakram.expect,
    dd = require('data-driven'),
    creds = require('../credentials'),
    testData = require('../testdata')(creds),
    schemas = require('../schemas'),
    extend = require('util')._extend,
    promotions = require('../src/api/wrapper/wrapper')(creds).promotions;

describe('Xsolla API', function () {
    describe('Promotions', function () {
        describe('Create/Get', function () {
            dd(testData.correctPromotionsOpts, function () {
                it('should create/get promotion when {description}', function (promotion) {
                    return promotions.post(promotion.options).then(function (res) {
                        var id = res.body.id;
                        expect(res)
                            .to.have.status(201)
                            .to.have.schema(schemas.createPromotionResponse);
                        return promotions.get(id).then(function (res) {
                            var expectedJson = extend({}, promotion.options);
                            expectedJson.technical_name += '';
                            expect(res)
                                .to.have.status(200)
                                .to.comprise.of.json(expectedJson)
                                .to.have.schema(schemas.getPromotionResponse);
                        });
                    });
                });
            });
            dd(testData.incorrectPromotionsOpts, function () {
                it('should not create promotion when {description}', function (promotion) {
                    var res = promotions.post(promotion.options);
                    return expect(res)
                        .not.to.have.schema(schemas.createPromotionResponse)
                        .not.to.have.status(201);
                });
            });
        });
        describe('Delete', function () {
            it('should delete a promotion', function () {
                return promotions.post(testData.correctPromotionsOpts[0]['options']).then(function (res) {
                    var id = res.body.id;
                    return promotions.delete(id).then(function (res) {
                        expect(res).to.have.status(204);
                        var getRes = promotions.get(id);
                        return expect(getRes).to.have.status(404);
                    });
                });
            });
        });
        describe('Get list', function () {
            beforeEach('delete all promotions', function () {
                return promotions.deleteAll();
            });
            dd([ {val:0},{val:1},{val:2} ], function () {
                it('should return list with {val} item(s)', function (count) {
                    var arrayOfOptions = testData.correctPromotionsOpts.slice(0, count.val).map(function(testObject) {
                        return testObject.options;
                    });
                    return promotions.postAll(arrayOfOptions).then(function (ids) {
                        return promotions.getAll().then(function (res) {
                            expect(res)
                                .to.have.status(200)
                                .to.have.schema(schemas.getAllPromotionsResponse);
                            expect(res.body).to.have.length(count.val);
                            var actual = res.body.map(function (obj) {
                                return obj.id;
                            });
                            expect(actual.sort()).to.deep.equal(ids.sort());
                        });
                    });
                });
            });
        });
    });
});