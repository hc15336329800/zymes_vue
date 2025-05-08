import request from '@/utils/request'
export function ganttChart(data) {
  return request({
    url: '/api/work/work_order/ganttChart',
    method: 'post',
    data,
  })
}
