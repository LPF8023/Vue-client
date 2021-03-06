import Vue from 'vue'
import {Button} from 'mint-ui'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import router from './router'
import store from './store'
import TopHeader from './components/TopHeader/TopHeader.vue'
import CartControl from './components/CartControl/CartControl'
import Split from './components/Split/Split'

import 'swiper/dist/css/swiper.min.css'
import './mock/mockServer'
import './filters'
import loading from './common/imgs/loaing.gif'


// 注册全局组件
Vue.component('TopHeader', TopHeader)
Vue.component('CartControl', CartControl)
Vue.component('Split', Split)
Vue.component(Button.name, Button)  //mt-button

Vue.use(VueLazyload, {  // 内部添加一个全局指令: lazy
  loading,
})

/* eslint-disable no-new */
new Vue({
  el: '#app',

  /* components: { App },
   template: '<App/>'
   */
  /*render: function (createElement) {  // 函数返回的标签会被渲染到el中
    return createElement(App)   // '<App/>'
  }*/
  render: h => h(App),

  router,
  store,
})
