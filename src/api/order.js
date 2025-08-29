import request from '@/utils/request'


// 工序名称与设备ID的固定映射表
export  const procedureDeviceMap = {
  '激光切割下料': '424949962023788544',
  '预装焊接': '424859913508773888',
  '打码': '424949505515741184',
  '铆铭牌': '424974103321927680',
  '包装': '424859706293379072',
  '倒角': '424950346687602688',
  '左立板预装': '424860069373304832',
  '左立板焊接': '424859913508773888',
  '右立板预装': '424860069373304832',
  '右立板焊接': '424859913508773888',
  '预装': '424860069373304832',
  '左立板焊后调平': '424859994123296768',
  '右立板焊后调平': '424859994123296768',
  '装框入库发货': '427747339575123968',
  '打磨遮蔽': '424983016339562496',
  '喷粉': '424973040892141568',
  '检验组挂防护上件': '424951282155806720',
  '装配调整': '424974103321927680',
  '调整平面度及尺寸': '424859994123296768',
  '火焰校正': '424859994123296768',
  '机头座预装': '424860069373304832',
  '焊接': '424859913508773888',
  '机头座焊接': '424859913508773888',
  '预装小件': '424860069373304832',
  '焊后调平': '424859994123296768',
  '砸轴套': '424974103321927680',
  '改成预装焊接及螺母': '424860069373304832',
  '加工平面及孔': '424950493689569280',
  '预装焊接前贴板': '424860069373304832',
  '焊接油缸座': '424859913508773888',
  '焊接后调整': '424859994123296768',
  '组装焊接电线环': '424859913508773888',
  '焊接固定板': '424859913508773888',
  '机器人预装焊接上板': '424950932417961984',
  '铣平面': '424950493689569280',
  '预装上板焊合': '424860069373304832',
  '铆钉': '424974103321927680',
  '喷砂': '424951176589369344',
  '预装油缸座': '424860069373304832',
  '总成平整度，尺寸矫正': '424859994123296768',
  '总成试装装配护栏': '424974103321927680',
  '焊后加工': '424950493689569280',
  '总装': '424974103321927680',
  '喷砂前防护': '424983016339562496',
  '修磨切割纹': '424949846894338048',
  '卸防护': '425239381603672064',
  '一次预装': '424860069373304832',
  '二次预装': '424860069373304832',
  '攻丝': '424948342544293888',
  '预装下件': '425239381603672064',
  '调整平面': '424950828344696832',
  '折弯': '424950245286109184',
  '车床加工': '424950493689569280',
  '清渣修磨': '424859821687070720',
  '调整检验': '424859994123296768',
  '装运总装车间': '424960035571785728',
  '下件': '425239381603672064',
  '总成顺丝及调整': '424973656825683968',
  '装配油箱电池侧': '424974103321927680',
  '下料': '424949962023788544',
  '装框': '427747339575123968',
  '沉孔': '424950640133693440',
  '预装焊接螺母': '424860069373304832',
  '火焰切割外形': '424950120539119616',
  '加工坡口': '424950346687602688',
  '打磨机修磨': '424949846894338048',
  '装车': '424960035571785728',
  '调整': '424859994123296768',
  '火焰切割下料': '424950120539119616',
  '调平': '424950828344696832',
  '加工2个R弧': '424950493689569280',
  '机器人折弯': '424950245286109184',
  '钻孔': '424950640133693440',
  'U型抬杠装配': '424974103321927680',
  '圆管切割机下料': '424950740994121728',
  '焊接机器人预装焊接': '424950932417961984',
  '围弯': '424871737725706240',
  '衬管下料': '424950740994121728',
  '钻孔攻丝': '424950640133693440',
  '切除多余部分': '001',
  '切割圆弧': '424859821687070720',
  '压型': '424951108410957824',
  '压边': '424950245286109184',
  '总成修整装配': '424974103321927680',
  '修磨圆弧': '424859821687070720',
  '下料围弯': '424950740994121728',
  '机器人补焊': '424950932417961984',
  '机器人焊接': '424950932417961984',
  '人工焊接': '424859913508773888',
  '人工补焊': '424859913508773888',
  '机器人预装': '424860069373304832',
  '改为修磨毛刺及微连接': '424859821687070720',
  '焊接后调平': '424859994123296768',
  '清抛': '424951176589369344',
  '装片1个': '424951176589369344',
  '吹砂': '424951176589369344',
  '吹水': '424979166555693056',
  '成品': '424974103321927680',
  '铆接': '002'
}


// BON列表
export function get_bom_list(data) {
  return request({
    url: '/api/item/mes_item_stock/bom_list',
    method: 'post',
    data
  })
}

// 提交销售单
export function submit_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/commit',
    method: 'post',
    data
  })
}

// 订单增加
export function orderAdd(data) {
  return request({
    url: '/api/order/add',
    method: 'post',
    data
  })
}

// export function remote_list(data) {
//   return request({
//     url: '/api/item/mes_procedure/list_by_short_code',
//     method: 'post',
//     data
//   })
// }
export function list_procedure_by_item(data) {
  return request({
    url: '/api/item/mes_procedure/list_procedure_by_item',
    method: 'post',
    data
  })
}

export function get_bom_list_keyword(data) {
  return request({
    url: '/api/item/mes_item_stock/list_bom_by_no',
    method: 'post',
    data
  })
}

// 订单修改
export function orderUpdate(data) {
  return request({
    url: '/api/order/update',
    method: 'post',
    data
  })
}

// 订单列表
export function orderList(data, signal) {
  return request({
    url: '/api/production/production_order/page_list',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

//待分配订单列表
export function orderForAllocList(data, signal) {
  return request({
    url: '/api/order/order_alloc_list',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

export function updateStatus(data, signal) {
  return request({
    url: '/api/order/update_status',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

export function orderListSales(data, signal) {
  return request({
    url: '/api/sales/delivery/page_list',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

// 订单详情
export function getDetail(data) {
  return request({
    url: '/api/order/page_list',
    method: 'post',
    data
  })
}

// 订单工序分配
export function update_order_work(data) {
  return request({
    url: '/api/order/update_order_work',
    method: 'post',
    data
  })
}

// 订单工序分配明细
export function work_detail(data) {
  return request({
    url: '/api/order/work_detail',
    method: 'post',
    data
  })
}

// 订单导入
export function import_order(data) {
  return request({
    url: '/api/order/import_order',
    method: 'post',
    data
  })
}

// 关闭订单
export function update_status(data) {
  return request({
    url: '/api/production/production_order/update_status',
    method: 'post',
    data
  })
}

// 获取外协明细
export function get_outer_detail(data) {
  return request({
    url: '/api/order/get_outer_detail',
    method: 'post',
    data
  })
}

//获取所有外协厂家
export function get_all_outer(data) {
  return request({
    url: '/api/user/mes_worker/get_all_outer',
    method: 'post',
    data
  })
}

//获取外协工序明细
// "params": {
//     "bomNo": "string",
//     "id": "string",
//     "type": "string"
//   }
export function get_outer_procedure(data) {
  return request({
    url: '/api/order/get_outer_procedure',
    method: 'post',
    data
  })
}

// 暂停
export function pause_order(data) {
  return request({
    url: '/api/order/pause_order',
    method: 'post',
    data
  })
}

// 订单排程/恢复
export function scheduled_order(data) {
  return request({
    url: '/api/order/scheduled_order',
    method: 'post',
    data
  })
}

// 订单排程/恢复 返回排程id
export function start_scheduled(data) {
  return request({
    url: '/api/production/production_order/start_scheduled',
    method: 'post',
    data
  })
}

// 根据排程id 查询返回结果
export function status_scheduled(data, signal) {
  return request({
    url: '/api/order/status_scheduled',
    method: 'post',
    data,
    headers: {
      signal: signal
    }
  })
}

// 排程异常获取异常资源
export function defect_resources(data) {
  return request({
    url: '/api/order/defect_resources',
    method: 'post',
    data
  })
}

// 排程异常 获取物料
export function get_item_list(data) {
  return request({
    url: '/api/order/get_item_list',
    method: 'post',
    data
  })
}

// 排程异常获取设备
export function get_device_list(data) {
  return request({
    url: '/api/order/get_device_list',
    method: 'post',
    data
  })
}

// 异常排程确认
export function update_resources(data) {
  return request({
    url: '/api/order/update_resources',
    method: 'post',
    data
  })
}

// 外协分配
export function update_order_outer(data) {
  return request({
    url: '/api/order/update_order_outer',
    method: 'post',
    data
  })
}

// 发货
export function order_shipped(data) {
  return request({
    url: '/api/order/order_shipped',
    method: 'post',
    data
  })
}

// 工序分配列表
export function proc_allocation_list(data) {
  return request({
    url: '/api/order/proc_allocation/page_list',
    method: 'post',
    data
  })
}

//订单外协
export function proc_allocation_list_v2(data) {
  return request({
    url: '/api/production/production_proc/page_list',
    method: 'post',
    data
  })
}

// 工序恢复
export function proc_allocation_resume(data) {
  return request({
    url: '/api/order/proc_allocation/resume',
    method: 'post',
    data
  })
}

// 工序暂停
export function proc_allocation_pause(data) {
  return request({
    url: '/api/order/proc_allocation/pause',
    method: 'post',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/api/order/proc_allocation/delete_by_work_id',
    method: 'post',
    data
  })
}

//获取个人分配详情
export function get_person_dist(data) {
  return request({
    url: '/api/order/proc_allocation/get_person_dist',
    method: 'post',
    data
  })
}

//替换设备
export function replace_device(data) {
  return request({
    url: '/api/order/proc_allocation/replace_device',
    method: 'post',
    data
  })
}

//获取分组分配详情
export function get_group_dist(data) {
  return request({
    url: '/api/order/proc_allocation/get_group_dist',
    method: 'post',
    data
  })
}

//按人工序分配
export function distribution_person(data) {
  return request({
    url: '/api/order/proc_allocation/distribution_person',
    method: 'post',
    data
  })
}

// 按组工序分配
export function distribution_group(data) {
  return request({
    url: '/api/order/proc_allocation/distribution_group',
    method: 'post',
    data
  })
}

//更新发货数量
export function update_count(data) {
  return request({
    url: '/api/sales/delivery_order/update_count',
    method: 'post',
    data
  })
}

//外协分配列表
export function distribution_outer(data) {
  return request({
    url: '/api/production/proc_allocation/distribution_outer',
    method: 'post',
    data
  })
}

export function distribution_outer2(data) {
  return request({
    url: '/api/order/proc_allocation/distribution_outer',
    method: 'post',
    data
  })
}

//新发货单列表
export function new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/page_list',
    method: 'post',
    data
  })
}

//新发货单删除
export function delete_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/delete',
    method: 'post',
    data
  })
}

//新发货单新增
export function add_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/batch_add',
    method: 'post',
    data
  })
}

//新发货单详情
export function detail_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/detail',
    method: 'post',
    data
  })
}

//新发货单编辑
export function edit_new_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/update',
    method: 'post',
    data
  })
}

//发货单列表
export function delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/page_list',
    method: 'post',
    data
  })
}

// 新增发货单
export function add_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/batch_add',
    method: 'post',
    data
  })
}

// 删除发货单
export function delete_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/delete',
    method: 'post',
    data
  })
}

// 修改发货单
export function edit_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/update',
    method: 'post',
    data
  })
}

// 审核发货单
export function audit_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery/audit',
    method: 'post',
    data
  })
}

//新审核发货单
export function new_audit_delivery_page_list(data) {
  return request({
    url: '/api/sales/delivery_order/confirm',
    method: 'post',
    data
  })
}

// 批量工序分配页面列表
export function proc_procedure_list(data) {
  return request({
    url: '/api/order/proc_allocation/dist_list',
    method: 'post',
    data
  }).then(res => {
    if (Array.isArray(res.data)) {
      res.data = res.data.map(item => {
        const mappedId = procedureDeviceMap[item.procedureName]
        if (mappedId) {
          item.deviceId = mappedId
          if (!item.workDeviceId) item.workDeviceId = mappedId
        }
        return item
      })
    }
    return res
  })
}

// 批量工序获取分配模式
// 获取班次
// 批量工序获取详情
//批量工序提交分配

export function submit_alloc_proc(data) {
  return request({
    url: '/api/order/proc_allocation/alloc_proc_v1',
    method: 'post',
    data
  })
}

//清空
export function proc_detail(data) {
  return request({
    url: '/api/order/proc_allocation/proc_detail',
    method: 'post',
    data
  })
}

//外协管理-外协分配列表
export function proc_allocation_list_v3(data) {
  return request({
    url: '/api/order/proc_allocation/out_page_list',
    method: 'post',
    data
  })
}

//外协管理-外协发布
export function pub_outer(data) {
  return request({
    url: '/api/order/proc_allocation/pub_outer',
    method: 'post',
    data
  })
}

//外协管理-外协发布
export function outer_list(data) {
  return request({
    url: '/api/order/proc_allocation/outer_list',
    method: 'post',
    data
  })
}

export function outer_to_alloc_list(data) {
  return request({
    url: '/api/order/proc_allocation/outer_to_alloc_list',
    method: 'post',
    data
  })
}
