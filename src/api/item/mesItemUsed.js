import request from '@/utils/request'



// ==================== 新接口（分段流程） ====================

/**
 * ①  上传 Excel → 只写 mes_item_use
 * formData: new FormData(); formData.append('file', file)
 */
export function uploadUsedNew(formData) {
  return request({
    url: '/api/item/mes_item_use/uploadNew',   // ← 新控制器
    method: 'post',
    data: formData
  })
}

// /**
//  * ②  生成 BOM 树 → 写 t_bom_used
//  * roots: ['600494', '600495']  // 根物料编码数组
//  */
// export function refreshBomTree(roots) {
//   return request({
//     url: '/api/item/mes_item_use/refreshBomTree',
//     method: 'post',
//     data: roots
//   })
// }

// ==================== 旧接口 ====================

//分页数据
export function usedPageList(data) {
  return request({
    url: '/api/item/mes_item_use/page_list',
    method: 'post',
    data
  })
}

export function uploadUsed(data) {
  return request({
    url: '/api/item/mes_item_use/upload',
    method: 'post',
    data
  })
}

// 一阶用料树
export function itemUsedTree(data) {
  return request({
    url: '/api/item/mes_item_use/item_use_tree',
    method: 'post',
    data
  })
}


// 修改
export function updateUsed(data) {
  return request({
    url: '/api/item/mes_item_use/update',
    method: 'post',
    data
  })
}

// 新增
export function addUsed(data) {
  return request({
    url: '/api/item/mes_item_use/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteUsed(data) {
  return request({
    url: '/api/item/mes_item_use/delete',
    method: 'post',
    data
  })
}

//详情
export function detailUsed(data) {
  return request({
    url: '/api/item/mes_item_use/detail',
    method: 'post',
    data
  })
}
