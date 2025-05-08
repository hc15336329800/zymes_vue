import request from '@/utils/request'

//分页数据
export function orderPageList(data) {
  return request({
    url: '/api/order/order_dtl/page_list',
    method: 'post',
    data
  })
}

export function updateOrderStatus(data) {
  return request({
    url: '/api/order/order_dtl/update_status',
    method: 'post',
    data
  })
}
export function updateAllocation(data) {
  return request({
    url: '/api/order/order_dtl/update_all_status',
    method: 'post',
    data
  })
}

export function getWarnning(data) {
  return request({
    url: '/api/order/order_dtl/getWarnning',
    method: 'post',
    data
  })
}



