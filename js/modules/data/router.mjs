import router from '../router.mjs';

export const Router = (routes, strategy, base) => ({
    ROUTE: { is: () => false },
    _routes: router(routes, strategy, base),
    router_update() {
        this.ROUTE = this._routes();
    },

    init() {
        this.router_event = this.router_update.bind(this);
        this.router_update();
        window.addEventListener('popstate', this.router_event);
    },

    destroy() {
        window.removeEventListener('popstate', this.router_event);
    },
});