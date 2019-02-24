<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入新闻标题搜索" class="search-input" v-model="query.title"/>
            <Button @click="handleGetNewss" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleAddNew" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑新闻" v-model="drawer.edit" width="100%" :mask-closable="false" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="8">
                    <FormItem label="标题：" prop="title" label-position="left">
                        <Input v-model="form.edit.title" placeholder="请输入新闻标题" />
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="状态：" prop="status" label-position="top">
                        <Select v-model="form.edit.status" class="search-col">
                            <Option v-for="item in select.status" :value="item.value" :key="item.value">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="来源：" prop="source" label-position="left">
                        <Input v-model="form.edit.source" placeholder="请输入新闻来源" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="8">
                    <FormItem label="标签：" prop="tag" label-position="left">
                        <Input v-model="form.edit.tag" placeholder="请输入新闻标签" />
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="跳转：" prop="redirect_url" label-position="left">
                        <Input v-model="form.edit.redirect_url" placeholder="请输入跳转地址" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="上传宣传图：" prop="pic" label-position="left">
                       <BaseUpload :refType="refType" multiple :upid="form.edit.img_id" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="描述：" prop="desc" label-position="left">
                        <Input v-model="form.edit.desc" type="textarea" :rows="3" placeholder="请输入描述" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <editor ref="editor" @on-change="handleChange" :value="form.edit.content"/>
                </Col>
            </Row>
        </Form>
        <br/>
        <div style="margin-left:40%">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>    
  </div>
</template>

<script>
import './index.less'
import Editor from '_c/editor'
import BaseUpload from '@/view/base/base_upload'
import { getNewss,saveNews,getNews,delNews,getContent } from '@/api/truck/news'
import { getUpload,getUploadIdsByRef,getRefId} from '@/api/base/upload'

export default {
  components: {
    Editor,BaseUpload
  },
  data () {
    return {
        refType:3,
        content:'',
        modal:{
            delete:false
        },
        drawer:{
            edit:false,
        },
        form:{
            edit:{
                id:'',
                title:'',
                status:'1',
                content:''
            },
        },
        rules:{
            edit:{
                title:[{required:true,message:'标题不能为空',trigger:'blur'}],
            },
        },
        select:{
            status:[
                {name:'草稿' ,value:0 },
                {name:'发表' ,value:1 },
                {name:'撤回' ,value:2 },
            ],
        },
        columns: [
            {title: 'ID',key: 'id'},
            {title: '标题',key: 'title'},
            {title: '用户ID',key: 'user_id'},
            {title: '创建时间',key: 'ctime'},
            {
                title: '状态',
                key: 'status',
                align: 'center',
                render: (h, params) => {
                    let status = params.row.status;
                    if(status == 0){
                        return h('span',{}, '草稿')
                    }else if(status == 1){
                        return h('span',{}, '发表')
                    }else{
                        return h('span',{}, '撤回')
                    }
                } 
            },
            {
                title: '操作',
                key: 'status',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style:{
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.handleDelete(params)
                                }
                            }
                        }, '删除'),
                        h('Button', {
                            props: {
                                type: 'info',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.handleEdit(params)
                                }
                            }
                        }, '编辑')
                    ]);
                }
            }
        ],
        data: [],
        page:{
            current:1,
            total:0,
            pageSize:10
        },
      query:{
          page:1
      }

    }
  },
  methods: {
    handleChange (html, text) {
        this.form.edit.content = html
    },
    handleChangePage(page){
        this.query.page = page;
        this.handleGetNewss();
    },
    handleAddNew(){
        getRefId(2).then(res => {
            if(res.data.status == 1){
                // this.form.edit.pic_id = res.data.data.id
                this.drawer.edit = true
                this.form.edit={
                    id:'',
                    title:'',
                    status:'0',
                    order:1,
                    content:'',
                    img_id:res.data.data.id
                }
                this.$refs.editor.setHtml('')
            }
        })
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                saveNews(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetNewss();
                        this.$refs[name].resetFields();
                        this.drawer.edit=false
                    }
                }).catch(e=>{
                    console.log(e);
                });
            } else {
                this.$Message.error('请按照格式填写表单!');
            }
        })
    },
    handleGetNewss(){
        getNewss(this.query).then((res)=>{
            this.data = res.data.data.rows;
            this.page.current=res.data.data.pageNum
            this.page.total=res.data.data.total
            this.page.pageSize=res.data.data.pageSize
        });
    },
    handleDelete (params) {
        let config={
            title:'提醒',
            content:'确定要删除id为：'+params.row.id+"的记录？",
            onOk:()=>{
                let id = params.row.id;
                delNews(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetNewss()
                    }else{
                        this.$Message.error(res.data.msg)
                    }
                })
            },
            onCancel:()=>{return false},
        }
        let confirm = this.$Modal.confirm(config);
    },
    handleEdit (params) {
        let id = params.row.id;
        getNews(id).then(res =>{
            if(res.data.status == 1){
                this.form.edit = res.data.data
                this.drawer.edit = true;
                getContent(res.data.data.content_id).then(res =>{
                    this.form.edit.content = res.data.data.content
                    this.$refs.editor.setHtml(res.data.data.content)
                })
            }
        })
    }
  },
  mounted () {
    this.handleGetNewss();
  }
}
</script>

<style>

</style>
