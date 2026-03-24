export const Toast = () => ({
    toasts: [],
    id: 1,
    toast_show(toast) {
        this.toasts.push(Object.assign({ id: this.id++ }, toast.component ? toast : { component: toast }));
    },
    toast_close(toast) {
        clearTimeout(toast.timeoutId);
        this.toasts.splice(this.toasts.indexOf(toast), 1);
    },
    toast_timeout(toast, timeout = 5000) {
        clearTimeout(toast.timeoutId);
        toast.hover = false;
        toast.timeoutId = setTimeout(() => !toast.hover && (this.hidden = true), toast.timeout || timeout);
    },
    toast_hover(toast) {
        clearTimeout(toast.timeoutId);
        toast.hover = true;
    }
});