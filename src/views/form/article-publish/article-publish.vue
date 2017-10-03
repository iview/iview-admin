<style lang="less">
    @import '../../../styles/common.less';
    @import './article-publish.less';
</style>

<template>
    <div>
        <Row>
            <Col span="18">
                <Card>
                    <Form :label-width="80">
                        <FormItem label="文章标题" :error="articleError">
                            <Input v-model="articleTitle" @on-blur="handleArticletitleBlur" icon="android-list"/>
                        </FormItem>
                        <div class="article-link-con">
                            <FormItem v-show="showLink" label="固定链接">
                                <span>{{ fixedLink }}</span><span v-if="!editLink">{{ articlePath }}</span>
                                <Input v-model="articlePath" style="display:inline-block;width:auto"  v-else/>
                                <span style="float:right;">
                                    <Button :type="editPathButtonType" @click="editArticlePath">{{ editPathButtonText }}</Button>
                                </span>
                            </FormItem>
                        </div>
                    </Form>
                </Card>
            </Col>
            <Col span="6" class="padding-left-10">
                <Card></Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            articleTitle: '',
            articleError: '',
            showLink: false,
            fixedLink: '',
            articlePath: '',
            articlePathHasEdited: false,
            editLink: false,
            editPathButtonType: 'ghost',
            editPathButtonText: '编辑'
        };
    },
    methods: {
        handleArticletitleBlur () {
            if (this.articleTitle.length !== 0) {
                // this.articleError = '';
                if (!this.articlePathHasEdited) {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDay() + 1;
                    this.fixedLink = window.location.host + '/' + year + '/' + month + '/' + day + '/';
                    this.articlePath = this.articleTitle;
                    this.articlePathHasEdited = true;
                    this.showLink = true;
                }
            } else {
                // this.articleError = '文章标题不可为空哦';
                this.$Message.error('文章标题不可为空哦');
            }
        },
        editArticlePath () {
            this.editLink = !this.editLink;
            this.editPathButtonType = this.editPathButtonType === 'ghost' ? 'success' : 'ghost';
            this.editPathButtonText = this.editPathButtonText === '编辑' ? '完成' : '编辑';
        }
    }
};
</script>
