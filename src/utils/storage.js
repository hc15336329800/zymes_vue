// use localStorage to store the authority info, which might be sent from server in actual project.
const dset = require('@/settings.js')

const keyName = dset.storade_key + '-'

import {validatenull} from '@/utils/index'

/**
 * 存储localStorage
 */
export const setStore = (params = {}) => {
  let {name, content, type} = params
  name = keyName + name
  let obj = {
    dataType: typeof content,
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  if (type) window.sessionStorage.setItem(name, JSON.stringify(obj))
  else window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */

export const getStore = (params = {}) => {
  let {name, debug} = params
  name = keyName + name
  let obj = {},
    content
  obj = window.sessionStorage.getItem(name)
  if (validatenull(obj)) obj = window.localStorage.getItem(name)
  if (validatenull(obj)) return
  try {
    obj = JSON.parse(obj)
  } catch {
    return obj
  }
  if (debug) {
    return obj
  }
  if (obj.dataType == 'string') {
    content = obj.content
  } else if (obj.dataType == 'number') {
    content = Number(obj.content)
  } else if (obj.dataType == 'boolean') {
    content = eval(obj.content)
  } else if (obj.dataType == 'object') {
    content = obj.content
  }
  return content
}
/**
 * 删除localStorage
 */
export const removeStore = (params = {}) => {
  let {name, type} = params
  name = keyName + name
  if (type) {
    window.sessionStorage.removeItem(name)
  } else {
    window.localStorage.removeItem(name)
  }
}

export function setToken(token) {
  localStorage.setItem(dset.TokenKey, token)
}

export function getToken() {
  return localStorage.getItem(dset.TokenKey) || ''
}

export function delToken() {
  return localStorage.removeItem(dset.TokenKey)
}

export function setUser(user) {
  const jsond = JSON.stringify(user)
  localStorage.setItem(dset.userKey, jsond)
}

export function getUser() {
  const u = localStorage.getItem(dset.userKey) || ''
  if (u != '') {
    return JSON.parse(u)
  }
  return null
}

export function delUser() {
  return localStorage.removeItem(dset.userKey)
}

export function setLanguage(language) {
  if (language && language === 'en_US') {
    language = 'en-US,en;q=0.9'
  } else {
    language = 'zh-CN,zh;q=0.9'
  }
  localStorage.setItem(dset.languageKey, language)
}

export function getLanguage() {
  return localStorage.getItem(dset.languageKey) || 'zh-CN,zh;q=0.9'
}

export function setMenus(codes) {
  const jsond = JSON.stringify(codes)
  localStorage.setItem(dset.menuKey, jsond)
}

export function getMenus() {
  const u = localStorage.getItem(dset.menuKey) || []
  if (u != []) {
    return JSON.parse(u)
  }
  return []
}

export function setPerm(perm) {
  const jperm = JSON.stringify(perm)
  console.log(jperm)
  localStorage.setItem(dset.permKey, jperm)
}

export function getPerm() {
  const p = localStorage.getItem(dset.permKey) || ''
  if (p != '') {
    return JSON.parse(p)
  }
  return null
}

export function setTitleName(n) {
  localStorage.setItem(dset.titleNameKey, n)
}

export function getTitleName() {
  return localStorage.getItem(dset.titleNameKey) || ''
}

export function clearStorage() {
  localStorage.clear()
  document.cookie = 'Session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

export function urls() {
  const base = process.env.VUE_APP_BASE_API
  return {
    upload_url: base + '/api/anon/file/upload',
    org_tree: base + '/api/sys/adm/reg_tree',
    yangshaung_check_work: base + '/api/anon/check_work/import'
  }
}

export function getHeaderToken() {
  return {
    Authorization: getToken()
  }
}

export function setCookie(k, v, exdays) {
  var exdate = new Date()
  //保存的天数
  exdate.setTime(exdate.getTime() + 86400000 * exdays)
  window.document.cookie =
    k + '=' + v + ';path=/;expires=' + exdate.toGMTString()
}

export function setErrorCount(c) {
  const key = 'e_p_c'
  if (c !== 0) {
    // 取缓存累加
    const co = getErrorCount()
    c += parseInt(co)
  }
  setCookie(key, c, 1)
  return c
}

export function getErrorCount() {
  const key = 'e_p_c'
  const co = getCookieOne(key)
  var c = 0
  if (co) {
    c = co
  }
  return c
}

export function setUserPwdCookie(username, pwd) {
  setCookie('uencry', username, dset.pwdExdays)
  setCookie('pvi', pwd, dset.pwdExdays)
}

export function getUserPwdCookie() {
  var map = new Map()
  map.set('uencry', '')
  map.set('pvi', '')
  getCookie(map)
  return map
}

export function clearUserPwdCookie() {
  setCookie('uencry', '', -1)
  setCookie('pvi', '', -1)
}

export function getCookieOne(key) {
  var map = new Map()
  map.set(key, '')
  getCookie(map)
  return map.get(key)
}

export function getCookie(map) {
  if (document.cookie.length > 0) {
    //这里显示的格式需要切割一下自己可输出看下
    var arr = document.cookie.split('; ')
    for (var i = 0; i < arr.length; i++) {
      //再次切割
      var arr2 = arr[i].split('=')
      map.forEach(function (k, v) {
        if (arr2[0] == v) {
          map.set(v, arr2[1])
        }
      })
    }
  }
}
