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
                    :style="{left: triggerLeft}"
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
                    :style="{top: triggerLeft}"
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
		},
		right: {
			type: Boolean,
			default: false
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
			atMax: false,
			oldOffset: 0
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
			return this.right ? `${100 - this.triggerOffset}%` : `${this.triggerOffset}%`;
		},
		rightSize () {
			return this.right ? `${this.triggerOffset}%` : `${100 - this.triggerOffset}%`;
		},
		triggerLeft () {
			return this.right ? `${100 - this.triggerOffset}%` : `${this.triggerOffset}%`;
		},
		minTransed () {
			return this.transValue(this.min);
		},
		maxTransed () {
			return this.right ? (100 - this.transValue(this.max)) : this.transValue(this.max);
		}
	},
	methods: {
		handleMouseup (e) {
			this.canMove = false;
			this.$emit('on-resizing-end', e);
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
			this.$emit('on-resizing-start', e);
			e.preventDefault();
		},
		handleMouseout () {
			this.canMove = false;
		},
		handleMousemove (e) {
			if (this.canMove) {
				let offset;
				let moveSize = 0;
				if (this.direction === 'horizontal') {
					moveSize = Math.floor(((e.clientX - this.offset.x) / this.$refs.wraper.offsetWidth) * 10000) / 100;
					offset = this.triggerOldOffset + (this.right ? -moveSize : moveSize);
				} else {
					moveSize = Math.floor(((e.clientY - this.offset.y) / this.$refs.wraper.offsetHeight) * 10000) / 100;
					offset = this.triggerOldOffset + (this.right ? -moveSize : moveSize);
				}
				if (this.right) {
					let offsetHandle = 100 - offset;
					if (offsetHandle <= this.minTransed) {
						this.triggerOffset = 100 - Math.max(offsetHandle, this.minTransed);
					} else {
						this.triggerOffset = 100 - Math.min(offsetHandle, this.maxTransed);
					}
				} else {
					if (offset <= this.minTransed) {
						this.triggerOffset = Math.max(offset, this.minTransed);
					} else {
						this.triggerOffset = Math.min(offset, this.maxTransed);
					}
				}
				e.atMin = 100 - offset <= this.minTransed;
				e.atMax = 100 - offset <= this.minTransed;
				if (this.triggerOffset < this.oldOffset) {
					e.direction = this.right ? 1 : 0;
				} else {
					e.direction = this.right ? 0 : 1;
				}
				this.oldOffset = this.triggerOffset;
				this.$emit('input', this.triggerOffset);
				this.$emit('on-resizing', e);
			}
		}
	},
	watch: {
		value (val) {
			this.$nextTick(() => {
				this.triggerOffset = (typeof val === 'number') ? val : Math.floor(((parseInt(val) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
			});
		}
	},
	mounted () {
		if (this.value !== undefined) {
			this.$nextTick(() => {
				this.triggerOffset = (typeof this.value === 'number') ? this.value : Math.floor(((parseInt(this.value) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
			});
			this.triggerOffset = (typeof this.value === 'number') ? this.value : Math.floor(((parseInt(this.value) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
		}
	}
};
</script>
