<style lang="less">
    @import '../../../styles/common.less';
    @import './preview.less';
</style>

<template>
    <div class="preview-main">
        <div class="preview-header">
            <Menu mode="horizontal" theme="dark" active-name="1">
                <div class="preview-header-nav">
                    <MenuItem name="1">
                        <Icon type="ios-navigate"></Icon>
                        导航一
                    </MenuItem>
                    <MenuItem name="2">
                        <Icon type="ios-keypad"></Icon>
                        导航二
                    </MenuItem>
                    <MenuItem name="3">
                        <Icon type="ios-analytics"></Icon>
                        导航三
                    </MenuItem>
                    <MenuItem name="4">
                        <Icon type="ios-paper"></Icon>
                        导航四
                    </MenuItem>
                </div>
            </Menu>
        </div>
        <Row class="margin-top-20">
            <Col span="12" offset="5">
                <div>
                    <Card>
                        <h1>{{ articleTitle }}</h1>
                        <p class="preview-publish-time"><Icon type="android-alarm-clock"></Icon>&nbsp;发布时间：{{ publishTime }}</p>
                        <div class="preview-tags-con">
                            <b class="preview-tip"><Icon type="ios-pricetags-outline"></Icon>&nbsp;标签：</b><Tag v-for="item in tagsList" type="border" color="blue" :key="item">{{ item }}</Tag>
                        </div>
                        <div class="preview-content-con" v-html="content"></div>
                        <div class="preview-classifition-con">
                            <b class="preview-tip"><Icon type="navicon-round"></Icon>&nbsp;目录：</b>
                            <a class="preview-classifition-item" v-for="item in classificationSelected" :key="item">
                                <Icon type="android-folder-open"></Icon>
                                {{ item }}
                            </a>
                        </div>
                    </Card>
                </div>
            </Col>
            <Col span="4" class="padding-left-10">
                <div>
                    <Card>
                        <p slot="title">
                            <Icon type="paper-airplane"></Icon>
                            热门文章
                        </p>
                        <div class="preview-placeholderCon">
                            <div class="preview-placeholder"></div>
                            <div class="preview-placeholder"></div>
                            <div class="preview-placeholder"></div>
                            <div class="preview-placeholder"></div>
                        </div>
                    </Card>
                </div>
                <div class="margin-top-10">
                    <Card>
                        <p slot="title">
                            <Icon type="paper-airplane"></Icon>
                            最新文章
                        </p>
                        <div class="preview-placeholderCon">
                            <div class="preview-placeholder"></div>
                            <div class="preview-placeholder"></div>
                            <div class="preview-placeholder"></div>
                            <div class="preview-placeholder"></div>
                        </div>
                    </Card>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            articleTitle: '',
            tagsList: '',
            classificationSelected: [],
            content: '',
            publishTime: ''
        };
    },
    mounted () {
        this.articleTitle = localStorage.articleTitle;
        this.tagsList = localStorage.tagsList ? JSON.parse(localStorage.tagsList) : [];
        this.classificationSelected = localStorage.classificationSelected ? JSON.parse(localStorage.classificationSelected) : [];
        this.content = localStorage.content;
        this.publishTime = localStorage.publishTime;
    }
};
</script>
