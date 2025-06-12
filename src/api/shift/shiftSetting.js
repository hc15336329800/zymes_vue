import request from '@/utils/request'

//获取班次列表
export function get_shift_setting(data) {
  return request({
    url: '/api/shift/shift_setting/list',
    method: 'post',
    data
  })
}

//保存班次信息
export function save_shift_setting(data) {
  return request({
    url: '/api/shift/shift_setting/save',
    method: 'post',
    data
  })
}
