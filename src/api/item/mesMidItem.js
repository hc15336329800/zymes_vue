import request from '@/utils/request'

//分页数据
export function midPageList(data) {
  return request({
    url: '/api/item/mid_item_stock/page_list',
    method: 'post',
    data
  })
}

