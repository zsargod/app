Alpine.directive('destroy', (el, { expression }, { evaluateLater, cleanup }) => {
    const clean = evaluateLater(expression);
    cleanup(() => clean());
});