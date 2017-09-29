<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="tableData" border></Table>
    </div>
</template>

<script>
const editButton = (vm, h, currentRow) => {
    return h('Button', {
        props: {
            type: currentRow.editting ? 'success' : (currentRow.saveFail ? 'error' : 'primary'),
            loading: currentRow.saving
        },
        on: {
            'click': () => {
                if (currentRow.saveFail) {
                    currentRow.saving = true;
                    vm.saveEdit(vm.successSave(currentRow), vm.failSave(currentRow));
                } else {
                    if (!currentRow.editting) {
                        currentRow.editting = true;
                    } else {
                        currentRow.saving = true;
                        vm.saveEdit(vm.successSave(currentRow), vm.failSave(currentRow));
                    }
                }
            }
        }
    }, currentRow.editting ? '保存' : (currentRow.saveFail ? '重试' : '编辑'));
};
export default {
    name: 'EditableTable',
    props: {
        refs: String,
        columnsList: Array,
        tableData: Array,
        url: String,
        saveEdit: Function
    },
    data () {
        return {
            columns: []
        };
    },
    beforeUpdate () {
        let vm = this;
        this.tableData.map(item => {
            this.$set(item, 'editting', false);
            this.$set(item, 'saving', false);
            this.$set(item, 'saveFail', false);
            return item;
        });
        this.columnsList.map(item => {
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
                        },
                        on: {
                            'keyup' (event) {
                                event = event || window.event;
                                let thisTd = event.srcElement || event.target;
                                vm.tableData[param.index][item.key] = thisTd.innerHTML;
                            }
                        }
                    }, param.row[item.key]);
                };
            }
            if (item.type === 'handle') {
                item.render = (h, param) => {
                    return h('div', [
                        editButton(this, h, this.tableData[param.index])
                    ]);
                };
            }
        });
    },
    methods: {
        successSave (currentRow) {
            return (callback) => {
                currentRow.editting = false;
                currentRow.saveFail = false;
                currentRow.saving = false;
                callback();
            };
        },
        failSave (currentRow) {
            return (callback) => {
                currentRow.editting = false;
                currentRow.saveFail = true;
                currentRow.saving = false;
                callback();
            };
        }
    },
    mounted () {
        //
    }
};
</script>
