import request from '@/utils/request'

//分页数据
export function outStorePageList(data) {
  return request({
    url: '/api/depository/out_store_order/page_list',
    method: 'post',
    data
  })
}

export function updateCheckStatus(data) {
  return request({
    url: '/api/depository/out_store_order/update_check_status',
    method: 'post',
    data
  })
}

export function detailOutStore(data) {
  return request({
    url: '/api/depository/out_store_order/detail',
    method: 'post',
    data
  })
}

export function updateOutStore(data) {
  return request({
    url: '/api/depository/out_store_order/update',
    method: 'post',
    data
  })
}




