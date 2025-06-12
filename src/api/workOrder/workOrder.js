import request from '@/utils/request'
// 新增部门
export function workOrderLogPage(data) {
    return request({
      url: '/api/work/work_order_record/page_list',
      method: 'post',
      data
    })
}
export function workOrderList(data) {
  return request({
    url: '/api/work/work_order/page_list',
    method: 'post',
    data
  })
}
export function addAssign(data) {
  return request({
    url: '/api/work/work_order/add_assign',
    method: 'post',
    data
  })
}

export function allAddAssign(data) {
  return request({
    url: '/api/work/work_order/add_All_assign',
    method: 'post',
    data
  })
}
export function addReport(data) {
  return request({
    url: '/api/work/work_order/add_report',
    method: 'post',
    data
  })
}

export function addAllReport(data) {
  return request({
    url: '/api/work/work_order/add_All_report',
    method: 'post',
    data
  })
}
export function saveItemand(data) {
  return request({
    url: '/api/work/work_order/saveItemand',
    method: 'post',
    data
  })
}
export function getRealnumber(data) {
  return request({
    url: '/api/work/work_order/getRealnumber',
    method: 'post',
    data
  })
}
