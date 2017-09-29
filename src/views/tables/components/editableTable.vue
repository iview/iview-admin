<style lang="less">
    @import '../../../styles/common.less';
</style>


<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="tableData" border disabled-hover></Table>
    </div>
</template>

<script>
const editButton = (vm, h, currentRow, index) => {
    return h('Button', {
        props: {
            type: currentRow.editting ? 'success' : (currentRow.saveFail ? 'error' : 'primary'),
            loading: currentRow.saving
        },
        on: {
            'click': () => {
                if (currentRow.saveFail) {
                    currentRow.saving = true;
                    vm.saveEdit(vm.editIndex(index), vm.successSave(currentRow), vm.failSave(currentRow));
                } else {
                    if (!currentRow.editting) {
                        currentRow.editting = true;
                    } else {
                        currentRow.saving = true;
                        vm.saveEdit(vm.editIndex(index), vm.successSave(currentRow), vm.failSave(currentRow));
                    }
                }
            }
        }
    }, currentRow.editting ? '保存' : (currentRow.saveFail ? '重试' : '编辑'));
};
const deleteButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要删除这条数据吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                currentRow.isDeleting = true;
                vm.deleteRow(vm.deleteIndex(index), vm.successDel(currentRow), vm.failDel(currentRow));
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 10px'
            },
            props: {
                type: 'error',
                placement: 'top',
                loading: currentRow.isDeleting
            }
        }, '删除')
    ]);
};
export default {
    name: 'EditableTable',
    props: {
        refs: String,
        columnsList: Array,
        tableData: Array,
        url: String,
        saveEdit: {
            type: Function,
            default () {
                return () => {};
            }
        },
        deleteRow: {
            type: Function,
            default () {
                return () => {};
            }
        }
    },
    data () {
        return {
            columns: []
        };
    },
    created () {
        let vm = this;
        this.tableData.map(item => {
            this.$set(item, 'editting', false);
            this.$set(item, 'saving', false);
            this.$set(item, 'saveFail', false);
            this.$set(item, 'isDeleting', false);
            return item;
        });
        this.columnsList.forEach(item => {
            if (item.editable) {
                item.render = (h, param) => {
                    return h('div', {
                        attrs: {
                            contenteditable: this.tableData[param.index].editting
                        },
                        style: {
                            width: '100%',
                            outline: 'none'
                        },
                        on: {
                            'blur' (event) {
                                event = event || window.event;
                                let thisTd = event.srcElement || event.target;
                                vm.tableData[param.index][item.key] = thisTd.innerHTML;
                            }
                        }
                    }, param.row[item.key]);
                };
            }
            if (item.handle) {
                item.render = (h, param) => {
                    if (item.handle.length === 2) {
                        return h('div', [
                            editButton(this, h, this.tableData[param.index], param.index),
                            deleteButton(this, h, this.tableData[param.index], param.index)
                        ]);
                    } else if (item.handle.length === 1) {
                        if (item.handle[0] === 'edit') {
                            return h('div', [
                                editButton(this, h, this.tableData[param.index], param.index)
                            ]);
                        } else {
                            return h('div', [
                                deleteButton(this, h, this.tableData[param.index], param.index)
                            ]);
                        }
                    }
                };
            }
        });
    },
    methods: {
        editIndex (index) {
            return (() => {
                return index;
            })();
        },
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
        },
        deleteIndex (index) {
            return (() => {
                return index;
            })();
        },
        successDel (currentRow) {
            return (callback) => {
                callback();
                currentRow.isDeleting = false;
            };
        },
        failDel (currentRow) {
            return (callback) => {
                callback();
                currentRow.isDeleting = false;
            };
        }
    }
};
</script>
