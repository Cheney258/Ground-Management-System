import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [

  // 公共路由
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }

  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  // 管理端异步路由

  // 个人信息
  {
    path: '/permissions',
    component: Layout,
    redirect: '/permissions/users',
    meta: { title: '用户管理', role: 'admin' },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/admin/users/Users.vue'),
        meta: { title: '用户管理', role: 'admin' }
      },
      {
        path: 'myinfo',
        name: 'Myinfo',
        component: () => import('@/views/admin/users/MyInfo.vue'),
        meta: { title: '个人信息', role: 'admin' }
      }
    ]
  },

  // 活动管理
  {
    path: '/game',
    component: Layout,
    redirect: '/game/gameproje',
    meta: { title: '活动管理', role: 'admin' },
    children: [
      {
        path: 'gameproje',
        name: 'GameProje',
        component: () => import('@/views/admin/games/Game_project.vue'),
        meta: { title: '活动管理', role: 'admin' }
      },
      {
        path: 'gameaudit',
        name: 'GameAudit',
        component: () => import('@/views/admin/games/Game_audit.vue'),
        meta: { title: '活动申请审核', role: 'admin' }
      },
      // {
      //   path: 'referee',
      //   name: 'Referee',
      //   component: () => import('@/views/admin/games/Referee.vue'),
      //   meta: { title: '裁判管理', role: 'admin' }
      // }

    ]
  },

  // 场地管理
  {
    path: '/field',
    component: Layout,
    redirect: '/field/facilities',
    meta: { title: '场地管理', role: 'admin' },
    children: [
      // {
      //   path: 'facilities',
      //   name: 'FieldFacilities',
      //   meta: { title: '场地设施管理', role: 'admin' },
      //   component: () => import ('@/views/admin/Field/Field_facilities.vue')

      // },
      {
        path: 'info',
        name: 'FieldInfo',
        meta: { title: '场地信息管理', role: 'admin' },
        component: () => import ('@/views/admin/Field/Field_info.vue')
      },
      {
        path: 'fieldaudit',
        name: 'FieldAudit',
        meta: { title: '场地申请管理', role: 'admin' },
        component: () => import ('@/views/admin/Field/Field_Audit.vue')
      },
      {
        path: 'specialfield',
        name: 'SpecialField',
        meta: { title: '特殊场地信息管理', role: 'admin' },
        component: () => import ('@/views/admin/Field/Special_field.vue')
      }
    ]
  },

  // 器材管理
  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment/equip',
    meta: { title: '器材管理', role: 'admin' },
    children: [
      {
        path: 'equip',
        name: 'Equip',
        meta: { title: '器材信息管理', role: 'admin' },
        component: () => import ('@/views/admin/Equip/Equip.vue')
      },
      {
        path: 'rent',
        name: 'Rent',
        meta: { title: '借用申请管理', role: 'admin' },
        component: () => import ('@/views/admin/Equip/Rent.vue')
      },      
      {
        path: 'recycling',
        name: 'Recycling',
        meta: { title: '借用回收管理', role: 'admin' },
        component: () => import ('@/views/admin/Equip/Recycling.vue')
      },
      {
        path: 'damage',
        name: 'Damage',
        meta: { title: '损坏赔偿管理', role: 'admin' },
        component: () => import ('@/views/admin/Equip/Damage.vue')
      },
    ]
  },

  // 公告管理
  {
    path: '/announ',
    component: Layout,
    redirect: '/announ/announcement',
    meta: { title: '公告留言', role: 'admin' },
    children: [
      {
        path: 'announcement',
        name: 'Announcement',
        meta: { title: '公告管理', role: 'admin' },
        component: () => import('@/views/admin/Announ_Msg/Announcement')
      },
      {
        path: 'Message',
        name: 'Message',
        meta: { title: '留言管理', role: 'admin' },
        component: () => import('@/views/admin/Announ_Msg/Message')
      }
    ]
  },


// ------------------------------------------------------------//
// ------------------------- 用户端  ---------------------------//
// ------------------------------------------------------------//

  // 用户端异步请求路由
  // 用户信息
  {
    path: '/mine',
    component: Layout,
    redirect: '/mine/myinfo',
    name: 'Mine',
    meta: { title: '个人中心', icon: 'el-icon-s-help', role: 'editor' },
    children: [
      {
        path: 'myinfo',
        name: 'Myinfo',
        component: () => import('@/views/users/mine/myinfo'),
        meta: { title: '个人信息', icon: 'table', role: 'editor' }
      },
      
    ]
  },

  // 申请
  {
    path: '/apply',
    component: Layout,
    redirect: '/apply/game',
    meta: { title: '申请', icon: 'form', role: 'editor' },
    children: [
      {
        path: 'game',
        name: 'Game',
        component: () => import('@/views/users/apply/game'),
        meta: { title: '比赛申请', icon: 'form', role: 'editor' }
      },
      {
        path: 'field',
        name: 'Field',
        component: () => import('@/views/users/apply/field'),
        meta: { title: '场地申请', icon: 'form', role: 'editor' }
      },
      {
        path: 'equip',
        name: 'Equip',
        component: () => import('@/views/users/apply/equip'),
        meta: { title: '器材申请', icon: 'form', role: 'editor' }
      }
    ]
  },

  // 查询
  {
    path: '/query',
    component: Layout,
    redirect: '/query/gQuery',
    name: 'Query',
    meta: { title: '查询', icon: 'nested', role: 'editor' },
    children: [
      {
        path: 'myapply',
        name: 'MyApply',
        component: () => import('@/views/users/query/apply/myapply'),
        meta: { title: '申请记录', role: 'editor' }
      },
      {
        path: 'gQuery',
        component: () => import('@/views/users/query/gQuery'), // Parent router-view
        name: 'gQuery',
        meta: { title: '比赛查询', role: 'editor' }
      },
      {
        path: 'fQuery',
        component: () => import('@/views/users/query/fQuery'),
        name: 'fQuery',
        meta: { title: '场地查询', role: 'editor' }
      },
      {
        path: 'eQuery',
        component: () => import('@/views/users/query/eQuery'),
        name: 'eQuery',
        meta: { title: '器材查询', role: 'editor' }
      }
    ]
  },

  {
    path: '/announ',
    component: Layout,
    redirect: '/announcement',
    meta: { role: 'editor' },
    children: [{
      path: 'announcement',
      name: 'userAnnouncement',
      component: () => import('@/views/users/Announcement.vue'),
      meta: { title: '公告通知', icon: 'link', role: 'editor' }
    }]

  },

  {
    path: '/msg',
    component: Layout,
    redirect: '/message',
    meta: { role: 'editor' },
    children: [
      {
        path: 'message',
        name: 'UserMessage',
        component: () => import('@/views/users/message'),
        meta: { title: '留  言', icon: 'table', role: 'editor' }
      },
      
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
