<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            用户状态：
            <Select v-model="query.status" class="search-col">
                <Option v-for="item in select.status" :value="item.key" :key="item.key">{{ item.title }}</Option>
            </Select>
            <Input  clearable placeholder="输入关键字搜索" class="search-input" v-model="query.nickname"/>
            <Button @click="handleGetUsers" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="drawer.edit = true" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="新增用户" v-model="drawer.edit" width="720" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="帐号：" prop="username" label-position="left">
                        <Input v-model="form.edit.username" placeholder="请输入帐号" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="密码：" prop="password" label-position="top">
                        <Input v-model="form.edit.password" type="password" placeholder="请输入密码" />
                    </FormItem>
                </Col>
                
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="昵称：" prop="nickname" label-position="left">
                        <Input v-model="form.edit.nickname" placeholder="请输入昵称" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="手机号：" prop="phonenumber" label-position="top">
                        <Input   v-model="form.edit.phonenumber" placeholder="请输入手机号" />
                    </FormItem>
                </Col>
                
            </Row>
            <Row :gutter="32">
                    <Col span="12">
                    <FormItem label="邮箱：" prop="email" label-position="top">
                        <Input v-model="form.edit.email" placeholder="请输入email" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="顺序：" prop="u_order" label-position="top">
                        <Input  v-model="form.edit.u_order"  placeholder="请输入顺序" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                    <Col span="12">
                    <FormItem label="状态：" prop="status" label-position="top">
                        <Select v-model="form.edit.status" class="search-col">
                            <Option v-for="item in select.status" :value="item.key" :key="item.key">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="align:rigth">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>    
    <Drawer title="用户修改" v-model="drawer.update" width="720" :mask-closable="true" >
        <Form ref="form.update" :model="form.update" label-position="right" :label-width="70"  :rules="rules.update">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="帐号：" prop="username"  >
                        {{form.update.username}}
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="顺序：" prop="u_order" >
                        <InputNumber style="width:60%;" :max="10" :min="1" v-model="form.update.u_order"></InputNumber>
                    </FormItem>
                </Col>
                
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="昵称：" prop="nickname" >
                        <Input style="width:60%;" v-model="form.update.nickname" placeholder="请输入昵称" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="可用：" prop="status" >
                        <Select style="width:60%;" v-model="form.update.status">
                            <Option v-for="item in select.status" :value="item.value" :key="item.value">
                                {{ item.title }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="邮箱："  prop="email" >
                        <Input style="width:60%;" v-model="form.update.email" placeholder="请输入email" />
                    </FormItem>
                </Col>
                 <Col span="12">
                    <FormItem label="手机号："  prop="phonenumber" >
                        <Input  style="width:60%;" v-model="form.update.phonenumber" placeholder="请输入手机号" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="密码：" prop="password" >
                        <Input style="width:60%;" v-model="form.update.password" type="password" placeholder="请输入密码" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="密码：" prop="rePassword" >
                        <Input style="width:60%;" v-model="form.update.rePassword" type="password" placeholder="请再次输入密码" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="margin-left:40%;margin-top:10%">
            <Button style="margin-right: 8px" @click="drawer.update=false">取消</Button>
            <Button type="primary" @click="handleUpdate('form.update')">提交</Button>
        </div>
    </Drawer> 
  </div>
</template>

<script>
import './index.less'
import { getAllUser,isExist,addUser,deleteUser,getUser,updateUser } from '@/api/user'
export default {
  data () {
    const validatorUsername=(rule,value,callback)=>{
        if(value === ''){
            callback(new Error('请输入帐号!!!'));
        }else{
            isExist(value).then(res=>{
                if(res.data == false){
                    callback(new Error('帐号已经被占用，请换一个帐号。'));
                }else{
                    callback();
                }
            });
        }
    };
    const validatePass = (rule, value, callback) => {
        if (value != this.form.update.rePassword) {
            callback(new Error('两次输入的密码不一致。'));
        } else {
            callback();
        }
    };
    const validateRepass = (rule, value, callback) => {
        if (value != this.form.update.password) {
            callback(new Error('两次输入的密码不一致。'));
        } else {
            callback();
        }
    };
    return {
        modal:{
            delete:false
        },
        drawer:{
            edit:false,
            update:false,
        },
        form:{
            edit:{
                username:'',
                password:'',
                nickname:'',
                phonenumber:'',
                email:'',
                u_order:'',
            },
            update:{
                id:0,
                username:'',
                password:'',
                rePassword:'',
                nickname:'',
                phonenumber:'',
                email:'',
                u_order:1,
                status:1
            }
        },
        rules:{
            edit:{
                username:[{validator:validatorUsername,trigger:'blur'}],
                password:[{required:true,message:'密码不能为空',trigger:'blur'}],
                nickname:[{required:true,message:'昵称不能为空',trigger:'blur'}],
                phonenumber:[{required:true,message:'手机号不能为空',trigger:'blur'}],
                email:[
                    {required:true,message:'邮箱不能为空',trigger:'blur'},
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
                ],
                u_order:[
                    {required:true,message:'顺序不能为空',trigger:'blur'},
                ],
            },
            update:{
                password:[{validator:validatePass,trigger:'blur'}],
                rePassword:[{validator:validateRepass,trigger:'blur'}],
                nickname:[{required:true,message:'昵称不能为空',trigger:'blur'}],
                phonenumber:[{required:true,message:'手机号不能为空',trigger:'blur'}],
                email:[
                    {required:true,message:'邮箱不能为空',trigger:'blur'},
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
                ],
            },
        },
        select:{
            status:[
                {key : 1, title:'有效' ,value:1 },
                {key : 0, title:'无效' ,value:0 },
            ]
        },
        columns: [
            {title: '#',key: 'id'},
            {title: '昵称',key: 'nickname'},
            {title: '帐号',key: 'username'},
            {title: '创建时间',key: 'create_time'},
            {
                title: '状态',
                key: 'status',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    if(params.row.status){
                        return h('strong', '有效')
                    }else{
                        return h('strong', '无效')
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
          nickname:'',
          status:1,
          page:1
      }

    }
  },
  methods: {
    handleChangePage(page){
        this.query.page = page;
        this.handleGetUsers();
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                addUser(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success('保存成功');
                        this.handleGetUsers();
                        this.$refs[name].resetFields();
                        this.drawer.edit=false
                    }
                });
            } else {
                this.$Message.error('请按照格式填写表单!');
            }
        })
    },
    handleUpdate (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                updateUser(this.form.update).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success('修改成功');
                        this.handleGetUsers();
                        this.$refs[name].resetFields();
                        this.drawer.update=false
                    }
                });
            } else {
                this.$Message.error('请按照格式填写表单!');
            }
        })
    },
    handleGetUsers(){
        getAllUser(this.query).then((res)=>{
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
                deleteUser(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetUsers()
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
        getUser(id).then(res =>{
            if(res.data.status == 1){
                this.form.update.id = res.data.data.id;
                this.form.update.status = res.data.data.status;
                this.form.update.username = res.data.data.username;
                this.form.update.password = '';
                this.form.update.nickname = res.data.data.nickname;
                this.form.update.phonenumber = res.data.data.phonenumber;
                this.form.update.email = res.data.data.email;
                this.form.update.valid = res.data.data.valid;
                this.form.update.u_order = res.data.data.u_order;
                this.drawer.update = true;
            }
        })
    }
  },
  mounted () {
    this.handleGetUsers();
  }
}
</script>

<style>

</style>
