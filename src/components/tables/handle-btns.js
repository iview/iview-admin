const btns = [
  (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '你确定要删除吗?'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params)
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.index))
        }
      }
    }, [
      h('Button', {
        props: {
          type: 'text'
        }
      }, [
        h('Icon', {
          props: {
            type: 'trash-b',
            size: 18
          }
        })
      ])
    ])
  },
  (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'text'
      },
      on: {
        click: () => {
          console.log(params)
        }
      }
    }, [
      h('Icon', {
        props: {
          type: 'search',
          size: 18
        }
      })
    ])
  }
]

export default btns
