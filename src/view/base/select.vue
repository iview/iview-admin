<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入id搜索" class="search-input" v-model="query.id"/>
            <Input  clearable placeholder="输入资源名称搜索" class="search-input" v-model="query.org_name"/>
            <Button @click="handleGetSelects" class="search-btn" type="primary">搜索</Button>
            <Button @click="handleNewSelect" class="search-btn" type="success">新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑字典" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="代码：" prop="code" label-position="left">
                        <Input v-model="form.edit.code" placeholder="请输入代码" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="名称：" prop="name" label-position="left">
                        <Input v-model="form.edit.name" placeholder="请输入名称" />
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
    <Drawer title="配置字典" v-model="drawer.manage" width="100%" :mask-closable="true" >
        <Card>
            <p slot="title">
                所有键值
            </p>
            <Table size="small" stripe  :columns="columns_option" :data="data_option"></Table>
            <Page :total="pageOption.total" :current="pageOption.current" :page-size="pageOption.pageSize" size="small" 
            show-total style="margin: 10px 0" @on-change="handleChangePageOption" />
        </Card>
        <div style="margin-left:40%;margin-top:10%">
            <Button style="margin-right: 8px" @click="drawer.manage=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>
  </div>
</template>

<script>
import './index.less'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
import { getOrgs,addOrUpdateOrg,delOrg,getOrg,orgTree,orgTreeIview,addOrgUser,delOrgUser } from '@/api/org'
import { getSelects,getSelect,delSelect,saveSelect } from '@/api/base/select'
import expandRow from './select-expand.vue';
export default {
    components: {
        Treeselect  ,
        expandRow 
    },
  data () {
    return {
        dataAllOrg:[],
        modal:{
            delete:false,
            tree:false
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
            },
        },
        rules:{
            edit:{
                code:[{required:true,message:'代码不能为空',trigger:'blur'}],
                name:[{required:true,message:'名称不能为空',trigger:'blur'}],
            },
        },
        columns: [
            {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(expandRow, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            {title: 'ID',key: 'id'},
            {title: '代码',key: 'code'},
            {title: '名称',key: 'name'},
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
                        h('Button', {
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.handleManage(params)
                                }
                            }
                        }, '级联'),
                    ]);
                }
            }
        ],
        columns_option: [
            {title: 'ID',key: 'id'},
            {title: '值',key: 'value'},
            {title: '显示',key: 'name'},
            {title: '所属字典',key: 'select_code'},
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
        data_option: [],
        query:{
            org_name:'',
            page:1
        },
        page:{
            current:1,
            total:0,
            pageSize:10,
        },
        pageOption:{
            current:1,
            total:0,
            pageSize:10,
        },
        select_id:'',
        select_name:'',
    }
  },
  methods: {
    handleNewSelect(){
        this.form.edit={};
        this.drawer.edit = true
    },
    handleManage(params){
        this.select_id = params.row.id;
        this.select_name = params.row.name;
        this.drawer.manage = true
    },
    handleChangePage(page){
        this.query.page = page;
        this.handleGetSelects();
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                saveSelect(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetSelects();
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
    handleGetSelects(){
        getSelects(this.query).then((res)=>{
            this.data = res.data.data.rows;
            this.page.current=res.data.pageNum
            this.page.total=res.data.total
            this.page.pageSize=res.data.pageSize
        });
    },
    handleDelete (params) {
        let config={
            title:'提醒',
            content:'确定要删除id为：'+params.row.id+"的记录？",
            onOk:()=>{
                let id = params.row.id;
                delSelect(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetSelects()
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
        getSelect(id).then(res =>{
            if(res.data.status == 1){
                console.log(res);
                this.form.edit = res.data.data
                this.drawer.edit = true;
            }
        })
    },
  },
  mounted () {
    this.handleGetSelects();
  }
}
</script>

<style>

</style>
