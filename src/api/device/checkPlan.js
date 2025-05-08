import request from '@/utils/request'

//分页数据
export function checkPageList(data) {
  return request({
    url: '/api/device/check_info/page_list',
    method: 'post',
    data
  })
}

// 修改
export function updateCheckInfo(data) {
  return request({
    url: '/api/device/check_info/update',
    method: 'post',
    data
  })
}

// 新增
export function addCheckInfo(data) {
  return request({
    url: '/api/device/check_info/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteCheckInfo(data) {
  return request({
    url: '/api/device/check_info/delete',
    method: 'post',
    data
  })
}

//详情
export function detailCheckInfo(data) {
  return request({
    url: '/api/device/check_info/detail',
    method: 'post',
    data
  })
}
