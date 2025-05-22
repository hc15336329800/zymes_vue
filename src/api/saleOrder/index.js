import request from '@/utils/request'


//////////////////////////////审批单/////////////////////////////////////////////////////////////////////

/**
 * 提交生产审批单
 * @param {Array} data 格式：[{ orderNo, orderedNum, deliverTime, saleId, bizType }]
 */
export function submitPlaceOrder(data) {
  return request({
    url: '/api/salesOrder/submitPlaceOrder',
    method: 'post',
    data
  })
}



//////////////////////////////销售单/////////////////////////////////////////////////////////////////////


/**
 * 根据 ID 查询销售单详情
 * @param {string} id
 */
export function infoById(data) {
  return request({
    url: '/api/salesOrder/infoById',
    method: 'post',
    data  // ✅ 直接传对象
  })
}



/**
 * 修改销售单（单个）
 * @param {Object} data 格式：{id, custName, itemNo, needNum}
 */
export function update(data) {
  return request({
    url: '/api/salesOrder/update',
    method: 'post',
    data
  })
}


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
