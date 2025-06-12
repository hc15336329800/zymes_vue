import request from '@/utils/request'
// 新增部门
export function workAssignPage(data) {
  return request({
    url: '/api/work/work_assign/page_list',
    method: 'post',
    data
  })
}
