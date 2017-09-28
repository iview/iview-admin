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
    methods: {
        //
    },
    mounted () {
        var el = this.$refs[this.refs].$children[1].$el.children[1];
        let vm = this;
        Sortable.create(el, {
            onStart: vm.start,
            onEnd: vm.end,
            onChoose: vm.choose
        });
    }
};
</script>
