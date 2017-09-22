// TODO Draggable for group
// FIXME Draggable on element which has parent rotation or scale
define(function (require) {
    function Draggable() {

        this.on('mousedown', this._dragStart, this);
        this.on('mousemove', this._drag, this);
        this.on('mouseup', this._dragEnd, this);
        this.on('globalout', this._dragEnd, this);
        // this._dropTarget = null;
        // this._draggingTarget = null;

        // this._x = 0;
        // this._y = 0;
    }

    Draggable.prototype = {

        constructor: Draggable,

        _dragStart: function (e) {
            var draggingTarget = e.target;
            if (draggingTarget && draggingTarget.draggable) {
                this._draggingTarget = draggingTarget;
                draggingTarget.dragging = true;
                this._x = e.offsetX;
                this._y = e.offsetY;

                this.dispatchToElement(param(draggingTarget, e), 'dragstart', e.event);
            }
        },

        _drag: function (e) {
            var draggingTarget = this._draggingTarget;
            if (draggingTarget) {

                var x = e.offsetX;
                var y = e.offsetY;

                var dx = x - this._x;
                var dy = y - this._y;
                this._x = x;
                this._y = y;

                draggingTarget.drift(dx, dy, e);
                this.dispatchToElement(param(draggingTarget, e), 'drag', e.event);

                var dropTarget = this.findHover(x, y, draggingTarget).target;
                var lastDropTarget = this._dropTarget;
                this._dropTarget = dropTarget;

                if (draggingTarget !== dropTarget) {
                    if (lastDropTarget && dropTarget !== lastDropTarget) {
                        this.dispatchToElement(param(lastDropTarget, e), 'dragleave', e.event);
                    }
                    if (dropTarget && dropTarget !== lastDropTarget) {
                        this.dispatchToElement(param(dropTarget, e), 'dragenter', e.event);
                    }
                }
            }
        },

        _dragEnd: function (e) {
            var draggingTarget = this._draggingTarget;

            if (draggingTarget) {
                draggingTarget.dragging = false;
            }

            this.dispatchToElement(param(draggingTarget, e), 'dragend', e.event);

            if (this._dropTarget) {
                this.dispatchToElement(param(this._dropTarget, e), 'drop', e.event);
            }

            this._draggingTarget = null;
            this._dropTarget = null;
        }

    };

    function param(target, e) {
        return {target: target, topTarget: e && e.topTarget};
    }

    return Draggable;
});