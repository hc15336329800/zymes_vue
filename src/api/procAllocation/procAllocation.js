// procAllocation.js 页面
import request from '@/utils/request'



// todo： 增加一个 报工分组 查询接口：POST
// 	http://192.168.0.103:9527/local_api/api/group/group_info/page_list
// 请求： {"params":{},"page":{"page_num":1,"page_size":10}}
// 响应格式：{"tx_code":"00","page":{"pages":"6","page_num":"1","page_size":"10","total_num":"53"},"error_info":null,"data":[{"id":"430416826245996544","groupName":"测试","groupUid":"1","groupUserName":"超级管理员","deptId":"312905765054574592","deptName":"制造中心","remark":"123","createdTime":"2025-04-02 17:22:48"},{"id":"430295074027233280","groupName":"机器人焊接1组","groupUid":"428200302479302656","groupUserName":"杨智","deptId":"312905765054574592","deptName":"制造中心","remark":"机器人焊接1组组长","createdTime":"2025-04-02 09:19:00"},{"id":"430294607029231616","groupName":"总成修磨2组","groupUid":"317698515364896768","groupUserName":"李合熙","deptId":"312905765054574592","deptName":"制造中心","remark":"总成修磨2组组长","createdTime":"2025-04-02 09:17:09"},{"id":"430294253696868352","groupName":"总成修磨1组","groupUid":"317034602067550208","groupUserName":"范荣国","deptId":"312905765054574592","deptName":"制造中心","remark":"总成修磨1组","createdTime":"2025-04-02 09:15:45"},{"id":"430293947076468736","groupName":"调整1组","groupUid":"317033099734966272","groupUserName":"冯长青","deptId":"312905765054574592","deptName":"制造中心","remark":"调整1组组长","createdTime":"2025-04-02 09:14:31"},{"id":"430293819863228416","groupName":"王光庆","groupUid":"428204539682643968","groupUserName":"王光庆","deptId":"312905765054574592","deptName":"制造中心","remark":"个人","createdTime":"2025-04-02 09:14:01"},{"id":"430293558662946816","groupName":"李承虎","groupUid":"317697173015650304","groupUserName":"李承虎","deptId":"312905765054574592","deptName":"制造中心","remark":"个人","createdTime":"2025-04-02 09:12:59"},{"id":"430293431646838784","groupName":"齐峰","groupUid":"428200154609115136","groupUserName":"齐峰","deptId":"312905765054574592","deptName":"制造中心","remark":"个人","createdTime":"2025-04-02 09:12:29"},{"id":"430293310985101312","groupName":"赵建","groupUid":"428199212736208896","groupUserName":"赵建","deptId":"312905765054574592","deptName":"制造中心","remark":"个人","createdTime":"2025-04-02 09:12:00"},{"id":"430293180231868416","groupName":"刘明","groupUid":"317699235954712576","groupUserName":"刘明","deptId":"312905765054574592","deptName":"制造中心","remark":"个人","createdTime":"2025-04-02 09:11:29"}]}

// ★★★ 新增：报工分组分页列表接口 ★★★
export function groupInfoPageList(data) {
  return request({
    url: '/api/group/group_info/page_list', // 报工分组分页查询
    method: 'post',
    data
  })
}



//分页数据
export function allocationPageList(data) {
  return request({
    url: '/api/order/proc_allocation/page_list',
    method: 'post',
    data
  })
}

export function listAllocationById(data) {
  return request({
    url: '/api/order/proc_allocation/list_by_id',
    method: 'post',
    data
  })
}

export function updateAllocation(data) {
  return request({
    url: '/api/order/proc_allocation/update_status',
    method: 'post',
    data
  })
}

export function publishOuter(data) {
  return request({
    url: '/api/order/proc_allocation/distribution_outer',
    method: 'post',
    data
  })
}

export function procProcedureOuterList(data) {
  return request({
    url: '/api/order/proc_allocation/outer_dist_list',
    method: 'post',
    data
  })
}

//外协待分配列表
export function outerPubList(data) {
  return request({
    url: '/api/order/proc_allocation/outer_pub_list',
    method: 'post',
    data
  })
}
