<style>

</style>
<template>
  <div>
    <Table :columns="historyColumns" :data="historyData"></Table>
    <Page :total="dataCount" :page-size="pageSize" show-total show-sizer show-elevator   @on-change="changepage"></Page>
  </div>
</template>
<script>
let testData = {
  'histories': [
    {
      'username': '智能审批',
      'shenpistatus': '审批已通过',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-24 18:11'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批已通过',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-24 18:11'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批已通过',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-24 10:04'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201',
      'time': '2017-07-24 10:03'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201',
      'time': '2017-07-24 10:02'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批已通过',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-24 10:02'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-24 10:01'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-24 09:56'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-21 14:23'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201 && 所有项目的总净收入 > 5000',
      'time': '2017-07-21 14:23'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-21 14:23'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201 && 所有项目的总净收入 > 5000',
      'time': '2017-07-21 14:23'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201 && 所有项目的总净收入 > 5000',
      'time': '2017-07-21 14:23'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201 && 所有项目的总净收入 > 5000',
      'time': '2017-07-21 14:21'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-21 14:21'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-21 14:20'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201 && 所有项目的总净收入 > 5000',
      'time': '2017-07-21 14:20'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-21 14:14'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-21 14:13'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-21 14:11'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-21 14:10'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201 && 所有项目的总净收入 > 5000',
      'time': '2017-07-20 18:09'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201 && 所有项目的总净收入 > 5000',
      'time': '2017-07-20 18:08'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '  收入 > 999 && 支出 < 201 && 所有项目的总净收入 > 5000',
      'time': '2017-07-20 18:08'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-20 18:07'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-20 18:05'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批已通过',
      'shenpicomments': 'wedfqw',
      'time': '2017-07-20 15:50'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批已通过',
      'shenpicomments': 'wedfqw',
      'time': '2017-07-20 15:20'
    },
    {
      'username': '智能审批',
      'shenpistatus': '审批被拒绝',
      'shenpicomments': '自动审批通过',
      'time': '2017-07-19 18:27'
    }
  ]
}
export default {
  data () {
    return {
      ajaxHistoryData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 10,
      historyColumns: [
        {
          title: '人员',
          key: 'username'
        },
        {
          title: '操作',
          key: 'shenpistatus'
        },
        {
          title: '意见',
          key: 'shenpicomments'
        },
        {
          title: '时间',
          key: 'time'
        }

      ],
      historyData: []
    }
  },
  methods: {
    // 获取历史记录信息
    handleListApproveHistory () {
      // 保存取到的所有数据
      this.ajaxHistoryData = testData.histories
      this.dataCount = testData.histories.length
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (testData.histories.length < this.pageSize) {
        this.historyData = this.ajaxHistoryData
      } else {
        this.historyData = this.ajaxHistoryData.slice(0, this.pageSize)
      }
    },
    changepage (index) {
      var _start = (index - 1) * this.pageSize
      var _end = index * this.pageSize
      this.historyData = this.ajaxHistoryData.slice(_start, _end)
    }
  },
  created () {
    this.handleListApproveHistory()
  }
}
</script>
