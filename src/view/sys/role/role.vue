<template>
  <Card>
    <Row>
      <Form ref="formInline" inline :label-width="70">
        <Form-item label="角色名:">
          <Input type="text" v-model="filter.querys[0].value" clearable placeholder="请输入角色名"/>
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
        <Button class="opt-btn" type="primary" icon="md-add" @click="handleAddRole">添加</Button>
        <!--<Button class="opt-btn" icon="md-git-pull-request" @click="assignPermissionModal">分配权限</Button>-->
        <Button class="opt-btn" icon="md-trash" @click="handleDeletRole">删除</Button>
      </div>
      <div>
        <Button icon="md-refresh" @click="handleSearch">刷新</Button>
      </div>
    </Row>
    <Row>
      <Table ref="table" border stripe :columns="table.columns" :data="table.data" :loading="table.loading" @on-selection-change="onSelectionChange"></Table>
    </Row>
    <Row type="flex" justify="center" class="page">
      <Page show-sizer :total="table.total" @on-change="onChange" @on-page-size-change="onPageSizeChange"/>
    </Row>
    <Modal ref="addOrUpdateModal" v-model="view.showAddOrUpdateModal" :title="view.addOrUpdateTitle" :mask-closable="false" ok-text="提交" :loading="true" @on-ok="onOk" :width="600">
      <Form ref="addOrUpdateFormRef" :model="addOrUpdateRoleDto" :rules="roleRuleValidate" :label-width="80">
        <FormItem prop="name" label="角色名">
          <Input v-model="addOrUpdateRoleDto.name"></Input>
        </FormItem>
        <FormItem label="排序号">
          <InputNumber v-model="addOrUpdateRoleDto.sort"></InputNumber>
        </FormItem>
        <FormItem label="状态">
          <i-switch size="large" v-model="addOrUpdateRoleDto.status" :true-value="1" :false-value="0">
            <span slot="open">正常</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem prop="description" label="备注">
          <Input type="textarea" v-model="addOrUpdateRoleDto.description"/>
        </FormItem>
      </Form>
    </Modal>

    <Modal ref="assignPermissionModal" v-model="view.showAssignPermissionModal" title="分配权限" :mask-closable="false" ok-text="提交" :loading="true" @on-ok="onOkAssignPermission" :width="600">
      <div class="tree-z" style="position: relative">
        <!--@on-select-change="onSelectChange"-->
        <Tree ref="tree" :data="dataTree" empty-text="暂无数据" show-checkbox check-strictly></Tree>
        <Spin  size="large" fix v-if="view.assignPermissionLoading">
          <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
          <div>加载中</div>
        </Spin>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { apiGetRoleList, apiAddRole, apiUpdateRole, apiDeleteRole, apiGetRolePermissionTree, apiUpdateRolePermission } from '@/api/sys/role'
import CoustomForm from '../../components/form/coustom-form'

export default {
  name: 'role',
  components: {
    CoustomForm
  },
  data () {
    return {
      view: {
        showAddOrUpdateModal: false,
        showAssignPermissionModal: false,
        assignPermissionLoading: true,
        addOrUpdateTitle: '',
        isAddOrUpdate: false
      },
      filter: {
        querys: [
          {
            column: 'name',
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
            key: 'id',
            width: 100,
            align: 'center'
          },
          {
            title: '角色名',
            key: 'name',
            align: 'center'
          },
          {
            title: '排序号',
            key: 'sort',
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
            title: '备注',
            key: 'description'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 300,
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
                        console.log(params.row)
                        this.assignPermission(params.row)
                      }
                    }
                  },
                  '分配权限'
                ),
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
                        console.log(params.row)
                        this.handleUpdateRole(params.row)
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
                        this.deletRole(params.row)
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
      dataTree: [],
      roleInitDto: {
        name: '',
        sort: 0,
        status: 1,
        description: ''
      },
      addOrUpdateRoleDto: {
        name: '',
        sort: 0,
        status: 1,
        description: ''
      },
      assignPermissionDto: {
        roleId: null,
        permIds: []
      },
      roleRuleValidate: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入备注', trigger: 'blur' }
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
    },
    getList () {
      this.table.loading = true
      apiGetRoleList(this.filter).then(res => {
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
    handleAddRole: function () {
      this.view.addOrUpdateTitle = '添加角色'
      this.view.isAddOrUpdate = true
      this.addOrUpdateRoleDto = _.cloneDeep(this.roleInitDto)
      this.view.showAddOrUpdateModal = true
    },
    handleUpdateRole: function (row) {
      this.view.addOrUpdateTitle = '修改角色'
      this.view.isAddOrUpdate = false
      let { id, name, sort, status, description } = row
      this.addOrUpdateRoleDto = { id, name, sort, status, description }
      this.view.showAddOrUpdateModal = true
    },
    onOk: function () {
      this.$refs.addOrUpdateFormRef.validate(valid => {
        if (valid) {
          if (this.view.isAddOrUpdate) {
            apiAddRole(this.addOrUpdateRoleDto).then(res => {
              this.$Message.success('添加成功')
              this.view.showAddOrUpdateModal = false
              this.getList()
            })
          } else {
            apiUpdateRole(this.addOrUpdateRoleDto).then(res => {
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
    onSelectionChange: function (e) {
      this.table.selectionData = e
    },
    handleDeletRole: function () {
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
          apiDeleteRole(ids).then(res => {
            this.$Message.success('删除成功')
            this.init()
          })
        }
      })
    },
    deletRole: function (row) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除角色' + row.name + ' ?',
        onOk: () => {
          let ids = ''
          ids = row.id
          apiDeleteRole(ids).then(res => {
            this.$Message.success('删除成功')
            this.init()
          })
        }
      })
    },
    assignPermission: function (row) {
      this.dataTree = []
      this.view.showAssignPermissionModal = true
      this.view.assignPermissionLoading = true
      this.assignPermissionDto.roleId = row.id
      apiGetRolePermissionTree(row.id).then(res => {
        this.view.assignPermissionLoading = false
        this.dataTree = res.data
      })
    },
    onOkAssignPermission: function () {
      let permIds = []
      let checkedAndIndeterminateNodes = this.$refs.tree.getCheckedAndIndeterminateNodes()
      checkedAndIndeterminateNodes.forEach(function (e) {
        permIds.push(e.id)
      })
      this.assignPermissionDto.permIds = permIds
      apiUpdateRolePermission(this.assignPermissionDto).then(res => {
        this.view.showAssignPermissionModal = false
        this.$Message.success('分配成功')
      })
      this.$refs.assignPermissionModal.buttonLoading = false
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

  .tree-z {
    max-height: 430px;
    min-height: 50px;
    overflow: auto;
  }

  .tree-z::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .tree-z::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
  }

  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
