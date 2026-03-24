export const Reset = function () {
    return {
        reset_timeout: null,
        reset_show: true,
        reset(timeout = 0) {
            this.reset_show = false;
            clearTimeout(this.reset_timeout);
            this.reset_timeout = setTimeout(() => {
                this.reset_show = true;
            }, timeout);
        },
        destroy() {
            clearTimeout(this.reset_timeout);
        },
    };
};