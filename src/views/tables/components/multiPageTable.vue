<template>
    <div>
        <EditableTable :table-data="tableData1" :columns-list="tableColumns1" :saveEdit="saveEdit" :deleteRow="deleteRow"></EditableTable>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="100" :current="1" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    import EditableTable from './editableTable.vue';
    export default {
        name: 'multiPageTable',
        components: {
            EditableTable
        },
        data () {
            return {
                tableData1: this.mockTableData1(),
                tableColumns1: [
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 1 ? 'blue' : row.status === 2 ? 'green' : 'red';
                            const text = row.status === 1 ? '构建中' : row.status === 2 ? '构建完成' : '构建失败';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '内容',
                        key: 'content',
                        editable: true
                    },
                    {
                        title: '取样时段',
                        key: 'time',
                        render: (h, params) => {
                            return h('div', '近' + params.row.time + '天');
                        }
                    },
                    {
                        title: '更新时间',
                        key: 'update',
                        render: (h, params) => {
                            return h('div', this.formatDate(this.tableData1[params.index].update));
                        }
                    },
                    {
                        title: '操作',
                        width: 200,
                        align: 'center',
                        key: 'handle',
                        handle: ['edit', 'delete']
                    }
                ]
            };
        },
        methods: {
            mockTableData1 () {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    data.push({
                        name: '商圈' + Math.floor(Math.random() * 100 + 1),
                        status: Math.floor(Math.random() * 3 + 1),
                        content: '这是测试数据，所以不要理睬这的文字是什么，看效果才是关键对吧',
                        time: Math.floor(Math.random() * 7 + 1),
                        update: new Date()
                    });
                }
                return data;
            },
            formatDate (date) {
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            changePage () {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.tableData1 = this.mockTableData1();
            },
            saveEdit (index, success, fail) {
                success(() => {
                    this.$Message.success('保存成功');
                });
            },
            deleteRow (index, success, fail) {
                this.tableData1.splice(index, 1);
                this.changePage();
                success(() => {
                    this.$Message.success('删除数据成功~');
                });
            }
        }
    };
</script>
