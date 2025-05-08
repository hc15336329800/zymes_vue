import request from '@/utils/request'

//分页数据
export function stockPageList(data) {
  return request({
    url: '/api/item/mes_item_stock/page_list',
    method: 'post',
    data
  })
}

export function bomPageList(data) {
  return request({
    url: '/api/item/mes_item_stock/bom_page_list',
    method: 'post',
    data
  })
}

export function itemSelected(data) {
  return request({
    url: '/api/item/mes_item_stock/item_no_selected',
    method: 'post',
    data
  })
}

export function bomSelected(data) {
  return request({
    url: '/api/item/mes_item_stock/list_bom_by_no',
    method: 'post',
    data
  })
}

export function uploadStock(data) {
  return request({
    url: '/api/item/mes_item_stock/upload',
    method: 'post',
    data
  })
}

// 修改
export function updateStock(data) {
  return request({
    url: '/api/item/mes_item_stock/update',
    method: 'post',
    data
  })
}

// 新增
export function addStock(data) {
  return request({
    url: '/api/item/mes_item_stock/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteStock(data) {
  return request({
    url: '/api/item/mes_item_stock/delete',
    method: 'post',
    data
  })
}

//详情
export function detailStock(data) {
  return request({
    url: '/api/item/mes_item_stock/detail',
    method: 'post',
    data
  })
}
