import Api from '../api.mjs';
import csv from '../csv.mjs';

export const api = function () {
    let data;
    const args = [...arguments];

    return data = {
        api_fetch(url, options = {}) {
            return Api(url, options, this.$dispatch);
        },
        api_resolve: (key, filename) => response => key === 'download' ? (Api().download(response, filename), response) : response[key](),
        api_value: key => response => response[key],
        api_csv: response => typeof response === 'string' ? csv(response) : response.text().then(text => csv(text)),
        api_set(key) {
            let that = this;
            return response => that[key] = response;
        },
        api_event(name) {
            return response => (this.$dispatch(name, response.clone()), response);
        },
        init() {
            Object.assign(data, ...args);
        }
    };
};