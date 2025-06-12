import request from '@/utils/request'

// // 查询外协分页列表
// export function outer_order_list(data) {
//   return request({
//     url: '/api/work/outer_order/page_list',
//     method: 'post',
//     data
//   })
// }
// // 查询外协分页列表
export function outer_order_list(data) {
  return request({
    url: '/api/work/outer_task/page_list',
    method: 'post',
    data
  })
}

// 外协订单详情页
export function outer_order_detail(data) {
  return request({
    url: '/api/work/outer_order/detail',
    method: 'post',
    data
  })
}

// 新增工序外协记录
export function outer_order_add(data) {
  return request({
    url: '/api/work/outer_order/add',
    method: 'post',
    data
  })
}

// 接收外协订单接口
export function outer_order_accept(data) {
  return request({
    url: '/api/work/outer_order/accept',
    method: 'post',
    data
  })
}


// 启用外协订单接口
export function outer_order_resume(data) {
  return request({
    url: '/api/work/outer_task/resume',
    method: 'post',
    data
  })
}

// 暂停外协订单接口
export function outer_order_pause(data) {
  return request({
    url: '/api/work/outer_task/pause',
    method: 'post',
    data
  })
}

// 取消外协订单接口
export function outer_order_cancel(data) {
  return request({
    url: '/api/work/outer_task/cancel',
    method: 'post',
    data
  })
}

// 外协工序报工

// export function outer_order_report(data) {
//   return request({
//     url: '/api/work/outer_order/report',
//     method: 'post',
//     data
//   })
// }
export function outer_order_report(data) {
  return request({
    url: '/api/work/outer_task/report',
    method: 'post',
    data
  })
}

// 外协报工验收列表分页查询
export function outer_log_list(data) {
  return request({
    url: '/api/work/outer_log/acceptancePageList',
    method: 'post',
    data
  })
}

// 批量验收通过/批量验收拒绝
export function outer_log_batchUpdateStatus(data) {
  return request({
    url: '/api/work/outer_log/batchUpdateOById',
    method: 'post',
    data
  })
}

// 查询外协报工日志分页列表
export function outer_log_page_list(data) {
  return request({
    url: '/api/work/outer_log/page_list',
    method: 'post',
    data
  })
}

// 查询外协报工日志头部信息
export function outer_log_page_list_data(data) {
  return request({
    url: '/api/work/outer_log/page_list_data',
    method: 'post',
    data
  })
}

// 新查询外协报工日志头部信息
export function newouter_log_page_list_data(data) {
  return request({
    url: '/api/work/outer_task/task_info',
    method: 'post',
    data
  })
}

// 查询报工日志详情分页
export function newouter_log_page_list(data) {
  return request({
    url: '/api/work/outer_task_report/report_list',
    method: 'post',
    data
  })
}

// 外协报工验收详情
export function outer_log_log_detail(data) {
  return request({
    url: '/api/work/outer_log/log_detail',
    method: 'post',
    data
  })
}

// 获取所有外协厂家名称
export function get_all_outer(data) {
  return request({
    url: '/api/user/mes_worker/get_all_outer',
    method: 'post',
    data
  })
}

// 接收外协
export function accept_outer(data) {
  return request({
    url: '/api/work/outer_task/accept',
    method: 'post',
    data
  })
}

//批量外协发布
export function pub_batch_outer(data) {
  return request({
    url: '/api/order/proc_allocation/pub_batch_outer',
    method: 'post',
    data
  })
}




