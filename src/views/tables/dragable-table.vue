<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <Row>
            <Col span="16">
                <Card>
                    <DragableTable 
                        v-model="tableData" 
                        :columns-list="columnsList" 
                        @on-start="handleOnstart1" 
                        @on-end="handleOnend1" 
                    ></DragableTable>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10 height-100" >
                <Card>
                    <p slot="title">
                        <Icon type="clipboard"></Icon>
                        表格1操作记录( 拖拽 )
                    </p>
                    <Row style="height: 374px;">
                        <div class="dragging-tip-con">
                            <transition name="dragging-tip">
                                <span v-show="table1.isDragging">您正在拖拽表格1单元行...</span>
                            </transition>
                        </div>
                        <Card>
                            <div class="record-tip-con">
                                <div v-for="(item, index) in table1.draggingRecord" :key="index" class="record-item">
                                    拖拽第 {{ item.from }} 行表格到第 {{ item.to }} 行
                                </div>
                            </div>
                        </Card>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="8" class="height-100" >
                <Card>
                    <p slot="title">
                        <Icon type="clipboard"></Icon>
                        表格2操作记录( 点击和拖拽 )  
                    </p>
                    <Row style="height: 374px;">
                        <div class="dragging-tip-con">
                            <transition name="dragging-tip">
                                <span v-show="table2.hasDragged">拖拽第 {{ table2.oldIndex + 1 }} 行表格到第 {{ table2.newIndex + 1 }} 行</span>
                            </transition>
                        </div>
                        <Card>
                            <div class="record-tip-con">
                                <div v-for="(item, index) in table2.chooseRecord" :key="index" class="record-item">
                                    {{ item }}
                                </div>
                            </div>
                        </Card>
                    </Row>
                </Card>
            </Col>
            <Col span="16" class="padding-left-10">
                <Card>
                    <DragableTable refs="table2" :columnsList="columnsList" v-model="tableData" @on-start="handleOnstart2" @on-end="handleOnend2" @on-choose="handleOnchoose2" ></DragableTable>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import DragableTable from './components/dragableTable.vue';

export default {
    name: 'dragable-table',
    components: {
        DragableTable
    },
    data () {
        return {
            columnsList: [],
            tableData: [],
            table1: {
                hasDragged: false,
                isDragging: false,
                oldIndex: 0,
                newIndex: 0,
                draggingRecord: []
            },
            table2: {
                hasDragged: false,
                isDragging: false,
                oldIndex: 0,
                newIndex: 0,
                chooseRecord: []
            }
        };
    },
    methods: {
        handleOnstart1 (from) {
            this.table1.oldIndex = from;
            this.table1.hasDragged = true;
            this.table1.isDragging = true;
        },
        handleOnend1 (e) {
            this.table1.isDragging = false;
            this.table1.draggingRecord.unshift({
                from: e.from + 1,
                to: e.to + 1
            });
        },
        handleOnstart2 (from) {
            this.table2.oldIndex = from;
            this.table2.hasDragged = true;
            this.table2.isDragging = true;
        },
        handleOnend2 (e) {
            this.table2.newIndex = e.to;
            this.table2.isDragging = false;
        },
        handleOnchoose2 (from) {
            this.table2.chooseRecord.unshift(this.tableData[from].todoItem);
        },
        getData () {
            this.columnsList = [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '待办事项',
                    key: 'todoItem'
                },
                {
                    title: '备注',
                    key: 'remarks'
                },
                {
                    title: '拖拽',
                    key: 'drag',
                    width: 90,
                    align: 'center',
                    render: (h) => {
                        return h(
                            'Icon',
                            {
                                props: {
                                    type: 'arrow-move',
                                    size: 24
                                }
                            }
                        );
                    }
                }
            ];
            this.tableData = [
                {
                    todoItem: '明天去后海玩',
                    remarks: '估计得加班'
                },
                {
                    todoItem: '后天去和妹子看电影',
                    remarks: '可能没妹子'
                },
                {
                    todoItem: '大后天去吃海天盛筵',
                    remarks: '没钱就不去了'
                },
                {
                    todoItem: '周末去看电影',
                    remarks: '估计得加班'
                },
                {
                    todoItem: '下个月准备回家看父母',
                    remarks: '估计得加班'
                },
                {
                    todoItem: '该买回家的票了',
                    remarks: '可能没票了'
                },
                {
                    todoItem: '过年不回家和父母视频聊天',
                    remarks: '一定要记得'
                },
                {
                    todoItem: '去车站接父母一起在北京过年',
                    remarks: 'love'
                }
            ];
        }
    },
    created () {
        // 可在此从服务端获取表格数据
        this.getData();
    }
};
</script>
