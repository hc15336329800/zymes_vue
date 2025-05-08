import Layout from '@/layout'

const structureRouter = [
  {
    path: '/structure',
    component: Layout,
    name: 'structure',
    redirect: 'noRedirect',
    meta: {
      title: '组织管理',
      icon: 'user',
      number: 11
    },
    children: [
      {
        path: '/structure/user',
        component: () =>
          import(
            /* webpackChunkName: "structure" */ '../../views/structure/userList.vue'
            ),
        name: 'user',
        meta: {title: '用户管理', icon: ''}
      },
      // 用户管理
      {
        path: '/structure/dept',
        component: () =>
          import(
            /* webpackChunkName: "structure" */ '../../views/structure/deptList.vue'
            ),
        name: 'dept',
        meta: {title: '部门管理', icon: ''}
      },
      {
        path: '/structure/menu',
        component: () =>
          import(
            /* webpackChunkName: "structure" */ '../../views/structure/menuList.vue'
            ),
        name: 'menu',
        meta: {title: '菜单管理', icon: ''}
      },
      {
        path: '/structure/role',
        component: () =>
          import(
            /* webpackChunkName: "structure" */ '../../views/structure/roleList.vue'
            ),
        name: 'role',
        meta: {title: '角色管理', icon: ''}
      }
    ]
  }
]
export default structureRouter
