import * as api from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'



const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    roles: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, username) => {
    state.name = username
  },
  SET_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_MYAPPLY: (state, myapply) => {
    state.myapply = myapply
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_STATUS: (state,status) => {
    state.status = status
  },
  SET_AVATAR: (state,avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async login({ commit, state }, userInfo) {
    // console.log(userInfo)
    const { username, password, role } = userInfo
    return await new Promise((resolve, reject) => {
      api.login({ username: username.trim(), password: password, role: role }).then(response => {
        commit('SET_TOKEN', response.token)
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.getInfo(state.token).then(response => {
        const data = response.data
        // console.log(data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const username = data.name
        commit('SET_INFO', data)
        commit('SET_NAME', username)
        commit('SET_STATUS',data.status)
        commit('SET_AVATAR', data.avatar)
        const roles = []
        if (response.data.uid == 1) {
          roles.push('editor')
        } else {
          roles.push('admin')
        }
        
        commit('SET_UID', response.data.uid)
        commit('SET_ROLES', roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // ??????????????????
  async uploadAvatar({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqUploadAvatar(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // ????????????
  async getAnnouncement({commit}){
    return await new Promise((resolve,reject) => {
      api.reqGetAnnouncement().then(res => {
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  },

  // ??????????????????
  async updateInfo({ commit }, userInfo) {
    const result = await api.reqUpdateInfo(userInfo)
    if (result.code == 200) {
      // ?????????????????????
      return result
    } else {
      // ?????????????????????
      return result
    }
  },

  // ????????????
  async subMessage({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqSubMessage(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // ??????????????????
  async getMessageList({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqGetMessageList(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // ????????????
  async deleteMessage({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqDeletesMessage(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // ??????????????????
  async readedMessage({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqReadedMessage(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // ?????????????????????????????????
  async getNoReadedMessage({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqGetNoReadedNum(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // ??????????????????
  async getNoReadedAnnoun({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqGetNoReadedAnnoun(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // ????????????
  async readedAnnouncement({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqReadedAnnouncement(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // ????????????????????????
  async getIndexImg(){
    return await new Promise((resolve,reject)=>{
      api.reqGetIndexImg().then(res => {
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

