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
                            <transition name="fixed-link">
                                <FormItem v-show="showLink" label="固定链接">
                                    <span>
                                        <span key="pathfixedtext">{{ fixedLink }}</span><span key="pathText" v-if="!editLink">{{ articlePath }}</span>
                                        <Input key="pathInput" v-model="articlePath" style="display:inline-block;width:auto"  v-else/>
                                    </span>
                                    <span style="float:right;">
                                        <Button :type="editPathButtonType" @click="editArticlePath">{{ editPathButtonText }}</Button>
                                    </span>
                                </FormItem>
                            </transition>
                        </div>
                    </Form>
                    <div class="margin-top-20">
                        <textarea id="articleEditor"></textarea>
                    </div>
                </Card>
            </Col>
            <Col span="6" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        发布
                    </p>
                    <!-- <div>
                        <span><Button>保存草稿</Button></span>
                        <span style="float:right;"><Button>预览</Button></span>
                    </div> -->
                    <p class="margin-top-10">
                        <Icon type="android-time"></Icon>&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp; 态：
                        <Select size="small" style="width:70px">
                            <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
                        </Select>
                    </p>
                    <p class="margin-top-10">
                        <Icon type="android-time"></Icon>&nbsp;&nbsp;公开度：&nbsp;<b>{{ Openness }}</b><Button v-show="!editOpenness" @click="handleEditOpenness" type="text">修改</Button>
                        <transition name="openness-con">
                            <div v-show="editOpenness" class="openness-radio-con">
                                <RadioGroup v-model="currentOpenness" vertical>
                                    <Radio label="公开">
                                        公开
                                        <Checkbox v-show="currentOpenness === '公开'" v-model="topArticle">在首页置顶这篇文章</Checkbox>
                                    </Radio>
                                    <Radio label="密码">
                                        密码
                                        <Input v-show="currentOpenness === '密码'" style="width:120px" size="small" placeholder="请输入密码"/>
                                    </Radio>
                                    <Radio label="私密"></Radio>
                                </RadioGroup>
                                <div>
                                    <Button type="primary" @click="handleSaveOpenness">确认</Button>
                                    <Button type="ghost" @click="cancelEditOpenness">取消</Button>
                                </div>
                            </div>
                        </transition>
                    </p>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import tinymce from 'tinymce';
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
            editPathButtonText: '编辑',
            articleStateList: [{value: '草稿'}, {value: '等待复审'}],
            editOpenness: false,
            Openness: '公开',
            currentOpenness: '公开',
            topArticle: false
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
        },
        handleEditOpenness () {
            this.editOpenness = !this.editOpenness;
        },
        handleSaveOpenness () {
            this.Openness = this.currentOpenness;
            this.editOpenness = false;
        },
        cancelEditOpenness () {
            this.currentOpenness = this.Openness;
            this.editOpenness = false;
        }
    },
    mounted () {
        tinymce.init({
            selector: '#articleEditor',
            branding: false,
            elementpath: false,
            height: 400,
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                'searchreplace visualblocks visualchars code fullscreen fullpage',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
            autosave_interval: '20s',
            image_advtab: true,
            table_default_styles: {
                width: '100%',
                borderCollapse: 'collapse'
            }
        });
    },
    destroyed () {
        tinymce.get('articleEditor').destroy();
    }
};
</script>
