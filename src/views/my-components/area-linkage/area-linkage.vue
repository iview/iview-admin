<style lang="less">
    @import './area-linkage.less';
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col span="17">
                <Card>
                    <p slot="title">
                        <Icon type="minus-round"></Icon>
                        基础示例
                    </p>
                    <Row class="area-linkage-page-row1">
                        <al-selector 
                            v-model="resDefault"
                            level="3"
                            auto
                        />
                        <pre>
&lt;al-selector v-model="resDefault" /&gt;
                        </pre>
                        <al-cascader
                            v-model="res1"
                            style="margin-top:20px;width:50%;"
                        />
                        <pre>
&lt;al-cascader v-model="res1" /&gt;
                        </pre>
                        <Button @click="setAreaOne">set city</Button>
                        <Button @click="setAreaTwo">set city</Button>
                        <Button @click="setAreaThree">set city</Button>
                        <div>
                            <p>更多配置可参考iview-area组件官方文档：<a href="https://github.com/iview/iview-area" target="_block">iview-area</a></p>
                        </div>
                    </Row>
                </Card>
            </Col>
            <Col span="7">
                <Card>
                    <p slot="title">
                        <Icon type="stats-bars"></Icon>
                        数据展示
                    </p>
                    <Row class="area-linkage-page-row1">
                        <pre style="font-size:12px;">
{{ showRes }}
                        </pre>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" :gutter="10">
            <Col span="3">
                <Card>
                    <p slot="title">
                        一级
                    </p>
                    <al-selector v-model="res1" level="0"/>
                </Card>
            </Col>
            <Col span="5">
                <Card>
                    <p slot="title">
                        二级
                    </p>
                    <al-selector v-model="res1" level="1"/>
                </Card>
            </Col>
            <Col span="7">
                <Card>
                    <p slot="title">
                        三级
                    </p>
                    <al-selector v-model="res1" data-type="code" level="2"/>
                </Card>
            </Col>
            <Col span="9">
                <Card>
                    <p slot="title">
                        四级
                    </p>
                    <al-selector v-model="res1" data-type="name" level="3"/>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" :gutter="10">
            <Col span="8">
                <Card>
                    <p slot="title">
                        禁用指定级别
                    </p>
                    <al-selector v-model="res1" :disabled="2" level="3"/>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">
                        四级
                    </p>
                    <al-cascader v-model="res1" level="3"/>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">
                        三级
                    </p>
                    <al-cascader v-model="res1" level="2"/>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">
                        二级
                    </p>
                    <al-cascader v-model="res1" data-type="name" level="1"/>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">
                        一级
                    </p>
                    <al-cascader v-model="res1" data-type="code" level="0"/>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" :gutter="10">
            <Col span="4">
                <Card>
                    <p slot="title">
                        三种尺寸
                    </p>
                    <al-selector v-model="res1" size="large" level="0"/>
                    <al-selector style="margin-top:10px;" v-model="res1" size="default" level="0"/>
                    <al-selector style="margin-top:10px;" v-model="res1" size="small" level="0"/>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">
                        三种尺寸
                    </p>
                    <al-cascader v-model="res1" size="large" level="1"/>
                    <al-cascader style="margin-top:10px;" v-model="res1" level="1"/>
                    <al-cascader style="margin-top:10px;" v-model="res1" size="small" level="1"/>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">
                        自定义显示格式
                    </p>
                    <Row class="area-linkage-page-row2">
                        <al-cascader
                            v-model="res1" 
                            size="large" 
                            level="3"
                            placeholder="这是级联模式"
                            :render-format="label => label.join(' > ')"
                        />
                    </Row>
                </Card>
            </Col>
            <Col span="12">
                <Card>
                    <p slot="title">
                        可搜索
                    </p>
                    <Row class="area-linkage-page-row2">
                        <al-selector 
                            :value="res1"
                            searchable
                        />
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import alSelector from './components/al-selector.vue';
import alCascader from './components/al-cascader.vue';

// import Vue from 'vue';
// import iviewArea from 'iview-area';
// Vue.use(iviewArea);

export default {
    components: {
        alSelector,
        alCascader
    },
    data () {
        return {
            res1: [],
            resDefault: ['河北省', '张家口市', '怀来县', '沙城镇'],
            showRes: []
        };
    },
    methods: {
        renderFormat (label) {
            return label.join(' => ');
        },
        setAreaOne () {
            this.resDefault = ['北京市', '市辖区', '东城区', '东华门街道'];
        },
        setAreaTwo () {
            this.resDefault = ['山西省', '太原市', '小店区', '北营街道'];
        },
        setAreaThree () {
            this.resDefault = ['130000', '130700', '130730', '130730100000'];
        }
    },
    watch: {
        res1 (val) {
            this.showRes = val;
        },
        resDefault (val) {
            this.showRes = val;
        }
    }
};
</script>
