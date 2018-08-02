<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :loading="loading" :columns="columns" @on-delete="handleDelete" @on-search="handleSearch"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getTableData } from '@/api/data'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      loading: false,
      columns: [
        {title: 'Name', key: 'name', sortable: true, searchable: true},
        {title: 'Email', key: 'email', editable: true, searchable: true},
        {title: 'Create-Time', key: 'createTime', searchable: true},
        {
          title: 'Handle',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '自定义删除')
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    handleSearch (params) {
      // 在这里模拟进行远程过滤
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res.data
    })
  }
}
</script>

<style>

</style>
