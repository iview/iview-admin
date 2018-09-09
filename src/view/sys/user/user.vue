<template>
  <Card>
      <Row>
        <Form ref="formInline" inline :label-width="70">
          <Form-item label="用户名称:">
            <Input type="text" clearable placeholder="请输入用户名" style="width: 200px"/>
          </Form-item>
          <Form-item label="用户名称:">
            <Input type="text" clearable placeholder="请输入用户名" style="width: 200px"/>
          </Form-item>
          <Form-item style="margin-left:-35px;" class="br">
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
        <Table border stripe></Table>
      </Row>
      <Row type="flex" justify="center" class="page">
        <Page :total="100" show-sizer />
      </Row>
  </Card>
</template>

<script>
export default {
  name: 'user'
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
