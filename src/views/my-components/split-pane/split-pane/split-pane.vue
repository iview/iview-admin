<style lang="less">
    @import './split-pane.less';
</style>

<template>
    <div 
        :class="wraperClasses" 
        ref="wraper"
        @mouseup="handleMouseup" 
        @mousemove="handleMousemove"
        @mouseleave="handleMouseout">
        <div v-if="direction === 'horizontal'" :class="`${prefix}-container`">
            <div :class="`${prefix}-left-area`" :style="{width: leftSize}">
                <slot name="left"></slot>
            </div>
            <slot name="trigger">
                <div 
                    :class="`${prefix}-trigger`" 
                    ref="trigger" 
                    :style="{left: `${triggerOffset}%`}"
                    @mousedown="handleMousedown"
                    unselectable="on">
                </div>
            </slot>
            <div :class="`${prefix}-right-area`" :style="{width: rightSize}">
                <slot name="right"></slot>
            </div>
        </div>

        <div v-else :class="`${prefix}-container`">
            <div :class="`${prefix}-top-area`" :style="{height: leftSize}">
                <slot name="top"></slot>
            </div>
            <slot name="trigger">
                <div 
                    :class="`${prefix}-trigger`" 
                    ref="trigger"
                    :style="{top: `${triggerOffset}%`}"
                    @mousedown="handleMousedown"
                    unselectable="on">
                </div>
            </slot>
            <div :class="`${prefix}-bottom-area`" :style="{height: rightSize}">
                <slot name="bottom"></slot>
            </div>
        </div>
    </div>
</template>

<script>
const oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};
export default {
    name: 'splitPane',
    props: {
        value: {
            type: [Number, String],
            default: 50
        },
        direction: {
            type: String,
            default: 'horizontal',
            validator (val) {
                return oneOf(val, ['vertical', 'horizontal']);
            }
        },
        min: {
            type: [Number, String],
            default: 3
        },
        max: {
            type: [Number, String],
            default: 97
        }
    },
    data () {
        return {
            prefix: 'split-pane',
            canMove: false,
            triggerOffset: 50,
            triggerOldOffset: 50,
            offset: {},
            atMin: false,
            atMax: false
        };
    },
    computed: {
        wraperClasses () {
            return [
                this.prefix,
                this.direction === 'vertical' ? `${this.prefix}-vertical` : `${this.prefix}-horizontal`
            ];
        },
        leftSize () {
            return `${this.triggerOffset}%`;
        },
        rightSize () {
            return `${100 - this.triggerOffset}%`;
        },
        minTransed () {
            return this.transValue(this.min);
        },
        maxTransed () {
            return this.transValue(this.max);
        }
    },
    methods: {
        handleMouseup () {
            this.canMove = false;
        },
        transValue (val) {
            return (typeof val === 'number') ? val : Math.floor(((parseFloat(val) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
        },
        handleMousedown (e) {
            this.canMove = true;
            this.triggerOldOffset = this.triggerOffset;
            this.offset = {
                x: e.pageX,
                y: e.pageY
            };
            e.preventDefault();
        },
        handleMouseout () {
            this.canMove = false;
        },
        handleMousemove (e) {
            if (this.canMove) {
                let offset;
                if (this.direction === 'horizontal') {
                    offset = this.triggerOldOffset + Math.floor(((e.clientX - this.offset.x) / this.$refs.wraper.offsetWidth) * 10000) / 100;
                } else {
                    offset = this.triggerOldOffset + Math.floor(((e.clientY - this.offset.y) / this.$refs.wraper.offsetHeight) * 10000) / 100;
                }
                if (offset <= this.minTransed) {
                    this.triggerOffset = Math.max(offset, this.minTransed);
                } else {
                    this.triggerOffset = Math.min(offset, this.maxTransed);
                }
                this.atMin = this.triggerOffset === this.minTransed;
                this.atMax = this.triggerOffset === this.maxTransed;
                e.atMin = this.atMin;
                e.atMax = this.atMax;
                this.$emit('input', offset);
                this.$emit('on-trigger-moving', e);
            }
        }
    },
    mounted () {
        if (this.value !== undefined) {
            this.triggerOffset = (typeof this.value === 'number') ? this.value : Math.floor(((parseFloat(this.value) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
        }
    }
};
</script>
