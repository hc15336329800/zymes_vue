import request from '@/utils/request'

//分页数据
export function procedurePageList(data) {
  return request({
    url: '/api/item/mes_procedure/page_list',
    method: 'post',
    data
  })
}

export function uploadProcedure(data) {
  return request({
    url: '/api/item/mes_procedure/upload',
    method: 'post',
    data
  })
}

export function procedureHeader(data) {
  return request({
    url: '/api/item/mes_procedure/procedure_header',
    method: 'post',
    data
  })
}

export function listNameByShortCode(data) {
  return request({
    url: '/api/item/mes_procedure/list_name_by_short',
    method: 'post',
    data
  })
}

// 修改
export function updateProcedure(data) {
  return request({
    url: '/api/item/mes_procedure/update',
    method: 'post',
    data
  })
}

// 新增
export function addProcedure(data) {
  return request({
    url: '/api/item/mes_procedure/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteProcedure(data) {
  return request({
    url: '/api/item/mes_procedure/delete',
    method: 'post',
    data
  })
}

//详情
export function detailProcedure(data) {
  return request({
    url: '/api/item/mes_procedure/detail',
    method: 'post',
    data
  })
}
