<template>
    <div>
        <Cascader 
            v-model="select" 
            :data="data"
            :load-data="loadData"
            transfer
            :disabled="disabled"
            :size="size"
            :placeholder="placeholder"
            :render-format="renderFormat"
            @on-change="handleChange"
        />
    </div>
</template>

<script>
import areaData from 'area-data';
import util from '../util';
const levelShow = (level, code) => {
    if (level === 2) {
        return Object.keys(areaData['86']).indexOf(code) > -1;
    } else if (level === 3) {
        return true;
    }
};
export default {
    name: 'alCascader',
    props: {
        value: Array,
        level: {
            type: [Number, String],
            default: 3,
            validator: val => {
                return util.checkLevel(parseInt(val));
            }
        },
        dataType: {
            type: String,
            default: 'all',
            validator: val => {
                return util.oneOf(val, util.dataType);
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        size: String,
        placeholder: String,
        renderFormat: Function
    },
    data () {
        return {
            data: [],
            select: [],
            isInit: true,
            oldData: []
        };
    },
    computed: {
        showLevel () {
            return parseInt(this.level);
        }
    },
    methods: {
        init () {
            let proData = [];
            for (const p in areaData['86']) {
                let proitem = {
                    value: p,
                    label: areaData['86'][p],
                    children: []
                };
                if (this.showLevel > 0 && areaData[p]) {
                    proitem.loading = false;
                }
                proData.push(proitem);
            }
            this.data = proData;
        },
        setDefaultValue () {
            if (this.value[0]) {
                let select = [];
                if (isNaN(parseInt(this.value[0]))) {
                    let i = 0;
                    let index = '';
                    while (this.value[i] && i <= this.showLevel) {
                        if (i === 0) {
                            index = util.getIndex(areaData['86'], this.value[0]);
                        } else {
                            index = util.getIndex(areaData[index], this.value[i]);
                        }
                        select.push(index);
                        i++;
                    }
                    this.select = select;
                } else {
                    this.select = this.value;
                }
                let res = this.procesValue(this.select);
                this.oldData = res;
                this.$emit('input', res);
                this.$emit('on-change', res);
            }
        },
        canEmit (res) {
            let ifEmit = false;
            if (this.value && this.value.length !== 0) {
                if (typeof res[0] === 'string') {
                    if (this.value[this.value.length - 1] !== this.oldData[this.oldData.length - 1]) {
                        ifEmit = true;
                    }
                } else {
                    if (this.oldData && this.oldData.length !== 0 && this.value[this.value.length - 1].code !== this.oldData[this.oldData.length - 1].code) {
                        ifEmit = true;
                    }
                }
            } else {
                ifEmit = true;
            }
            return ifEmit;
        },
        handleChange (resArr) {
            let res = this.procesValue(resArr);
            this.oldData = res;
            this.$emit('input', res);
            this.$emit('on-change', res);
        },
        loadData (item, callback) {
            let childData = [];
            let childs = areaData[item.value];
            for (const c in childs) {
                let childitem = {
                    value: c,
                    label: areaData[item.value][c],
                    children: []
                };
                if (areaData[childitem.value] && levelShow(this.showLevel, item.value)) {
                    childitem.loading = false;
                }
                childData.push(childitem);
                item.children = childData;
            }
            item.loading = false;
            callback();
        },
        procesValue (arr) {
            let i = 0;
            let res = [];
            while (arr[i]) {
                let name = '';
                if (i === 0) {
                    name = areaData['86'][arr[i]];
                } else {
                    name = areaData[arr[i - 1]][arr[i]];
                }
                let item;
                if (this.dataType === 'all') {
                    item = {
                        code: arr[i],
                        name: name
                    };
                } else if (this.dataType === 'name') {
                    item = name;
                } else {
                    item = arr[i];
                }
                res.push(item);
                i++;
            }
            return res;
        }
    },
    mounted () {
        this.init();
    },
    watch: {
        value (val) {
            if (this.canEmit(this.value)) {
                this.setDefaultValue();
            }
        }
    }
};
</script>
