<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">信息化统一认证</h3>
      </div>

      <el-tabs v-model="active" :stretch="stretch">
        <el-tab-pane label="账号密码登录" name="username">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="handleLogin">登录</el-button>
        </el-tab-pane>
        <el-tab-pane label="钉钉扫码登录" name="qrcode" class="qrcode">
          <div id="qrcode" />
          <div class="tip-qrcode">
            扫描二维码登录，点击二维码可刷新
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tips"><span>2024 © Power By IT&运维 使用chrome获得最佳体验</span></div>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 指定默认登录方式
      active: 'username',
      // 用户名密码登录表单数据
      loginForm: {
        username: '',
        password: ''
      },
      // 钉钉扫码认证相关参数
      dingtalk: {
        redirect_uri: window.location.protocol + '//' + window.location.hostname + '/login' // 认证成功后的回调地址
      },
      // 用户名密码登录表单验证规则
      loginRules: {
        username: [{ required: true, trigger: 'change', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'change', message: '请输入用户密码' }]
      },
      // 控制el-tabs标签页宽度自适应
      stretch: true,
      // 控制登录按钮状态
      loading: false,
      // 控制密码表单显示与隐藏
      passwordType: 'password',
      // 登录成功后跳转的路径
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        // 获取登录成功后跳转的路径
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // 钉钉二维码初始化
    this.ddQrcodeinInit()
  },
  methods: {

    /* 密码显示与隐藏 */
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    /* 登录按钮 */
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          // 合并URL中的query参数（主要是SSO客户端的请求参数同样需要发送到后端）
          const newForm = {
            ...this.loginForm,
            ...this.$route.query
          }

          // 执行登录
          this.$store.dispatch('user/login', newForm).then((res) => {
            // redirect_uri表示SSO客户端在进行单点登录认证
            if (res.redirect_uri !== undefined) {
              // SAML认证
              if (newForm.SAMLRequest) {
                // 将授权HTML插入到当前页面的DOM中
                const div = document.createElement('div')
                div.innerHTML = res.redirect_uri // 这里后端返回的redirect_uri实际是授权HTML
                document.body.appendChild(div)
                // 获取表单（saml这个ID是后端定义好后返回的）
                const form = div.querySelector('#saml')
                // 提交表单
                if (form) {
                  form.submit()
                }
              } else {
                // CAS3.0和OAuth2.0认证
                window.location.href = res.redirect_uri
              }
            }

            // redirect表示启动了MFA认证，需要根据后端返回的redirect名称，跳转至不同的MFA认证页面
            if (res.redirect) {
              // 如果是MFA认证，则需要将SSO客户端请求参数传递到MFA认证页面
              this.$router.push({
                name: res.redirect,
                params: {
                  token: res.token,
                  username: this.loginForm.username
                },
                query: this.$route.query
              })
            } else {
              this.$router.push({ path: this.redirect || '/' })
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },

    /* 钉钉二维码始、扫码成功后的动作 */
    ddQrcodeinInit() {
      if (window.location.port !== '80' && window.location.port !== '443') {
        this.dingtalk.redirect_uri = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/login'
      }
      window.DTFrameLogin(
        // 二维码容器相关参数：绑定的容器id、宽度、高度
        {
          id: 'qrcode', // 二维码容器id
          width: 300, // 二维码容器宽度
          height: 240 // 二维码容器高度
        },
        {
          redirect_uri: encodeURIComponent(this.dingtalk.redirect_uri), // 回调地址，需要与开发者后台钉钉登录与分享的地址保持一致，必须进行encode处理
          client_id: process.env.VUE_APP_DINGTALK_CLIENT_ID, // 钉钉应用的client_id
          scope: 'openid', // 固定值
          response_type: 'code', // 固定值
          state: 'aops', // 固定值，认证成功后会原样返回
          prompt: 'consent' // 固定值
        },
        (loginResult) => {
          // 向钉钉认证成功后的动作
          const { redirectUrl } = loginResult
          window.location.href = redirectUrl
        },
        (errorMsg) => {
          // 登录失败的原因
          alert(`Login Error: ${errorMsg}`)
        }
      )
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.qrcode {
  text-align: center;
  background-color: white;

  .tip-qrcode {
    padding-bottom: 20px;
    font-size: 12.5px;
    margin-bottom: 20px;
  }
}

.login-container {

  .el-tabs__item.is-top{
    color:white
  }

  .el-tabs__item.is-active{
    color:#409EFF
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 15px
  }

  .login-form-switch {
    border: initial;
    background: initial;

    .el-form-item__label {
      color: white;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    text-align: center;
    color: #fff;
    margin-bottom: 10px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
