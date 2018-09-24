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
          <Button class="opt-btn" type="primary" icon="md-add" @click="form.addForm.visible = true">添加</Button>
          <Button class="opt-btn" icon="md-trash">删除</Button>
        </div>
        <div>
          <Button icon="md-refresh" @click="handleSearch">刷新</Button>
        </div>
      </Row>
      <Row>
        <Table border stripe :columns="table.columns" :data="table.data" :loading="table.loading"></Table>
      </Row>
      <Row type="flex" justify="center" class="page">
        <Page show-sizer :total="table.total" @on-change="onChange" @on-page-size-change="onPageSizeChange" />
      </Row>
    <coustom-form title="添加用户" v-model="form.addForm.visible"
                 :form-column="form.addForm.formColumn"
                 :loading="form.addForm.loading"
                 @on-visible-change="addOnVisibleChange"
                 @form-data="addFormData"
                 @on-ok="handleAddForm">
    </coustom-form>
  </Card>
</template>

<script>
import { addForm } from '@/api/common'
import { getUserList } from '@/api/user'
import CoustomForm from '../../components/form/coustom-form'
export default {
  name: 'user',
  components: {
    CoustomForm
  },
  data () {
    return {
      customFormVisible: false,
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
        columns: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '昵称',
            key: 'nickname'
          },
          {
            title: '状态',
            key: 'status'
          }
        ]
      },
      form: {
        addForm: {
          visible: false,
          loading: true,
          formColumn: [
            {
              key: 'username',
              label: '用户名',
              type: 'input',
              placeholder: '请输入用户名',
              ext: {
                clearable: true
              },
              data: 1
            },
            {
              key: 'password',
              label: '密码',
              type: 'input',
              ext: {
                type: 'password'
              },
              placeholder: '请输入密码',
              data: 1
            },
            {
              key: 'nickname',
              label: '昵称',
              type: 'input',
              placeholder: '请输入用户名',
              data: 1
            },
            {
              key: 'avatar',
              label: '头像',
              type: 'input',
              placeholder: '请输入头像',
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
      this.filter.querys[1].value = ''
    },
    getList () {
      this.table.loading = true
      getUserList(this.filter).then(res => {
        this.filter.current = res.data.data.current
        this.filter.pageSize = res.data.data.size
        this.table.data = res.data.data.records
        this.table.total = res.data.data.total
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
    addOnVisibleChange (val) {
      this.form.addForm.visible = val
    },
    addFormData (val) {
      this.form.addForm.formData = val
    },
    handleAddForm () {
      addForm({data: this.form.addForm.formData, url: 'admin/sys/user'}).then(res => {
        if (res.data.code == 200) {
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
</style>
