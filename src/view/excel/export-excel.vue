<style lang="less">
    @import "./common.less";
</style>
<template>
  <div>
    <Card title="导出EXCEL">
      <Row>
        <Button icon="md-download" :loading="exportLoading" @click="exportExcel">导出文件</Button>
      </Row>
    </Card>
    <Row class="margin-top-10">
      <Table :columns="tableTitle" :data="tableData"></Table>
    </Row>
  </div>
</template>
<script>
import excel from '@/libs/excel'
export default {
  name: 'export-excel',
  data () {
    return {
      exportLoading: false,
      tableTitle: [
        {
          title: '一级分类',
          key: 'category1'
        },
        {
          title: '二级分类',
          key: 'category2'
        },
        {
          title: '三级分类',
          key: 'category3'
        }
      ],
      tableData: [
        {
          category1: 1,
          category2: 2,
          category3: 3
        },
        {
          category1: 4,
          category2: 5,
          category3: 6
        },
        {
          category1: 7,
          category2: 8,
          category3: 9
        }
      ]
    }
  },
  methods: {
    exportExcel () {
      if (this.tableData.length) {
        this.exportLoading = true
        const params = {
          title: ['一级分类', '二级分类', '三级分类'],
          key: ['category1', 'category2', 'category3'],
          data: this.tableData,
          autoWidth: true,
          filename: '分类列表'
        }
        excel.export_array_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
