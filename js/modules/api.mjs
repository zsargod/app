import toQueryString from './to-query-string.mjs';
import pathToRegexp from './lib/path-to-regexp.mjs';

function parseObjectSafe(obj, isTostring = false) {
    Object.keys(obj).forEach(key => {
        obj[key] = isTostring ? String(obj[key]) : parseJSONSafe(obj[key]);
    });

    return obj;
}

function parse(url, { query, params } = {}) {
    let newUrl;
    let implicitQuery = url.split('?')[1];
    let queryString = (query ? '?' + toQueryString(query) : '') + (implicitQuery ? (query ? '&' : '?') + implicitQuery : '');
    newUrl = pathToRegexp.compile(url.split('?')[0])(parseObjectSafe(params || {}, true));

    return newUrl + queryString;
};

function getFilenameFromHeader(response) {
    if (!response.headers) return;
    const header = response.headers.get('Content-Disposition');
    if (header) {
        const parts = header.split(';');
        return parts[1].split('=')[1].replace(/"/g, '');
    }
}

const download = (response, filename) => {
    return response.clone().blob().then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || getFilenameFromHeader(response) || 'download';
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    });
};

const fetchStream = async function fetchStream(req, emit = () => null) {
    emit('api-start', req);
    const response = await req;

    if (!response.body) {
        let error = 'ReadableStream not supported in this environment.';

        emit('api-error', error);
        throw new Error(error);
    }

    const reader = response.clone().body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert Uint8Array chunks into text
        let chunk = decoder.decode(value, { stream: true });
        emit('api-chunk', value);
        emit('api-chunk-text', chunk);
    }

    // Final decode (flushes buffer)
    if (response.ok) {
        emit('api-response', response.clone());
        return req;
    } else {
        emit('api-error', response.clone());
        throw new Error(response);
    }
};

const module = (url, options = {}, emit) => ({
    fetch: () => {
        let request = fetch(parse(url, options), options);

        return fetchStream(request, emit);
    },
    options(newOptions) { return module(url, Object.assign({}, options, newOptions), emit); },
    headers(newHeaders) { return module(url, Object.assign({}, options, { headers: Object.assign({}, options.headers, newHeaders) }), emit); },
    send(data, id) {
        let body = data instanceof FormData ? data : JSON.stringify(data);
        let newOptions = Object.assign({}, options, { method: options.method || (id ? 'PATCH' : (data.id ? 'PUT' : 'POST')), body });

        newOptions.headers = Object.assign({}, options.headers, { 'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json' });
        newOptions.params = Object.assign({}, newOptions.params, { id: id || data.id || '' });
        
        return module(url, newOptions, emit).fetch();
    },
    download,
    then(cb) { return this.fetch().then(cb); },
});

export default module;