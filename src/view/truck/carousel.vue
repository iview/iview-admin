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
    <Drawer title="编辑信息" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="名称：" prop="title" label-position="left">
                        <Input v-model="form.edit.title" placeholder="请输入轮播名称" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="是否使用：" prop="valid" label-position="top">
                        <Select v-model="form.edit.valid" class="search-col">
                            <Option v-for="item in select.valid" :value="item.key" :key="item.key">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="顺序：" prop="order" label-position="top">
                        <Input  v-model="form.edit.order"  placeholder="请输入顺序" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="轮播图片：" prop="url" label-position="top">
                        <Upload action="/api/carousel/upload" name = "file">
                            <Button icon="ios-cloud-upload-outline">选择轮播图片</Button>
                        </Upload>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="轮播描述：" prop="description" label-position="top">
                        <Input v-model="form.edit.description" type="textarea" :rows="4" placeholder="请输入轮播描述。" />
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
            valid:[
                {key : '1', title:'有效' ,value:'1' },
                {key : '0', title:'无效' ,value:'0' },
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
