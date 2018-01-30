<style lang="less">
    @import './advanced-router.less';
</style>

<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="ios-list"></Icon>
                    购物记录(传递参数)
                </p>
                <Row type="flex" justify="center" align="middle" class="advanced-router">
                    <Table :columns="shoppingColumns" :data="shoppingData" style="width: 100%;"></Table>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'argument-page',
    data () {
        return {
            shoppingColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60
                },
                {
                    title: '购物单号',
                    key: 'shopping_id',
                    align: 'center'
                },
                {
                    title: '购买物品名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '购买时间',
                    key: 'time'
                },
                {
                    title: '查看详情',
                    key: 'show_more',
                    align: 'center',
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    let query = {shopping_id: params.row.shopping_id};
                                    this.$router.push({
                                        name: 'shopping',
                                        query: query
                                    });
                                }
                            }
                        }, '了解详情');
                    }
                }
            ],
            shoppingData: [
                {
                    shopping_id: 100001,
                    name: '《vue.js实战》',
                    time: '2017年11月12日'
                },
                {
                    shopping_id: 100002,
                    name: '面包',
                    time: '2017年11月5日'
                },
                {
                    shopping_id: 100003,
                    name: '咖啡',
                    time: '2017年11月8日'
                },
                {
                    shopping_id: 100004,
                    name: '超级豪华土豪金牙签',
                    time: '2017年11月9日'
                }
            ]
        };
    }
};
</script>
