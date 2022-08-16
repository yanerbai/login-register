import Vue from 'vue'
import App from './App.vue'
import router from "./router/index.js"
import store from './store'

import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(Message)


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
