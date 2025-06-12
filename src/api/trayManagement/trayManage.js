import request from '@/utils/request'

// 修改数据
export function addTrayInfo(data) {
  return request({
    url: '/api/tray/tray_info/add',
    method: 'post',
    data
  })
}

// 批量修改数据
export function addAllTrayInfo(data) {
  return request({
    url: '/api/tray/tray_info/addAll',
    method: 'post',
    data
  })
}

//分页数据
export function trayPageList(data) {
  return request({
    url: '/api/tray/tray_info/page_list',
    method: 'post',
    headers: {
      showLoading: false
    },
    data
  })
}

// 删除数据
export function deleteOneData(data) {
  return request({
    url: '/api/tray/tray_info/delete',
    method: 'post',
    data
  })
}

//获取下拉框数据
export function getItem(data) {
  return request({
    url: '/api/tray/tray_info/getItem',
    method: 'post',
    data
  })
}
