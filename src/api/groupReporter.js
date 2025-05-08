import request from '@/utils/request'

//修改分组的占比
export function group_dtl_update(data) {
  return request({
    url: '/api/group/group_dtl/update',
    method: 'post',
    data,
  })
}

//车间名称列表
export function work_shop_list(data) {
  return request({
    url: '/api/group/group_info/work_shop_list',
    method: 'post',
    data,
  })
}

//修改分组名称
export function update_group(data) {
  return request({
    url: '/api/group/group_info/update_group',
    method: 'post',
    data,
  })
}

//分组列表
export function proc_group_list(data) {
  return request({
    url: '/api/group/group_info/proc_group_list',
    method: 'post',
    data,
  })
}

//工序分配页面分组下拉
export function proc_group_list2(data) {
  return request({
    url: '/api/order/proc_allocation/group_list',
    method: 'post',
    data,
  })
}

//工人分组记录
export function group_list(data) {
  return request({
    url: '/api/group/group_info/group_list',
    method: 'post',
    data,
  })
}

//删除分组
export function delete_group(data) {
  return request({
    url: '/api/group/group_info/delete',
    method: 'post',
    data,
  })
}

//新增分组
export function add_group(data) {
  return request({
    url: '/api/group/group_info/add',
    method: 'post',
    data,
  })
}

//查询分组明细分页

export function group_page_list(data) {
  return request({
    url: '/api/group/group_dtl/page_list',
    method: 'post',
    data,
  })
}

//删除分组明细
export function group_delete(data) {
  return request({
    url: '/api/group/group_dtl/delete',
    method: 'post',
    data,
  })
}

//新增分组明细
export function group_add(data) {
  return request({
    url: '/api/group/group_dtl/add',
    method: 'post',
    data,
  })
}

//查询工序分配需要用到的数据
export function proc_dtl(data) {
  return request({
    url: '/api/group/group_dtl/proc_dtl',
    method: 'post',
    data,
  })
}
