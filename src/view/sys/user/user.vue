<template>
  <Card>
    <div>
      <Form ref="formInline" inline>
        <Row>
          <Col span="8">
            <FormItem label="开始时间-结束时间:" :label-width="129">
              <DatePicker type="datetimerange" placement="bottom-end" format="yyyy-MM-dd HH:mm:ss" placeholder="搜索时间"  style="min-width: 280px;">
              </DatePicker>
            </FormItem>
          </Col>
          <Col>
            <!--<FormItem  style="position: absolute;right: 0;">-->
              <!--<Button class="search-btn" icon="ios-refresh-circle-outline" type="primary">重置</Button>-->
              <!--<Button class="search-btn" icon="md-search" type="primary">搜索</Button>-->
            <!--</FormItem>-->
          </Col>
        </Row>
      </Form>
    </div>
    <!--<Table border stripe :loading="loading" :columns="columns" :data="data"></Table>-->
    <Table border stripe></Table>
  </Card>
</template>

<script>
export default {
  name: 'user'
}
</script>

<style scoped>

</style>
