import {asyncRoutes, constantRoutes} from '@/router'
import {getMenus} from '@/utils/storage'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function pushMenu(menus, menu) {
  let flag = true
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].path === menu.path) {
      flag = false
      break
    }
  }
  if (flag) {
    menus.push(menu)
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {...route}
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = asyncRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes2({commit}, roles) {
    return new Promise(resolve => {
      let accessedRoutes

      if (roles && roles.includes('admin')) {
        accessedRoutes = constantRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(constantRoutes, roles)
      }

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateRoutes({commit}) {
    return new Promise(resolve => {
      let accessedRoutes
      var userMenus = getMenus()
      // userMenus.push({

      // })
      var asyncRoutes1 = []
      if (userMenus && userMenus.length > 0) {
        userMenus.forEach((item, index) => {
          constantRoutes.forEach((item1, indxe1) => {
            if (item1.hidden) {
              // 如果是非菜单，则直接添加
              pushMenu(asyncRoutes1, item1)
            } else if (item.path.indexOf(item1.path) > -1) {
              if (item.children && item.children.length > 0) {
                var children = []

                item.children.forEach(item2 => {
                  if (item1.children && item1.children.length > 0) {
                    item1.children.forEach(item3 => {
                      if (item3.hidden) {
                        // 如果是非菜单，则直接添加
                        pushMenu(children, item3)
                      } else if (
                        item2.path.indexOf(item3.path) > -1 &&
                        item2.label == item3.meta.title
                      ) {
                        // 当前子菜单存在
                        console.log(item3)
                        pushMenu(children, item3)
                      }
                    })
                  }
                })
                item1.children = children
              }
              pushMenu(asyncRoutes1, item1)
            }
          })
        })
      } else {
        asyncRoutes1 = []
      }
      accessedRoutes = asyncRoutes1 || []
      // console.log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
