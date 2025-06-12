import request from '@/utils/request'

//分页数据
export function devicePageList(data) {
  return request({
    url: '/api/device/device_info//page_list',
    method: 'post',
    data
  })
}

// 修改
export function updateDeviceInfo(data) {
  return request({
    url: '/api/device/device_info/update',
    method: 'post',
    data
  })
}

// 新增
export function addDeviceInfo(data) {
  return request({
    url: '/api/device/device_info/add',
    method: 'post',
    data
  })
}

// 设备下拉框
export function deviceSelect(data) {
  return request({
    url: '/api/device/device_info/device_select',
    method: 'post',
    data
  })
}

// 删除
export function deleteDeviceInfo(data) {
  return request({
    url: '/api/device/device_info/delete',
    method: 'post',
    data
  })
}

//详情
export function detailDeviceInfo(data) {
  return request({
    url: '/api/device/device_info/detail',
    method: 'post',
    data
  })
}
