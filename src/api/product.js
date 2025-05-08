import request from '@/utils/request'

// 库位列表
export function get_workshop_location(data) {
  return request({
    url: '/api/item/workshop_location/page_list',
    method: 'post',
    data
  })
}

// 不良品列表
export function defect_page_list(data) {
  return request({
    url: '/api/item/defective_stock/page_list',
    method: 'post',
    data
  })
}

// 新增不良品
export function add_defect(data) {
  return request({
    url: '/api/item/defective_stock/add',
    method: 'post',
    data
  })
}

export function get_location_list(data) {
  return request({
    url: '/api/item/mes_item_stock/list_location',
    method: 'post',
    data
  })
}

// BOM分页列表
export function bom_page_list(data) {
  return request({
    url: '/api/item/mes_item_stock/bom_page_list',
    method: 'post',
    data
  })
}

// BOM详情页面
export function get_bom_detail(data) {
  return request({
    // url: '/api/item/mes_item_stock/get_bom_detail',
    url: '/api/item/mes_item_use/item_use_tree',
    method: 'post',
    data
  })
}

// 工序导入
export function import_procedure(data) {
  return request({
    url: '/api/item/mes_procedure/import_procedure',
    method: 'post',
    data
  })
}

// 工序用料导入
export function import_use(data) {
  return request({
    url: '/api/item/mes_item_use/upload',
    method: 'post',
    data
  })
}

// 订单工序分配明细
export function work_detail(data) {
  return request({
    url: '/api/order/order/work_detail',
    method: 'post',
    data
  })
}

// 查询mes中间件库存表分页列表
export function mid_page_list(data) {
  return request({
    url: '/api/item/mid_item_stock/mid_page_list',
    method: 'post',
    data
  })
}


//查询工序
export function get_item_procedure(data) {
  return request({
    url: '/api/item/mes_item_stock/get_item_procedure',
    method: 'post',
    data
  })
}

//工序分配
// "params": {
//     "itemNo": "string",
//     "procedureCode": "string",
//     "orderDetailId": "string",
//     "orderNo": "string",
//     "list": [
//       {
//         "employeeNo": "string",
//         "employeeName": "string",
//         "percentage": 0
//       }
//     ],
//     "saveDefault": true
//   }

export function update_order_work(data) {
  return request({
    url: '/api/order/update_order_work',
    method: 'post',
    data
  })
}

//物料编辑
export function edit_item(data) {
  return request({
    url: '/api/item/mes_item_stock/edit_item',
    method: 'post',
    data
  })
}

//物料新增
export function add_item(data) {
  return request({
    url: '/api/item/mes_item_stock/add_item',
    method: 'post',
    data
  })
}

//物料删除
export function delete_item(data) {
  return request({
    url: '/api/item/mes_item_stock/delete_item',
    method: 'post',
    data
  })
}

//BOM编辑
export function edit_bom(data) {
  return request({
    url: '/api/item/mes_item_stock/edit_bom',
    method: 'post',
    data
  })
}

//物料新增
export function add_bom(data) {
  return request({
    url: '/api/item/mes_item_stock/add_bom',
    method: 'post',
    data
  })
}

//工序导出
export function export_order(data) {
  return request({
    url: '/api/item/mes_procedure/export_bom_proc',
    method: 'post',
    data
  })
}

//用料导出
export function export_bom_use(data) {
  return request({
    url: '/api/item/mes_item_use/export_bom_use',
    method: 'post',
    data
  })
}
