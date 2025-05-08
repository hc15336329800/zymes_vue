import request from '@/utils/request'
//分页数据
export function groupPageList(data) {
  return request({
    url: '/api/group/group_info/page_list',
    method: 'post',
    data
  })
}
// 修改
export function updateGroup(data) {
  return request({
    url: '/api/group/group_info/update',
    method: 'post',
    data
  })
}
// 新增
export function addGroup(data) {
  return request({
    url: '/api/group/group_info/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteGroup(data) {
  return request({
    url: '/api/group/group_info/delete',
    method: 'post',
    data
  })
}
//详情
export function detailGroup(data) {
  return request({
    url: '/api/group/group_info/detail',
    method: 'post',
    data
  })
}
export function groupSelected(data) {
  return request({
    url: '/api/group/group_info/selected',
    method: 'post',
    data
  })
}
