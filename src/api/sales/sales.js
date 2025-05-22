import request from '@/utils/request'

//分页数据
export function salesPageList(data) {
  return request({
    url: '/api/sales/sale_order/page_list',
    method: 'post',
    data
  })
}

// 不分页，查询销售单 + 审批下发列表（展开组合）
export function getAllByOrderNo(data) {
  return request({
    url: '/api/salesOrder/getAllByOrderNo',
    method: 'post',
    data
  })
}


// 修改
export function updateSales(data) {
  return request({
    url: '/api/sales/sale_order/update',
    method: 'post',
    data
  })
}

// 新增
export function addSales(data) {
  return request({
    url: '/api/sales/sale_order/batch_add',
    method: 'post',
    data
  })
}

// 删除
export function deleteSales(data) {
  return request({
    url: '/api/sales/sale_order/delete',
    method: 'post',
    data
  })
}

export function detailSales(data) {
  return request({
    url: '/api/sales/sale_order/detail',
    method: 'post',
    data
  })
}

export function listDetails(data) {
  return request({
    url: '/api/sales/sale_order_place/list_details',
    method: 'post',
    data
  })
}

export function approvalPass(data) {
  return request({
    url: '/api/sales/sale_order_place/approval',
    method: 'post',
    data
  })
}

export function approvalRefuse(data) {
  return request({
    url: '/api/sales/sale_order_place/refuse',
    method: 'post',
    data
  })
}

export function placePageList(data) {
  return request({
    url: '/api/sales/sale_order_place/page_list',
    method: 'post',
    data
  })
}
