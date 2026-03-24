export const Webworker = url => {
    if (!url) return;
    let emit = () => console.log('No emit function defined for webworker');
    let uid = 1;
    let queue = [];
    let worker = new Worker(url);
    let process = (data, action = 'resolve') => {
        if (data.id) {
            let pr = queue.find(d => d.id === data.id);

            if (pr) {
                let index = queue.findIndex(d => d === pr);

                if (index) queue.splice(index, 1);
                pr[action](data);
                return true;
            } else {
                emit('ww-promise-error', data);
            }
        }
    };

    worker.onmessage = event => {
        let data = event.detail || event.data || {};

        if (process(data)) return;

        emit('ww-message' + (data.eventName ? ':' + data.eventName : ''), data);
    };

    worker.onerror = error => {
        console.error('WebWorker error:', error, worker);
        process(error, 'reject');

        emit('ww-error', error);
    };

    worker.sendPromise = (msg = {}) => {
        let id = msg.id || (msg.id = uid++);
        let pr = new Promise((resolve, reject) => {
            queue.push({ resolve, reject, id });
        });

        worker.postMessage(msg);
        return pr;
    };

    worker.send = worker.postMessage;

    worker.end = () => {
        worker.terminate();
        console.log('Worker ended', url);
        emit('ww-end');
        queue.forEach(d => d.reject('Worker promise rejected'));
        queue = null;
    };

    return {
        webworker: worker,
        webworker_available: false,
        init() {
            emit = this.$dispatch || emit;
        },
        destroy() {
            worker.end();
        }
    };
};