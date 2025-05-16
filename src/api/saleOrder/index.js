import request from '@/utils/request'




/**
 * 新增销售单（单个）
 * @param {Object} data 格式：{ custName, itemNo, needNum }
 */
export function add(data) {
  return request({
    url: '/api/salesOrder/add', // ✅ 注意路径：你新建的 OrderController 映射路径
    method: 'post',
    data
  })
}


/**
 * 批量新增
 */
export function addList(data) {
  return request({
    url: '/api/salesOrder/add',
    method: 'post',
    data: {
      list: [data] // ✅ 包装成 list 格式
    }
  })
}



//分页数据
export function pageList(data) {
  return request({
    url: '/api/item/mes_item_stock/page_list',
    method: 'post',
    data
  })
}
