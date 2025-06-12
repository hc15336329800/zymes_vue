import request from '@/utils/request'

//分页数据
export function productionPageList(data) {
  return request({
    url: '/api/production/production_order/page_list',
    method: 'post',
    data
  })
}

export function startScheduled(data) {
  return request({
    url: '/api/production/production_order/start_scheduled',
    method: 'post',
    data
  })
}

