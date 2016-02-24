var chakram = require('chakram'),
    expect = chakram.expect,
    dd = require('data-driven'),
    creds = require('../credentials'),
    testData = require('../testdata')(creds),
    schemas = require('../schemas'),
    extend = require('util')._extend;

chakram.setRequestDefaults({
    baseUrl: creds.apiUrl + '/' + creds.merchant_id,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    auth: {
        user: creds.merchant_id + '',
        pass: creds.api_key
    }
});

describe('Xsolla API', function () {
    describe('Promotions', function () {
        describe('Create/Get', function () {
            dd(testData.correctPromotionsOpts, function () {
                it('should create/get promotion when {description}', function (promotion) {
                    return chakram.post('/promotions', promotion.options).then(function (res) {
                        var id = res.body.id;
                        expect(res).to.have.status(201);
                        expect(res).to.have.schema(schemas.createPromotionResponse);
                        return chakram.get('/promotions/' + id).then(function (res) {
                            var expectedJson = extend({}, promotion.options);
                            expectedJson.technical_name += '';
                            expect(res).to.have.status(200);
                            expect(res).to.comprise.of.json(expectedJson);
                            expect(res).to.have.schema(schemas.getPromotionResponse);
                        });
                    });
                });
            });
            dd(testData.incorrectPromotionsOpts, function () {
                it('should not create promotion when {description}', function (promotion) {
                    var res = chakram.post('/promotions', promotion.options);
                    expect(res).not.to.have.schema(schemas.createPromotionResponse);
                    expect(res).not.to.have.status(201);
                    return chakram.wait();
                });
            });
        });
        describe('Delete', function () {
            it('should delete a promotion', function () {
                return chakram.post('/promotions', testData.correctPromotionsOpts[0]['options']).then(function (res) {
                    var id = res.body.id;
                    return chakram.delete('/promotions/' + id).then(function (res) {
                        expect(res).to.have.status(204);
                        var getRes = chakram.get('/promotions/' + id);
                        return expect(getRes).to.have.status(404);
                    });
                });
            });
        });
        describe('Get list', function () {
            beforeEach('delete all promotions', function () {
                var promise, promises = [];
                return chakram.get('/promotions').then(function (res) {
                    res.body.forEach(function(obj) {
                        promise = chakram.delete('/promotions/' + obj.id);
                        promises.push(promise);
                    });
                    return chakram.all(promises);
                });
            });
            dd([ {val:0},{val:1},{val:2} ], function () {
                it('should return list with {val} item(s)', function (count) {
                    var ids = [], promises = [], promise, i;
                    for (i = 0; i < count.val; i++) {
                        promise = chakram.post('/promotions', testData.correctPromotionsOpts[count.val]['options']).then(function (res) {
                            ids.push(res.body.id);
                        });
                        promises.push(promise);
                    }
                    return chakram.all(promises).then(function () {
                        return chakram.get('/promotions').then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.schema(schemas.getAllPromotionsResponse);
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