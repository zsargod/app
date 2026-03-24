export const Broadcast = function (channel) {
    const bc = new BroadcastChannel(channel);

    bc.onmessage = event => this.$dispatch('broadcast-message', event.data);

    bc.onmessageerror = error => this.$dispatch('broadcast-error', error);

    bc.onclose = () => this.$dispatch('broadcast-end');

    return {
        broadcast: bc,
        destroy() {
            bc.close();
        }
    };
};