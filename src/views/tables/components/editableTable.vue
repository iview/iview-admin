<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="tableData"></Table>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import Vue from 'Vue';
const editButton = function (h, canEdit, buttonText, buttonType) {
    return h('Button', {
        props: {
            type: buttonType
        },
        on: {
            'click' (event, buttonText, buttonType) {
                canEdit = true;
                buttonText = buttonText === '编辑' ? '完成' : '编辑';
                buttonType = buttonType === 'primary' ? 'success' : 'primary';
            }
        }
    }, buttonText);
};
export default {
    name: 'EditableTable',
    props: {
        refs: String,
        columnsList: Array,
        tableData: Array
    },
    data () {
        return {
            columns: []
        };
    },
    beforeUpdate () {
        this.tableData.map(item => {
            this.$set(item, 'editting', false);
            return item;
        });
        console.log(this.columnsList)
        this.columnsList.map(item => {
            // this.$set(item, 'editting', false);
            if (item.editable) {
                item.render = (h, param) => {
                    return h('div', {
                        attrs: {
                            contenteditable: this.tableData[param.index].editting
                        },
                        style: {
                            width: '100%',
                            height: '30px',
                            outline: 'none',
                            fontSize: '16px',
                            lineHeight: '30px'
                        }
                    }, param.row.name);
                };
            }
            if (item.type === 'handle') {
                item.render = (h, param) => {
                    return h('Button', {
                        props: {
                            type: this.tableData[param.index].editting ? 'success' : 'primary'
                        },
                        on: {
                            'click': () => {
                                console.log(this.tableData[param.index])
                                this.tableData[param.index].editting = !this.tableData[param.index].editting;
                            }
                        }
                    }, this.tableData[param.index].editting ? '完成' : '编辑');
                };
            }
        });
    },
    mounted () {
        //
    }
};
</script>
