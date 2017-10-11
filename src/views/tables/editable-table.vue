<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <Row>
            <Col span="6">
                <Card>
                    <p slot="title">
                        <Icon type="load-b"></Icon>
                        不同场景效果测试
                    </p>
                    <div class="edittable-test-con">
                        <p>借助vue和iview对原生JS的强大支持，我们对iview的table组件进行了一个定制封装，实现了单元格的可编辑和可删除，您可以在此体验不同场景下编辑和删除功能的不同表现。</p>
                        <div class="margin-top-10">
                            <span class="margin-right-10" style="color:#2d8cf0;">断开网络连接:</span>
                            <i-switch @on-change="handleNetConnect">
                                <span slot="open">是</span>
                                <span slot="close">否</span>
                            </i-switch>
                        </div>
                        <div class="margin-top-10" >
                            <span class="margin-right-10" style="color:#2d8cf0;">开启网速限制:</span>
                            <i-switch @on-change="handleLowSpeed">
                                <span slot="open">是</span>
                                <span slot="close">否</span>
                            </i-switch>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col span="18" class="padding-left-10">
                <Card>
                    <div class="edittable-con-1">
                        <editable-table refs="table1" :columns-list="columnsList" :table-data="tableData" :saveEdit="saveEdit" :deleteRow="deleteRow"></editable-table>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        可编辑单元行
                    </p>
                    <div class="edittable-table-height-con">
                        <editable-table refs="table2" :columns-list="editInlineColumns" :table-data="editInlineData" :saveEdit="saveEditInline" :deleteRow="deleteRowInline"></editable-table>
                    </div>
                </Card>
            </Col>
            <Col span="12" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="android-more-horizontal"></Icon>
                        可编辑单元格(鼠标移入显示编辑单元格按钮)
                    </p>
                    <div class="edittable-table-height-con">
                        <editable-table refs="table2" :hover-show="true" :edit-incell="true" :columns-list="editIncellColumns" :table-data="editIncellData" :saveEdit="saveEditIncell" :deleteRow="deleteRowIncell"></editable-table>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                         单元行和单元格两种方式编辑(始终显示编辑单元格按钮)
                    </p>
                    <div class="edittable-table-height-con">
                        <editable-table refs="table3" :editIncell="true" :columns-list="editInlineAndCellColumn" :table-data="editInlineAndCellData" :saveEdit="saveEditInlineIncell" :deleteRow="deleteRowInlineIncell"></editable-table>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import EditableTable from './components/editableTable.vue';
import tableData from './components/table_data.js';
export default {
    components: {
        EditableTable
    },
    data () {
        return {
            columnsList: [],
            tableData: [],
            breakConnect: false,
            lowNetSpeed: false,
            editInlineColumns: [],
            editInlineData: [],
            editIncellColumns: [],
            editIncellData: [],
            editInlineAndCellColumn: [],
            editInlineAndCellData: []
        };
    },
    methods: {
        getData () {
            this.columnsList = tableData.table1Columns;
            this.tableData = tableData.table1Data;
            this.editInlineColumns = tableData.editInlineColumns;
            this.editInlineData = tableData.editInlineData;
            this.editIncellColumns = tableData.editIncellColumns;
            this.editIncellData = tableData.editIncellData;
            this.editInlineAndCellColumn = tableData.editInlineAndCellColumn;
            this.editInlineAndCellData = tableData.editInlineAndCellData;
        },
        handleNetConnect (state) {
            this.breakConnect = state;
        },
        handleLowSpeed (state) {
            this.lowNetSpeed = state;
        },
        saveEdit (index, success, fail) {
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(() => {
                if (this.breakConnect) {
                    fail(() => {
                        this.$Message.error('服务器嫌弃你的网络，所以保存失败');
                    });
                } else {
                    success(() => {
                        this.$Message.success('保存成功');
                    });
                }
            }, delay);
        },
        deleteRow (index, success, fail) {
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(() => {
                if (this.breakConnect) {
                    fail(() => {
                        this.$Message.error('服务器嫌弃你的网络，所以删除失败');
                    });
                } else {
                    success(() => {
                        this.$Message.success('删除数据成功~');
                    });
                }
            }, delay);
        },
        saveEditInline (index, success, fail) {
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(() => {
                if (this.breakConnect) {
                    fail(() => {
                        this.$Message.error('服务器嫌弃你的网络，所以保存失败');
                    });
                } else {
                    success(() => {
                        this.$Message.success('保存成功');
                    });
                }
            }, delay);
        },
        deleteRowInline (index, success, fail) {
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(() => {
                if (this.breakConnect) {
                    fail(() => {
                        this.$Message.error('服务器嫌弃你的网络，所以删除失败');
                    });
                } else {
                    success(() => {
                        this.$Message.success('删除数据成功~');
                    });
                }
            }, delay);
        },
        saveEditIncell (index, success, fail) {
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(() => {
                if (this.breakConnect) {
                    fail(() => {
                        this.$Message.error('服务器嫌弃你的网络，所以保存失败');
                    });
                } else {
                    success(() => {
                        this.$Message.success('保存成功');
                    });
                }
            }, delay);
        },
        deleteRowIncell (index, success, fail) {
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(() => {
                if (this.breakConnect) {
                    fail(() => {
                        this.$Message.error('服务器嫌弃你的网络，所以删除失败');
                    });
                } else {
                    success(() => {
                        this.$Message.success('删除数据成功~');
                    });
                }
            }, delay);
        },
        saveEditInlineIncell (index, success, fail) {
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(() => {
                if (this.breakConnect) {
                    fail(() => {
                        this.$Message.error('服务器嫌弃你的网络，所以保存失败');
                    });
                } else {
                    success(() => {
                        this.$Message.success('保存成功');
                    });
                }
            }, delay);
        },
        deleteRowInlineIncell (index, success, fail) {
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(() => {
                if (this.breakConnect) {
                    fail(() => {
                        this.$Message.error('服务器嫌弃你的网络，所以删除失败');
                    });
                } else {
                    success(() => {
                        this.$Message.success('删除数据成功~');
                    });
                }
            }, delay);
        }
    },
    created () {
        this.getData();
    }
};
</script>
