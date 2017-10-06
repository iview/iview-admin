<style lang="less">
    @import './animate-input.less';
</style>

<template>
    <div @click="handleClick" class="animate-input-con">
        <span ref="animateInputLabel" class="animate-input-label" :style="{color: color}"><span v-if="icon" class="animate-input-icon-wrap"><Icon :type="icon"></Icon></span>{{ label }}</span>
        <input :type="type" ref="animateInputInput" @input="handleInput" @blur="handleBlur" class="animate-input-input" :style="{color: color, borderBottom: '2px solid ' + color, paddingRight: canclear ? '30px' : '5px'}"/>
        <transition name="animate-input-clearbtn">
            <span v-show="value.length !== 0 && canclear" @click="clearValue" :style="{color: color}" class="animate-input-clear-btn"><Icon :size="20" type="close-circled"></Icon></span>
        </transition>
    </div>
</template>

<script>
const inOf = (value, targetArr) => {
    if (targetArr.indexOf(value) > -1) {
        return true;
    } else {
        return false;
    }
};
export default {
    name: 'AnimateInput',
    data () {
        return {
            value: ''
        };
    },
    props: {
        icon: String,
        label: [String, Number],
        color: {
            type: String,
            default: '#fff'
        },
        canclear: Boolean,
        type: {
            type: String,
            validator (value) {
                return inOf(value, ['text', 'password']);
            },
            default: 'text'
        }
    },
    methods: {
        handleClick () {
            this.$refs.animateInputLabel.className = 'animate-input-label on';
            this.$refs.animateInputInput.focus();
        },
        handleBlur () {
            if (this.value.length === 0) {
                this.$refs.animateInputLabel.className = 'animate-input-label';
            }
        },
        handleInput () {
            this.value = this.$refs.animateInputInput.value;
            this.$emit('input', this.value);
        },
        clearValue () {
            this.value = '';
        }
    }
};
</script>
