<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            <Input  clearable placeholder="输入资源名称搜索" class="search-input" v-model="query.res_name"/>
            <Button @click="handleGetNotices" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleNewNotice" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" stripe  :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="编辑信息" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="标题：" prop="title" label-position="left">
                        <Input v-model="form.edit.title" placeholder="请输入公告标题" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="是否使用：" prop="stick" label-position="top">
                        <Select v-model="form.edit.stick" class="search-col">
                            <Option v-for="item in select.stick" :value="item.key" :key="item.key">{{ item.title }}</Option>
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
                    <FormItem label="内容：" prop="content" label-position="top">
                        <Input v-model="form.edit.content" type="textarea" :rows="4" placeholder="请输入公告内容。" />
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
import { getNotices,getNotice,saveNotice,delNotice } from '@/api/truck/notice'
export default {
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
                id:'',
                title:'',
                content:'Y',
                stick:'',
                order:'',
            },
        },
        rules:{
            edit:{
                title:[{required:true,message:'标题不能为空',trigger:'blur'}],
                content:[{required:true,message:'公告内容不能为空',trigger:'blur'}],
                order:[{required:true,message:'公告顺序不能为空',trigger:'blur'}],
            },
        },
        select:{
            stick:[
                {key : '1', title:'置顶' ,value:'1' },
                {key : '0', title:'不置顶' ,value:'0' },
            ],
        },
        columns: [
            {title: 'ID',key: 'id'},
            {title: '标题',key: 'title'},
            {title: '内容',key: 'content'},
            {title: '是否置顶',key: 'stick'},
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
    handleChangePage(page){
        this.query.page = page;
        this.handleGetNotices();
    },
    handleNewNotice(){
        this.drawer.edit = true
        this.form.edit={
            id:'',
            title:'',
            content:'',
            stick:'',
            order:'',
        }
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                saveNotice(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg);
                        this.handleGetNotices();
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
    handleGetNotices(){
        getNotices(this.query).then((res)=>{
            this.data = res.data.data;
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
                delNotice(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetNotices()
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
        getNotice(id).then(res =>{
            if(res.data.status == 1){
                console.log(res);
                this.form.edit = res.data.data
                this.drawer.edit = true;
            }
        })
    }
  },
  mounted () {
    this.handleGetNotices();
  }
}
</script>

<style>

</style>
