import request from '@/utils/request'
// 我发起的外协报工
export function my_page_list(data) {
  return request({
    url: '/api/work/outer_task_report/my_page_list',
    method: 'post',
    data
  })
}
// 我发起的物料替换
  export function page_list_started(data) {
    return request({
      url: '/api/order/item_replace/page_list_started',
      method: 'post',
      data
    })
  }
// 我负责的外协报工
export function page_list(data) {
  return request({
    url: '/api/work/outer_task_report/page_list',
    method: 'post',
    data
  })
}

// 我负责的物料替换
export function page_list_audit(data) {
  return request({
    url: '/api/order/item_replace/page_list_audit',
    method: 'post',
    data
  })
}
//下生产单列表
export function sales_page_list(data) {
  return request({
    url: '/api/sales/place/page_list',
    method: 'post',
    data
  })
}
// 下生产审批拒绝
export function sales_page_refuse(data) {
  return request({
    url: '/api/sales/place/refuse',
    method: 'post',
    data
  })
}
// 下生产审批通过
export function sales_page_approval(data) {
  return request({
    url: '/api/sales/place/approval',
    method: 'post',
    data
  })
}
//下生产单
export function sales_page_order(data) {
  return request({
    url: '/api/sales/place/place_order',
    method: 'post',
    data
  })
}
//外协报工审批
export function outer_task_report_review(data) {
  return request({
    url: '/api/work/outer_task_report/review',
    method: 'post',
    data
  })
}
//外协报工审核
export function outer_task_report_check(data) {
  return request({
    url: '/api/work/outer_task_report/check',
    method: 'post',
    data
  })
}

//物料替换审批通过
export function item_replace_audit_pass(data) {
  return request({
    url: '/api/order/item_replace/audit_pass',
    method: 'post',
    data
  })
}
//物料替换审批拒绝
export function item_replace_audit_reject(data) {
  return request({
    url: '/api/order/item_replace/audit_reject',
    method: 'post',
    data
  })
}
