<style lang="less">
    @import '../../../styles/common.less';
    @import 'draggable-list.less';
</style>

<template>
    <div>
        <Row>
            <Col span="16">
                <Card>
                    <Row>
                        <Col span="12">
                            <Card dis-hover>
                                <p slot="title">
                                    <Icon type="ios-list-outline"></Icon>
                                    本周欲完成任务清单(拖拽到右侧删除)
                                </p>
                                <div style="height: 360px;">
                                    <ul id="doList" class="iview-admin-draggable-list"></ul>
                                </div>
                            </Card>
                        </Col>
                        <Col span="12" class="padding-left-10">
                            <Card dis-hover>
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
                    <p slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        本周已选任务清单
                    </p>
                    <div style="height: 394px;">
                        <ul class="iview-admin-draggable-list">
                            <li v-for="(item, index) in doArray" :key="index" class="notwrap" :data-index="index">
                                {{ item.content }}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="16">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        可滚动拖拽
                    </p>
                    <Row>
                        <Col span="12">
                            <Card dis-hover>
                                <div style="height: 360px;">
                                    <ul id="affordList" class="iview-admin-draggable-list"></ul>
                                </div>
                            </Card>
                        </Col>
                        <Col span="12" class="padding-left-10">
                            <Card dis-hover>
                                <div style="height: 360px;">
                                    <ul id="shoppingList" class="iview-admin-draggable-list">
                                        <li v-for="(item, index) in shoppingList" :key="index" class="notwrap todolist-item" :data-index="index">
                                            好吃的美食--{{ item.name }}
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
                    <p slot="title">
                        <Icon type="android-funnel"></Icon>
                        买得起的清单
                    </p>
                    <div style="height: 394px;">
                        <ul class="iview-admin-draggable-list">
                            <li v-for="(item, index) in affordList" :key="index" class="notwrap" :data-index="index">
                                {{ item.name }}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import Sortable from 'sortablejs';
export default {
    name: 'draggable-list',
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
            shoppingList: [
                {name: '香肠'},
                {name: '烤鸭'},
                {name: '烧鸡'},
                {name: '卤煮'},
                {name: '酱汁腊肉'},
                {name: '松花小肚'},
                {name: '白丸子'},
                {name: '红丸子'},
                {name: '汆丸子'},
                {name: '蒸熊掌'},
                {name: '蒸羊羔'},
                {name: '蒸鹿尾'},
                {name: '梅菜扣肉'},
                {name: '四喜丸子'},
                {name: '酒酿萝卜皮'},
                {name: '红烧胖大海'},
                {name: '连年有鱼'}
            ],
            affordList: []
        };
    },
    mounted () {
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
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
        let shoppingList = document.getElementById('shoppingList');
        Sortable.create(shoppingList, {
            group: {
                name: 'list',
                pull: true
            },
            animation: 120,
            ghostClass: 'placeholder-style',
            fallbackClass: 'iview-admin-cloned-item',
            onRemove (event) {
                vm.affordList.splice(event.newIndex, 0, vm.shoppingList[event.item.getAttribute('data-index')]);
            }
        });
        let affordList = document.getElementById('affordList');
        Sortable.create(affordList, {
            group: {
                name: 'list',
                pull: true
            },
            sort: false,
            filter: '.iview-admin-draggable-delete',
            animation: 120,
            fallbackClass: 'iview-admin-cloned-item',
            onRemove (event) {
                vm.affordList.splice(event.oldIndex, 1);
            }
        });
    }
};
</script>
