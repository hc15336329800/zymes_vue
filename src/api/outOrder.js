import request from '@/utils/request'

// 出库单列表
export function page_list(data) {
  return request({
    url: '/api/store/out_store_order/page_list',
    method: 'post',
    data
  })
}

//审核
export function review_order(data) {
  return request({
    url: '/api/store/out_store_order/review',
    method: 'post',
    data
  })
}

//驳回
export function reject_order(data) {
  return request({
    url: '/api/store/out_store_order/reject',
    method: 'post',
    data
  })
}

//领料确认
export function confirm(data) {
  return request({
    url: '/api/store/out_store_order/confirm',
    method: 'post',
    data
  })
}


//中间件分页
export function store_mid_list(data) {
  return request({
    url: '/api/store/store_mid/page_list',
    method: 'post',
    data
  })
}


//物料出库明细
export function dtl_page_list(data) {
  return request({
    url: '/api/store/out_store_dtl/page_list',
    method: 'post',
    data
  })
}


//查询物料信息
export function dtl_item_info(data) {
  return request({
    url: '/api/store/out_store_dtl/get_item_info',
    method: 'post',
    data
  })
}


//删除中间件
export function dtl_delete(data) {
  return request({
    url: '/api/store/out_store_dtl/delete',
    method: 'post',
    data
  })
}


//删除中间件
export function dtl_add(data) {
  return request({
    url: '/api/store/out_store_dtl/add',
    method: 'post',
    data
  })
}


//删除中间件
export function dtl_update(data) {
  return request({
    url: '/api/store/out_store_dtl/update',
    method: 'post',
    data
  })
}

//物料替换
export function item_replace(data) {
  return request({
    url: '/api/store/out_store_dtl/item_replace',
    method: 'post',
    data
  })
}
