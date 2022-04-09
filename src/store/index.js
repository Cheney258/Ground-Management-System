import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user/user'
import permission from './modules/permission'
import game from './modules/user/game'
import venue from './modules/user/venue'
import equip from './modules/user/equip'
import adminUser from './modules/admin/user'
import adminGame from './modules/admin/game'
import adminEquip from './modules/admin/equip'
import adminVenue from './modules/admin/venue'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    game,
    venue,
    equip,
    adminUser,
    adminGame,
    adminEquip,
    adminVenue
  },
  getters
})

export default store
