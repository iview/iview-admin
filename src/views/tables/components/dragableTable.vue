<template>
    <div>
        <Table 
            :ref="refs" 
            :columns="columnsList" 
            :data="tableData" 
            highlight-row 
            border
        ></Table>
    </div>
</template>

<script>
import Sortable from 'sortablejs';
import util from '@/libs/util.js';

export default {
    name: 'DragableTable',
    props: {
        refs: String,
        columnsList: Array,
        tableData: Array,
        start: Function,
        end: Function,
        choose: Function
    },
    data () {
        return {
            oldIndex: 0,
            newTableData: []
        };
    },
    mounted () {
        // tableData保存个副本 每次拖拽后同步数据
        this.newTableData = JSON.parse(JSON.stringify(this.tableData));
        let el = this.$refs[this.refs].$children[1].$el.children[1];
        let vm = this;
        Sortable.create(el, {
            onStart: vm.start,
            onEnd: (endEl) => {
                this.newTableData = util.dragableArray(this.newTableData, endEl.oldIndex, endEl.newIndex);
                vm.end && vm.end(endEl, this.newTableData);
            },
            onChoose: vm.choose
        });
    }
};
</script>
