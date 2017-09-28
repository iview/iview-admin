<template>
    <div>
        <EditableTable refs="table1" :columns-list="columnsList" :table-data="tableData"></EditableTable>
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
                    editable: true,
                    edittype: 'text'
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
                    name: 'lison'
                },
                {
                    name: 'lisa'
                }
            ];
        }
    },
    mounted () {
        this.getData();
    }
};
</script>
