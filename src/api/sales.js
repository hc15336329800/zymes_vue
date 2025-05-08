import request from '@/utils/request'

// 查询销售单列表
export function sales_list(data) {
  return request({
    url: '/api/sales/sale_order/page_list',
    method: 'post',
    data
  })
}

// 修改销售单列表
export function edit_sales_list(data) {
  return request({
    url: '/api/sales/sale_order/update',
    method: 'post',
    data
  })
}

// 新增销售单列表
export function add_sales_list(data) {
  return request({
    url: '/api/sales/sale_order/batch_add',
    method: 'post',
    data
  })
}

// 删除销售单列表
export function delete_sales_list(data) {
  return request({
    url: '/api/sales/sale_order/delete',
    method: 'post',
    data
  })
}

//导入销售单
export function sales_import_order(data) {
  return request({
    url: '/api/sales/sale_order/import_order',
    method: 'post',
    data
  })
}

//导出销售单
export function sales_export_order(data) {
  return request({
    url: '/api/sales/sale_order/export_order',
    method: 'post',
    responseType: 'blob',
    data
  })
}

//导出模板
export function down_temp(data) {
  return request({
    url: '/api/sales/sale_order/down_temp',
    method: 'post',
    responseType: 'blob',
    data
  })
}

//发货统计
export function delivery_record_sta(data) {
  return request({
    url: '/api/sales/delivery_record/sta',
    method: 'post',
    data
  })
}

//发货明细列表
export function delivery_record_export(data) {
  return request({
    url: '/api/sales/delivery_record/page_list',
    method: 'post',
    data
  })
}

//发货统计2
export function delivery_record_sta2(data) {
  return request({
    url: '/api/sales/bom_store/sta',
    method: 'post',
    data
  })
}

//发货明细列表2
export function delivery_record_export2(data) {
  return request({
    url: 'api/sales/bom_store/sta_detail',
    method: 'post',
    data
  })
}

//下生产单

export function place_order(data) {
  return request({
    url: '/api/sales/sale_order_place/place_order',
    method: 'post',
    data
  })
}

//查询下生产单分页接口
export function place_page_list(data) {
  return request({
    url: '/api/sales/sale_order/list_sales_order',
    method: 'post',
    data
  })
}

//上传发货单
export function sales_import_delivery(data) {
  return request({
    url: '/api/sales/delivery/import_delivery',
    method: 'post',
    data
  })
}

//新上传发货单
export function sales_new_import_delivery(data) {
  return request({
    url: '/api/sales/delivery_order/import_delivery',
    method: 'post',
    data
  })
}

export function get_sales_option() {
  return [
    {
      value: '销售单',
      id: '01'
    },
    {
      value: '加急单',
      id: '02'
    },
    {
      value: '追加计划',
      id: '03'
    },
    {
      value: '月度单',
      id: '04'
    }
  ]
}

export function get_sales_value(id) {
  var res = get_sales_option()

  var arr = res.filter(item => {
    return item.id == id
  })
  if (arr && arr.length > 0) {
    return arr[0].value
  }
}
