const _import = url => {
    const importModule = u => {
        if (typeof u === 'object') {
            return Object.keys(u).map(key => importModule(u[key]).then(mod => ({ [key]: mod })));
        }
        return import(formatUrl(u)).then(mod => mod.default || mod);
    };
    const formatUrl = u => u.includes('://') ? u : window.location.origin + u;

    return Promise.all(url.map(importModule).flat());
};

Alpine.data('Import', function () {
    let data;
    const urls = [...arguments].flat();

    return data = {
        import_done: false,

        init() {
            _import(urls)
                .then(r => r.filter(m => Object.keys(m).length))
                .then(r => Object.assign(data, ...r))
                .then(() => this.import_done = true);
        },
    };
});