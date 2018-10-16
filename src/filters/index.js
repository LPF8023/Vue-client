/*
* 自定义过滤器模块
* */

import Vue from 'vue'
import moment from 'moment'

// 定义全局的过滤器(处理时间)
Vue.filter('date-format', function (value, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(value).format(format)
})

