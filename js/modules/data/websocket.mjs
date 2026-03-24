export const Websocket = url => {
    if (!url) return;
    let emit = () => console.log('No emit function defined for websocket');
    let uid = 1;
    let queue = [];
    let socket = new WebSocket(url);
    let process = (data, action = 'resolve') => {
        if (data.id) {
            let pr = queue.find(d => d.id === data.id);

            if (pr) {
                let index = queue.findIndex(d => d === pr);

                if (index) queue.splice(index, 1);
                pr[action](data.data || data);
                return true;
            } else {
                emit('ws-promise-error', data);
            }
        }
    };

    socket.onopen = () => {
        console.log('WebSocket connection established', url);
        emit('ws-open', socket);
    };

    socket.onmessage = event => {
        let data = event.detail || event.data || {};

        try {
            data = JSON.parse(data);

            if (process(data)) return;
        } catch (e) {
        }

        emit('ws-message' + (data.eventName ? ':' + data.eventName : ''), data);
    };

    socket.onerror = error => {
        console.error('WebSocket error:', error, url);
        emit('ws-error', error);
    };

    socket.onclose = event => {
        console.log('WebSocket connection closed', url);
        emit('ws-end', event);
    };

    socket.end = () => {
        queue.forEach(d => d.reject('WebSocket promise rejected'));
        queue = null;
        socket.close();
    };

    socket.sendPromise = (msg = {}) => {
        let id = msg.id || (msg.id = uid++);
        let pr = new Promise((resolve, reject) => {
            queue.push({ resolve, reject, id });
        });

        socket.send(JSON.stringify(msg));
        return pr;
    };

    return {
        websocket: socket,
        websocket_open: false,
        init() {
            emit = this.$dispatch || emit;
        },
        destroy() {
            socket.end();
        }
    };
};