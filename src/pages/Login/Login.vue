<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: isMsgLogin}" @click="isMsgLogin=true">短信登录</a>
          <a href="javascript:;" :class="{on: !isMsgLogin}" @click="isMsgLogin=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on: isMsgLogin}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!isRightPhone || resetTime>0" class="get_verification"
                      :class="{right_phone_number: isRightPhone}" @click.prevent="sendCode">
                {{resetTime > 0 ? `已发送(${resetTime})s` : '获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !isMsgLogin}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input :type="isShowPwd ? 'text' : 'password'" maxlength="8" placeholder="密码" v-model="pwd">
                <div class="switch_button" @click="isShowPwd = !isShowPwd" :class="isShowPwd ? 'on' : 'off'">
                  <div class="switch_circle" :class="{right: isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd ? 'pwd' : '...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha"
                     ref="captcha" @click="updateCaptcha">
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
  </section>
</template>
<script>
  import {Toast, MessageBox} from 'mint-ui'
  import {reqPwdLogin, reqSendCode, reqSmsLogin} from '../../api'

  export default {
    data() {
      return {
        isMsgLogin: true, // true为短信登录, false为密码登录
        phone: '', //  手机号码
        code: '', // 短信验证码
        name: '', // 用户名
        pwd: '',  // 用户密码
        captcha: '',  // 图片验证码
        resetTime: 0, // 倒计时剩余的时间
        isShowPwd: false, // 是否显示密码
      }
    },

    computed: {
      isRightPhone () {
        const reg = /^1\d{10}$/ //检验手机号是否符合的正则
         return reg.test(this.phone)
      }
    },

    methods: {
      // 发送验证码
      async sendCode () {
        // 启动定时器
        this.resetTime = 30
        const intervalId = setInterval(() => {
          this.resetTime--
          if(this.resetTime === 0 ){
            clearInterval(intervalId)
          }
        }, 1000)

        // 发送短信验证码：成功或失败
        const result = await reqSendCode(this.phone)
        if(result.code === 0){
          // 成功提示信息：验证码已发送
          Toast('验证码已发送')
        } else {
          // 失败提示信息：result.msg
          MessageBox.alert(result.msg).then(action => {
            console.log('点击确定')
          })
        }
      },

      //更新图形验证码
      updateCaptcha () {
        // 告诉浏览器一个新的url，浏览器就会自动发送请求
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time=' + Date.now()

      },

      // 请求登录
      async login () {

        let result
        //  进行前台表单验证
        if(this.isMsgLogin){  // 短信登录
          const {phone, code} = this

          if(!this.isRightPhone){  //手机号不正确
            return MessageBox.alert('请输入正确的手机号')
          } else if(!/^\d{6}$/.test(code)){ //验证码不正确
            return MessageBox.alert('请输入正确的验证码')
          }
          // 发送登录请求
          result = await reqSmsLogin(phone, code)

        } else {  // 密码登录
          const {name, pwd, captcha} = this
          if(!name){  //用户名不正确
            return MessageBox.alert('请输入正确的用户名')
          } else if(!pwd){  //用户密码不正确
            return MessageBox.alert('请输入正确的用户密码')
          } else if(!/^.{4}$/.test(captcha)){  //图片验证码不正确
            return MessageBox.alert('请输入正确的验证码')
          }

          // 发送登录的请求
          result = await reqPwdLogin({name, pwd, captcha})
        }

        // 请求结束后，停止倒计时
        this.resetTime = 0
        // 更新验证码
        this.updateCaptcha()

        //根据请求的结果进行处理
        if(result.code === 0){  // 成功
          const user = result.data
          // 将user保存到state
          this.$store.dispatch('saveUser', user)
          // 跳转到个人中心
          this.$router.replace('/profile')
        } else {
          MessageBox.alert(result.msg)
        }

      }
    }

  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone_number
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                   transform translateX(27px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
