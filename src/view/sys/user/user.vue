<template>
  <Card>
      <Row>
        <Form ref="formInline" inline :label-width="70">
          <Form-item label="用户名:">
            <Input type="text" v-model="filter.querys[0].value" clearable placeholder="请输入用户名"/>
          </Form-item>
          <Form-item label="昵称:">
            <Input type="text" v-model="filter.querys[1].value" clearable placeholder="请输入昵称"/>
          </Form-item>
          <Form-item style="margin-left:-60px;">
            <div class="opt-group">
              <Button class="opt-btn" type="primary" icon="ios-search" @click="handleSearch">搜索</Button>
              <Button class="opt-btn" @click="handleReset">重置</Button>
            </div>
          </Form-item>
        </Form>
      </Row>
      <Row class="operation" type="flex" justify="space-between">
        <div class="opt-group">
          <Button class="opt-btn" type="primary" icon="md-add" @click="handleAddUser">添加</Button>
          <Button class="opt-btn" icon="md-trash" @click="handleDeleUser">删除</Button>
        </div>
        <div>
          <Button icon="md-refresh" @click="handleSearch">刷新</Button>
        </div>
      </Row>
      <Row>
        <Table border stripe :columns="table.columns" :data="table.data" :loading="table.loading" @on-selection-change="onSelectionChange"></Table>
      </Row>
      <Row type="flex" justify="center" class="page">
        <Page show-sizer :total="table.total" @on-change="onChange" @on-page-size-change="onPageSizeChange" />
      </Row>

      <Modal ref="addOrUpdateModal" v-model="view.showAddOrUpdateModal" :title="view.addOrUpdateTitle" :mask-closable="false" ok-text="提交" :loading="true" @on-ok="onOk" :width="600">
        <Form ref="addOrUpdateFormRef" :model="addOrUpdateUserDto" :rules="userRuleValidate" :label-width="80">
          <FormItem prop="username" label="用户名">
            <Input v-model="addOrUpdateUserDto.username"></Input>
          </FormItem>
          <FormItem prop="nickname" label="昵称">
            <Input v-model="addOrUpdateUserDto.nickname"></Input>
          </FormItem>
          <FormItem prop="phone" label="手机号">
            <Input v-model="addOrUpdateUserDto.phone"></Input>
          </FormItem>
          <FormItem prop="email" label="邮箱">
            <Input v-model="addOrUpdateUserDto.email"></Input>
          </FormItem>
          <FormItem label="状态">
            <i-switch size="large" v-model="addOrUpdateUserDto.status" :true-value="1" :false-value="0">
              <span slot="open">正常</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
          <FormItem label="角色">
            <Select
              v-model="addOrUpdateUserDto.roleIds"
              multiple
              filterable
              remote
              :remote-method="selectRemoteMethod"
              :loading="view.selectRemoteMethodLoading">
              <Option v-for="(item, index) in selectRoleDto" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
  </Card>
</template>

<script>
import { getUserList, apiAddUser, apiUpdateUser, apiUserRolesInfo, apiDeleteUser } from '@/api/sys/user'
import { apiQueryRole } from '@/api/sys/role'
import CoustomForm from '../../components/form/coustom-form'
export default {
  name: 'user',
  components: {
    CoustomForm
  },
  data () {
    return {
      view: {
        showAddOrUpdateModal: false,
        addOrUpdateTitle: '',
        isAddOrUpdate: false,
        selectRemoteMethodLoading: true
      },
      filter: {
        querys: [
          {
            column: 'username',
            type: 'eq',
            value: ''
          },
          {
            column: 'nickname',
            type: 'eq',
            value: ''
          }
        ],
        current: 1,
        pageSize: 10
      },
      table: {
        loading: false,
        total: 0,
        data: [],
        selectionData: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID',
            width: 100,
            key: 'id',
            align: 'center'
          },
          {
            title: '用户名',
            key: 'username',
            align: 'center'
          },
          {
            title: '昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center'
          },
          {
            title: '邮箱',
            key: 'email',
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 0) {
                return h('div', [
                  h('tag', {
                    props: {
                      color: 'warning'
                    }
                  }, '禁用')
                ])
              } else if (params.row.status === 1) {
                return h('div', [
                  h('tag', {
                    props: {
                      color: 'success'
                    }
                  }, '正常')
                ])
              }
            }
          },
          {
            title: '创建时间',
            key: 'gmtCreate',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 130,
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.handleUpdateUser(params.row)
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.deletUser(params.row)
                        console.log(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ]
      },
      userInitDto: {
        username: '',
        nickname: '',
        phone: '',
        email: '',
        status: 1,
        roleIds: []
      },
      addOrUpdateUserDto: {
        username: '',
        nickname: '',
        phone: '',
        email: '',
        status: 1,
        roleIds: []
      },
      selectRoleDto: [],
      userRuleValidate: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.getList()
    },
    handleSearch () {
      this.getList()
    },
    handleReset () {
      this.filter.querys[0].value = ''
      this.filter.querys[1].value = ''
    },
    getList () {
      this.table.loading = true
      getUserList(this.filter).then(res => {
        this.filter.current = res.data.current
        this.filter.pageSize = res.data.size
        this.table.data = res.data.records
        this.table.total = res.data.total
        this.table.loading = false
      })
    },
    onChange (current) {
      this.filter.current = current
      this.getList()
    },
    onPageSizeChange (pageSize) {
      this.filter.pageSize = pageSize
      this.getList()
    },
    handleAddUser: function () {
      this.view.addOrUpdateTitle = '添加用户'
      this.view.isAddOrUpdate = true
      this.addOrUpdateUserDto = _.cloneDeep(this.userInitDto)
      this.view.showAddOrUpdateModal = true
      this.getApiQueryRole()
    },
    handleUpdateUser: function (row) {
      this.view.addOrUpdateTitle = '修改用户'
      this.view.isAddOrUpdate = false
      this.view.showAddOrUpdateModal = true
      this.getApiQueryRole()
      // 调用接口查询数据
      apiUserRolesInfo(row.id).then(res => {
        let { id, username, nickname, phone, email, roleIds } = res.data
        this.addOrUpdateUserDto = { id, username, nickname, phone, email, roleIds }
      })
    },
    getApiQueryRole: function (roleName = '') {
      this.view.selectRemoteMethodLoading = true
      apiQueryRole(roleName).then(res => {
        this.view.selectRemoteMethodLoading = false
        this.selectRoleDto = res.data
      })
    },
    onOk: function () {
      this.$refs.addOrUpdateFormRef.validate(valid => {
        if (valid) {
          if (this.view.isAddOrUpdate) {
            apiAddUser(this.addOrUpdateUserDto).then(res => {
              this.$Message.success('添加成功')
              this.view.showAddOrUpdateModal = false
              this.getList()
            })
          } else {
            apiUpdateUser(this.addOrUpdateUserDto).then(res => {
              this.$Message.success('修改成功')
              this.view.showAddOrUpdateModal = false
              this.getList()
            })
          }
        } else {
          this.$refs.addOrUpdateModal.buttonLoading = false
        }
      })
    },
    selectRemoteMethod: function (query) {
      this.getApiQueryRole(query)
    },
    onSelectionChange: function (e) {
      this.table.selectionData = e
    },
    handleDeleUser: function () {
      if (this.table.selectionData.length <= 0) {
        this.$Message.warning('请选择要删除的数据')
        return
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除所选的 ' + this.table.selectionData.length + ' 条数据?',
        onOk: () => {
          let ids = ''
          this.table.selectionData.forEach(function (e) {
            ids += e.id + ','
          })
          ids = ids.substring(0, ids.length - 1)
          apiDeleteUser(ids).then(res => {
            this.$Message.success('删除成功')
            this.init()
          })
        }
      })
    },
    deletUser: function (row) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除用户' + row.username + ' ?',
        onOk: () => {
          let ids = ''
          ids = row.id
          apiDeleteUser(ids).then(res => {
            this.$Message.success('删除成功')
            this.init()
          })
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped lang="less">
  .operation {
    margin-bottom: 2vh;
  }
  .opt-group {
    .opt-btn:first-child {
      margin-left: 0;
    }
    .opt-btn:last-child {
      margin-right: 0;
    }
    .opt-btn {
      margin-left: 2px;
      margin-right: 2px;
    }
  }
  .page {
    margin-top: 2vh;
  }
</style>
