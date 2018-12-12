<template>
  <Card>
    <Row class="operation">
      <Button type="primary" icon="md-add" @click="handleAddPermission">添加菜单</Button>
      <Button icon="ios-trash" @click="handleDelPermission">删除菜单</Button>
      <Button icon="md-barcode" @click="getPermissionTree">刷新</Button>
    </Row>
    <Row type="flex" justify="start" style="margin-top: 10px">
      <Col span="6">
        <Alert show-icon v-if="!view.loadingUpdate">当前选择：{{view.selectTitle}}</Alert>
        <Alert show-icon v-if="view.loadingUpdate">暂无选择：</Alert>
        <div class="tree-z">
          <Tree ref="tree" :data="dataTree" show-checkbox @on-select-change="onSelectChange"></Tree>
        </div>
      </Col>
      <Col span="14">
        <Form :label-width="80" :model="updatePermission" ref="updatePermissionFormValidate"
              :rules="permissionRuleValidate">
          <div style="display: flex;justify-content: start;">
            <FormItem label="类型">
              <RadioGroup v-model="updatePermission.type">
                <Radio :label="0" :disabled="updatePermission.type == 1">
                  <Icon type="md-menu" size="16"/>
                  <span>菜单</span>
                </Radio>
                <Radio :label="1" :disabled="updatePermission.type == 0">
                  <Icon type="logo-youtube" size="16"/>
                  <span>按钮</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="排序号">
              <InputNumber v-model="updatePermission.sort"></InputNumber>
            </FormItem>
          </div>
          <FormItem label="ID">
            <Input v-model="updatePermission.id" :disabled="true"></Input>
          </FormItem>
          <FormItem prop="title" label="标题">
            <Input v-model="updatePermission.title" placeholder="菜单显示的名称"></Input>
          </FormItem>
          <FormItem v-if="updatePermission.type == 0" prop="name" label="名称">
            <Input v-model="updatePermission.name" placeholder="菜单唯一标记，不可重复"></Input>
          </FormItem>
          <FormItem v-if="updatePermission.type == 0" prop="path" label="路由">
            <Input v-model="updatePermission.path" placeholder="前端路由"></Input>
          </FormItem>
          <FormItem v-if="updatePermission.type == 0" prop="icon" label="图标">
            <Input v-model="updatePermission.icon" placeholder="菜单图标"></Input>
          </FormItem>
          <FormItem v-if="updatePermission.type == 0" prop="component" label="组件名">
            <Input v-model="updatePermission.component" placeholder="组件名称"></Input>
          </FormItem>
          <FormItem label="备注" prop="description">
            <Input v-model="updatePermission.description" type="textarea" placeholder="备注"/>
          </FormItem>
          <div v-if="updatePermission.type == 0" style="display: flex;justify-content: space-between;">
            <FormItem label="是否隐藏菜单" :label-width="100">
              <RadioGroup v-model="updatePermission.hideInMenu">
                <Radio :label="1">
                  是
                </Radio>
                <Radio :label="0">
                  否
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否隐藏面包屑" :label-width="100">
              <RadioGroup v-model="updatePermission.hideInBread">
                <Radio :label="1">
                  是
                </Radio>
                <Radio :label="0">
                  否
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否缓存" :label-width="100">
              <RadioGroup v-model="updatePermission.notCache">
                <Radio :label="1">
                  是
                </Radio>
                <Radio :label="0">
                  否
                </Radio>
              </RadioGroup>
            </FormItem>
          </div>
          <Form-item>
            <Button type="primary" style="margin-right: 5px;" @click="updatePermissionOpt">修改保存</Button>
          </Form-item>
        </Form>
        <Spin size="large" fix v-if="view.loadingUpdate">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>暂无操作</div>
        </Spin>
      </Col>
    </Row>

    <Modal v-model="view.showAddModal" title="添加权限" ok-text="提交" :loading="true" :width="600">
      <Form :label-width="80" :model="addPermission" ref="addPermissionFormValidate" :rules="permissionRuleValidate">
        <div style="display: flex;justify-content: start;">
          <FormItem label="类型">
            <RadioGroup v-model="addPermission.type">
              <Radio :label="0" :disabled="addPermission.type == 1">
                <Icon type="md-menu" size="16"/>
                <span>菜单</span>
              </Radio>
              <Radio :label="1" :disabled="addPermission.type == 0">
                <Icon type="logo-youtube" size="16"/>
                <span>按钮</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="排序号">
            <InputNumber v-model="addPermission.sort"></InputNumber>
          </FormItem>
          <FormItem label="pid">
            <span v-text="addPermission.pid"></span>
          </FormItem>
        </div>
        <FormItem label="标题" prop="title">
          <Input v-model="addPermission.title" placeholder="菜单显示的名称"></Input>
        </FormItem>
        <FormItem v-if="addPermission.type == 0" prop="name" label="名称">
          <Input v-model="addPermission.name" placeholder="菜单唯一标记，不可重复"></Input>
        </FormItem>
        <FormItem v-if="addPermission.type == 0" prop="path" label="路由">
          <Input v-model="addPermission.path" placeholder="前端路由"></Input>
        </FormItem>
        <FormItem v-if="addPermission.type == 0" prop="icon" label="图标">
          <Input v-model="addPermission.icon" placeholder="菜单图标"></Input>
        </FormItem>
        <FormItem v-if="addPermission.type == 0" prop="component" label="组件名">
          <Input v-model="addPermission.component" placeholder="组件名称"></Input>
        </FormItem>
        <FormItem label="备注" prop="description">
          <Input v-model="addPermission.description" type="textarea" placeholder="备注"/>
        </FormItem>
        <div v-if="addPermission.type == 0" style="display: flex;justify-content: space-between;">
          <FormItem label="是否隐藏菜单" :label-width="100">
            <RadioGroup v-model="addPermission.hideInMenu">
              <Radio :label="1">
                是
              </Radio>
              <Radio :label="0">
                否
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否隐藏面包屑" :label-width="100">
            <RadioGroup v-model="addPermission.hideInBread">
              <Radio :label="1">
                是
              </Radio>
              <Radio :label="0">
                否
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否缓存" :label-width="100">
            <RadioGroup v-model="addPermission.notCache">
              <Radio :label="1">
                是
              </Radio>
              <Radio :label="0">
                否
              </Radio>
            </RadioGroup>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addPermissionOpt">提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import {getPermissionTree, addPermission, updatePermission, deletePermissions} from '@/api/sys/permission'

export default {
  name: 'permission',
  data () {
    return {
      view: {
        showAddModal: false,
        loadingUpdate: true,
        selectTitle: ''
      },
      dataTree: [],
      permissionInit: {
        type: 0,
        sort: 0,
        title: '',
        path: '',
        name: '',
        icon: '',
        component: '',
        description: '',
        hideInMenu: 0,
        hideInBread: 0,
        notCache: 0
      },
      addPermission: {},
      updatePermission: {},
      permissionRuleValidate: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        path: [
          {required: true, message: '请输入路由', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '请输入图标', trigger: 'blur'}
        ],
        component: [
          {required: true, message: '请输入组件', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入备注', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.addPermission = _.cloneDeep(this.permissionInit)
    this.updatePermission = _.cloneDeep(this.permissionInit)
    this.getPermissionTree()
  },
  methods: {
    getPermissionTree: function () {
      getPermissionTree().then(res => {
        this.dataTree = res.data
      })
    },
    handleAddPermission: function () {
      let selectedNodes = this.$refs.tree.getSelectedNodes()[0]
      if (selectedNodes) {
        if (selectedNodes.pid === 0) {
          this.addPermission.pid = selectedNodes.id
          this.addPermission.type = 0
          this.view.showAddModal = true
          return
        }
        if (selectedNodes.type === 1) {
          this.$Message.error('按钮下不允许添加！')
          return
        } else {
          this.addPermission.pid = selectedNodes.id
          this.addPermission.type = 1
        }
      } else {
        this.addPermission.pid = 0
        this.addPermission.type = 0
      }
      this.view.showAddModal = true
    },
    addPermissionOpt: function () {
      this.$refs['addPermissionFormValidate'].validate((valid) => {
        if (valid) {
          addPermission(this.addPermission).then(res => {
            this.view.showAddModal = false
            if (res.code === 200) {
              this.$refs['addPermissionFormValidate'].resetFields()
              this.$Message.success('添加成功')
              this.getPermissionTree()
            } else {
              this.$Message.error('添加失败')
            }
          })
        }
      })
    },
    updatePermissionOpt: function () {
      this.$refs['updatePermissionFormValidate'].validate((valid) => {
        if (valid) {
          updatePermission(this.updatePermission).then(res => {
            if (res.code === 200) {
              this.$Message.success('修改保存成功')
              this.view.selectTitle = this.updatePermission.title
              this.getPermissionTree()
            } else {
              this.$Message.error('修改保存失败')
            }
          })
        }
      })
    },
    handleDelPermission: function () {
      if (this.$refs.tree.getCheckedNodes().length <= 0) {
        this.$Message.warning('请选择要删除的数据')
        return
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除所选的 ' + this.$refs.tree.getCheckedNodes().length + ' 条数据?',
        onOk: () => {
          let ids = ''
          this.$refs.tree.getCheckedNodes().forEach(function (e) {
            ids += e.id + ','
          })
          ids = ids.substring(0, ids.length - 1)
          deletePermissions(ids).then(res => {
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.getPermissionTree()
            }
          })
        }
      })
    },
    onSelectChange: function (e) {
      if (e[0]) {
        let {id, type, sort, title, path, name, icon, component, description, hideInMenu, hideInBread, notCache} = e[0]
        this.updatePermission = {
          id,
          type,
          sort,
          title,
          path,
          name,
          icon,
          component,
          description,
          hideInMenu,
          hideInBread,
          notCache
        }
        this.view.selectTitle = title
        this.view.loadingUpdate = false
      } else {
        this.view.loadingUpdate = true
        this.updatePermission = this.permissionInit
      }
    }
  }
}
</script>

<style scoped lang="less">
  .operation {
    button {
      margin-right: 5px;
    }
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

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
