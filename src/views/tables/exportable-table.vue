<style lang="less" scoped>
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <Row>
            <Card>
                <h4 slot="title">
                    <Icon type="android-archive"></Icon>
                    导出表格数据到 .Csv 文件
                </h4>
                <Row>
                    <Col span="18">
                        <Table :columns="columnsCsv" :data="csvData" size="small" ref="tableCsv"></Table>
                    </Col>
                    <Col span='6' class="padding-left-10">
                        <div class="exportable-table-download-con1">
                            <span style="margin-right: 16px;"><Button type="primary" size="large" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button></span>
                            <Button type="primary" size="large" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 导出排序和过滤后的数据</Button>
                        </div>
                        <div class="exportable-table-download-con2">
                            <div>
                                <span>选取行范围：&nbsp;</span><InputNumber :min="1" :max="selectMaxRow" v-model="selectMinRow"></InputNumber> 
                                <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span> 
                                <InputNumber :min="selectMinRow" :max="rowNum" v-model="selectMaxRow"></InputNumber>
                            </div>
                            <div class="margin-top-10">
                                <span>选取列范围：&nbsp;</span><InputNumber :min="1" :max="selectMaxCol" v-model="selectMinCol"></InputNumber> 
                                <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span> 
                                <InputNumber :min="selectMinCol" :max="colNum" v-model="selectMaxCol"></InputNumber>
                            </div>
                            <div class="margin-top-10">
                                <span>输入文件名：</span>
                                <Input v-model="csvFileName" icon="document" placeholder="请输入文件名" style="width: 190px" />
                            </div>
                            <div class="margin-top-20">
                                <Button type="primary" size="large" @click="exportData(3)"><Icon type="ios-download-outline"></Icon> 导出自定义数据</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import {table2csvData, csvColumns} from './data/table2csv.js';
export default {
    data () {
        return {
            columnsCsv: csvColumns,
            csvData: table2csvData,
            rowNum: table2csvData.length,
            colNum: csvColumns.length,
            selectMinRow: 1,
            selectMaxRow: table2csvData.length,
            selectMinCol: 1,
            selectMaxCol: csvColumns.length,
            maxRow: 0,
            minRow: 1,
            maxCol: 0,
            minCol: 1,
            csvFileName: ''
        };
    },
    methods: {
        exportData (type) {
            if (type === 1) {
                this.$refs.tableCsv.exportCsv({
                    filename: '原始数据'
                });
            } else if (type === 2) {
                this.$refs.tableCsv.exportCsv({
                    filename: '排序和过滤后的数据',
                    original: false
                });
            } else if (type === 3) {
                this.$refs.tableCsv.exportCsv({
                    filename: this.csvFileName,
                    columns: this.columnsCsv.filter((col, index) => index >= this.selectMinCol - 1 && index <= this.selectMaxCol - 1),
                    data: this.csvData.filter((data, index) => index >= this.selectMinRow - 1 && index <= this.selectMaxRow - 1)
                });
            }
        }
    }
};
</script>
