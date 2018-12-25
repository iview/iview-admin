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
        <Button class="opt-btn" type="primary" icon="md-add" @click="form.addForm.visible = true">添加</Button>
        <Button class="opt-btn" icon="md-git-pull-request" @click="assignPermissionModal">分配权限</Button>
        <Button class="opt-btn" icon="md-trash">删除</Button>
      </div>
      <div>
        <Button icon="md-refresh" @click="handleSearch">刷新</Button>
      </div>
    </Row>
    <Row>
      <Table ref="table" border stripe :columns="table.columns" :data="table.data" :loading="table.loading"></Table>
    </Row>
    <Row type="flex" justify="center" class="page">
      <Page show-sizer :total="table.total" @on-change="onChange" @on-page-size-change="onPageSizeChange"/>
    </Row>
    <!--<coustom-form title="添加角色" v-model="form.addForm.visible"-->
    <!--:form-column="form.addForm.formColumn"-->
    <!--:loading="form.addForm.loading"-->
    <!--@on-visible-change="addOnVisibleChange"-->
    <!--@form-data="addFormData"-->
    <!--@on-ok="handleAddForm"></coustom-form>-->

    <Modal ref="assignPermissionModal" v-model="view.assignPermissionModal" title="分配权限">
      <div class="tree-z">
        <Tree ref="tree" :data="dataTree" show-checkbox></Tree>
      </div>
      <div slot="footer">
        <Button type="primary" @click="updateRolePermission">提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import {addForm} from '@/api/common'
import {getRoleList, getRolePermissionTree, updateRolePermission} from '@/api/sys/role'
import CoustomForm from '../../components/form/coustom-form'

export default {
  name: 'user',
  components: {
    CoustomForm
  },
  data () {
    return {
      view: {
        assignPermissionModal: false
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
      dataTree: [],
      assignPermission: {
        roleId: null,
        permIds: null
      },
      table: {
        loading: false,
        total: 0,
        data: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '角色名',
            key: 'name'
          },
          {
            title: '排序号',
            key: 'sort'
          },
          {
            title: '状态',
            key: 'status'
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
                        this.edit(params.row)
                      }
                    }
                  },
                  '编辑'
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
                        this.remove(params.row)
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
      tableSelectionData: [],
      form: {
        addForm: {
          visible: false,
          loading: true,
          formColumn: [
            {
              key: 'name',
              label: '角色名',
              type: 'input',
              placeholder: '请输入角色名',
              ext: {
                clearable: true
              },
              data: 1
            },
            {
              key: 'sort',
              label: '排序号',
              type: 'input-number',
              ext: {},
              data: 1
            },
            {
              key: 'status',
              label: '状态',
              type: 'switch',
              ext: {
                trueValue: 1,
                falseValue: 0
              },
              data: [
                {
                  name: '打开',
                  value: 'open'
                },
                {
                  name: '关闭',
                  value: 'close'
                }
              ]
            },
            {
              key: 'description',
              label: '描述',
              type: 'textarea',
              placeholder: '请输入描述'
            }
          ],
          formData: {}
        }
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
      getRoleList(this.filter).then(res => {
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
    assignPermissionModal () {
      if (this.$refs.table.getSelection().length <= 0 || this.$refs.table.getSelection().length > 1) {
        this.$Message.warning('请选择需要分配权限的一条数据')
        return
      }
      this.dataTree = []
      getRolePermissionTree(this.$refs.table.getSelection()[0].id).then(res => {
        this.assignPermission.roleId = this.$refs.table.getSelection()[0].id
        this.dataTree = res.data
        this.view.assignPermissionModal = true
      })
    },
    updateRolePermission () {
      let permIds = []
      // let selectedNodes = this.$refs.tree.getSelectedNodes();
      let selectedNodes = this.$refs.tree.getCheckedNodes()
      selectedNodes.forEach(function (e) {
        permIds.push(e.id)
      })
      this.assignPermission.permIds = permIds
      updateRolePermission(this.assignPermission).then(res => {
        console.log(res)
      })
    },
    addOnVisibleChange (val) {
      this.form.addForm.visible = val
    },
    addFormData (val) {
      this.form.addForm.formData = val
    },
    handleAddForm () {
      addForm({data: this.form.addForm.formData, url: 'admin/sys/role'}).then(res => {
        if (res.code === 200) {
          this.form.addForm.visible = false
          this.$Message.success('添加成功')
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

  .tree-z {
    max-height: 500px;
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
</style>
