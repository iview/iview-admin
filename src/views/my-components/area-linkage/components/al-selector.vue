<template>
    <div>
        <Row :gutter="gutterNum">
            <Col :span="span" v-if="show(0)">
                <Select 
                    ref="prov"
                    v-model="currPro"
                    @on-change="hasChange"
                    :filterable="searchable"
                    :placeholder="phHandled(0)"
                    :size="size"
                    :not-found-text="ndsHandled(0)"
                    :disabled="disabled === undefined ? false : disHandled(0)"
                    transfer
                    style="width:100%">
                    <Option v-for="item in provList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </Col>
            <Col :span="span" v-if="show(1)">
                <Select
                    ref="city"
                    v-model="currCit"
                    @on-change="hasChange"
                    :filterable="searchable"
                    :placeholder="phHandled(1)"
                    :size="size"
                    :not-found-text="ndsHandled(1)"
                    :disabled="disabled === undefined ? false : disHandled(1)"
                    transfer
                    style="width:100%">
                    <Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </Col>
            <Col :span="span" v-if="show(2)">
                <Select 
                    ref="coun"
                    v-model="currCou"
                    @on-change="hasChange"
                    :filterable="searchable"
                    :placeholder="phHandled(2)"
                    :size="size"
                    :not-found-text="ndsHandled(2)"
                    :disabled="disabled === undefined ? false : disHandled(2)"
                    transfer
                    style="width:100%">
                    <Option v-for="item in counList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </Col>
            <Col :span="span" v-if="show(3)">
                <Select 
                    ref="stre"
                    v-model="currStr"
                    @on-change="hasChange"
                    :filterable="searchable"
                    :placeholder="phHandled(3)"
                    :size="size"
                    :not-found-text="ndsHandled(3)"
                    :disabled="disabled === undefined ? false : disHandled(3)"
                    transfer
                    style="width:100%">
                    <Option v-for="item in streList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </Col>
        </Row>
        <slot></slot>
    </div>
</template>

<script>
import areaData from 'area-data';
import util from '../util';
const areaLinkageArr = util.levelArr;
const dataTypeArr = util.dataType;
export default {
    name: 'alSelector',
    data () {
        return {
            currPro: '',
            currCit: '',
            currCou: '',
            currStr: '',
            provList: areaData[86],
            cityList: {},
            counList: {},
            streList: {},
            provIndex: 0,
            cityIndex: 0,
            counIndex: 0,
            streIndex: 0,
            isInit: true,
            defaultPlaceholder: ['请选择省', '请选择市', '请选择县区', '请选择乡镇街'],
            defaultnotFoundText: ['无匹配省', '无匹配市', '无匹配县区', '无匹配乡镇街'],
            cloneValue: []
        };
    },
    props: {
        gutter: {
            type: [String, Number],
            default: 10
        },
        level: {
            type: [String, Number],
            default: 3,
            validator: val => {
                return util.oneOf(parseInt(val), areaLinkageArr);
            }
        },
        value: {
            type: Array
        },
        searchable: {
            type: Boolean,
            default: false
        },
        dataType: {
            type: String,
            default: 'all',
            validator: (val) => {
                return util.oneOf(val, dataTypeArr);
            }
        },
        auto: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: [Array, String],
            default () {
                return this.defaultPlaceholder;
            }
        },
        size: {
            type: String,
            default: 'default'
        },
        notFoundText: {
            type: [String, Array],
            default () {
                return this.defaultnotFoundText;
            }
        },
        disabled: {
            type: [Boolean, Array, Number],
            default: false
        }
    },
    computed: {
        gutterNum () {
            if (typeof this.gutter === 'number') {
                return this.gutter;
            } else {
                return parseInt(this.gutter);
            }
        },
        showLevel () {
            return parseInt(this.level);
        },
        span () {
            if (util.oneOf(this.showLevel, areaLinkageArr)) {
                return 24 / (this.showLevel + 1);
            }
        }
    },
    watch: {
        currPro (prov) {
            this.updateNextSelector('provIndex', 'provList', 'cityList', prov, 'currCit', 0);
            if (this.showLevel === 0 || (!areaData[util.getIndex(areaData[86], prov)]) || !this.auto) {
                this.returnRes(0);
            }
        },
        currCit (city) {
            this.updateNextSelector('cityIndex', 'cityList', 'counList', city, 'currCou', 1);
            if (this.showLevel === 1 || (!areaData[util.getIndex(this.provList, city)]) || !this.auto) {
                this.returnRes(1);
            }
        },
        currCou (coun) {
            this.updateNextSelector('counIndex', 'counList', 'streList', coun, 'currStr', 2);
            if (this.showLevel === 2 || !this.auto) {
                this.returnRes(2);
            }
        },
        currStr (str) {
            this.streIndex = util.getIndex(this.streList, str);
            if (this.showLevel === 3 || !this.auto) {
                this.returnRes(3);
            }
        }
    },
    methods: {
        init () {
            if (this.value && this.value.length > 0) {
                this.cloneValue = this.value;
                if (isNaN(parseInt(this.value[0]))) {
                    if (util.getIndex(this.provList, this.value[0])) {
                        this.currPro = this.value[0];
                    }
                } else {
                    if (this.value[0]) {
                        if (areaData[86][this.value[0]]) {
                            this.currPro = areaData[86][this.value[0]];
                            this.provIndex = this.value[0];
                        }
                    }
                }
            }
        },
        show (level) {
            if (level <= this.showLevel) {
                return true;
            } else {
                return false;
            }
        },
        updateNextSelector (index, list, nextList, name, nextName, level) {
            if (level <= this.showLevel) {
                let nextSelected = '';
                if (this.isInit && this.value[level]) {
                    let valueItem = this.value[level];
                    if (isNaN(parseInt(valueItem))) {
                        if (util.getIndex(this[list], this.value[level])) {
                            name = valueItem;
                        }
                    } else {
                        if (Object.keys(this[list]).indexOf(this.value[level]) > -1) {
                            if (level === 0) {
                                name = areaData[86][this.value[level]];
                            } else {
                                name = areaData[this.value[level - 1]][this.value[level]];
                            }
                        }
                    }
                }
                this[index] = util.getIndex(this[list], name);
                if (areaData[this[index]]) {
                    if (this[index] === undefined) {
                        this.$refs[nextList.substr(0, 4)].setQuery('');
                    }
                    this[nextList] = areaData[this[index]];
                    if (this.isInit && this.cloneValue[level + 1]) {
                        let valueNextItem = this.cloneValue[level + 1];
                        if (isNaN(parseInt(valueNextItem))) {
                            if (util.getIndex(this[nextList], this.cloneValue[level + 1])) {
                                nextSelected = this.cloneValue[level + 1];
                            }
                        } else {
                            if (Object.keys(this[nextList]).indexOf(this.cloneValue[level + 1]) > -1) {
                                nextSelected = areaData[this.cloneValue[level]][this.cloneValue[level + 1]];
                            }
                        }
                    }
                    if (this.isInit && this.value.length !== 0) {
                        this[nextName] = nextSelected || this.setNextSelect(index);
                    } else if (!this.isInit && this.auto) {
                        this[nextName] = nextSelected || this.setNextSelect(index);
                    }
                    if (this.isInit && level === this.showLevel) {
                        this.returnRes(level);
                    }
                } else {
                    this[nextName] = '';
                    this[nextList] = [];
                }
            }
        },
        returnRes (level) {
            if (this.auto) {
                this.returnResArr(this.showLevel);
            } else {
                this.returnResArr(level);
            }
        },
        setNextSelect (index) {
            return areaData[this[index]][Object.keys(areaData[this[index]])[0]];
        },
        returnResArr (level) {
            let res = [];
            let i = 0;
            let codeArr = [this.provIndex, this.cityIndex, this.counIndex, this.streIndex];
            let nameArr = [this.currPro, this.currCit, this.currCou, this.currStr];
            if (this.dataType === 'name') {
                while (i <= level) {
                    if (nameArr[i]) {
                        res.push(nameArr[i]);
                    }
                    i++;
                };
            } else if (this.dataType === 'all') {
                while (i <= level) {
                    if (codeArr[i] && nameArr[i]) {
                        let item = {
                            code: codeArr[i],
                            name: nameArr[i]
                        };
                        res.push(item);
                    }
                    i++;
                }
            } else {
                while (i <= level) {
                    if (codeArr[i]) {
                        res.push(codeArr[i]);
                    }
                    i++;
                };
            }
            this.$emit('input', res);
            this.$emit('on-change', res);
        },
        hasChange () {
            this.isInit = false;
        },
        phHandled (level) {
            if (typeof this.placeholder === 'string' && this.placeholder !== '') {
                return this.placeholder;
            } else {
                if (this.placeholder && this.placeholder[level]) {
                    return this.placeholder[level];
                } else {
                    return this.defaultPlaceholder[level];
                }
            }
        },
        ndsHandled (index) {
            if (typeof this.notFoundText === 'string' && this.notFoundText !== '') {
                return this.notFoundText;
            } else {
                if (!this.notFoundText) {
                    return this.defaultnotFoundText[index];
                } else {
                    if (this.notFoundText[index]) {
                        return this.notFoundText[index];
                    } else {
                        return this.defaultnotFoundText[index];
                    }
                }
            }
        },
        disHandled (level) {
            if (typeof this.disabled === 'number') {
                if (util.oneOf(this.disabled, areaLinkageArr)) {
                    if (level >= this.disabled) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else if (Array.isArray(this.disabled)) {
                let i = 0;
                let isDis = false;
                while (this.disabled[i]) {
                    if (this.disabled[i] === level) {
                        isDis = true;
                        break;
                    }
                    i++;
                }
                return isDis;
            } else {
                return this.disabled;
            }
        }
    },
    updated () {
        this.init();
    },
    mounted () {
        this.init();
    }
};
</script>
