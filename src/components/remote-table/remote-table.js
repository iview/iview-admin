import PageTable from './page-table.js'
const TOTAL = 'total'
const ITEMS = 'items'

export default {
  name: 'remote-table',
  extends: PageTable,
  props: {
    dataRemote: Function
  },
  data () { // 自带属性值
    return {
      mData: []
    }
  },
  methods: {
    load: function () {
      if (this.dataRemote) {
        let pageIndex = this.pageCurrent
        let pageSize = this.mPageSize
        this.$emit('on-before-load', this.mData)
        let promise = this.dataRemote(pageIndex, pageSize)
        promise && promise.then(res => {
          this.loadData(res.data)
        })
      }
    },
    loadData: function (data) {
      this.pageTotal = data[TOTAL]
      this.mData = data[ITEMS]
      this.$emit('update:data', this.mData)
      this.$emit('on-loaded', this.mData)
    },
    bindPageEvent: function () {
      let _this = this

      let page = this.$refs[this.$props.pageRefs]
      page.$on('on-change', function (val) {
        _this.$emit('update:current', val)
        _this.$emit('on-change', ...arguments)
        _this.load()
      })
      page.$on('on-page-size-change', function (val) {
        _this.mPageSize = val
        _this.$emit('on-page-size-change', ...arguments)
        _this.load()
      })
    }
  },
  computed: {
    tableData: function () {
      return this.mData
    }
  },
  mounted () {
    this.load()
  }
}
