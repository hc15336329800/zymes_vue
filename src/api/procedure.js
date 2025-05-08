import request from '@/utils/request'

//用料下拉
export function get_item_list(data) {
  return request({
    url: '/api/item/mes_item_use/item_list',
    method: 'post',
    data
  })
}

//工作车间下拉
export function work_shop_list(data) {
  return request({
    url: '/api/item/mes_procedure/work_shop_list',
    method: 'post',
    data
  })
}

// 删除
export function delete_list(data) {
  return request({
    url: '/api/item/mes_procedure/delete',
    method: 'post',
    data
  })
}

//修改
export function edit_list(data) {
  return request({
    url: '/api/item/mes_procedure/update',
    method: 'post',
    data
  })
}

//新增
export function add_list(data) {
  return request({
    url: '/api/item/mes_procedure/add',
    method: 'post',
    data
  })
}

//新增用料
export function add_mes_item_use(data) {
  return request({
    url: '/api/item/mes_item_use/add',
    method: 'post',
    data
  })
}

//删除用料
export function delete_mes_item_use(data) {
  return request({
    url: '/api/item/mes_item_use/delete',
    method: 'post',
    data
  })
}

//用料详情
export function detail_mes_item_use(data) {
  return request({
    url: '/api/item/mes_item_use/detail',
    method: 'post',
    data
  })
}
