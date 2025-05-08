import request from '@/utils/request'

// 查询列表
export function wages_page_list(data) {
  return request({
    url: '/api/work/worker_report_dtl/page_list',
    method: 'post',
    data
  })
}

export function wages_detail_page_list(data) {
  return request({
    url: '/api/work/worker_report_dtl/detail_page_list',
    method: 'post',
    data
  })
}
