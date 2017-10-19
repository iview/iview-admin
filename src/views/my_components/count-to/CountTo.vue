<template>
    <p :style="mainStyle" :class="mainClass">
        <slot name="leftText"></slot>
        <span :style="countStyle" :class="countClass"><span :id="countId">{{ initCount }}</span><span>{{ unitText }}</span></span>
        <slot name="rightText"></slot>
    </p>
</template>

<script>
import CountUp from 'countup';
export default {
    name: 'CountTo',
    data () {
        return {
            counter: {},
            unitText: '',
            countId: 'count' + parseInt(Math.random() * 1000000)
        };
    },
    props: {
        mainClass: String,
        countClass: String,
        mainStyle: {
            type: Object,
            default: () => {
                return {
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'gray'
                };
            }
        },
        countStyle: Object,
        initCount: {
            type: Number,
            default: 0
        },
        startVal: {
            type: Number,
            default: 0
        },
        endVal: {
            type: Number,
            required: true
        },
        simplify: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
            default: 2
        },
        delay: {
            type: Number,
            default: 200
        },
        uneasing: {
            type: Boolean,
            default: false
        },
        ungroup: {
            type: Boolean,
            default: false
        },
        separator: {
            type: String,
            default: ','
        },
        decimals: {
            type: Number,
            default: 0
        },
        decimal: {
            type: String,
            default: '.'
        },
        unit: {
            type: Array,
            default: () => {
                return [[3, 'K+'], [6, 'M+'], [9, 'B+']];
            }
        }
    },
    methods: {
        transformValue (val) {
            let endVal = 0;
            let unit = '';
            let len = this.unit.length;
            if (val < Math.pow(10, this.unit[0][0])) {
                endVal = val;
            } else {
                for (let i = 1; i < len; i++) {
                    if (val >= Math.pow(10, this.unit[i - 1][0]) && val < Math.pow(10, this.unit[i][0])) {
                        endVal = parseInt(val / Math.pow(10, this.unit[i - 1][0]));
                        unit = this.unit[i - 1][1];
                    }
                }
            }
            if (val > Math.pow(10, this.unit[len - 1][0])) {
                endVal = parseInt(val / Math.pow(10, this.unit[len - 1][0]));
                unit = this.unit[len - 1][1];
            }
            return {
                val: endVal,
                unit: unit
            };
        }
    },
    mounted () {
        this.$nextTick(() => {
            setTimeout(() => {
                let endVal = 0;
                let res = {};
                if (this.simplify) {
                    res = this.transformValue(this.endVal);
                    endVal = res.val;
                    this.unitText = res.unit;
                } else {
                    endVal = this.endVal;
                }
                let counter = {};
                this.counter = counter = new CountUp(this.countId, this.startVal, endVal, this.decimals, this.duration, {
                    useEasing: !this.uneasing,
                    useGrouping: !this.ungroup,
                    separator: this.separator,
                    decimal: this.decimal
                });
                if (!counter.error) {
                    counter.start();
                }
            }, this.delay);
        });
    },
    watch: {
        endVal (val) {
            let endVal = 0;
            if (this.simplify) {
                let res = this.transformValue(this.endVal);
                endVal = res.val;
                this.unitText = res.unit;
            } else {
                endVal = this.endVal;
            }
            this.counter.update(endVal);
        }
    }
};
</script>
