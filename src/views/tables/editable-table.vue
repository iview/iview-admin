<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <Row>
            <Col span="8">
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
            <Col span="16" class="padding-left-10">
                <Card>
                    <div class="edittable-con-1">
                            <EditableTable refs="table1" :columns-list="columnsList" :table-data="tableData" :saveEdit="saveEdit" :deleteRow="deleteRow"></EditableTable>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import EditableTable from './components/editableTable.vue';
export default {
    components: {
        EditableTable
    },
    data () {
        return {
            columnsList: [],
            tableData: [],
            breakConnect: false,
            lowNetSpeed: false
        };
    },
    methods: {
        getData () {
            this.columnsList = [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '姓名',
                    align: 'center',
                    key: 'name',
                    editable: true
                },
                {
                    title: '性别',
                    align: 'center',
                    key: 'sex'
                },
                {
                    title: '岗位',
                    align: 'center',
                    key: 'work',
                    editable: true
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 200,
                    key: 'handle',
                    handle: ['edit', 'delete']
                }
            ];
            this.tableData = [
                {
                    name: 'Aresn',
                    sex: '男',
                    work: '前端开发'
                },
                {
                    name: 'Lison',
                    sex: '男',
                    work: '前端开发'
                },
                {
                    name: 'lisa',
                    sex: '女',
                    work: '程序员鼓励师'
                }
            ];
        },
        handleNetConnect (state) {
            this.breakConnect = state;
        },
        handleLowSpeed (state) {
            this.lowNetSpeed = state;
        },
        saveEdit (index, success, fail) {
            let vm = this;
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(function () {
                if (vm.breakConnect) {
                    fail(() => {
                        vm.$Message.error('服务器嫌弃你的网络，所以保存失败');
                    });
                } else {
                    success(() => {
                        vm.$Message.success('保存成功');
                    });
                }
            }, delay);
        },
        deleteRow (index, success, fail) {
            let vm = this;
            let delay = 0;
            if (this.lowNetSpeed) {
                delay = 1000;
            }
            setTimeout(function () {
                if (vm.breakConnect) {
                    fail(() => {
                        vm.$Message.error('服务器嫌弃你的网络，所以删除失败');
                    });
                } else {
                    vm.tableData.splice(index, 1);
                    success(() => {
                        vm.$Message.success('删除数据成功~');
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
