import request from '@/utils/request'

// BON列表
export function get_bom_list(data) {
  return request({
    url: '/api/item/mes_item_stock/bom_list',
    method: 'post',
    data
  })
}

// 提交销售单
export function submit_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/commit',
    method: 'post',
    data
  })
}

// 订单增加
export function orderAdd(data) {
  return request({
    url: '/api/order/add',
    method: 'post',
    data
  })
}

// export function remote_list(data) {
//   return request({
//     url: '/api/item/mes_procedure/list_by_short_code',
//     method: 'post',
//     data
//   })
// }
export function list_procedure_by_item(data) {
  return request({
    url: '/api/item/mes_procedure/list_procedure_by_item',
    method: 'post',
    data
  })
}

export function get_bom_list_keyword(data) {
  return request({
    url: '/api/item/mes_item_stock/list_bom_by_no',
    method: 'post',
    data
  })
}

// 订单修改
export function orderUpdate(data) {
  return request({
    url: '/api/order/update',
    method: 'post',
    data
  })
}

// 订单列表
export function orderList(data, signal) {
  return request({
    url: '/api/production/production_order/page_list',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

//待分配订单列表
export function orderForAllocList(data, signal) {
  return request({
    url: '/api/order/order_alloc_list',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

export function updateStatus(data, signal) {
  return request({
    url: '/api/order/update_status',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

export function orderListSales(data, signal) {
  return request({
    url: '/api/sales/delivery/page_list',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

// 订单详情
export function getDetail(data) {
  return request({
    url: '/api/order/page_list',
    method: 'post',
    data
  })
}

// 订单工序分配
export function update_order_work(data) {
  return request({
    url: '/api/order/update_order_work',
    method: 'post',
    data
  })
}

// 订单工序分配明细
export function work_detail(data) {
  return request({
    url: '/api/order/work_detail',
    method: 'post',
    data
  })
}

// 订单导入
export function import_order(data) {
  return request({
    url: '/api/order/import_order',
    method: 'post',
    data
  })
}

// 关闭订单
export function update_status(data) {
  return request({
    url: '/api/production/production_order/update_status',
    method: 'post',
    data
  })
}

// 获取外协明细
export function get_outer_detail(data) {
  return request({
    url: '/api/order/get_outer_detail',
    method: 'post',
    data
  })
}

//获取所有外协厂家
export function get_all_outer(data) {
  return request({
    url: '/api/user/mes_worker/get_all_outer',
    method: 'post',
    data
  })
}

//获取外协工序明细
// "params": {
//     "bomNo": "string",
//     "id": "string",
//     "type": "string"
//   }
export function get_outer_procedure(data) {
  return request({
    url: '/api/order/get_outer_procedure',
    method: 'post',
    data
  })
}

// 暂停
export function pause_order(data) {
  return request({
    url: '/api/order/pause_order',
    method: 'post',
    data
  })
}

// 订单排程/恢复
export function scheduled_order(data) {
  return request({
    url: '/api/order/scheduled_order',
    method: 'post',
    data
  })
}

// 订单排程/恢复 返回排程id
export function start_scheduled(data) {
  return request({
    url: '/api/production/production_order/start_scheduled',
    method: 'post',
    data
  })
}

// 根据排程id 查询返回结果
export function status_scheduled(data, signal) {
  return request({
    url: '/api/order/status_scheduled',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

// 排程异常获取异常资源
export function defect_resources(data) {
  return request({
    url: '/api/order/defect_resources',
    method: 'post',
    data
  })
}

// 排程异常 获取物料
export function get_item_list(data) {
  return request({
    url: '/api/order/get_item_list',
    method: 'post',
    data
  })
}

// 排程异常获取设备
export function get_device_list(data) {
  return request({
    url: '/api/order/get_device_list',
    method: 'post',
    data
  })
}

// 异常排程确认
export function update_resources(data) {
  return request({
    url: '/api/order/update_resources',
    method: 'post',
    data
  })
}

// 外协分配
export function update_order_outer(data) {
  return request({
    url: '/api/order/update_order_outer',
    method: 'post',
    data
  })
}

// 发货
export function order_shipped(data) {
  return request({
    url: '/api/order/order_shipped',
    method: 'post',
    data
  })
}

// 工序分配列表
export function proc_allocation_list(data) {
  return request({
    url: '/api/order/proc_allocation/page_list',
    method: 'post',
    data
  })
}

//订单外协
export function proc_allocation_list_v2(data) {
  return request({
    url: '/api/production/production_proc/page_list',
    method: 'post',
    data
  })
}

// 工序恢复
export function proc_allocation_resume(data) {
  return request({
    url: '/api/order/proc_allocation/resume',
    method: 'post',
    data
  })
}

// 工序暂停
export function proc_allocation_pause(data) {
  return request({
    url: '/api/order/proc_allocation/pause',
    method: 'post',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/api/order/proc_allocation/delete_by_work_id',
    method: 'post',
    data
  })
}

//获取个人分配详情
export function get_person_dist(data) {
  return request({
    url: '/api/order/proc_allocation/get_person_dist',
    method: 'post',
    data
  })
}

//替换设备
export function replace_device(data) {
  return request({
    url: '/api/order/proc_allocation/replace_device',
    method: 'post',
    data
  })
}

//获取分组分配详情
export function get_group_dist(data) {
  return request({
    url: '/api/order/proc_allocation/get_group_dist',
    method: 'post',
    data
  })
}

//按人工序分配
export function distribution_person(data) {
  return request({
    url: '/api/order/proc_allocation/distribution_person',
    method: 'post',
    data
  })
}

// 按组工序分配
export function distribution_group(data) {
  return request({
    url: '/api/order/proc_allocation/distribution_group',
    method: 'post',
    data
  })
}

//更新发货数量
export function update_count(data) {
  return request({
    url: '/api/sales/delivery_order/update_count',
    method: 'post',
    data
  })
}

//外协分配列表
export function distribution_outer(data) {
  return request({
    url: '/api/production/proc_allocation/distribution_outer',
    method: 'post',
    data
  })
}

export function distribution_outer2(data) {
  return request({
    url: '/api/order/proc_allocation/distribution_outer',
    method: 'post',
    data
  })
}

//新发货单列表
export function new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/page_list',
    method: 'post',
    data
  })
}

//新发货单删除
export function delete_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/delete',
    method: 'post',
    data
  })
}

//新发货单新增
export function add_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/batch_add',
    method: 'post',
    data
  })
}

//新发货单详情
export function detail_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/detail',
    method: 'post',
    data
  })
}

//新发货单编辑
export function edit_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/update',
    method: 'post',
    data
  })
}

//发货单列表
export function delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/page_list',
    method: 'post',
    data
  })
}

// 新增发货单
export function add_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/batch_add',
    method: 'post',
    data
  })
}

// 删除发货单
export function delete_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/delete',
    method: 'post',
    data
  })
}

// 修改发货单
export function edit_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/update',
    method: 'post',
    data
  })
}

// 审核发货单
export function audit_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/audit',
    method: 'post',
    data
  })
}

//新审核发货单
export function new_audit_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/confirm',
    method: 'post',
    data
  })
}

// 批量工序分配页面列表

export function proc_procedure_list(data) {
  return request({
    url: '/api/order/proc_allocation/dist_list',
    method: 'post',
    data
  })
}

// 批量工序获取分配模式
// 获取班次
// 批量工序获取详情
//批量工序提交分配

export function submit_alloc_proc(data) {
  return request({
    url: '/api/order/proc_allocation/alloc_proc_v1',
    method: 'post',
    data
  })
}

//清空
export function proc_detail(data) {
  return request({
    url: '/api/order/proc_allocation/proc_detail',
    method: 'post',
    data
  })
}

//外协管理-外协分配列表
export function proc_allocation_list_v3(data) {
  return request({
    url: '/api/order/proc_allocation/out_page_list',
    method: 'post',
    data
  })
}

//外协管理-外协发布
export function pub_outer(data) {
  return request({
    url: '/api/order/proc_allocation/pub_outer',
    method: 'post',
    data
  })
}

//外协管理-外协发布
export function outer_list(data) {
  return request({
    url: '/api/order/proc_allocation/outer_list',
    method: 'post',
    data
  })
}

export function outer_to_alloc_list(data) {
  return request({
    url: '/api/order/proc_allocation/outer_to_alloc_list',
    method: 'post',
    data
  })
}
