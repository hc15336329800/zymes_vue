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


// 导出工资明细（下载 Excel）
export function wages_export_detail(params) {
  return request({
    url: '/api/work/worker_report_dtl/download_salary',
    method: 'post',
    data: params, // 直接扁平，不包一层data
    responseType: 'blob'
  })
}


// 导出工资汇总（带时间参数）
export function download_salary_summary(params) {
  return request({
    url: '/api/work/worker_report_dtl/download_salary_summary',
    method: 'post',
    data: params,            // 传递 { beginTime, endTime }
    responseType: 'blob'
  })}
