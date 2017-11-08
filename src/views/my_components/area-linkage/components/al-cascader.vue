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
            select: [],
            data: []
        };
    },
    computed: {
        showLevel () {
            return parseInt(this.level);
        }
    },
    methods: {
        handleChange (resArr) {
            let res = this.procesValue(resArr);
            this.$emit('input', res);
            this.$emit('on-change', res);
        },
        loadData (item, callback) {
            item.loading = true;
            let childData = [];
            let childs = areaData[item.value];
            for (const c in childs) {
                let childitem = {
                    value: c,
                    label: areaData[item.value][c],
                    children: []
                };
                if (areaData[Object.keys(areaData[item.value])[0]]) {
                    if (levelShow(this.showLevel, item.value)) {
                        childitem.loading = false;
                    }
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
    created () {
        let proData = [];
        for (const p in areaData['86']) {
            let proitem = {
                value: p,
                label: areaData['86'][p],
                children: []
            };
            if (this.showLevel > 0) {
                proitem.loading = false;
            }
            proData.push(proitem);
        }
        this.data = proData;
    }
};
</script>
