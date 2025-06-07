import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: false               if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
import structureRouter from './modules/structure'

export const constantRoutes = [
  ...structureRouter,
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/test',
    component: () => import('@/views/test/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard'
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   // redirect: '/salesManagesment',
  // },


  //首页
  {
    path: '/dashboard',
    component: Layout,
    name: 'dashboard',
    meta: {
      title: '',
      icon: 'el-icon-s-opportunity',
      number: 1,
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: false }
      }
    ]
  },
  // 我的审批
  {
    path: '/responsibleApproval',
    component: Layout,
    name: 'responsibleApproval',
    meta: {
      title: '我的审批',
      number: 7,
      icon: 'el-icon-folder-checked'
    },
    children: [
      {
        path: 'product',
        component: () =>
          import('@/views/approvalManagement/responsibleApproval/product'),
        name: 'responsibleApprovalProduct',
        meta: {
          title: '生产下单审批'
        }
      },
      {
        path: 'workReport',
        component: () =>
          import('@/views/approvalManagement/responsibleApproval/workReport'),
        name: 'responsibleApprovalWorkReport',
        meta: {
          title: '报工审批'
        }
      },
      {
        path: 'workReportYs',
        component: () =>
          import('@/views/approvalManagement/responsibleApproval/workReportYs'),
        name: 'responsibleApprovalWorkReport',
        meta: {
          title: '报工验收'
        }
      },
      {
        path: 'outsourcing',
        component: () =>
          import('@/views/approvalManagement/responsibleApproval/outsourcing'),
        name: 'responsibleApprovalOutsourcing',
        meta: {
          title: '外协报工审批'
        }
      }
    ]
  },
  // 基础资料
  {
    path: '/inventoryManagement',
    component: Layout,
    meta: {
      title: '基础资料',
      number: 2,
      icon: 'el-icon-wallet',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () =>
          import('@/views/inventoryManagement/rawMaterialManagement'),
        name: 'rawMaterialManagement',
        meta: {
          title: '物料库存'
        }
      },
      {
        path: 'middlewareManagement',
        component: () =>
          import('@/views/inventoryManagement/middlewareManagement'),
        name: 'middlewareManagement',
        meta: {
          title: '工序管理'
        }
      },

      {
        path: 'BOMManagement',
        component: () => import('@/views/inventoryManagement/BOMManagement'),
        name: 'BOMManagement',
        meta: {
          title: 'BOM明细'
        }
      },

      {
        path: 'BOMDetail',
        hidden: true,
        component: () => import('@/views/inventoryManagement/BOMDetail'),
        name: 'BOMDetail',
        meta: {
          title: '工序详情'
        }
      },
      {
        path: 'itemUsedDetail',
        hidden: true,
        component: () => import('@/views/inventoryManagement/itemUsedDetail'),
        name: 'itemUsedDetail',
        meta: {
          title: '用料详情'
        }
      }
    ]
  },
   // 半成品库 -->title
  // {
  //   path: '/cesi',
  //   component: Layout,
  //   meta: {
  //     title: '半成品库',
  //     number: 3,
  //     icon: 'el-icon-shopping-cart-1',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'trayManage',
  //       component: () => import('@/views/trayManagement/trayManage'),
  //       name: 'trayManage',
  //       meta: {
  //         title: '测试菜单子集'
  //       }
  //     },
  //     {
  //       path: 'trayManage1',
  //       component: () => import('@/views/trayManagement/trayManage'),
  //       name: 'trayManage',
  //       meta: {
  //         title: '测试菜单子集1'
  //       }
  //     }
  //   ]
  // },

  // 半成品库
  {
    path: '/outStoreOrder',
    component: Layout,
    meta: {
      title: '半成品库',
      number: 8,
      icon: 'el-icon-shopping-cart-1',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/outStore/list'),
        name: 'outList',
        meta: {
          isBack: true,
          keepAlive: true,
          title: '领料单管理'
        }
      },

      {
        path: 'inOutManagement',
        component: () => import('@/views/outStore/inOutManagement'),
        name: 'inOutManagement',
        meta: {
          title: '出入库管理'
        }
      },
      {
        path: '/statistics',
        component: () => import('@/views/outStore/statistics'),
        name: 'statistics',
        meta: {
          title: '月度入库统计'
        }
      },
      {
        path: 'outStoreDetail',
        hidden: true,
        component: () => import('@/views/outStore/outStoreDetail'),
        name: 'outStoreDetail',
        meta: {
          title: '领料详情'
        }
      },
      {
        path: 'storeMid',
        hidden: true,
        component: () => import('@/views/outStore/storeMid'),
        name: 'storeMid',
        meta: {
          title: '中间件详情'
        }
      },

      {
        path: 'defective',
        component: () => import('@/views/inventoryManagement/defective'),
        name: 'defective',
        meta: {
          title: '不良品管理'
        }
      },
      {
        path: 'warehouseSetting',
        component: () => import('@/views/inventoryManagement/warehouseSetting'),
        name: 'warehouseSetting',
        meta: {
          title: '库位设置'
        }
      },




    ]
  },


  //工资管理
  {
    path: '/wages',
    component: Layout,
    meta: {
      title: '工资管理',
      number: 9,
      icon: 'el-icon-money',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/wages/wagesDetail'),
        name: 'wagesDetail',
        meta: {
          title: '工资明细'
        }
      },
      {
        path: 'list',
        component: () => import('@/views/wages/list'),
        name: 'wagesList',
        meta: {
          title: '日工资'
        }
      }
    ]
  },
  // 销售管理
  {
    path: '/salesManagesment',
    component: Layout,
    meta: {
      title: '销售管理',
      number: 3,
      icon: 'el-icon-s-data',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/sales/list'),
        name: 'salesManagesment',
        meta: {
          title: '销售管理'
        }
      },
      {
        path: 'salesPlaceRecord',
        component: () => import('@/views/sales/salesPlaceRecord'),
        name: 'salesPlaceRecord',
        meta: {
          title: '下单记录'
        }
      },
      {
        path: 'shipmentRequest',
        component: () => import('@/views/sales/shipmentRequest'),
        name: 'shipmentRequest',
        meta: {
          title: '发货申请'
        }
      },
      {
        path: 'shipmentStatistics',
        component: () => import('@/views/sales/shipmentStatistics'),
        name: 'shipmentStatistics',
        meta: {
          title: '发货统计'
        }
      },

      {
        path: '/addSaleList',
        hidden: true,
        component: () => import('@/views/sales/addSaleList'),
        name: 'addSaleList',
        meta: {
          title: '新增销售订单'
        }
      },
      {
        path: '/addShipment',
        hidden: true,
        component: () => import('@/views/sales/addShipment'),
        name: 'addShipment',
        meta: {
          title: '新增发货申请'
        }
      },
      {
        path: '/editShipment',
        hidden: true,
        component: () => import('@/views/sales/addShipment'),
        name: 'editShipment',
        meta: {
          title: '修改发货申请'
        }
      },
      {
        path: '/detailShipment',
        hidden: true,
        component: () => import('@/views/sales/addShipment'),
        name: 'detailShipment',
        meta: {
          title: '发货申请详情'
        }
      },
      {
        path: '/placeProductionOrder',
        hidden: true,
        component: () => import('@/views/sales/placeProductionOrder'),
        name: 'placeProductionOrder',
        meta: {
          title: '下生产单'
        }
      },
      {
        path: '/salesApprovalDetails',
        hidden: true,
        component: () => import('@/views/sales/salesApprovalDetails'),
        name: 'salesApprovalDetails',
        meta: {
          title: '审批详情'
        }
      }
    ]
  },
  // 车间管理
  {
    path: '/workshopManagement',
    component: Layout,
    meta: {
      title: '车间管理',
      number: 3,
      icon: 'el-icon-s-data',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [

      {
        path: '',
        component: () => import('@/views/workshopManagement/workOrder.vue'),
        name: 'wordList',
        meta: {
          title: '工单下达'
        }
      },
      {
        path: 'workOrderBg',
        component: () => import('@/views/workshopManagement/workOrderBg.vue'),
        name: 'workOrderBg',
        meta: {
          title: '工单报工'
        }
      },
      {
        path: 'generalListOfParts',
        component: () => import('@/views/tabularAnalysis/generalListOfParts.vue'),
        name: 'generalListOfParts',
        meta: {
          title: '下料文件上报'
        }
      },
      {
        path: 'workAssignDetail',
        component: () => import('@/views/workshopManagement/workAssignDetail'),
        name: 'workAssignDetail',
        meta: {
          title: '下达记录'
        }
      },
      {
        path: 'workReportDetail',
        component: () => import('@/views/workshopManagement/workReportDetail'),
        name: 'workReportDetail',
        meta: {
          title: '报工记录'
        }
      },
      // {
      //   path: 'deviceLocation',
      //   component: () => import('@/views/workshopManagement/deviceLocation'),
      //   name: 'deviceLocation',
      //   meta: {
      //     title: '库位货物管理'
      //   }
      // },

      {
        path: 'groupManagement',
        component: () => import('@/views/workshopManagement/groupManagement'),
        name: 'groupManagement',
        meta: {
          title: '分组管理'
        }
      },
      {
        path: '/groupDetailManagement',
        hidden: true,
        component: () =>
          import('@/views/workshopManagement/groupDetailManagement'),
        name: 'groupDetailManagement',
        meta: {
          title: '分组详情'
        }
      },
      {
        path: 'shiftManagement',
        component: () => import('@/views/workshopManagement/shiftManagement'),
        name: 'shiftManagement',
        meta: {
          title: '班次设置'
        }
      }
    ]
  },

  // 生产管理
  {
    path: '/orderManagement',
    component: Layout,
    meta: {
      title: '生产管理',
      number: 5,
      icon: 'el-icon-s-order',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/orderManagement/list'),
        name: 'orderList',
        meta: {
          title: '生产任务'
        }
      },

      {
        path: 'workWaste',
        component: () => import('@/views/workWaste/list'),
        name: 'workWasteList',
        meta: {
          title: '补录单管理'
        }
      },
      {
        path: 'shipmentRequest',
        component: () => import('@/views/orderManagement/shipmentRequest'),
        name: 'orderShipmentRequest',
        meta: {
          title: '发货申请管理'
        }
      },
      {
        path: 'inOutManagement',
        component: () => import('@/views/orderManagement/inOutManagement'),
        name: 'orderInOutManagement',
        meta: {
          title: '出入库管理'
        }
      },
      {
        path: 'prodList',
        component: () => import('@/views/orderManagement/prodList'),
        name: 'prodList',
        meta: {
          title: '任务分配'
        }
      },

      {
        path: 'bomList',
        component: () => import('@/views/orderManagement/bomList'),
        name: 'bomList',
        meta: {
          title: 'BOM组织'
        }
      },

      {
        path: 'deliverGoodsDetail',
        hidden: true,
        component: () => import('@/views/orderManagement/deliverGoodsDetail'),
        name: 'deliverGoodsDetail',
        meta: {
          title: '确认'
        }
      },
      {
        path: 'confirm',
        hidden: true,
        component: () => import('@/views/workWaste/confirm'),
        name: 'workWasteConfirm',
        meta: {
          title: '补录单确认'
        }
      },
      {
        path: 'workWasteBom',
        hidden: true,
        component: () => import('@/views/workWaste/detail'),
        name: 'workWasteConfirm',
        meta: {
          title: '补录单确认'
        }
      },
      {
        path: 'edit',
        hidden: true,
        component: () => import('@/views/orderManagement/edit'),
        name: 'orderEdit',
        meta: {
          title: '订单编辑'
        }
      },
      {
        path: 'orderBom',
        hidden: true,
        component: () => import('@/views/orderManagement/orderBom'),
        name: 'orderBom',
        meta: {
          title: '用料详情'
        }
      },
      {
        path: 'processAllocation',
        hidden: true,
        component: () => import('@/views/orderManagement/processAllocation'),
        name: 'processAllocation',
        meta: {
          title: '工序分配'
        }
      },
      {
        path: 'newProcessAllocation',
        hidden: true,
        component: () =>
          import('@/views/orderManagement/processAllocation/list'),
        name: 'newprocessAllocation',
        meta: {
          title: '工序分配'
        }
      },
      {
        path: 'procedureList',
        hidden: true,
        component: () =>
          import('@/views/orderManagement/processAllocation/procedureList'),
        name: 'procedureList',
        meta: {
          title: '工序分配列表'
        }
      },
      {
        path: 'outerAlloc',
        hidden: true,
        component: () =>
          import('@/views/orderManagement/processAllocation/outerAlloc'),
        name: 'outerAlloc',
        meta: {
          title: '外协分配列表'
        }
      },
      {
        path: 'detail',
        hidden: true,
        component: () => import('@/views/orderManagement/detail'),
        name: 'detail',
        meta: {
          title: '用料详情'
        }
      },
      {
        path: 'assignDetail',
        component: () => import('@/views/orderManagement/assignDetail'),
        name: 'assignDetail',
        meta: {
          title: '分配详情'
        }
      },
      {
        path: 'secondAssignDetail',
        hidden: true,
        component: () => import('@/views/orderManagement/secondAssignDetail'),
        name: 'secondAssignDetail',
        meta: {
          title: '子分配详情'
        }
      },
      {
        path: 'newOrderOuter',
        hidden: true,
        component: () => import('@/views/orderManagement/orderOuter/list'),
        name: 'newOrderOuter',
        meta: {
          title: '订单外协'
        }
      },
      {
        path: 'orderOuter',
        hidden: true,
        component: () => import('@/views/orderManagement/orderOuter'),
        name: 'orderOuter',
        meta: {
          title: '订单外协'
        }
      },
      {
        path: 'materialReplacement',
        hidden: true,
        component: () => import('@/views/orderManagement/materialReplacement'),
        name: 'materialReplacement',
        meta: {
          title: '物料替换'
        }
      },
      {
        path: 'orderAbnormal',
        hidden: true,
        component: () => import('@/views/orderManagement/orderAbnormal'),
        name: 'orderAbnormal',
        meta: {
          title: '异常排程'
        }
      }
    ]
  },
  // 外协管理
  {
    path: '/outsourcingManagement',
    component: Layout,
    meta: {
      title: '外协管理',
      number: 6,
      icon: 'el-icon-help',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/outsourcingManagement/order'),
        name: 'outsourcingOrder',
        meta: {
          title: '外协分配'
        }
      },
      {
        path: 'report',
        component: () => import('@/views/outsourcingManagement/report'),
        name: 'outsourcingManagementReport',
        meta: {
          title: '外协任务'
        }
      },
      {
        path: 'outerReportDetail',
        component: () =>
          import('@/views/outsourcingManagement/outerReportDetail'),
        name: 'outerReportDetail',
        meta: {
          title: '报工记录'
        }
      },
      {
        path: 'edit',
        hidden: true,
        component: () => import('@/views/outsourcingManagement/edit'),
        name: 'outsourcingEdit',
        meta: {
          title: '编辑'
        }
      },
      {
        path: 'outerAllocDetail',
        hidden: true,
        component: () => import('@/views/outsourcingManagement/outAllocDetail'),
        name: 'outerAllocDetail',
        meta: {
          title: '外协分配明细'
        }
      },
      {
        path: 'detail',
        hidden: true,
        component: () => import('@/views/outsourcingManagement/detail'),
        name: 'outsourcingDetail',
        meta: {
          title: '详情'
        }
      },
      {
        path: 'logs',
        hidden: true,
        component: () => import('@/views/outsourcingManagement/logs'),
        name: 'outsourcingOrderLogs',
        meta: {
          title: '报工日志'
        }
      },
      {
        path: 'acceptance',
        hidden: true,
        component: () => import('@/views/outsourcingManagement/acceptance'),
        name: 'outsourcingAcceptance',
        meta: {
          title: '外协验收'
        }
      }
    ]
  },

  // AGV叉车管理
  {
    path: '/agvCarManagement',
    component: Layout,
    meta: {
      title: 'AGV叉车管理',
      number: 12,
       icon: 'el-icon-shopping-cart-1',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/agvCarManagement/agvCarManage'),
        name: 'agvCarManage',
        meta: {
          title: '叉车管理'
        }
      },
      {
        path: 'deviceLocation',
        component: () => import('@/views/agvCarManagement/deviceLocation'),
        name: 'deviceLocation',
        meta: {
          title: '库位货物管理'
        }
      }
    ]
  },
  // 托盘管理
  {
    path: '/trayManagement',
    component: Layout,
    meta: {
      title: '托盘管理',
      number: 13,
      icon: 'el-icon-shopping-cart-1',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/trayManagement/trayManage'),
        name: 'trayManage',
        meta: {
          title: '托盘物料信息'
        }
      }
    ]
  },

  // 下料文件上报
  // {
  //   path: '/tabularAnalysis',
  //   component: Layout,
  //   meta: {
  //     title: '下料文件上报',
  //     number: 13,
  //     icon: 'el-icon-shopping-cart-1',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/tabularAnalysis/generalListOfParts.vue'),
  //         name: 'generalListOfParts',
  //       meta: {
  //         title: '零件总表信息'
  //       }
  //     }
  //   ]
  // },


  //采购管理
  {
    path: '/purchaseForecast',
    component: Layout,
    meta: {
      title: '采购管理',
      icon: 'el-icon-notebook-1',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/purchaseForecast/list'),
        name: 'purchaseForecastList',
        meta: {
          title: '采购预测'
        }
      },
      {
        path: 'detail',
        hidden: true,
        component: () => import('@/views/purchaseForecast/edit'),
        name: 'purchaseForecastDetail',
        meta: {
          title: '采购录入'
        }
      },
      {
        path: 'demandAnalysis',
        component: () => import('@/views/purchaseForecast/demandAnalysis'),
        name: 'demandAnalysis',
        hidden: true,
        meta: {
          title: '需求分析'
        }
      }
    ]
  },

  //设备管理
  {
    path: '/deviceManagement',
    component: Layout,
    meta: {
      title: '设备管理',
      number: 10,
      icon: 'el-icon-s-opportunity',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '',
        component: () => import('@/views/deviceManagement/deviceType'),
        name: 'deviceType',
        meta: {
          title: '设备类型设置'
        }
      },
      {
        path: 'machinery',
        component: () => import('@/views/deviceManagement/machinery'),
        name: 'machinery',
        meta: {
          title: '设备台账'
        }
      },
      {
        path: 'dvsubject',
        component: () => import('@/views/deviceManagement/dvsubject'),
        name: 'dvsubject',
        meta: {
          title: '点检保养项目'
        }
      },
      {
        path: 'checkplan',
        component: () => import('@/views/deviceManagement/checkplan'),
        name: 'checkplan',
        meta: {
          title: '点检保养计划'
        }
      },
      {
        path: 'repair',
        component: () => import('@/views/deviceManagement/repair'),
        name: 'repair',
        meta: {
          title: '维修单'
        }
      }
    ]
  },

]
console.log(constantRoutes)
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', number: 1 }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
