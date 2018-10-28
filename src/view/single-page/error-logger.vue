<template>
  <div>
    <Button @click="exportData" type="primary" style="margin: 0 10px 10px 0;">导出日志记录</Button>
    <b>注：这里只会显示成功保存到服务端的错误日志，而且页面错误日志不会在浏览器持久化存储，刷新页面即会丢失</b>
    <Table ref="table" :columns="columns" :data="errorList"></Table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'
export default {
  name: 'error_logger_page',
  data () {
    return {
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 100
        },
        {
          key: 'type',
          title: '类型',
          width: 100,
          render: (h, { row }) => {
            return (
              <div>
                <icon size={16} type={row.type === 'ajax' ? 'md-link' : 'md-code-working'}></icon>
              </div>
            )
          }
        },
        {
          key: 'code',
          title: '编码',
          render: (h, { row }) => {
            return (
              <span>{ row.code === 0 ? '-' : row.code }</span>
            )
          }
        },
        {
          key: 'mes',
          title: '信息'
        },
        {
          key: 'url',
          title: 'URL'
        },
        {
          key: 'time',
          title: '时间',
          render: (h, { row }) => {
            return (
              <span>{ dayjs(row.time).format('YYYY-MM-DD HH:mm:ss') }</span>
            )
          },
          sortable: true,
          sortType: 'desc'
        }
      ]
    }
  },
  computed: {
    errorList () {
      return this.$store.state.app.errorList
    }
  },
  methods: {
    ...mapMutations([
      'setHasReadErrorLoggerStatus'
    ]),
    exportData () {
      this.$refs.table.exportCsv({
        filename: '错误日志.csv'
      })
    }
  },
  activated () {
    this.setHasReadErrorLoggerStatus()
  },
  mounted () {
    this.setHasReadErrorLoggerStatus()
  }
}
</script>

<style>

</style>
