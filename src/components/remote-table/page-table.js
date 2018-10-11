import {
  Table,
  Page
} from 'iview'
export default {
  name: 'page-table',
  render: function (h) {
    let tableProps = {}
    for (let prop in Table.props) {
      if (prop === 'data') {
        tableProps[prop] = this.tableData
      } else {
        tableProps[prop] = this[prop]
      }
    }
    let pageProps = {}
    for (let prop in Page.props) {
      if (prop === 'current') {
        pageProps[prop] = this.pageCurrent
      } else if (prop === 'total') {
        pageProps[prop] = this.pageTotal
      } else {
        pageProps[prop] = this[prop]
      }
    }

    if (pageProps['size'] && pageProps['size'] !== 'small') {
      delete pageProps['size']
    }
    let header = this.$slots.header === undefined ? undefined : h('slot', {
      slot: 'header'
    }, this.$slots.header)
    var page = this.showPage ? h(Page, {
      props: pageProps,
      ref: this.pageRefs,
      on: {
        'update:current': val => { this.pageCurrent = val }
      }
    }) : undefined
    let footer = this.$slots.footer === undefined && page === undefined ? undefined : h('slot', {
      slot: 'footer'
    }, [this.$slots.footer, page])
    let loading = this.$slots.loading === undefined ? undefined : h('slot', {
      slot: 'loading'
    }, [this.$slots.loading])

    return h(Table, {
      props: tableProps,
      ref: this.tableRefs
    }, [header, footer, loading])
  },
  props: (() => {
    var props = {}
    Object.assign(props, Page.props, Table.props, {
      showPage: {
        type: Boolean,
        default () {
          return true
        }
      },
      tableRefs: {
        type: String,
        default () {
          return '_table'
        }
      },
      pageRefs: {
        type: String,
        default () {
          return '_page'
        }
      }
    })
    return props
  })(),
  computed: {
    tableData: function () {
      return this.data
    }
  },
  data () { // 自带属性值
    return {
      pageCurrent: this.current,
      mPageSize: this.pageSize,
      pageTotal: this.total,
      tableEvents: ['on-current-change', 'on-row-click', 'on-row-dblclick',
        'on-select', 'on-select-cancel', 'on-selection-change', 'on-expand',
        'on-select-all', 'on-filter-change', 'on-sort-change'
      ],
      pageEvents: ['on-change', 'on-page-size-change']
    }
  },
  methods: {
    bindTableEvent: function () {
      let _this = this
      let table = this.$refs[this.$props.tableRefs]
      this.tableEvents.forEach(event => {
        table.$on(event, function () {
          _this.$emit(event, ...arguments)
        })
      })
    },
    bindPageEvent: function () {
      let _this = this
      let page = this.$refs[this.$props.pageRefs]
      this.pageEvents.forEach(event => {
        page.$on(event, function () {
          if (event === 'on-change') {
            _this.$emit('update:current', _this.pageCurrent)
          }
          _this.$emit(event, ...arguments)
        })
      })
    }
  },
  mounted () {
    this.bindTableEvent()
    this.bindPageEvent()
  }
}
