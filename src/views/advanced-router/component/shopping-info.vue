<style lang="less">
    @import '../../../styles/common.less';
    @import '../advanced-router.less';
</style>

<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="compose"></Icon>
                    订单详情
                </p>
                <Table :columns="shopping_col" :data="shopping_data"></Table>
            </Card>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'shopping-info',
    data () {
        return {
            showInfo: false,
            shopping_col: [
                {
                    title: '购买物品名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '购买时间',
                    key: 'time',
                    align: 'center'
                },
                {
                    title: '价格',
                    key: 'price',
                    align: 'center'
                }
            ],
            shopping_data: []
        };
    },
    methods: {
        init () {
            let name = '';
            let time = '';
            let price = '';
            switch (this.$route.query.shopping_id.toString()) {
                case '100001': name = '《vue.js实战》'; time = '2017年11月12日 13：33：24'; price = '79'; break;
                case '100002': name = '面包'; time = '2017年11月5日 19：13：24'; price = '10'; break;
                case '100003': name = '咖啡'; time = '2017年11月8日 10：39：24'; price = '57'; break;
                case '100004': name = '超级豪华土豪金牙签'; time = '2017年11月9日 11：45：24'; price = '200'; break;
            }
            let shoppingInfor = {
                name: name,
                time: time,
                price: price
            };
            this.shopping_data = [shoppingInfor];
        }
    },
    mounted () {
        this.init();
    },
    watch: {
        '$route' () {
            this.init();
        }
    }
};
</script>
