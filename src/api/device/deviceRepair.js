import request from '@/utils/request'
//分页数据
export function repairPageList(data) {
  return request({
    url: '/api/device/repair_order/page_list',
    method: 'post',
    data
  })
}


// 修改
export function updateDeviceRepair(data) {
  return request({
    url: '/api/device/repair_order/update',
    method: 'post',
    data
  })
}
// 新增
export function addDeviceRepair(data) {
  return request({
    url: '/api/device/repair_order/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteDeviceRepair(data) {
  return request({
    url: '/api/device/repair_order/delete',
    method: 'post',
    data
  })
}
//详情
export function detailDeviceRepair(data) {
  return request({
    url: '/api/device/repair_order/detail',
    method: 'post',
    data
  })
}
