<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入搜索" class="search-input" v-model="query.name"/>
            <Button @click="handleGetTrucks" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleNewTruck" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑卡车信息" v-model="drawer.edit" width="720" :mask-closable="false" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="品牌：" prop="brand" label-position="left">
                        <BaseSelect code="truck_brand" :value.sync="this.form.edit.brand" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="里程数：" prop="mileage" label-position="top">
                        <Input   v-model="form.edit.mileage" placeholder="请输入里程数" />
                    </FormItem>
                </Col>
                
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="生产日期：" prop="create_time" label-position="top">
                        <br/>
                        <DatePicker v-model="form.edit.create_time" type="date" placeholder="选择生产日期" style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="出厂日期：" prop="product_time" label-position="left">
                        <br/>
                        <DatePicker  v-model="form.edit.product_time" type="date" placeholder="选择出厂日期" style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
            </Row>
             <Row :gutter="32">
                <Col span="12">
                    <FormItem label="上传卡车图：" prop="pic" label-position="left">
                       <BaseUpload multiple refType=2 :upid.sync="form.edit.img_id" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="简介：" prop="description" label-position="top">
                        <Input v-model="form.edit.description" type="textarea" :rows="4" placeholder="请输入卡车简介。" />
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
import BaseSelect from '@/view/base/base_select'
import BaseUpload from '@/view/base/base_upload'
import { getTrucks,saveTruck } from '@/api/truck/info'
import { getOptions } from '@/api/base/select'
export default {
    components: {
        BaseSelect,BaseUpload
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
          name:'',
          page:1
      }

    }
  },
  methods: {
    handleChangePage(page){
        this.query.page = page;
        this.handleGetTrucks();
    },
    handleNewTruck(){
        this.drawer.edit = true
        this.form.edit={
            
        }
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                saveTruck(this.form.edit).then(res=>{
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
                delTruck(id).then(res =>{
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
        getTruck(id).then(res =>{
            if(res.data.status == 1){
                this.form.edit = res.data.data
                this.drawer.edit = true;
            }
        })
    },
    handleGetBrand(){
        getOptions({code:"truck_brand"}).then(res=>{
            if(res.data.status == 1){
                alert(123);
            }
        })
    }
  },
  mounted () {
    this.handleGetTrucks();
    this.handleGetBrand();
  }
}
</script>

<style>

</style>
