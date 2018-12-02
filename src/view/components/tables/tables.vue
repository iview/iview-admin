<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete" @on-save-edit="selectEdit"/>
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
      columns: [
        {title: 'Name', key: 'name', sortable: true},
        {title: 'Email', key: 'email'},
        {title: 'Gender', key: 'gender', editable: true, editType: 'select', selectItem: [{value: '0', label: '女'}, {value: '1', label: '男'}]},
        {title: 'Create-Time', key: 'createTime'},
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
      tableData: [
        {
          'name': 'Charles Young',
          'email': 'j.uwdur@ekzteeh.mq',
          'createTime': '1992-03-06',
          'gender': '1'
        },
        {
          'name': 'Paul Martinez',
          'email': 'k.xrtak@atfqbjrrmn.sh',
          'createTime': '1995-07-06',
          'gender': '1'
        },
        {
          'name': 'Thomas Taylor',
          'email': 'o.lywr@byiig.tw',
          'createTime': '2002-07-16',
          'gender': '1'
        },
        {
          'name': 'Sharon Robinson',
          'email': 'b.hywyrigqo@vszks.lr',
          'createTime': '2003-05-01',
          'gender': '1'
        },
        {
          'name': 'Jennifer Miller',
          'email': 'm.knzkdwh@qoe.gw',
          'createTime': '1993-04-08',
          'gender': '1'
        }
      ]
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    selectEdit (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    getTableData().then(res => {
      console.log(res)
      // this.tableData = res.data
    })
  }
}
</script>

<style>

</style>
