import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)
//初始化时用localStorage.getItem('token'),这样子刷新页面就无需重新登录
const state = {
    token: localStorage.getItem('token'),
    username: '',
    password: '',
}

const mutations = {
    LOGIN: (state, data) => {
        state.token = data;
        localStorage.setItem('token', data);
    },
    LOGOUT: (state, data) => {
        state.token = data
        localStorage.removeItem('token')
    },
    USERNAME: (state, username) => {
        // 把用户名存起来
        state.username = username;
    },
    PASSWORD: (state, password) => {
        // 把用户密码存起来
        state.password = password;
    }
}

const actions = {
    UserLogin({ commit }, data) {
        commit('LOGIN', data)
    },
    UserLogout({ commit }) {
        commit('LOGOUT');
    },
    UserName({ commit }, username) {
        commit('USERNAME', username);
    },
    PassWord({ commit }, password) {
        commit('PASSWORD', password);
    }
}


export default new Vuex.Store({
    state,
    mutations,
    actions
});

