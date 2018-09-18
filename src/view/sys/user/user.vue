<template>
  <Card>
      <Row>
        <Form ref="formInline" inline :label-width="70">
          <Form-item label="用户名称:">
            <Input type="text" clearable placeholder="请输入用户名"/>
          </Form-item>
          <Form-item label="用户名称:">
            <Input type="text" clearable placeholder="请输入用户名"/>
          </Form-item>
          <Form-item label="用户名称:">
            <Input type="text" clearable placeholder="请输入用户名"/>
          </Form-item>
          <Form-item label="用户名称:">
            <Input type="text" clearable placeholder="请输入用户名"/>
          </Form-item>
          <Form-item style="margin-left:-60px;">
            <div class="opt-group">
              <Button class="opt-btn" type="primary" icon="ios-search">搜索</Button>
              <Button class="opt-btn">重置</Button>
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
          <Button icon="md-refresh">刷新</Button>
        </div>
      </Row>
      <Row>
        <Table border stripe :columns="table.columns" :data="table.data" :loading="table.loading"></Table>
      </Row>
      <Row type="flex" justify="center" class="page">
        <Page show-sizer :total="filter.total" @on-change="onChange" @on-page-size-change="onPageSizeChange" />
      </Row>
  </Card>
</template>

<script>
import { getUserList } from '@/api/user'
export default {
  name: 'user',
  data () {
    return {
      filter: {
        current: 1,
        size: 10,
        total: 0
      },
      table: {
        loading: false,
        data: [],
        columns: [
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
      }
    }
  },
  methods: {
    init () {
      this.getList()
    },
    getList () {
      this.table.loading = true
      getUserList({
        current: this.filter.current,
        size: this.filter.size
      }).then(res => {
        this.table.data = res.data.data.records
        this.filter.current = res.data.data.current
        this.filter.size = res.data.data.size
        this.filter.total = res.data.data.total
        this.table.loading = false
      })
    },
    onChange (current) {
      this.filter.current = current
      this.init()
    },
    onPageSizeChange (size) {
      this.filter.size = size
      this.init()
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
