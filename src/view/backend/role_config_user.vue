<template>
    <div>
        <Row>
            <Col span="11">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        全部人员
                    </p>
                    <div>
                        <Input size="small" style="width:150px" placeholder="请输入帐号"/>&nbsp;
                        <Input size="small" style="width:150px" placeholder="请输入昵称"/>&nbsp;
                        <Button size="small" shape="circle" icon="ios-search" type="primary">查询</Button>
                    </div>
                    <Table style="margin-top:10px" size="small" :columns="columnAll" :data="data.all"></Table>
                    <Page :total="page.all.total" :current="page.all.current" :page-size="page.all.pageSize"
                    size="small" show-total style="margin: 10px 0" @on-change="handleChangePageAll" />
                </Card>
            </Col>
            <Col span="11" offset="1">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        已包含人员
                    </p>
                    <Table size="small" :columns="columnMy" :data="data.my"></Table>
                    <Page :total="page.my.total" :current="page.my.current" :page-size="page.my.pageSize"
                    size="small" show-total style="margin: 10px 0" @on-change="handleChangePageMy" />
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import { getAllUser,isExist,addUser,deleteUser,getUser,updateUser } from '@/api/user'
import { listRole,updateRole,deleteRole,getRole,isCodeExsits,getResTree,addRoleRes,deleteRoleRes } from '@/api/role'
export default {
  name: 'LoginForm',
  props: {
    role_id: {
      type: Number,
      default: () => {
        return {}
      }
    },
  },
  data () {
    return {
        query:{},
        page:{
            all:{
                total:0,
                current:1,
                pageSize:5,
            },
            my:{
                total:0,
                current:1,
                pageSize:5,
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
                                    // this.handleDelete(params)
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
                                    // this.handleDelete(params)
                                }
                            }
                        }, '删除')
                    ]);
                }
            }
        ],
        data: {
            my:[],
            all:[],
        },
    }
  },
  methods: {
        handleGetUsers(type){
            if(type == 'my'){
                this.query.role_id = this.role_id;
            }
            this.query.current=this.page[type].current
            this.query.total=this.page[type].total
            this.query.rows=this.page[type].pageSize
            getAllUser(this.query).then((res)=>{
                this.data[type] = res.data.rows;
                this.page[type].current=res.data.pageNum
                this.page[type].total=res.data.total
                this.page[type].pageSize=res.data.pageSize
            });
            this.query={}
        },
        handleChangePageAll(page){
            this.query.page = page
            this.handleGetUsers('all')
        },
        handleChangePageMy(page){
            this.query.page = page
            this.handleGetUsers('my')
        },
  },
  mounted(){
      this.handleGetUsers('all');
      this.handleGetUsers('my');
  }
}
</script>
