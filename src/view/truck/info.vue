<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入资源名称搜索" class="search-input" v-model="query.res_name"/>
            <Button @click="handleGetTrucks" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleNewRes" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑卡车信息" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="品牌：" prop="brand" label-position="left">
                        <Input v-model="form.edit.res_code" placeholder="请输入资源代码" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="资源名称：" prop="res_name" label-position="top">
                        <Input v-model="form.edit.res_name" placeholder="请输入资源名称" />
                    </FormItem>
                </Col>
                
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="资源类型：" prop="res_type" label-position="left">
                        <Select v-model="form.edit.res_type" class="search-col">
                            <Option v-for="item in select.res_type" :value="item.key" :key="item.key">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="资源URL：" prop="res_url" label-position="top">
                        <Input   v-model="form.edit.res_url" placeholder="请输入资源URL" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="资源状态：" prop="res_enable" label-position="top">
                        <Select v-model="form.edit.res_enable" class="search-col">
                            <Option v-for="item in select.res_enable" :value="item.key" :key="item.key">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="顺序：" prop="res_order" label-position="top">
                        <Input  v-model="form.edit.res_order"  placeholder="请输入顺序" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="父资源：" prop="parent_id" label-position="top">
                        <treeselect v-model="form.edit.parent_id" placeholder="请选择父资源，不选默认顶级资源"  :options="options" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="备注：" prop="res_remark" label-position="top">
                        <Input v-model="form.edit.res_remark" type="textarea" :rows="4" placeholder="请输入资源备注。" />
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
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
import { getRess,addOrUpdateRes,delRes,getRes,resTree } from '@/api/res'
import { getTrucks } from '@/api/truck/info'
export default {
    components: {
        Treeselect  
    },
  data () {
    return {
        modal:{
            delete:false
        },
        drawer:{
            edit:false,
        },
        options: [],
        form:{
            edit:{
                res_code:'',
                res_name:'',
                res_enable:'Y',
                res_remark:'',
                res_url:'',
                res_order:100,
                res_type:'link',
                // parent_id:''
            },
        },
        rules:{
            edit:{
                res_code:[{required:true,message:'资源代码不能为空',trigger:'blur'}],
                res_name:[{required:true,message:'资源名称不能为空',trigger:'blur'}],
                res_url:[{required:true,message:'资源url不能为空',trigger:'blur'}],
                // res_name:[{validator:validatorUsername,trigger:'blur'}],
            },
        },
        select:{
            status:[
                {key : 'Y', title:'有效' ,value:'Y' },
                {key : 'N', title:'无效' ,value:'N' },
            ],
            res_enable:[
                {key : 'Y', title:'有效' ,value:'Y' },
                {key : 'N', title:'无效' ,value:'N' },
            ],
            res_type:[
                {key : 'link', title:'链接' ,value:'link' },
                {key : 'module', title:'模块' ,value:'module' },
            ],
        },
        columns: [
            {title: 'ID',key: 'id'},
            {title: '品牌',key: 'brand'},
            {title: '生产日期',key: 'create_time'},
            {title: '出厂日期',key: 'product_time'},
            {title: '里程数',key: 'mileage'},
            {title: '车型',key: 'car_type'},
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
          res_enable:'Y',
          res_name:'',
          page:1
      }

    }
  },
  methods: {
    handleChangePage(page){
        this.query.page = page;
        this.handleGetTrucks();
    },
    handleNewRes(){
        this.drawer.edit = true
        this.form.edit={
            res_code:'',
            res_name:'',
            res_enable:'Y',
            res_remark:'',
            res_url:'',
            res_order:100,
            res_type:'link',
        }
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                addOrUpdateRes(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetTrucks();
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
    handleGetTrucks(){
        getTrucks(this.query).then((res)=>{
            this.data = res.data.rows;
            this.page.current=res.data.pageNum
            this.page.total=res.data.total
            this.page.pageSize=res.data.pageSize
        });
    },
    handleGetResTree(){
        resTree({}).then((res)=>{
            this.options = res.data.data;
        });
    },
    handleDelete (params) {
        let config={
            title:'提醒',
            content:'确定要删除id为：'+params.row.id+"的记录？",
            onOk:()=>{
                let id = params.row.id;
                delRes(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetTrucks()
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
        getRes(id).then(res =>{
            if(res.data.status == 1){
                console.log(res);
                this.form.edit = res.data.data
                this.drawer.edit = true;
            }
        })
    }
  },
  mounted () {
    this.handleGetTrucks();
    this.handleGetResTree();
  }
}
</script>

<style>

</style>
