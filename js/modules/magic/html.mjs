Alpine.magic('html', () => function (el, html) {
    el.innerHTML = `<div @click.prevent @submit.prevent><div x-ignore>${html}</div></div>`
});