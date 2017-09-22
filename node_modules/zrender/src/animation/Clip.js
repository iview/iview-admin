/**
 * 动画主控制器
 * @config target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
 * @config life(1000) 动画时长
 * @config delay(0) 动画延迟时间
 * @config loop(true)
 * @config gap(0) 循环的间隔时间
 * @config onframe
 * @config easing(optional)
 * @config ondestroy(optional)
 * @config onrestart(optional)
 *
 * TODO pause
 */
define(function(require) {

    var easingFuncs = require('./easing');

    function Clip(options) {

        this._target = options.target;

        // 生命周期
        this._life = options.life || 1000;
        // 延时
        this._delay = options.delay || 0;
        // 开始时间
        // this._startTime = new Date().getTime() + this._delay;// 单位毫秒
        this._initialized = false;

        // 是否循环
        this.loop = options.loop == null ? false : options.loop;

        this.gap = options.gap || 0;

        this.easing = options.easing || 'Linear';

        this.onframe = options.onframe;
        this.ondestroy = options.ondestroy;
        this.onrestart = options.onrestart;

        this._pausedTime = 0;
        this._paused = false;
    }

    Clip.prototype = {

        constructor: Clip,

        step: function (globalTime, deltaTime) {
            // Set startTime on first step, or _startTime may has milleseconds different between clips
            // PENDING
            if (!this._initialized) {
                this._startTime = globalTime + this._delay;
                this._initialized = true;
            }

            if (this._paused) {
                this._pausedTime += deltaTime;
                return;
            }

            var percent = (globalTime - this._startTime - this._pausedTime) / this._life;

            // 还没开始
            if (percent < 0) {
                return;
            }

            percent = Math.min(percent, 1);

            var easing = this.easing;
            var easingFunc = typeof easing == 'string' ? easingFuncs[easing] : easing;
            var schedule = typeof easingFunc === 'function'
                ? easingFunc(percent)
                : percent;

            this.fire('frame', schedule);

            // 结束
            if (percent == 1) {
                if (this.loop) {
                    this.restart (globalTime);
                    // 重新开始周期
                    // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件
                    return 'restart';
                }

                // 动画完成将这个控制器标识为待删除
                // 在Animation.update中进行批量删除
                this._needsRemove = true;
                return 'destroy';
            }

            return null;
        },

        restart: function (globalTime) {
            var remainder = (globalTime - this._startTime - this._pausedTime) % this._life;
            this._startTime = globalTime - remainder + this.gap;
            this._pausedTime = 0;

            this._needsRemove = false;
        },

        fire: function (eventType, arg) {
            eventType = 'on' + eventType;
            if (this[eventType]) {
                this[eventType](this._target, arg);
            }
        },

        pause: function () {
            this._paused = true;
        },

        resume: function () {
            this._paused = false;
        }
    };

    return Clip;
});
