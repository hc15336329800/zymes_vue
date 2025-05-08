import request from '@/utils/request'
// 新增
export function addSendInfo(data) {
  return request({
    url: '/api/agvcar/agv_info/add',
    method: 'post',
    data
  })
}
//查询
export function selectUsingCar(data) {
  return request({
    url: '/api/agvcar/agv_info/useingCar',
    method: 'post',
    data
  })
}
//查询工位库位
export function getStation(data) {
  return request({
    url: '/api/agvcar/agv_info/getStation',
    method: 'post',
    data
  })
}
