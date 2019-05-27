import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
// 获取组件的方法
const _import = require('./router/_import_' + process.env.NODE_ENV)
import axios from 'axios'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login']
// 用来获取后台拿到的路由
var getRouter
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // 不加这个判断，路由会陷入死循环
  if (!getRouter) {
    if (!getObjArr('router')) {
      axios.get('').then(res => {
        // getRouter = res.data.data.router//后台拿到路由
        getRouter = [
          {
            'path': '/example',
            'component': 'Layout',
            'redirect': '/example/table',
            'name': 'Example',
            'meta': { 'title': 'Example', 'icon': 'example' },
            'children': [
              {
                'path': 'table',
                'name': 'Table',
                'component': 'table/index',
                'meta': { 'title': 'Table', 'icon': 'table' }
              },
              {
                'path': 'tree',
                'name': 'Tree',
                'component': 'tree/index',
                'meta': { 'title': 'Tree', 'icon': 'tree' }
              },
              {
                'path': 'news',
                'name': 'news',
                'component': 'news/index',
                'meta': { 'title': 'News', 'icon': 'form' }
              }
            ]
          },
          {
            'path': '/account',
            'component': 'Layout',
            'redirect': '/account/unit',
            'alwaysShow': 'true',
            'meta': {
              'title': '测试',
              'icon': 'dashboard'
            },
            'children': [
              {
                'path': 'unit',
                'component': 'account/unit',
                'meta': {
                  'title': '测试菜单',
                  'icon': 'dashboard'
                }
              }
            ]
          },
          {
            'path': '/form',
            'component': 'Layout',
            'redirect': '/form/index',
            'children': [
              {
                'path': 'index',
                'name': 'Form',
                'component': 'form/index',
                'meta': { 'title': 'Form', 'icon': 'form' }
              }
            ]
          },
          {
            'path': '/news',
            'component': 'Layout',
            'redirect': '/news/index',
            'children': [
              {
                'path': 'index',
                'name': 'news',
                'component': 'news/index',
                'meta': { 'title': 'News', 'icon': 'form' }
              }
            ]
          }
          // {
          //   'path': '/nested',
          //   'component': 'Layout',
          //   'redirect': '/nested/menu1',
          //   'name': 'Nested',
          //   'meta': {
          //     'title': 'Nested',
          //     'icon': 'nested'
          //   },
          //   'children': [
          //     {
          //       'path': 'menu1',
          //       'component': 'nested/menu1/index',
          //       'name': 'Menu1',
          //       'meta': { 'title': 'Menu1' },
          //       'children': [
          //         {
          //           'path': 'menu1-1',
          //           'component': 'nested/menu1/menu1-1/index',
          //           'name': 'Menu1-1',
          //           'meta': { 'title': 'Menu1-1' }
          //         },
          //         {
          //           'path': 'menu1-2',
          //           'component':'nested/menu1/menu1-2/index',
          //           'name': 'Menu1-2',
          //           'meta': { 'title': 'Menu1-2' },
          //           'children': [
          //             {
          //               'path': 'menu1-2-1',
          //               'component':'nested/menu1/menu1-2/menu1-2-1/index',
          //               'name': 'Menu1-2-1',
          //               'meta': { 'title': 'Menu1-2-1' }
          //             },
          //             {
          //               'path': 'menu1-2-2',
          //               'component': 'nested/menu1/menu1-2/menu1-2-2/index',
          //               'name': 'Menu1-2-2',
          //               'meta': { 'title': 'Menu1-2-2' }
          //             }
          //           ]
          //         },
          //         {
          //           'path': 'menu1-3',
          //           'component':'nested/menu1/menu1-3/index',
          //           'name': 'Menu1-3',
          //           'meta': { 'title': 'Menu1-3' }
          //         }
          //       ]
          //     },
          //     {
          //       'path': 'menu2',
          //       'component': 'nested/menu2/index',
          //       'meta': { 'title': 'menu2' }
          //     }
          //   ]
          // }
        ]
        getRouter.push({ path: '*', redirect: '/404', hidden: true })
        // 存储路由到localStorage
        saveObjArr('router', getRouter)
        // 执行路由跳转方法
        routerGo(to, next)
      })
    } else {
      // 从localStorage拿到了路由
      getRouter = getObjArr('router')
      routerGo(to, next)
    }
  } else {
    next()
  }

  // 设置页面title
  document.title = getPageTitle(to.meta.title)

  // 确认是否登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录redirect到Home
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
function routerGo(to, next) {
  // 过滤路由
  getRouter = filterAsyncRouter(getRouter)
  // 动态添加路由
  router.addRoutes(getRouter)
  // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
  global.antRouter = getRouter
  next({ ...to, replace: true })
}
// sessionStorage 存储数组对象的方法
function saveObjArr(name, data) {
  // localStorage.setItem(name, JSON.stringify(data))
  sessionStorage.setItem(name, JSON.stringify(data))
}
// sessionStorage 获取数组对象的方法
function getObjArr(name) {
  return JSON.parse(window.sessionStorage.getItem(name))
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
