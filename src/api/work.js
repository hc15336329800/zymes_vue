import request from '@/utils/request'

// 查询工单日志分页列表
export function work_log(data) {
  return request({
    url: '/api/work/work_log/page_list',
    method: 'post',
    data
  })
}

//查询详情列表
export function work_deails(data) {
  return request({
    url: '/api/work/work_report/page_list_for_detail',
    method: 'post',
    data
  })
}

// 订查询报工流转详情分页列表
export function work_flow(data) {
  return request({
    url: '/api/work/work_flow/page_list',
    method: 'post',
    data
  })
}

// 查询工单表分页列表
export function work_order(data) {
  return request({
    url: '/api/work/work_order/page_list',
    method: 'post',
    data
  })
}

//获取设备列表
export function getDeviceList(data) {
  return request({
    url: '/api/work/work_assign/list_device',
    method: 'post',
    data
  })
}

// 补录单确认页头部信息
export function confirm_title(data) {
  return request({
    url: '/api/work/work_waste/confirm_title',
    method: 'post',
    data
  })
}

// 次品补录确认
export function work_waste_confirm(data) {
  return request({
    url: '/api/work/work_waste/confirm',
    method: 'post',
    data
  })
}


// 补录单管理列表分页查询
export function work_waste_list(data) {
  return request({
    url: '/api/work/work_waste/page_list',
    method: 'post',
    data
  })
}

// app端次品补录已确认详情页
export function work_waste_confirm_detail(data) {
  return request({
    url: '/api/work/work_waste/confirm_detail',
    method: 'post',
    data
  })
}

// 报工验收列表分页查询
export function work_report_list(data) {
  return request({
    url: '/api/work/work_report/page_list',
    method: 'post',
    data
  })
}

//分配详情

export function alloc_log(data) {
  return request({
    url: '/api/order/alloc_log/page_list',
    method: 'post',
    data
  })
}

// 批量验收通过/批量验收拒绝
export function work_report_batchUpdateStatus(data) {
  return request({
    url: '/api/work/work_report/batchUpdateStatus',
    method: 'post',
    data
  })
}

//新增工单下达
// "params": {
//     "workOrderId": "string",
//     "assignCount": 0
//   }

export function work_assign_add(data) {
  return request({
    url: '/api/work/work_assign/add',
    method: 'post',
    data
  })
}

// 新增工单报工
// "params": {
//     "isWasteReport": "string",
//     "workOrderId": "string",
//     "reportCount": 0
//   }

export function work_report_add(data) {
  return request({
    url: '/api/work/work_report/add',
    method: 'post',
    data
  })
}

//新增次品补录记录
// "params": {
//    "workOrderId": "string",
//    "workOrderNo": "string",
//    "orderNo": "string",
//    "bomNo": "string",
//    "procedureCode": "string",
//    "procedureName": "string",
//    "itemNo": "string",
//    "itemName": "string",
//    "finishTime": "2022-08-16T10:38:51.327Z",
//    "wasteDesc": "string",
//    "itemCount": 0,
//    "createdBy": "string",
//    "createdTime": "2022-08-16T10:38:51.327Z"
//  }
export function work_waste_add(data) {
  return request({
    url: '/api/work/work_waste/add',
    method: 'post',
    data
  })
}

//生产管理-工单管理列表
export function page_list_for_pro(data) {
  return request({
    url: '/api/work/work_order/page_list_for_pro',
    method: 'post',
    data
  })
}
