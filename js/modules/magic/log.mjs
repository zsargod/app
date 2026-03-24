Alpine.magic('log', () => function () {
    console.log(...arguments);
    return [...arguments].pop();
});