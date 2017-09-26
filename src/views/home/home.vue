<template>
    <div class="home-main">
        <Row>
            <Col span="8">
                <Row>
                    <Card>
                        <Row type="flex" class="user-infor">
                            <Col span="8">
                                <Row class-name="made-child-con-middle" type="flex" align="middle">
                                    <img class="avator-img" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                                </Row>
                            </Col>
                            <Col span="16" style="padding-left:6px;">
                                <Row class-name="made-child-con-middle" type="flex" align="middle">
                                    <div>
                                        <b class="card-user-infor-name">Admin</b>
                                        <p>super admin</p>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                        <div class="line-gray"></div>
                        <Row class="margin-top-8">
                            <Col span="8">上次登录时间:</Col>
                            <Col span="16" class="padding-left-8">2017.09.12-13:32:20</Col>
                        </Row>
                        <Row class="margin-top-8">
                            <Col span="8">上次登录地点:</Col>
                            <Col span="16" class="padding-left-8">北京</Col>
                        </Row>
                    </Card>
                </Row>
                <Row class="margin-top-10">
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="android-checkbox-outline"></Icon>
                            待办事项
                        </p>
                        <a type="text" slot="extra" @click.prevent="addNewToDoItem">
                            <Icon type="plus-round"></Icon>
                        </a>
                        <Row class="to-do-list-con">
                            <Row v-for="(item, index) in toDoList" :key="index" class="to-do-item">
                                <Checkbox :v-model="index">{{ item.title }}</Checkbox>
                            </Row>
                        </Row>
                    </Card>
                </Row>
            </Col>
            <Col span="16" class-name="padding-left-5">
                <Row>
                    <Col span="6">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="count.createUser"
                                iconType="android-person-add"
                                color="#2d8cf0"
                                intro-text="今日新增用户"
                            ></infor-card>
                        
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.visit"
                            iconType="ios-eye"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="今日浏览量"
                        ></infor-card>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <infor-card
                            id-name="collection_count"
                            :end-val="count.collection"
                            iconType="upload"
                            color="#ffd572"
                            intro-text="今日数据采集量"
                        ></infor-card>
                    </Col>
                    <Col span="6" class-name="padding-left-5">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.transfer"
                            iconType="shuffle"
                            color="#f25e43"
                            intro-text="今日服务调用量"
                        ></infor-card>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Card :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="map"></Icon>
                            今日流量地理分布
                        </p>
                        <Row class="map-con">
                            <Col span="10">12</Col>
                            <Col span="14" class="map-incon">
                                <Row type="flex" justify="center" align="middle">
                                    <home-map></home-map>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        上周每日来访量统计
                    </p>
                    <Row class="data-source-row">
                        <!-- <visite-volume></visite-volume> -->
                    </Row>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        数据来源统计
                    </p>
                    <Row class="data-source-row">
                        <!-- <data-source-pie></data-source-pie> -->
                    </Row>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        各类用户服务调用变化统计
                    </p>
                    <Row class="data-source-row">
                        <!-- <user-flow></user-flow> -->
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-bottom-100">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    上周每日服务调用量(万)
                </p>
                <Row class="line-chart-con">
                    <!-- <service-requests></service-requests> -->
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>

import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';

export default {
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow,
        countUp,
        inforCard
    },
    data () {
        return {
            toDoList:[
                {
                    title: '去iView官网学习完整的iView组件只是打发斯蒂芬斯蒂芬斯蒂芬斯蒂芬',
                    time: '1506257011'
                },
                {
                    title: '去iView官网学习完整的iView组件',
                    time: '1506257011'
                },
                {
                    title: '去iView官网学习完整的iView组件',
                    time: '1506257011'
                },
                {
                    title: '去iView官网学习完整的iView组件',
                    time: '1506257011'
                },
                {
                    title: '去iView官网学习完整的iView组件',
                    time: '1506257011'
                }
            ],
            count: {
                createUser: 496,
                visit: 3264,
                collection: 24389305,
                transfer: 39503498
            }
        }
    },
    methods: {
        addNewToDoItem () {
            console.log(123)
        },
        init () {
            setInterval( () => {
                this.count.createUser += parseInt(Math.random()*10);
                this.count.visit += parseInt(Math.random()*100);
                this.count.collection += parseInt(Math.random()*10000);
                this.count.transfer += parseInt(Math.random()*100000);
            },10000)
        }
    },
    mounted () {
        this.init()
    }
}
</script>

<style scoped>
.home-main{
    /* padding: 10px; */
}
.user-infor{
    height: 120px;
}
.padding-left-5{
    padding-left: 10px;
}
.avator-img{
    display: block;
    width: 80%;
    max-width: 100px;
    height: auto;
}
.card-user-infor-name{
    font-size: 2em;
    color: #2d8cf0;
}
.card-title{
    color: #abafbd;
}
.made-child-con-middle{
    height: 100%;
}
.to-do-list-con{
    height: 160px;
    overflow: auto;
}
.to-do-item{
    padding: 2px;
}
.infor-card-con{
    height: 100px;
}
.infor-card-icon-con{
    height: 100%;
    color: white;
    border-radius: 3px 0 0 3px;
}

.infor-card-count{
    font-size: 30px;
    font-weight: 700;
    text-align: center;
}
.infor-intro-text{
    font-size:12px;
    font-weight:500;
    color:#C8C8C8;
}
.infor-card-icon-con1{
    background-color: #2d8cf0;
}
.user-created-count{
    color: #2d8cf0;
}
.infor-card-icon-con2{
    background-color: #64d572;
}
.visit-count{
    color: #64d572;
}
.infor-card-icon-con3{
    background-color: #ffd572;
}
.collection-count{
    color: #ffd572;
}
.infor-card-icon-con4{
    background-color: #f25e43;
}
.transfer-count{
    color: #f25e43;
}
.map-con{
    height: 305px;
}
.map-incon{
    height: 100%;
}
.data-source-row{
    height: 200px;
}
.line-chart-con{
    height: 200px;
}
.margin-top-8{
    margin-top: 8px;
}
.margin-top-10{
    margin-top: 10px;
}
.margin-left-10{
    margin-left: 10px;
}
.margin-bottom-100{
    margin-bottom: 100px;
}
.padding-left-6{
    padding-left: 6px;
}
.padding-left-8{
    padding-left: 5px;
}
.padding-left-10{
    padding-left: 10px;
}
.line-gray{
    height: 0;
    border-bottom: 2px solid #dcdcdc;
}
</style>
