<template>
    <div>
        <EditableTable refs="table1" :columns-list="columnsList" :table-data="tableData" :saveEdit="saveEdit" :deleteRow="deleteRow"></EditableTable>
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
            tableData: []
        };
    },
    methods: {
        getData () {
            this.columnsList = [
                {
                    title: '序号',
                    type: 'index',
                    width: 60,
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
        saveEdit (index, success, fail) {
            let vm = this;
            setTimeout(function () {
                fail(() => {
                    vm.$Message.error('服务器嫌弃你的网络，所以保存失败');
                });
            }, 1000);
        },
        deleteRow (index, success, fail) {
            let vm = this;
            setTimeout(function () {
                vm.tableData.splice(index, 1);
                success(() => {
                    vm.$Message.success('删除数据成功~');
                });
            }, 1000);
        }
    },
    created () {
        this.getData();
    }
};
</script>
