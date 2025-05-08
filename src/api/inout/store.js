import request from '@/utils/request'

//分页数据
export function storePageList(data) {
  return request({
    url: '/api/sales/bom_store/page_list',
    method: 'post',
    data
  })
}

export function addStore(data) {
  return request({
    url: '/api/sales/bom_store/add',
    method: 'post',
    data
  })
}

export function updateStore(data) {
  return request({
    url: '/api/sales/bom_store/update',
    method: 'post',
    data
  })
}

export function detailStore(data) {
  return request({
    url: '/api/sales/bom_store/detail',
    method: 'post',
    data
  })
}

export function deleteStore(data) {
  return request({
    url: '/api/sales/bom_store/delete',
    method: 'post',
    data
  })
}

export function confirmStore(data) {
  return request({
    url: '/api/sales/bom_store/confirm',
    method: 'post',
    data
  })
}
