
const axios = require('axios');
class CoreApi {
    constructor() {

    }

    post(url, params) {
        let headers = { 'content-type': 'application/json' };
        return new Promise((resolve, reject) => {
            const options = {
                method: 'POST',
                headers: headers,
                data: params,
                url: url,
            };
            axios(options).then(res => {
                console.log('post', res.data);
                resolve(res.data);
            }, err => {
                if (err && err.response && err.response.data)
                    reject(err.response.data);
                reject(err);
            });
        })
    }

    get(url, params) {
        let headers = {};
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                headers: headers,
                url: url,
                params: params
            };
            axios(options).then(res => {
                resolve(res.data);
            }, err => {
                if (err && err.response && err.response.data)
                    reject(err.response.data);
                reject(err);
            });
        })
    }
}

module.exports = CoreApi;