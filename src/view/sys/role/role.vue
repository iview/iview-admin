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
          <Button class="opt-btn" type="primary" icon="md-add">添加</Button>
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
  </Card>
</template>

<script>
import { getRoleList } from '@/api/role'
export default {
  name: 'user',
  data () {
    return {
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
        columns: [
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
            title: '描述',
            key: 'description'
          }
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
  .page {
    margin-top: 2vh;
  }
</style>
