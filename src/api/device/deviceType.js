import request from '@/utils/request'
//分页数据
export function pageList(data) {
  return request({
    url: '/api/device/device_type_info/page_list',
    method: 'post',
    data
  })
}

export function getAllTypeList(data) {
  return request({
    url: '/api/device/device_type_info/list_all_type',
    method: 'post',
    data
  })
}

// 修改
export function updateDeviceType(data) {
  return request({
    url: '/api/device/device_type_info/update',
    method: 'post',
    data
  })
}
// 新增
export function addDeviceType(data) {
  return request({
    url: '/api/device/device_type_info/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteDeviceType(data) {
  return request({
    url: '/api/device/device_type_info/delete',
    method: 'post',
    data
  })
}
//详情
export function detailDeviceType(data) {
  return request({
    url: '/api/device/device_type_info/detail',
    method: 'post',
    data
  })
}
