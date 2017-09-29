<template>
    <div>
        <EditableTable refs="table1" :columns-list="columnsList" :table-data="tableData" :saveEdit="saveEdit"></EditableTable>
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
                    type: 'handle'
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
        saveEdit (success, fail) {
            let vm = this;
            setTimeout(function () {
                fail(() => {
                    vm.$Message.error('对方不想说话，并且向你抛出了一个异常');
                });
            }, 1000);
        }
    },
    mounted () {
        this.getData();
    }
};
</script>
