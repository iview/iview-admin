<template>
  <div>
    <Card>
        <div class="search-con search-con-top">
            角色状态：
            <Select v-model="query.role_enable" class="search-col">
                <Option v-for="item in select.status" :value="item.value" :key="item.key">{{ item.title }}</Option>
            </Select>
            <Input  clearable placeholder="输入关键字搜索" class="search-input" v-model="query.role_name"/>
            <Button @click="handleGetRoles" class="search-btn" type="primary"><Icon type="search"/>搜索</Button>
            <Button @click="handleAdd" class="search-btn" type="success"><Icon type="search"/>新增</Button>
        </div>
        <Table size="small" :columns="columns" :data="data"></Table>
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" size="small" 
        show-total style="margin: 10px 0" @on-change="handleChangePage" />
    </Card>
    <Drawer title="新增角色" v-model="drawer.edit" width="600" :mask-closable="true" >
        <Form ref="form.edit" :model="form.edit" :rules="rules.edit" :label-width="100"  lable-postion="right">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="角色代码：" prop="role_code" >
                        <Input style="width:30%" v-model="form.edit.role_code" placeholder="请输入角色代码" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="角色名称：" prop="role_name" >
                        <Input style="width:30%" v-model="form.edit.role_name" role_nam placeholder="请输入角色名称" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="角色描述：" prop="role_remark" >
                        <Input type="textarea" style="width:30%" v-model="form.edit.role_remark" placeholder="请输入角色描述" />
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="是否可用：" prop="role_enbale" >
                        <Select style="width:30%" v-model="form.edit.role_enable" class="search-col">
                            <Option  v-for="item in select.status" :value="item.value" :key="item.key">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="margin-left:40%;margin-top:10%">
            <Button style="margin-right: 8px" @click="drawer.edit=false">取消</Button>
            <Button type="primary" @click="handleSubmit('form.edit')">提交</Button>
        </div>
    </Drawer>    
    <Drawer title="配置" v-model="drawer.config" width="600" :mask-closable="true" >
        
    </Drawer>    
    <Modal v-model="modal.delete" title="提醒" 
        @on-cancel="this.modal.delete=false">
        <p>确认要删除这条内容？</p>
    </Modal>   
  </div>
</template>

<script>
import './index.less'
import { getAllUser,isExist,addUser,deleteUser,getUser,updateUser } from '@/api/user'
import { listRole,updateRole,deleteRole,getRole,isCodeExsits } from '@/api/role'
export default {
  data () {
    const validatorRolecode=(rule,value,callback)=>{
        if(value === ''){
            callback(new Error('请输入帐号!!!'));
        }else{
            isCodeExsits(value).then(res=>{
                if(res.data == false){
                    callback(new Error('帐号已经被占用，请换一个帐号。'));
                }else{
                    callback();
                }
            });
        }
    };
    return {
        modal:{
            delete:false
        },
        drawer:{
            edit:false,
            config:false,
        },
        form:{
            edit:{
                role_code:'',
                role_remark:'',
                role_name:'',
                role_enable:'Y',
            }
        },
        rules:{
            edit:{
                role_code:[{required:true,message:'角色代码不能为空',trigger:'blur'}],
                role_remark:[{required:true,message:'角色描述不能为空',trigger:'blur'}],
                role_name:[{required:true,message:'角色名称不能为空',trigger:'blur'}],
            },
            
        },
        select:{
            status:[
                {key : 1, title:'可用' ,value:'Y' },
                {key : 0, title:'禁用' ,value:'N'},
            ]
        },
        columns: [
            {title: '#',key: 'id'},
            {title: '角色编码',key: 'role_code'},
            {title: '角色名称',key: 'role_name'},
            {title: '角色描述',key: 'role_remark'},
            {
                title: '状态',
                key: 'role_enable',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    if(params.row.role_enable=='Y'){
                        return h('strong', '可用')
                    }else{
                        return h('strong', '禁用')
                    }
                }
            },
            {
                title: '操作',
                key: 'status',
                width: 250,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style:{ marginRight: '5px' },
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
                            style:{ marginRight: '5px' },
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
                                    this.handleConfig(params)
                                }
                            }
                        }, '管理')
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
          role_name:'',
          role_enable:'Y',
          page:1
      }

    }
  },
  methods: {
    handleConfig(params){
        this.drawer.config = true;
    },
    handleAdd(){
        this.drawer.edit = true;
        this.form.edit={}
    },
    handleChangePage(page){
        this.query.page = page;
        this.handleGetRoles();
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                updateRole(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success('保存成功');
                        this.handleGetRoles();
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
                updateUser(this.form.edit).then(res=>{
                    if(res.data.status == 1){
                        this.$Message.success('修改成功');
                        this.handleGetRoles();
                        this.$refs[name].resetFields();
                        this.drawer.edit=false
                    }
                });
            } else {
                this.$Message.error('请按照格式填写表单!');
            }
        })
    },
    handleGetRoles(){
        listRole(this.query).then((res)=>{
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
                deleteRole(id).then(res =>{
                    if(res.data.status == 1){
                        this.$Message.success(res.data.msg)
                        this.handleGetRoles()
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
        getRole(id).then(res =>{
            if(res.data.status == 1){
                this.form.edit.id = res.data.data.id;
                this.form.edit.role_code =res.data.data.role_code;
                this.form.edit.role_remark=res.data.data.role_remark;
                this.form.edit.role_name=res.data.data.role_name;
                this.form.edit.role_enable=res.data.data.role_enable;
                this.drawer.edit = true;
            }
        })
    }
  },
  mounted () {
    this.handleGetRoles();
  }
}
</script>

<style>

</style>
