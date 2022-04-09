import { asyncRoutes, constantRoutes } from '@/router'

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

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      // console.log('111')
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // console.log(tmp.meta.role)
      try {
        if (tmp.meta) {
          if (tmp.meta.role && tmp.meta.role == roles) {
            res.push(tmp)
          }
        }
      } catch (error) {
        console.log(error)
      }

      // console.log(res)
      return res
    }
    // console.log(res)
    // return res
  })

  // console.log(res)
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(async(resolve) => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // if (roles.includes('admin')) {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)

      // }
      // console.log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      await resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
