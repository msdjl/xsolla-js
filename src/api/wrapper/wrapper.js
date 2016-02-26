var Q = require('q');
var chakram = require('chakram');

module.exports = function (creds) {
    var requestOptions = {
        baseUrl: creds.apiUrl + '/' + creds.merchant_id,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        auth: {
            user: creds.merchant_id + '',
            pass: creds.api_key
        }
    };
    var http = {
        get: function (url) {
            return chakram.get(url, requestOptions);
        },
        delete: function (url) {
            return chakram.delete(url, {}, requestOptions);
        },
        post: function (url, data) {
            return chakram.post(url, data, requestOptions);
        }
    };
    return {
        promotions: {
            get: function (id) {
                return http.get('/promotions/' + id);
            },
            getAll: function () {
                return http.get('/promotions');
            },
            getCount: function () {
                return this.getAll()
                    .then(function (res) {
                        return res.body.length;
                    });
            },
            post: function (options) {
                return http.post('/promotions', options);
            },
            postAll: function (arrayOfOptions) {
                var self = this;
                if (arrayOfOptions.length == 0) {
                    return Q([]);
                }
                return Q.all(arrayOfOptions.map(function (options) {
                    return self.post(options);
                })).then(function (responses) {
                    return responses.map(function (response) {
                        return response.body.id;
                    });
                });
            },
            delete: function (id) {
                return http.delete('/promotions/' + id);
            },
            deleteAll: function () {
                var self = this;
                return self.getAll()
                    .then(function (res) {
                        return Q.all(res.body.map(function (promotion) {
                            return self.delete(promotion.id);
                        }));
                    });
            }
        }
    };
};