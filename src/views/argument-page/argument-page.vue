<style lang="less">
    @import './argupage.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="android-favorite-outline"></Icon>
                        基础示例
                    </p>
                    <Row type="flex" justify="center" align="middle" class="argupage-open-argupage-row1">
                        <img @click="linkToOwnspace" :src="avatorImage" class="avator-img" alt="">
                        <b>点击头像跳转到该用户个人中心</b>
                    </Row>
                </Card>
            </Col>
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        订单详情
                    </p>
                    <Row type="flex" justify="center" align="middle" class="argupage-open-argupage-row1">
                        <Table :columns="orderColumns" :data="orderData" style="width: 100%;"></Table>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util';
export default {
    data () {
        return {
            orderColumns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 60
                },
                {
                    title: '订单号',
                    key: 'order_id',
                    align: 'center'
                },
                {
                    title: '用户',
                    key: 'user_name',
                    width: 160
                },
                {
                    title: '详情',
                    key: 'show_more',
                    width: 160,
                    align: 'center',
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    let argu = { order_id: params.row.order_id };
                                    util.openNewPage(this, 'order_info', argu);
                                    this.$router.push({
                                        name: 'order_info',
                                        params: argu
                                    });
                                }
                            }
                        }, '了解详情');
                    }
                }
            ],
            orderData: [
                {
                    order_id: '1000001',
                    user_name: 'Aresn'
                },
                {
                    order_id: '1000002',
                    user_name: 'Lison'
                },
                {
                    order_id: '1000003',
                    user_name: 'lili'
                },
                {
                    order_id: '1000004',
                    user_name: 'lala'
                }
            ]
        };
    },
    computed: {
        avatorImage () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        linkToOwnspace () {
            let argu = { username: Cookies.get('user') };
            this.$router.push({
                name: 'ownspace_with_name',
                params: argu
            });
            util.openNewPage(this, 'ownspace_with_name', argu);  // 如果是动态路由，带有参数，那么必须将参数对象传给util.openNewPage方法的第三个参数
        }
    }
};
</script>
