import request from '@/utils/request'

//分页数据
export function outTaskReport(data) {
  return request({
    url: '/api/outer/outer_task_report/add',
    method: 'post',
    data
  })
}

export function outTaskAcceptReport(data) {
  return request({
    url: '/api/outer/outer_task/accept',
    method: 'post',
    data
  })
}

export function outerReportPageList(data) {
  return request({
    url: '/api/outer/outer_task_report/page_list',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/api/outer/outer_task_report/update_status',
    method: 'post',
    data
  })
}
