define(function(require) {

    return (typeof window !== 'undefined' &&
                ((window.requestAnimationFrame && window.requestAnimationFrame.bind(window))
                // https://github.com/ecomfe/zrender/issues/189#issuecomment-224919809
                || (window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window))
                || window.mozRequestAnimationFrame
                || window.webkitRequestAnimationFrame)
            )
            || function (func) {
                setTimeout(func, 16);
            };
});
