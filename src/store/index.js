import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    msg: '数据获取到了',
    userInfo: 111
  },
  mutations: {
    setUserInfo(state, num){
      state.userInfo = num.userInfo
      console.log(state.userInfo)
    },
    sss(){
      this.commit('setUserInfo',{userInfo: 10})
    }
  }
})

export default store
