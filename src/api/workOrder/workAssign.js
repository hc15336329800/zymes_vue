import request from '@/utils/request'

export function workAssignPage(data) {
  return request({
    url: '/api/work/work_assign/page_list',
    method: 'post',
    data
  })
}
