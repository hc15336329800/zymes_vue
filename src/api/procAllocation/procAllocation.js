import request from '@/utils/request'

//分页数据
export function allocationPageList(data) {
  return request({
    url: '/api/order/proc_allocation/page_list',
    method: 'post',
    data
  })
}

export function listAllocationById(data) {
  return request({
    url: '/api/order/proc_allocation/list_by_id',
    method: 'post',
    data
  })
}

export function updateAllocation(data) {
  return request({
    url: '/api/order/proc_allocation/update_status',
    method: 'post',
    data
  })
}

export function publishOuter(data) {
  return request({
    url: '/api/order/proc_allocation/distribution_outer',
    method: 'post',
    data
  })
}

export function procProcedureOuterList(data) {
  return request({
    url: '/api/order/proc_allocation/outer_dist_list',
    method: 'post',
    data
  })
}

//外协待分配列表
export function outerPubList(data) {
  return request({
    url: '/api/order/proc_allocation/outer_pub_list',
    method: 'post',
    data
  })
}



