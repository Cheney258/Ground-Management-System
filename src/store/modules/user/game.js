import { reqAddGame,reqGetGameApply,reqGetAllGameInfo } from "@/api"

const state = {}

const actions = {
  // 新增活动申请
  async addgame({ commit }, gameInfo) {
    // console.log(gameInfo)
    const result = await reqAddGame(gameInfo)
    return result
  },

  // 获取用户的申请记录
  async getGameApply({ commit }, uid) {
    const result = await reqGetGameApply({ uid: uid })
    if (result.code === 200) {
      return result.data
    } else {
      return result.message
    }
  },

  // 获取全部比赛类型的赛事
  async getGameList({commit}){
    return await new Promise((resolve,reject) => {
      reqGetAllGameInfo().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {}

const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}