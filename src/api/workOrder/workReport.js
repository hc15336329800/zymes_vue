import request from '@/utils/request'
// 新增部门
export function workReportPage(data) {
  return request({
    url: '/api/work/work_report/page_list',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/api/work/work_report/update_status',
    method: 'post',
    data
  })
}
export function updateVerifyStatus(data) {
  return request({
    url: '/api/work/work_report/update_verify_status',
    method: 'post',
    data
  })
}
