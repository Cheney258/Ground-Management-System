
import * as api from '@/api'

const state = {}

const mutations = {}

const actions ={
  
  // 获取全部用户
  async getAllUsers({commit}){
    return await new Promise((resolve,reject) => {
      api.reqGetAllUsers().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 更改用户
  async updateRoleAndStatus({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqUpdateRoleAndStatus(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取全部公告
  async getAllAnnouncement({commit}){
    return await new Promise((resolve,reject) => {
      api.reqGetAllAnnouncement().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 删除公告
  async deleteAnnoun({commit},aid){
    return await new Promise((resolve,reject) => {
      api.reqDeleteAnnounce({aid:aid}).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 添加公告
  async addAnnouncement({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqAddAnnouncement(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 修改公告
  async updateAnnouncement({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqUpdateAnnouncement(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 发布或撤销公告
  async uploadOrUndoAnnounce({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqUploadOrUndoAnnounce(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取全部留言数据
  async getAllMessage(){
    return await new Promise((resolve,reject)=>{
      api.reqGetAllMessage().then(res => {
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  },

  // 回复留言
  async replyMessage({commit},data){
    return await new Promise((resolve,reject)=> {
      api.reqReplyMessage(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 删除留言
  async deleteMessage({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqDeletesMessage(data).then(res =>{
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 上传首页图片
  async uploadActivityImg({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqUploadActivityImg(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const getters ={}

export default  {
  state,
  actions,
  mutations,
  getters
}
