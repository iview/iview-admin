<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入名称搜索" class="search-input" v-model="query.name"/>
            <Select v-model="query.type" class="search-col" placeholder="请选择类型" >
                <Option v-for="item in select.type" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Button @click="handleGetUploads" class="search-btn" type="primary">搜索</Button>
            <Button @click="handleNewUpload" class="search-btn" type="success">新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="名称：" prop="name" label-position="left">
                        <Input v-model="form.edit.name" placeholder="请输入名称" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="类型：" prop="type" label-position="left">
                        <Select v-model="form.edit.type" class="search-col">
                            <Option v-for="item in select.type" :value="item.value" :key="item.value">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="文件："  label-position="top">
                        <Upload :action="url.upload" :headers="headers" :with-credentials="withCredentials" name = "file"
                            :on-success="handleOkUpload"
                        >
                            <Button icon="ios-cloud-upload-outline">选择上传文件</Button>
                        </Upload>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="描述：" prop="desc" label-position="left">
                        <Input v-model="form.edit.desc" type="textarea" :rows="4" placeholder="请输入描述" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="margin-left:40%;margin-top:10%">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>
  </div>
</template>

<script>
import './index.less'
import { getUploads,getUpload,delUpload,saveUpload,getOptionTree } from '@/api/base/upload'
import { getOptions } from '@/api/base/select'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export default {
  data () {
    return {
        url:{
            upload:baseUrl+"/upload/upload"
        },
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        withCredentials:true,
        modal:{
            delete:false,
        },
        select:{
            type:{}
        },
        drawer:{
            edit:false,
            manage:false,
        },
        form:{
            edit:{
                code:'',
                name:'',
                desc:'',
                path:'',
                type:1
            },
        },
        rules:{
            edit:{
                code:[{required:true,message:'代码不能为空',trigger:'blur'}],
                name:[{required:true,message:'名称不能为空',trigger:'blur'}],
            },
        },
        columns: [
            {title: 'ID',key: 'id'},
            {title: '名称',key: 'name'},
            {title: '类型',key: 'type'},
            {title: '存储路径',key: 'path'},
            {title: '描述',key: 'desc'},
            {
                title: '操作',
                key: 'status',
                width: 200,
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
                            style:{
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.handleEdit(params)
                                }
                            }
                        }, '编辑'),
                    ]);
                }
            }
        ],
        data: [],
        query:{
            code:'',
            name:''
        },
        page:{
            current:1,
            total:0,
            pageSize:10,
        },
    }
  },
  methods: {
    handleOkUpload(res,file,fileList){
        this.form.edit.path = res.msg
    },
    handleNewUpload(){
        this.form.edit={};
        this.drawer.edit = true
    },
    handleGetTypes(){
        getOptions({code:"upload_module"}).then(res =>{
            if(res.data.status == 1){
                this.select.type = res.data.data
            }
        })
    },
    handleChangePage(page){
        this.query.page = page;
        this.handleGetUploads();
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                saveUpload(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetUploads();
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
    handleGetUploads(){
        getUploads(this.query).then((res)=>{
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
                delUpload(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetUploads()
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
        getUpload(id).then(res =>{
            if(res.data.status == 1){
                this.form.edit = res.data.data
                this.drawer.edit = true;
            }else{
                this.$Message.error(res.data.msg);
            }
        })
    },
  },
  mounted () {
    this.handleGetUploads();
    this.handleGetTypes();
  }
}
</script>

<style>

</style>
