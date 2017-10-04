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
                        s
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
    //
};
</script>
