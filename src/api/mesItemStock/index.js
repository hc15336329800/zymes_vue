import request from '@/utils/request'


//分页数据
export function pageList(data) {
  return request({
    url: '/api/item/mes_item_stock/page_list',
    method: 'post',
    data
  })
}
