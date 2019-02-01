<template>
  <Card>
    <Row class="operation">
      <Button type="primary" icon="md-add" @click="handleAddPermission(0)">添加一级菜单</Button>
      <Button type="primary" icon="md-add" @click="handleAddPermission(1)">添加子节点</Button>
      <Button icon="ios-trash" @click="handleDeletePermission">删除菜单</Button>
      <Button icon="md-barcode" @click="initPermissionTree">刷新</Button>
    </Row>
    <Row type="flex" justify="start" style="margin-top: 10px">
      <Col span="6">
        <Alert show-icon v-if="!view.updatePermissionLoading">当前选择：{{view.selectTitle}}</Alert>
        <Alert show-icon v-if="view.updatePermissionLoading">暂无选择：</Alert>
        <div class="tree-z" style="position: relative">
          <Tree ref="tree" :data="dataTree" empty-text="暂无数据" show-checkbox @on-select-change="onSelectChange"></Tree>
          <Spin  size="large" fix v-if="view.treeLoading">
            <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
            <div>加载中</div>
          </Spin>
        </div>
      </Col>
      <Col span="14">
        <Form ref="updateFormRef" :model="updatePermissionDto" :rules="permissionRuleValidate" :label-width="80">
          <div style="display: flex;justify-content: start;">
            <FormItem label="ID">
              <Input v-model="updatePermissionDto.id" :disabled="true"></Input>
            </FormItem>
            <FormItem label="类型">
              <RadioGroup v-model="updatePermissionDto.type">
                <Radio :label="0" :disabled="updatePermissionDto.type == 1">
                  <Icon type="md-menu" size="16"/>
                  <span>菜单</span>
                </Radio>
                <Radio :label="1" :disabled="updatePermissionDto.type == 0">
                  <Icon type="logo-youtube" size="16"/>
                  <span>按钮</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="排序号">
              <InputNumber v-model="updatePermissionDto.sort"></InputNumber>
            </FormItem>
          </div>
          <FormItem prop="title" label="标题">
            <Input v-model="updatePermissionDto.title"></Input>
          </FormItem>
          <FormItem prop="name" label="英文名" v-if="updatePermissionDto.type == 0">
            <Input v-model="updatePermissionDto.name"></Input>
          </FormItem>
          <FormItem prop="path" label="前端路由" v-if="updatePermissionDto.type == 0">
            <Input v-model="updatePermissionDto.path"></Input>
          </FormItem>
          <FormItem prop="component" label="前端组件" v-if="updatePermissionDto.type == 0">
            <Input v-model="updatePermissionDto.component"></Input>
          </FormItem>
          <FormItem prop="icon" label="图标" v-if="updatePermissionDto.type == 0">
            <Input v-model="updatePermissionDto.icon"></Input>
          </FormItem>
          <FormItem prop="permCode" label="权限编码" v-if="updatePermissionDto.type == 1">
            <Input v-model="updatePermissionDto.permCode"></Input>
          </FormItem>
          <FormItem prop="description" label="备注">
            <Input type="textarea" v-model="updatePermissionDto.description"/>
          </FormItem>
          <div style="display: flex;justify-content: space-between;">
            <FormItem label="是否隐藏菜单" :label-width="100" v-if="updatePermissionDto.type == 0">
              <RadioGroup v-model="updatePermissionDto.hideInMenu">
                <Radio :label="1">
                  是
                </Radio>
                <Radio :label="0">
                  否
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否隐藏面包屑" :label-width="100" v-if="updatePermissionDto.type == 0">
              <RadioGroup v-model="updatePermissionDto.hideInBread">
                <Radio :label="1">
                  是
                </Radio>
                <Radio :label="0">
                  否
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否缓存" :label-width="100" v-if="updatePermissionDto.type == 0">
              <RadioGroup v-model="updatePermissionDto.notCache">
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
            <Button type="primary" :loading="view.updateButtonLoading" @click="handleUpdatePermission" style="margin-right: 5px;">修改保存</Button>
          </Form-item>
        </Form>
        <Spin size="large" fix v-if="view.updatePermissionLoading">
          <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
          <div>暂无操作</div>
        </Spin>
      </Col>
    </Row>

    <Modal ref="addModal" v-model="view.showAddModal" title="添加权限" :mask-closable="false" ok-text="提交" :loading="true" @on-ok="onOk" :width="600">
      <Form ref="addFormRef" :model="addPermissionDto" :rules="permissionRuleValidate" :label-width="80">
        <div style="display: flex;justify-content: start;">
          <FormItem label="类型">
            <RadioGroup v-model="addPermissionDto.type">
              <Radio :label="0" :disabled="addPermissionDto.type == 1">
                <Icon type="md-menu" size="16"/>
                <span>菜单</span>
              </Radio>
              <Radio :label="1" :disabled="addPermissionDto.type == 0">
                <Icon type="logo-youtube" size="16"/>
                <span>按钮</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="排序号">
            <InputNumber v-model="addPermissionDto.sort"></InputNumber>
          </FormItem>
        </div>
        <FormItem prop="title" label="标题">
          <Input v-model="addPermissionDto.title"></Input>
        </FormItem>
        <FormItem prop="name" label="英文名" v-if="addPermissionDto.type == 0">
          <Input v-model="addPermissionDto.name"></Input>
        </FormItem>
        <FormItem prop="path" label="前端路由" v-if="addPermissionDto.type == 0">
          <Input v-model="addPermissionDto.path"></Input>
        </FormItem>
        <FormItem prop="component" label="前端组件" v-if="addPermissionDto.type == 0">
          <Input v-model="addPermissionDto.component"></Input>
        </FormItem>
        <FormItem prop="icon" label="图标" v-if="addPermissionDto.type == 0">
          <Input v-model="addPermissionDto.icon"></Input>
        </FormItem>
        <FormItem prop="permCode" label="权限编码" v-if="addPermissionDto.type == 1">
          <Input v-model="addPermissionDto.permCode"></Input>
        </FormItem>
        <FormItem prop="description" label="备注">
          <Input type="textarea" v-model="addPermissionDto.description"/>
        </FormItem>
        <div style="display: flex;justify-content: space-between;">
          <FormItem label="是否隐藏菜单" :label-width="100" v-if="addPermissionDto.type == 0">
            <RadioGroup v-model="addPermissionDto.hideInMenu">
              <Radio :label="1">
                是
              </Radio>
              <Radio :label="0">
                否
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否隐藏面包屑" :label-width="100" v-if="addPermissionDto.type == 0">
            <RadioGroup v-model="addPermissionDto.hideInBread">
              <Radio :label="1">
                是
              </Radio>
              <Radio :label="0">
                否
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否缓存" :label-width="100" v-if="addPermissionDto.type == 0">
            <RadioGroup v-model="addPermissionDto.notCache">
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
      <!--<div slot="footer">-->
        <!--<Button type="primary">提交</Button>-->
      <!--</div>-->
    </Modal>
  </Card>
</template>

<script>
import { apiGetPermissionTree, apiAddPermission, apiUpdatePermission, apiDeletePermissions } from '@/api/sys/permission'

export default {
  name: 'permission',
  data () {
    return {
      view: {
        treeLoading: true, // tree 加载动画
        updatePermissionLoading: true, // 修改权限加载动画
        selectTitle: '', // 选中 title
        showAddModal: false, // 显示添加Modal
        updateButtonLoading: false
      },
      dataTree: [],
      permissionInitDto: {
        id: '',
        type: 0,
        sort: 0,
        title: '',
        name: '',
        path: '',
        component: '',
        icon: '',
        permCode: '',
        description: '',
        hideInMenu: 0,
        hideInBread: 0,
        notCache: 0
      },
      addPermissionDto: {
        id: '',
        type: 0,
        sort: 0,
        title: '',
        name: '',
        path: '',
        component: '',
        icon: '',
        permCode: '',
        description: '',
        hideInMenu: 0,
        hideInBread: 0,
        notCache: 0
      },
      updatePermissionDto: {
        id: '',
        type: 0,
        sort: 0,
        title: '',
        name: '',
        path: '',
        component: '',
        icon: '',
        permCode: '',
        description: '',
        hideInMenu: 0,
        hideInBread: 0,
        notCache: 0
      },
      permissionRuleValidate: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入英文名', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入前端路由', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入前端组件', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入图标', trigger: 'blur' }
        ],
        permCode: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initPermissionTree()
  },
  methods: {
    initPermissionTree: function () { // 获取树节点
      this.view.updatePermissionLoading = true
      this.view.treeLoading = true
      this.updatePermissionDto = _.cloneDeep(this.permissionInitDto)
      apiGetPermissionTree().then(res => {
        this.dataTree = res.data
        this.view.treeLoading = false
      })
    },
    onSelectChange: function (e) { // 点击节点事件
      let permissionTree = e[0]
      if (permissionTree) {
        let { id, type, sort, title, name, path, component, icon, permCode, description, hideInMenu, hideInBread, notCache } = permissionTree
        this.updatePermissionDto = {
          id,
          type,
          sort,
          title,
          name,
          path,
          component,
          icon,
          permCode,
          description,
          hideInMenu,
          hideInBread,
          notCache
        }
        this.view.selectTitle = title
        this.view.updatePermissionLoading = false
      } else {
        this.view.updatePermissionLoading = true
        this.updatePermissionDto = _.cloneDeep(this.permissionInitDto)
      }
    },
    handleAddPermission: function (e) {
      this.addPermissionDto = _.cloneDeep(this.permissionInitDto)
      if (e === 0) { // 一级菜单
        this.addPermissionDto.pid = 0
        this.addPermissionDto.type = 0
      } else if (e === 1) { // 子节点
        let selectedNodes = this.$refs.tree.getSelectedNodes()[0]
        if (!selectedNodes) {
          this.$Message.warning('请选择子节点')
          return
        }
        if (selectedNodes.type === 1) {
          this.$Message.warning('按钮下不允许添加')
          return
        }
        this.addPermissionDto.pid = selectedNodes.id
        console.log(this.addPermissionDto)
        if (selectedNodes.pid === 0) {
          this.addPermissionDto.type = 0
        } else {
          this.addPermissionDto.type = 1
        }
      }
      this.view.showAddModal = true
    },
    handleUpdatePermission: function () {
      this.$refs.updateFormRef.validate(valid => {
        if (valid) {
          apiUpdatePermission(this.updatePermissionDto).then(res => {
            this.$Message.success('修改成功')
            this.initPermissionTree()
          })
        }
      })
    },
    onOk: function () {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          apiAddPermission(this.addPermissionDto).then(res => {
            this.$Message.success('添加成功')
            this.view.showAddModal = false
            this.initPermissionTree()
          })
        } else {
          this.$refs.addModal.buttonLoading = false
        }
      })
    },
    handleDeletePermission: function () {
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
          apiDeletePermissions(ids).then(res => {
            this.$Message.success('删除成功')
            this.initPermissionTree()
          })
        }
      })
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

  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
