<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入id搜索" class="search-input" v-model="query.id"/>
            <Input  clearable placeholder="输入资源名称搜索" class="search-input" v-model="query.org_name"/>
            <Button @click="handleGetOrgs" class="search-btn" type="primary">搜索</Button>
            <Button @click="handleNewOrg" class="search-btn" type="success">新增</Button>
            <Button @click="handleViewTree" class="search-btn" type="warning" >组织树</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑组织机构" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="名称：" prop="org_name" label-position="left">
                        <Input v-model="form.edit.org_name" placeholder="请输入名称" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="父资源：" prop="parent_id" label-position="top">
                        <treeselect v-model="form.edit.parent_id" placeholder="请选择父组织结构，不选默认顶级组织机构"  :options="options" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="备注：" prop="org_remark" label-position="top">
                        <Input v-model="form.edit.org_remark" type="textarea" :rows="4" placeholder="请输入资源备注。" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="margin-left:40%;margin-top:10%">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>
    <Drawer title="管理人员" v-model="drawer.manage" width="100%" :mask-closable="true" >
        <Row>
            <Col span="11">
                <Card>
                    <p slot="title">
                        全部人员
                    </p>
                    <div>
                        <Input size="small" v-model="queryParams.all.username" style="width:150px" placeholder="请输入帐号"/>&nbsp;
                        <Input size="small" v-model="queryParams.all.nickname" style="width:150px" placeholder="请输入昵称"/>&nbsp;
                        <Button size="small" shape="circle" icon="ios-search" @click="handleGetUsers('all')" type="primary">查询</Button>
                    </div>
                    <Table stripe style="margin-top:10px"  size="small" :columns="columnAll" :data="dataUser.all"></Table>
                    <Page :total="page.all.total" :current="page.all.current" :page-size="page.all.pageSize" show-elevator
                     show-total style="margin: 10px 0" @on-change="handleChangePageAll" />
                </Card>
            </Col>
            <Col span="11" offset="1">
                <Card>
                    <p slot="title">
                        {{org_name}}已包含人员
                    </p>
                    <div>
                        <Input size="small" v-model="queryParams.my.username" style="width:150px" placeholder="请输入帐号"/>&nbsp;
                        <Input size="small" v-model="queryParams.my.nickname" style="width:150px" placeholder="请输入昵称"/>&nbsp;
                        <Button size="small" shape="circle" icon="ios-search" @click="handleGetUsers('my')" type="primary">查询</Button>
                    </div>
                    <Table stripe style="margin-top:10px" size="small" :columns="columnMy" :data="dataUser.my"></Table>
                    <Page :total="page.my.total" :current="page.my.current" :page-size="page.my.pageSize" show-elevator
                    show-total style="margin: 10px 0" @on-change="handleChangePageMy" />
                </Card>
            </Col>
        </Row>
    </Drawer>
    <Modal v-model="modal.tree" title="组织树">
        <Tree :data="dataAllOrg" :render="renderAllContent" ></Tree>
    </Modal>    
  </div>
</template>

<script>
import './index.less'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
import { getOrgs,addOrUpdateOrg,delOrg,getOrg,orgTree,orgTreeIview,addOrgUser,delOrgUser } from '@/api/org'
import { getAllUser,isExist,addUser,deleteUser,getUser,updateUser } from '@/api/user'
export default {
    components: {
        Treeselect  
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
        options: [],
        form:{
            edit:{
                org_name:'',
                org_remark:'',
                parent_id:'',
            },
        },
        rules:{
            edit:{
                org_name:[{required:true,message:'名称不能为空',trigger:'blur'}],
            },
        },
        columns: [
            {title: 'ID',key: 'id'},
            {title: '名称',key: 'org_name'},
            {title: '备注',key: 'org_remark'},
            {title: '父ID',key: 'parent_id'},
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
                        }, '管理'),
                    ]);
                }
            }
        ],
        data: [],
        query:{
            org_name:'',
            page:1
        },
        page:{
            current:1,
            total:0,
            pageSize:10,
            all:{
                total:0,
                current:1,
                pageSize:10,
            },
            my:{
                total:0,
                current:1,
                pageSize:10,
            },
        },
        queryParams:{
            my:{
                username:'',
                nickname:'',
                role_id:''
            },
            all:{
                username:'',
                nickname:'',
                role_id:''
            },
        },
        columnAll: [
            {title: 'id',key: 'id'},
            {title: '昵称',key: 'nickname'},
            {title: '帐号',key: 'username'},
            {
                title: '操作',
                key: 'status',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: { type: 'success', size: 'small',icon:"md-add" },
                            style:{ marginRight: '5px' },
                            on: {
                                click: () => {
                                    this.handleAddOrgUser(params)
                                }
                            }
                        })
                    ]);
                }
            }
        ],
        columnMy: [
            {title: 'id',key: 'id'},
            {title: '昵称',key: 'nickname'},
            {title: '帐号',key: 'username'},
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
                                    this.handleDelOrgUser(params)
                                }
                            }
                        }, '删除')
                    ]);
                }
            }
        ],
        dataUser: {
            my:[],
            all:[],
        },
        org_id:'',
        org_name:'',

    }
  },
  methods: {
    handleManage(params){
        this.org_id = params.row.id;
        this.org_name = params.row.org_name;
        this.handleGetUsers('all');
        this.handleGetUsers('my');
        this.drawer.manage = true
    },
    handleGetUsers(type){
        if(type == 'my'){
            this.queryParams[type].org_id = this.org_id;
        }
        this.queryParams[type].page=this.page[type].current
        this.queryParams[type].rows=this.page[type].pageSize
        getAllUser(this.queryParams[type]).then((res)=>{
            this.dataUser[type] = res.data.rows;
            this.page[type].current=res.data.pageNum?res.data.pageNum:1
            this.page[type].total=res.data.total
            this.page[type].pageSize=res.data.pageSize
        }).catch(e=>{
        });
        this.query={}
    },
    handleChangePageAll(page){
        this.page.all.current = page
        this.handleGetUsers('all')
    },
    handleChangePageMy(page){
        this.page.my.current = page
        this.handleGetUsers('my')
    },
    handleViewTree(){
        this.modal.tree=true
        orgTree({}).then((res)=>{
            this.dataAllOrg = res.data.data;
        });
    },
    handleChangePage(page){
        this.query.page = page;
        this.handleGetOrgs();
    },
    handleNewOrg(){
        this.drawer.edit = true
        this.form.edit={
            org_name:'',
            org_remark:'',
        }
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                addOrUpdateOrg(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetOrgs();
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
    handleGetOrgs(){
        getOrgs(this.query).then((res)=>{
            this.data = res.data.rows;
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
                delOrg(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetOrgs()
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
        getOrg(id).then(res =>{
            if(res.data.status == 1){
                console.log(res);
                this.form.edit = res.data.data
                this.drawer.edit = true;
            }
        })
    },
    handleGetOrgTree(){
        orgTreeIview({}).then((res)=>{
            this.options = res.data.data;
        });
    },
    handleAddOrgUser(params){
        let data ={
            org_id:this.org_id,
            user_id:params.row.id
        }
        addOrgUser(data).then((res)=>{
            if(res.data.status ==1){
                this.$Message.success(res.data.msg);
                this.handleGetUsers('my');
            }
        });
    },
    handleDelOrgUser(params){
        let data ={
            org_id:this.org_id,
            user_id:params.row.id
        }
        delOrgUser(data).then((res)=>{
            if(res.data.status ==1){
                this.$Message.success(res.data.msg);
                this.handleGetUsers('my');
            }
        });
    },
    renderAllContent (h, { root, node, data }) {
        return h('span', {
            style: {
                display: 'inline-block',
                width: '100%'
            }
        }, [
            h('span', [
                h('span', data.title)
            ]),
            h('span', {
                style: {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '32px'
                }
            }, [
                h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                        icon: 'ios-trash',size:'small',type:'error'
                    }),
                    on: {
                        click: () => { 
                            let id = node.node.id;
                            delOrg(id).then(res =>{
                                if(res.data.status == 1){
                                    this.$Message.success(res.data.msg)
                                    this.handleViewTree();
                                }else{
                                    this.$Message.error(res.data.msg)
                                }
                            })
                        }
                    }
                })
            ])
        ]);
    },
  },
  mounted () {
    this.handleGetOrgs();
    this.handleGetOrgTree();
  }
}
</script>

<style>

</style>
