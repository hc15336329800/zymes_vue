import request from '@/utils/request'

//分页数据
export function listTaskById(data) {
  return request({
    url: '/api/outer/outer_task/list_by_pid',
    method: 'post',
    data
  })
}

export function addOuterTask(data) {
  return request({
    url: '/api/outer/outer_task/add',
    method: 'post',
    data
  })
}

export function outerPageList(data) {
  return request({
    url: '/api/outer/outer_task/page_list',
    method: 'post',
    data
  })
}
