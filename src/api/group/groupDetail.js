import request from '@/utils/request'

//分页数据
export function groupDtlPageList(data) {
  return request({
    url: '/api/group/group_dtl/page_list',
    method: 'post',
    data
  })
}

// 修改
export function updateGroupDtl(data) {
  return request({
    url: '/api/group/group_dtl/update',
    method: 'post',
    data
  })
}

// 新增
export function addGroupDtl(data) {
  return request({
    url: '/api/group/group_dtl/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteGroupDtl(data) {
  return request({
    url: '/api/group/group_dtl/delete',
    method: 'post',
    data
  })
}

//详情
export function detailGroupDtl(data) {
  return request({
    url: '/api/group/group_dtl/detail',
    method: 'post',
    data
  })
}
