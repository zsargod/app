const emit = (name, data, el, options = {}) => {
    if (!el) {
        el = document;
    }

    if (Array.isArray(name)) {
        name.forEach(d => emit(d, data, el, options));
        return emit;
    }

    if (Array.isArray(el) || el instanceof NodeList) {
        [...el].filter(d => typeof d === 'object').forEach(d => emit(name, data, d, options));
        return emit;
    }

    let ev = new Event(name, Object.assign({ bubbles: true, cancelable: true }, options));

    ev.detail = data;
    el.dispatchEvent(ev);

    return emit;
};

Alpine.magic('emit', emit);