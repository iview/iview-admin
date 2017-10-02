<style lang="less">
    @import '../../../styles/common.less';
    @import 'draggable-list.less';
</style>

<template>
    <div>
        <Col span="16">
            <Card>
                <Row>
                    <Col span="12">
                        <Card>
                            <p slot="title">
                                <Icon type="ios-list-outline"></Icon>
                                本周欲完成任务清单(拖拽到右侧或点击按钮删除)
                            </p>
                            <div style="height: 360px;">
                                <ul id="doList" class="iview-admin-draggable-list"></ul>
                            </div>
                        </Card>
                    </Col>
                    <Col span="12" class="padding-left-10">
                        <Card>
                            <p slot="title">
                                <Icon type="ios-list"></Icon>
                                所剩任务清单(拖拽到左侧添加)
                            </p>
                            <div style="height: 360px;">
                                <ul id="todoList" class="iview-admin-draggable-list">
                                    <li v-for="(item, index) in todoArray" :key="index" class="notwrap todolist-item" :data-index="index">
                                        {{ item.content }}
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Col>
        <Col span="8" class="padding-left-10">
            <Card>
                <Card>
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        本周已选任务清单
                    </p>
                    <div style="height: 360px;">
                        <ul id="doList" class="iview-admin-draggable-list">
                            <li v-for="(item, index) in doArray" :key="index" class="notwrap" :data-index="index">
                                {{ item.content }}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Card>
        </Col>
    </div>
</template>

<script>
import Sortable from 'sortablejs';
export default {
    data () {
        return {
            todoArray: [
                {
                    content: '完成iview-admin基本开发'
                },
                {
                    content: '对iview-admin进行性能优化'
                },
                {
                    content: '对iview-admin的细节进行优化'
                },
                {
                    content: '完成iview-admin开发'
                },
                {
                    content: '解决发现的bug'
                },
                {
                    content: '添加更多组件'
                },
                {
                    content: '封装更多图表'
                },
                {
                    content: '增加更多人性化功能'
                }
            ],
            doArray: [],
            oldIndex: 0,
            todoCloneArray: this.todoArray
        };
    },
    mounted () {
        let vm = this;
        let todoList = document.getElementById('todoList');
        Sortable.create(todoList, {
            group: {
                name: 'list',
                pull: true
            },
            animation: 120,
            ghostClass: 'placeholder-style',
            fallbackClass: 'iview-admin-cloned-item',
            onRemove (event) {
                vm.doArray.splice(event.newIndex, 0, vm.todoArray[event.item.getAttribute('data-index')]);
            }
        });
        let doList = document.getElementById('doList');
        Sortable.create(doList, {
            group: {
                name: 'list',
                pull: true
            },
            sort: false,
            filter: '.iview-admin-draggable-delete',
            animation: 120,
            fallbackClass: 'iview-admin-cloned-item',
            onRemove (event) {
                vm.doArray.splice(event.oldIndex, 1);
            }
        });
    }
};
</script>
