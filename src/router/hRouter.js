import Main from '@/components/main'
// import parentView from '@/components/parent-view'

// 设置
const setting = [
  {
    path: '/setting',
    name: 'zero_setting',
    component: Main,
    meta: {
      title: '精神疾病',
      icon: 'ios-book'
    },
    children: [
      {
        path: 'my_info',
        name: 'my_info',
        meta: {
          icon: '_qq',
          title: 'my_info'
        },
        component: () => import('@/view/zero/settings/myInfo.vue')
      },
      {
        path: 'permissions',
        name: 'permissions',
        meta: {
          icon: '_qq',
          title: 'permissions'
        },
        component: () => import('@/view/zero/settings/permissions.vue')
      },
      {
        path: 'phone_num',
        name: 'phone_num',
        meta: {
          icon: '_qq',
          title: 'phone_num'
        },
        component: () => import('@/view/zero/settings/phoneNum.vue')
      },
      {
        path: 'pwd',
        name: 'pwd',
        meta: {
          icon: '_qq',
          title: 'pwd'
        },
        component: () => import('@/view/zero/settings/pwd.vue')
      }
    ]
  }
]

// 搜索
const search = [
  {
    path: '/search',
    name: 'zero_search',
    component: Main,
    meta: {
      title: '查询',
      icon: 'ios-book'
    },
    children: [
      {
        path: 'doctor',
        name: 'doctor',
        meta: {
          icon: '_qq',
          title: 'doctor'
        },
        component: () => import('@/view/zero/search/doctor.vue')
      },
      {
        path: 'patient',
        name: 'patient',
        meta: {
          icon: '_qq',
          title: 'patient'
        },
        component: () => import('@/view/zero/search/patient.vue')
      },
      {
        path: 'transforPatient',
        name: 'transforPatient',
        meta: {
          icon: '_qq',
          title: 'transforPatient'
        },
        component: () => import('@/view/zero/search/transforPatient.vue')
      }
    ]
  }
]

// 审批
const approval = [
  {
    path: '/approval',
    name: 'zero_approval',
    component: Main,
    meta: {
      title: '审批',
      icon: 'ios-book'
    },
    children: [
      {
        path: 'filed',
        name: 'filed',
        meta: {
          icon: '_qq',
          title: 'filed'
        },
        component: () => import('@/view/zero/approval/filed.vue')
      },
      {
        path: 'sure',
        name: 'sure',
        meta: {
          icon: '_qq',
          title: 'sure'
        },
        component: () => import('@/view/zero/approval/sure.vue')
      }
    ]
  }
]

// 模板
const templete = [
  {
    path: '/template',
    name: 'zero_template',
    component: Main,
    meta: {
      title: '模板',
      icon: 'ios-book'
    },
    children: [
      {
        path: 'cases',
        name: 'cases',
        meta: {
          icon: '_qq',
          title: 'cases'
        },
        component: () => import('@/view/zero/template/cases.vue')
      },
      {
        path: 'dropdown',
        name: 'dropdown',
        meta: {
          icon: '_qq',
          title: 'dropdown'
        },
        component: () => import('@/view/zero/template/dropdown.vue')
      },
      {
        path: 'table',
        name: 'table',
        meta: {
          icon: '_qq',
          title: 'table'
        },
        component: () => import('@/view/zero/template/table.vue')
      }
    ]
  }
]

// 精神疾病
const spirit = [
  {
    path: '/spirit',
    name: 'zero_spirit',
    component: Main,
    meta: {
      title: '精神疾病',
      icon: 'ios-book'
    },
    children: [
      {
        path: 'in_hospital_record',
        name: 'in_hospital_record',
        meta: {
          icon: '_qq',
          title: 'in_hospital_record'
        },
        component: () => import('@/view/zero/spirit/inHospitalRecord.vue')
      },
      {
        path: 'search_home_record',
        name: 'search_home_record',
        meta: {
          icon: '_qq',
          title: 'search_home_record'
        },
        component: () => import('@/view/zero/spirit/searchHomeRecord.vue')
      },
      {
        path: 'download_table',
        name: 'download_table',
        meta: {
          icon: 'md-download',
          title: 'download_table'
        },
        component: () => import('@/view/zero/spirit/downloadTable.vue')
      },
      {
        path: 'setting_table',
        name: 'setting_table',
        meta: {
          icon: '_qq',
          title: 'setting_table'
        },
        component: () => import('@/view/zero/spirit/settingTable.vue')
      }
    ]
  }
]

export default [...setting, ...search, ...approval, ...templete, ...spirit]
