import request from '@/utils/request'

//分页数据
export function defectivePageList(data) {
  return request({
    url: '/api/item/defective_stock/page_list',
    method: 'post',
    data
  })
}

// 修改
export function updateDefective(data) {
  return request({
    url: '/api/item/defective_stock/update',
    method: 'post',
    data
  })
}

// 新增
export function addDefective(data) {
  return request({
    url: '/api/item/defective_stock/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteDefective(data) {
  return request({
    url: '/api/item/defective_stock/delete',
    method: 'post',
    data
  })
}

//详情
export function detailDefective(data) {
  return request({
    url: '/api/item/defective_stock/detail',
    method: 'post',
    data
  })
}
