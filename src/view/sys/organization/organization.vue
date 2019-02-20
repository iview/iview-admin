<template>
  <Card>
    <Row>
      </Row>
      <Row class="operation" type="flex" justify="space-between">
        <div class="opt-group">
          <Button class="opt-btn" type="primary" icon="md-add">添加</Button>
          <Button class="opt-btn" icon="md-trash">删除</Button>
          <Button icon="md-refresh" @click="handleSearch">刷新</Button>
        </div>
        <div>
        </div>
      </Row>
      <Row type="flex" justify="start">
        <Col span="8" style="overflow: hidden;overflow-x: scroll">
          <Alert show-icon>
            当前选择编辑： <span class="select-count">中国</span>
            <a class="select-clear" >取消选择</a>
          </Alert>
          <Tree :data="data2" show-checkbox @on-select-change="onSelectChange"></Tree>
        </Col>
        <Col span="9">
          <Form ref="form" :label-width="85">
            <FormItem label="上级部门" prop="parentTitle">
              <Poptip trigger="click" placement="right-start" title="选择上级部门" width="250">
                <Input readonly/>
                <div slot="content" style="position:relative;min-height:5vh">
                  1
                </div>
              </Poptip>
            </FormItem>
            <FormItem label="部门名称" prop="title">
              <Input/>
            </FormItem>
            <FormItem label="排序值" prop="sortOrder">
              <InputNumber :max="1000" :min="0"></InputNumber>
              <span style="margin-left:5px">值越小越靠前，支持小数</span>
            </FormItem>
            <FormItem label="是否启用" prop="status">
              <i-switch size="large">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
            <Form-item class="opt-group">
              <Button class="opt-btn" type="primary" icon="ios-create-outline">修改并保存</Button>
              <Button class="opt-btn">重置</Button>
              <Button class="opt-btn" @click="customFormVisible = !customFormVisible">显示</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    <div>
      <custom-form title="xxx" v-model="customFormVisible"   :form-column="formColumn" @on-visible-change="onVisibleChange"></custom-form>
    </div>
  </Card>
</template>

<script>
import { getRoleList } from '@/api/role'
import CustomForm from '../../components/form/coustom-form'
export default {
  name: 'organization',
  components: {
    CustomForm
  },
  data () {
    return {
      customFormVisible: false,
      filter: {
      },
      formColumn: [
        {
          key: 'username',
          label: '用户名',
          type: 'input',
          placeholder: '请输入用户名',
          data: 1
        },
        {
          key: 'textarea',
          label: 'xxx',
          type: 'textarea',
          minRows: 2,
          maxRows: 5,
          placeholder: '请输入XXX',
          data: 1
        },
        {
          key: 'select',
          label: 'xxx',
          type: 'select',
          data: [
            {
              name: 'xxx',
              value: 'xxx'
            },
            {
              name: 'xxx2',
              value: 'xxx2'
            }
          ]
        },
        {
          key: 'radio',
          label: 'xxx',
          type: 'radio',
          data: [
            {
              name: 'xxx',
              value: 'xxx'
            },
            {
              name: 'xxx2',
              value: 'xxx2'
            }
          ]
        },
        {
          key: 'checkbox',
          label: 'xxx',
          type: 'checkbox',
          data: [
            {
              name: 'xxx',
              value: 'xxx'
            },
            {
              name: 'xxx2',
              value: 'xxx2'
            }
          ]
        },
        {
          key: 'switch',
          label: 'xxx',
          type: 'switch',
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
        }
      ],
      data2: [
        {
          id: 1,
          title: '父 1',
          sort: 66,
          description: '描述',
          expand: true,
          children: [
            {
              id: 11,
              title: '子节点',
              sort: 11,
              description: '描述',
              expand: true,
              children: [
                {
                  id: 11,
                  title: '子节点',
                  sort: 11,
                  description: '描述',
                  children: [
                    {
                      id: 11,
                      title: '子节点',
                      sort: 11,
                      description: '描述',
                      children: [
                        {
                          id: 11,
                          title: '子节点',
                          sort: 11,
                          description: '描述',
                          children: [
                            {
                              id: 11,
                              title: '子节点',
                              sort: 11,
                              description: '描述',
                              children: [
                                {
                                  id: 11,
                                  title: '子节点',
                                  sort: 11,
                                  description: '描述'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
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
    onVisibleChange (val) {
      this.customFormVisible = val
    },
    onSelectChange (value) {
      console.log(value)
    },
    childByValue (data) {
      console.log(data)
      console.log(this.ref.bbb)
    },
    getList () {
      return
      getRoleList(this.filter).then(res => {
        this.filter.current = res.data.data.current
        this.filter.size = res.data.data.size
        this.table.data = res.data.data.records
        this.table.total = res.data.data.total
        this.table.loading = false
      })
    },
    onChange (current) {
      this.table.current = current
      this.getList()
    },
    onPageSizeChange (pageSize) {
      this.table.pageSize = pageSize
      this.getList()
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
  .select-count {
    color: #40a9ff;
    font-size: 13px;
    font-weight: 600;
  }
  .select-clear {
    margin-left: 10px;
  }
</style>
