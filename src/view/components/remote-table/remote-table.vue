<template>
  <page-table @on-loaded="handleLoaded" :columns="columns1" :data.sync="data1" :data-remote="getPageData" :page-size="pageSize" :current.sync="current">
  </page-table>
</template>
<script>
import PageTable from '_c/remote-table/remote-table.js'
import {
  getPageTableData
} from '@/api/data'
export default {
  components: {
    PageTable
  },
  data () {
    return {
      current: 2,
      pageSize: 10,
      columns1: [{
        title: 'Name',
        key: 'name',
        sortable: true
      },
      {
        title: 'Email',
        key: 'email',
        editable: true
      },
      {
        title: 'Create-Time',
        key: 'createTime'
      }
      ],
      data1: []
    }
  },
  methods: {
    getPageData: function (index, size) {
      return getPageTableData({
        index,
        size
      })
    },
    handleLoaded: function () {}
  }
}
</script>
