const emit = (name, data, el) => {
    let ev = new Event(name, { bubbles: true, cancelable: true });

    ev.detail = data;
    el.dispatchEvent(ev);
};

export const Iframe = url => {
    let uid = 1;
    let queue = [];
    let iframeElement;
    let isSandbox, methods;
    let message = (event, action = 'resolve') => {
        if (iframeElement.contentWindow !== event.source) return;
        let data = event.detail || event.data || {};

        if (data.id) {
            let pr = queue.find(d => d.id === data.id);

            if (pr) {
                let index = queue.findIndex(d => d === pr);

                if (index) queue.splice(index, 1);
                pr[action](data.data || data);
                return true;
            } else {
                emit('iframe-promise-error', data, iframeElement);
            }
        } 

        emit('iframe-message' + (data.eventName ? ':' + data.eventName : ''), data, iframeElement);
    };

    return methods = {
        iframe: {
            sendPromise(msg) {
                let id = msg.id || (msg.id = uid++);
                let pr = new Promise((resolve, reject) => {
                    queue.push({ resolve, reject, id });
                });

                this.send(msg);
                return pr;
            },
            send(data) {
                if (isSandbox) {
                    iframeElement.contentWindow.postMessage(data, '*');
                } else {
                    emit('message', data, iframeElement);
                }
            },
            end() {
                console.log('Iframe ended');
                queue.forEach(d => d.reject('Iframe promise rejected'));
                queue = null;
            }
        },
        iframe_available: false,
        init() {
            iframeElement = this.$refs.iframe || this.$el.querySelector('iframe') || this.$el;
            isSandbox = iframeElement.contentWindow && !iframeElement.contentDocument;
            window.addEventListener('message', message);
            if (url) {
                iframeElement.src = url;
            }
        },
        destroy() {
            window.removeEventListener('message', message);
            methods.iframe.end();
        },
    };
};