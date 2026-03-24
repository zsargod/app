let methods = {};
let post, workerLoaded;
let kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());

const getProp = (object = {}, keys = '', defaultVal) => {
    keys = Array.isArray(keys) ? keys : keys.split('.');
    object = object ? object[keys[0]] : undefined;
    if (object && keys.length > 1) {
        let obj = getProp(object, keys.slice(1), defaultVal);

        return obj && obj.bind ? obj.bind(object) : obj;
    }
    return object === undefined ? defaultVal : object;
};
const listener = ev => {
    let data = ev.data || ev.detail || {};
    let method = getProp(methods, data.method);
    let send = (r, error) => {
        post({ id: data.id, result: r, error });
    };
    let params = data.params;

    if (method) {
        let result = typeof method === 'function' ? method(params) : method;

        if (result instanceof Promise) {
            result.then(res => send(res)).catch(err => send(null, err));
        } else {
            send(result);
        }
    } else {
        console.log('Method(s) is missing', data.method);
    }
};

if (typeof WorkerGlobalScope == 'undefined') {
    const embed = window.frameElement;
    const iframe = (embed || window);
    const urlParams = new URLSearchParams(window.location.search);

    post = (data) => {
        window.parent.postMessage(data, '*');
    };

    iframe.addEventListener('message', listener, false);
    iframe.addEventListener('load', () => post({ eventName: 'iframe-loaded' }), false);
} else {
    workerLoaded = () => postMessage({
        eventName: 'init'
    });
    post = postMessage;
    onmessage = listener;
}