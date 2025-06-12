import request from '@/utils/request'
//分页数据
export function DeviceLocationPageList(data) {
  return request({
    url: '/api/item/deviceLocation/page_list',
    method: 'post',
    data
  })
}
// 修改
export function updateDeviceLocation(data) {
  return request({
    url: '/api/item/deviceLocation/update',
    method: 'post',
    data
  })
}
// 新增
export function addDeviceLocation(data) {
  return request({
    url: '/api/item/deviceLocation/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteDeviceLocation(data) {
  return request({
    url: '/api/item/deviceLocation/delete',
    method: 'post',
    data
  })
}
//详情
export function detailDeviceLocation(data) {
  return request({
    url: '/api/item/deviceLocation/detail',
    method: 'post',
    data
  })
}
