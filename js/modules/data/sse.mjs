export const Sse = function (url, config = { withCredentials: true }) {
    if (!url) return;
    let source = new EventSource(url, config);

    source.onopen = () => {
        console.log('SSE connection established', url);
        this.$dispatch('sse-open', source);
        window.addEventListener('beforeunload', source.end);
    };

    source.onmessage = (event, eventName) => {
        let data = event.data;

        try {
            data = JSON.parse(data);
        } catch (e) {
        }

        this.$dispatch('sse-message' + (eventName ? ':' + eventName : ''), data);
    };

    source.onerror = (error) => {
        console.error('SSE error:', error, source);
        this.$dispatch('sse-error', error);
    };

    source.end = () => {
        console.log('SSE connection closed', url);
        this.$dispatch('sse-end', url);
        window.removeEventListener('beforeunload', source.end);
        source.close();
    };

    return {

        sse: {
            listen(...names) {
                names.forEach(name => {
                    source.addEventListener(name, event => source.onmessage(event, name));
                });
            },
        },

        destroy() {
            source.end();
        }
    };
};