import request from '@/utils/request'
//车间名称列表
export function get_work_center_list(data) {
  return request({
    url: '/api/user/mes_user/get_work_center_list',
    method: 'post',
    data,
  })
}
export function get_all_work_center_list(data) {
  return request({
    url: '/api/user/mes_user/get_all_center_list',
    method: 'post',
    data,
  })
}
