import cleanup from '../cleanup.mjs';
import template from '../template.mjs';

Alpine.magic('template', () => (el, url, options) => template(url, options).then(html => el.innerHTML = cleanup(el, html)));