import request from '@/utils/request'

// 新增部门
export function addDept(data) {
  return request({
    url: '/api/system/dept/add',
    method: 'post',
    data
  })
}

// 部门详情
export function detailDept(data) {
  return request({
    url: '/api/system/dept/detail',
    method: 'post',
    data
  })
}

// 部门树
export function deptTree(data) {
  return request({
    url: '/api/system/dept/tree',
    method: 'post',
    data
  })
}


// 修改部门信息
export function updateDept(data) {
  return request({
    url: '/api/system/dept/update',
    method: 'post',
    data
  })
}

// 删除部门信息
export function deleteDept(data) {
  return request({
    url: '/api/system/dept/delete',
    method: 'post',
    data
  })
}
