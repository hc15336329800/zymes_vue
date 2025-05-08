import request from '@/utils/request'
import {MessageBox, Message} from 'element-ui'

export function get_all_workers(data) {
  return request({
    url: '/api/user/mes_worker/get_all_workers',
    method: 'post',
    data
  })
}

/**
 * 字典
 * @param type
 * @param cbFun
 */
export function dictInfo(type, cbFun) {
  request({
    url: '/api/dict/list',
    method: 'post',
    data: {params: type}
  }).then(res => {
    cbFun(res.data)
  })
}
export function downExcelCb(res) {
  const relType = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  let type = res.headers['content-type']
  if (type.includes('application/json')) {
    const data = res.data
    let reader = new FileReader()
    reader.onload = function (event) {
      let content = reader.result
      // 错误信息
      let message = JSON.parse(content).error_info.message
      Message({
        message: message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
    reader.readAsText(data)
    return true
  }
  let excel = false
  relType.forEach((t, index) => {
    if (type.includes(t)) {
      excel = true
    }
  })
  if (excel) {
    let cdname = res.headers['content-disposition']
    let ss = cdname.split('=')
    let fileName = ss[1]
    let blob = new Blob([res.data], {
      type: type //将会被放入到blob中的数组内容的MIME类型
    })
    let a = document.createElement('a')
    a.download = decodeURIComponent(fileName)
    let objectUrl = window.URL.createObjectURL(blob) //生成一个url
    a.style.display = 'none'
    document.body.appendChild(a)
    a.href = objectUrl //浏览器打开这个url
    a.click()
    URL.revokeObjectURL(a.href) // 释放url
    document.body.removeChild(a) // 释放标签
  }
}

export function get_new_export(url, data) {
  request({
    url: url,
    method: 'post',
    responseType: 'blob',
    data
  }).then(res => {
    downExcelCb(res)
  })
}

export function list_by_short_code(data) {
  return request({
    url: '/api/user/mes_worker/list_by_short_code',
    method: 'post',
    data
  })
}
export function export_excel(url, data) {
  return request({
    url: url,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
    // multipart/form-data;
  })
}
