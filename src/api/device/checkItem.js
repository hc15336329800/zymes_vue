import request from '@/utils/request'
//分页数据
export function itemPageList(data) {
  return request({
    url: '/api/device/check_item/page_list',
    method: 'post',
    data
  })
}
// 修改
export function updateCheckItem(data) {
  return request({
    url: '/api/device/check_item/update',
    method: 'post',
    data
  })
}
// 新增
export function addCheckItem(data) {
  return request({
    url: '/api/device/check_item/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteCheckItem(data) {
  return request({
    url: '/api/device/check_item/delete',
    method: 'post',
    data
  })
}
//详情
export function detailCheckItem(data) {
  return request({
    url: '/api/device/check_item/detail',
    method: 'post',
    data
  })
}
