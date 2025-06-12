import request from '@/utils/request'

/**
 * 获取下载路径 参数为id 或者url
 * @param {*} data 表单信息
 * @returns
 */
export function getDownloadUrl(data) {
  return request({
    url: '/api/sys/file/download_url',
    method: 'post',
    data
  })
}


/**
 * 上传文件到后端
 * @param {*} data 表单信息
 * @returns
 */
export function fileUploadServer(data) {
  return request({
    url: '/api/sys/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

/**
 * 大文件上传前获取文件信息
 * @param {*} data
 * @returns
 */
export function uploadBefore(data) {
  return request({
    url: '/api/sys/file/upload_before',
    method: 'post',
    data
  })
}

/**
 * 大文件上传后保存
 * @param {*} data 文件
 * @returns
 */
export function uploadSave(data) {
  return request({
    url: '/api/sys/file/upload_save',
    method: 'post',
    data
  })
}

/**
 * 删除文件
 * @param {*} data
 * @returns
 */
export function fileUploadDel(data) {
  return request({
    url: '/api/sys/file/deleteFile',
    method: 'post',
    data
  })
}
