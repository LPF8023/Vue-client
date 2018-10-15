/*
包含n个用于直接更新状态数据方法的对象
 */

import Vue from 'vue'
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART
} from './mutation-types'

export default {

  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address
  },
  [RECEIVE_CATEGORYS] (state, {categorys}) {
    state.categorys = categorys
  },
  [RECEIVE_SHOPS] (state, {shops}) {
    state.shops = shops
  },
  [RECEIVE_USER] (state, {user}) {
    state.user = user
  },
  [RESET_USER] (state) {
    state.user = {}
  },
  [RECEIVE_GOODS] (state, {goods}) {
    state.goods = goods
  },
  [RECEIVE_RATINGS] (state, {ratings}) {
    state.ratings = ratings
  },
  [RECEIVE_INFO] (state, {info}) {
    state.info = info
  },

  [INCREMENT_FOOD_COUNT] (state, {food}) {
    if(food.count){
      food.count++
    } else {  // 第一次增加，没有count属性
      // 给food添加一个新属性count，值为1
      Vue.set(food, 'count', 1)
      // 将新的food添加到购物车中
      state.cartFoods.push(food)
    }
  },
  [DECREMENT_FOOD_COUNT] (state, {food}) {
    if(food.count){
      food.count--
      // 如果减到0，要将food从购物车中移除
      if(food.count===0){
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
    }
  },


  [CLEAR_CART] (state) {
    // 将购物车中所有food的数量重置为0
    state.cartFoods.forEach(food => food.count = 0)
    // 重置cartFoods
    state.cartFoods = []
  }

}

