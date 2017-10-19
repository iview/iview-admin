<style lang="less">
    @import './editable-table.less';
</style>


<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="thisTableData" border disabled-hover></Table>
    </div>
</template>

<script>
const editButton = (vm, h, currentRow, index) => {
    return h('Button', {
        props: {
            type: currentRow.editting ? 'success' : (currentRow.saveFail ? 'error' : 'primary'),
            loading: currentRow.saving
        },
        style: {
            margin: '0 5px'
        },
        on: {
            'click': () => {
                if (currentRow.saveFail) {
                    currentRow.saving = vm.edittingStore[index].saving = true;
                    vm.saveEdit(vm.editIndex(index), vm.successSave(currentRow, vm, index), vm.failSave(currentRow, vm, index));
                } else {
                    if (!currentRow.editting) {
                        if (currentRow.edittingCell) {
                            for (let name in currentRow.edittingCell) {
                                currentRow.edittingCell[name] = false;
                                vm.edittingStore[index].edittingCell[name] = false;
                            }
                        }
                        currentRow.editting = vm.edittingStore[index].editting = true;
                    } else {
                        currentRow.saving = vm.edittingStore[index].saving = true;
                        vm.saveEdit(vm.editIndex(index), vm.successSave(currentRow, vm, index), vm.failSave(currentRow, vm, index));
                    }
                }
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
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
                vm.deleteRow(vm.deleteIndex(index), vm.successDel(vm, index), vm.failDel(vm, index));
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top',
                loading: currentRow.isDeleting
            }
        }, '删除')
    ]);
};
const incellEditBtn = (vm, h, param) => {
    if (vm.hoverShow) {
        return h('div', {
            'class': {
                'show-edit-btn': vm.hoverShow
            }
        }, [
            h('Button', {
                props: {
                    type: 'text',
                    icon: 'edit'
                },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            })
        ]);
    } else {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
            }
        });
    }
};
const saveIncellEditBtn = (vm, h, param) => {
    return h('Button', {
        props: {
            type: 'text',
            icon: 'checkmark'
        },
        on: {
            click: (event) => {
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
            }
        }
    });
};
const cellInput = (vm, h, param, item) => {
    return h('Input', {
        props: {
            type: 'text',
            value: vm.edittingStore[param.index][item.key]
        },
        on: {
            'on-change' (event) {
                let key = item.key;
                vm.edittingStore[param.index][key] = event.target.value;
            }
        }
    });
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
        },
        editIncell: {
            type: Boolean,
            default: false
        },
        hoverShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            columns: [],
            thisTableData: [],
            edittingStore: []
        };
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            let vm = this;
            let editableCell = this.columnsList.filter(item => {
                if (item.editable) {
                    if (item.editable === true) {
                        return item;
                    }
                }
            });
            let cloneData = JSON.parse(JSON.stringify(this.tableData));
            let res = [];
            res = cloneData.map(item => {
                this.$set(item, 'editting', false);
                this.$set(item, 'saving', false);
                this.$set(item, 'saveFail', false);
                this.$set(item, 'isDeleting', false);
                let edittingCell = {};
                editableCell.forEach(item => {
                    edittingCell[item.key] = false;
                });
                this.$set(item, 'edittingCell', edittingCell);
                return item;
            });
            this.thisTableData = res;
            this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
            this.columnsList.forEach(item => {
                if (item.editable) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        if (!currentRow.editting) {
                            if (this.editIncell) {
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    }
                                }, [
                                    h('Col', {
                                        props: {
                                            span: '22'
                                        }
                                    }, [
                                        !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                    ]),
                                    h('Col', {
                                        props: {
                                            span: '2'
                                        }
                                    }, [
                                        currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                    ])
                                ]);
                            } else {
                                return h('span', currentRow[item.key]);
                            }
                        } else {
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: currentRow[item.key]
                                },
                                on: {
                                    'on-change' (event) {
                                        let key = param.column.key;
                                        vm.edittingStore[param.index][key] = event.target.value;
                                    }
                                }
                            });
                        }
                    };
                }
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        if (item.handle.length === 2) {
                            return h('div', [
                                editButton(this, h, currentRowData, param.index),
                                deleteButton(this, h, currentRowData, param.index)
                            ]);
                        } else if (item.handle.length === 1) {
                            if (item.handle[0] === 'edit') {
                                return h('div', [
                                    editButton(this, h, currentRowData, param.index)
                                ]);
                            } else {
                                return h('div', [
                                    deleteButton(this, h, currentRowData, param.index)
                                ]);
                            }
                        }
                    };
                }
            });
        },
        editIndex (index) {
            return (() => {
                return index;
            })();
        },
        successSave (currentRow, vm, index) {
            return (callback) => {
                let edittingRow = vm.edittingStore[index];
                edittingRow.editting = false;
                edittingRow.saveFail = false;
                edittingRow.saving = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                callback();
            };
        },
        failSave (currentRow, vm, index) {
            return (callback) => {
                let edittingRow = vm.edittingStore[index];
                edittingRow.editting = false;
                edittingRow.saveFail = true;
                edittingRow.saving = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                callback();
            };
        },
        deleteIndex (index) {
            return (() => {
                return index;
            })();
        },
        successDel (vm, index) {
            return (callback) => {
                callback();
                let edittingRow = vm.edittingStore[index];
                vm.edittingStore.splice(index, 1);
                edittingRow.isDeleting = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
            };
        },
        failDel (vm, index) {
            return (callback) => {
                callback();
                let edittingRow = vm.edittingStore[index];
                edittingRow.isDeleting = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
            };
        }
    },
    watch: {
        tableData (data) {
            this.init();
        }
    }
};
</script>
