import request from '@/utils/request'
//新增
export function add_bom_store_list(data) {
    return request({
      url: '/api/sales/bom_store/add',
      method: 'post',
      data
    })
  }
  //删除
export function del_bom_store_list(data) {
  return request({
    url: '/api/sales/bom_store/delete',
    method: 'post',
    data
  })
}
//修改
export function edit_bom_store_list(data) {
  return request({
    url: '/api/sales/bom_store/update',
    method: 'post',
    data
  })
}
//查询
export function bom_store_list(data) {
  return request({
    url: '/api/sales/bom_store/page_list',
    method: 'post',
    data
  })
}
//批量确认
export function confirm_bom_store_list(data) {
  return request({
    url: '/api/sales/bom_store/confirm',
    method: 'post',
    data
  })
}
