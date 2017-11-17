<style lang="less">
    @import '../../../styles/common.less';
    @import './count-to.less';
</style>

<template>
    <div>
        <Row>
            <Col span="3">
                <Card>
                    <p slot="title">
                        <Icon type="waterdrop"></Icon>
                        CountTo组件基础用法
                    </p>
                    <Row type="flex" justify="center" align="middle" class="countto-page-row">
                        <div class="count-to-con">
                            <CountTo :endVal="2534"/>
                        </div>
                    </Row>
                </Card>
            </Col>
            <Col span="5" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="code"></Icon>
                        可添加左右文字
                    </p>
                    <Row type="flex" justify="center" align="middle" class="countto-page-row">
                        <div class="count-to-con">
                            <CountTo :endVal="2534">
                                <span slot="leftText">Total:&nbsp;</span>
                                <span slot="rightText">&nbsp;times</span>
                            </CountTo>
                        </div>
                    </Row>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="paintbucket"></Icon>
                        自定义样式
                    </p>
                    <Row type="flex" justify="center" align="middle" class="countto-page-row">
                        <div class="count-to-con">
                            <CountTo :endVal="2534" :mainStyle="mainStyle" :countStyle="countStyle">
                                <span slot="leftText">Total:&nbsp;</span>
                                <span slot="rightText">&nbsp;times</span>
                            </CountTo>
                        </div>
                    </Row>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="settings"></Icon>
                        设置数据格式
                    </p>
                    <Row type="flex" justify="center" align="middle" class="countto-page-row">
                        <div class="count-to-con">
                            <CountTo :endVal="2534" :mainStyle="mainStyle" :countStyle="countStyle" :decimals="2">
                                <span slot="leftText">Total:&nbsp;</span>
                                <span slot="rightText">&nbsp;times</span>
                            </CountTo>
                        </div>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-color-wand"></Icon>
                        转换单位简化数据
                    </p>
                    <Row type="flex" justify="center" align="middle" class="countto-page-row">
                        <div class="count-to-con">
                            <CountTo :simplify="true" :endVal="2534" :mainStyle="mainStyle" :countStyle="countStyle">
                                <span slot="leftText">Total:&nbsp;</span>
                                <span slot="rightText">&nbsp;times</span>
                            </CountTo>
                        </div>
                    </Row>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="ios-shuffle-strong"></Icon>
                        自定义单位
                    </p>
                    <Row type="flex" justify="center" align="middle" class="countto-page-row">
                        <div class="count-to-con">
                            <CountTo :simplify="true" :unit="unit" :endVal="253" :mainStyle="mainStyle2" :countStyle="countStyle2">
                                <span slot="leftText">原始数据：253&nbsp;=>&nbsp;</span>
                            </CountTo>
                            <CountTo :simplify="true" :unit="unit" :endVal="2534" :mainStyle="mainStyle2" :countStyle="countStyle2">
                                <span slot="leftText">原始数据：2534&nbsp;=>&nbsp;</span>
                            </CountTo>
                            <CountTo :simplify="true" :unit="unit" :endVal="257678" :mainStyle="mainStyle2" :countStyle="countStyle2">
                                <span slot="leftText">原始数据：257678&nbsp;=>&nbsp;</span>
                            </CountTo>
                        </div>
                    </Row>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="android-stopwatch"></Icon>
                        可异步更新数据
                    </p>
                    <Row type="flex" justify="center" align="middle" class="countto-page-row">
                        <div class="count-to-con">
                            <CountTo :endVal="asynEndVal" :mainStyle="mainStyle" :countStyle="countStyle">
                                <span slot="leftText">Total:&nbsp;</span>
                                <span slot="rightText">&nbsp;times</span>
                            </CountTo>
                        </div>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title">
                    <Icon type="ios-analytics"></Icon>
                    综合实例
                </p>
                <Row type="flex" justify="center" align="middle" class="countto-page-row">
                    <div class="count-to-con">
                        <CountTo :delay="500" :simplify="true" :unit="unit2" :endVal="integratedEndVal" :mainStyle="mainStyle" :countStyle="countStyle">
                            <span slot="leftText">原始数据:&nbsp;{{ integratedEndVal }}&nbsp;=>&nbsp;</span>
                            <span slot="rightText">&nbsp;times</span>
                        </CountTo>
                    </div>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import CountTo from './CountTo.vue';
export default {
    name: 'count-to',
    components: {
        CountTo
    },
    data () {
        return {
            endVal: 0,
            mainStyle: {
                fontSize: '30px'
            },
            countStyle: {
                fontSize: '50px',
                color: '#dc9387'
            },
            mainStyle2: {
                fontSize: '22px'
            },
            countStyle2: {
                fontSize: '30px',
                color: '#dc9387'
            },
            unit: [[3, '千多'], [4, '万多'], [5, '十万多']],
            unit2: [[1, '十多'], [2, '百多'], [3, '千多'], [4, '万多'], [5, '十万多'], [6, '百万多'], [7, '千万多'], [8, '亿多']],
            asynEndVal: 487,
            integratedEndVal: 3
        };
    },
    methods: {
        init () {
            setInterval(() => {
                this.asynEndVal += parseInt(Math.random() * 20);
                this.integratedEndVal += parseInt(Math.random() * 30);
            }, 2000);
        }
    },
    mounted () {
        this.init();
    }
};
</script>
