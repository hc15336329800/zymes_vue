import request from '@/utils/request'

export function pwdStrength(data) {
  return request({
    url: '/api/anon/pwd/strength',
    method: 'post',
    data: {params: {password: data}},
    headers: {
      showLoading: false
    }
  });
}

/**
 * 用密码的方式修改用户密码
 * @param {数据} data
 * @returns
 */
export function updatePwd(data) {
  return request({
    url: '/api/user/info/updatePwd',
    method: 'post',
    data: {params: data}
  });
}
