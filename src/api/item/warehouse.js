import request from '@/utils/request'

//分页数据
export function warehousePageList(data) {
  return request({
    url: '/api/item/warehouse_info/page_list',
    method: 'post',
    data
  })
}

export function getWarehouseSelected(data) {
  return request({
    url: '/api/item/warehouse_info/selected',
    method: 'post',
    data
  })
}

// 修改
export function updateWarehouse(data) {
  return request({
    url: '/api/item/warehouse_info/update',
    method: 'post',
    data
  })
}

// 新增
export function addWarehouse(data) {
  return request({
    url: '/api/item/warehouse_info/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteWarehouse(data) {
  return request({
    url: '/api/item/warehouse_info/delete',
    method: 'post',
    data
  })
}

//详情
export function detailWarehouse(data) {
  return request({
    url: '/api/item/warehouse_info/detail',
    method: 'post',
    data
  })
}
