<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col span="8">
                <Card>
                    <p slot="title">
                        <Icon type="pinpoint"></Icon>
                        一个条件搜索
                    </p>
                    <Row>
                        <Input v-model="searchConName1" icon="search" @on-change="handleSearch1" placeholder="请输入姓名搜索..." style="width: 200px" />
                    </Row>
                    <Row class="margin-top-10 searchable-table-con1">
                        <Table :columns="columns1" :data="data1"></Table>
                    </Row>
                </Card>
            </Col>
            <Col span="8">
                <Card>
                    <p slot="title">
                        <Icon type="help-buoy"></Icon>
                        多个条件搜索
                    </p>
                    <Row>
                        <Input v-model="searchConName2" @on-change="handleSearch2" icon="search" placeholder="请输入姓名搜搜..." style="width: 200px" />
                        <Input v-model="searchConTel2" @on-change="handleSearch2" icon="search" placeholder="请输入手机号搜搜..." style="width: 200px" />
                    </Row>
                    <Row class="margin-top-10 searchable-table-con1">
                        <Table :columns="columns1" :data="data2"></Table>
                    </Row>
                </Card>
            </Col>
            <Col span="8">
                <Card>
                    <p slot="title">
                        <Icon type="mouse"></Icon>
                        点击搜索进行搜索
                    </p>
                    <Row>
                        <Input v-model="searchConName3" placeholder="请输入姓名搜搜..." style="width: 200px" />
                        <span @click="handleSearch3" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <Button @click="handleCancel3" type="ghost" >取消</Button>
                    </Row>
                    <Row class="margin-top-10 searchable-table-con1">
                        <Table :columns="columns1" :data="data3"></Table>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import * as table from './data/search';
export default {
    name: 'searchable-table',
    data () {
        return {
            searchConName1: '',
            searchConName2: '',
            searchConTel2: '',
            searchConName3: '',
            columns1: table.columns1,
            data1: [],
            initTable1: [],
            data2: [],
            initTable2: [],
            data3: [],
            initTable3: []
        };
    },
    methods: {
        init () {
            this.data1 = this.initTable1 = table.searchTable1;
            this.data2 = this.initTable2 = table.searchTable2;
            this.data3 = this.initTable3 = table.searchTable3;
        },
        search (data, argumentObj) {
            let res = data;
            let dataClone = data;
            for (let argu in argumentObj) {
                if (argumentObj[argu].length > 0) {
                    res = dataClone.filter(d => {
                        return d[argu].indexOf(argumentObj[argu]) > -1;
                    });
                    dataClone = res;
                }
            }
            return res;
        },
        handleSearch1 () {
            this.data1 = this.initTable1;
            this.data1 = this.search(this.data1, {name: this.searchConName1});
        },
        handleSearch2 () {
            this.data2 = this.initTable2;
            this.data2 = this.search(this.data2, {name: this.searchConName2, tel: this.searchConTel2});
        },
        handleSearch3 () {
            this.data3 = this.initTable3;
            this.data3 = this.search(this.data3, {name: this.searchConName3});
        },
        handleCancel3 () {
            this.data3 = this.initTable3;
        }
    },
    mounted () {
        this.init();
    }
};
</script>
