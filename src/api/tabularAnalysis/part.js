import request from '@/utils/request'

//分页数据
export function stockPageList(data) {
  return request({
    url: '/api/tabularAnalysis/parts-summary/page_list',
    method: 'post',
    data
  })
}
// 缓存数据
export function get_list(data) {
  return request({
    url: '/api/tabularAnalysis/parts-summary/get_list',
    method: 'post',
    data
  })
}
// 缓存数据
export function get_map(data) {
  return request({
    url: '/api/tabularAnalysis/parts-summary/get_map',
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
    url: '/api/tabularAnalysis/parts-summary/upload',
    method: 'post',
    data
  })
}

// 清除缓存数据
export function cleanList(data) {
  return request({
    url: '/api/tabularAnalysis/parts-summary/clean_list',
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


// 批量新增
export function addInBulk(data) {
  return request({
    url: '/api/tabularAnalysis/parts-summary/add_in_bulk',
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
