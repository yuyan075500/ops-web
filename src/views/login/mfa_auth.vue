<template>
  <div class="mfa-container">
    <el-form ref="form" class="login-form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="left" label-width="110px">

      <div class="title-container">
        <h3 class="title">MFA认证</h3>
      </div>

      <el-form-item label="动态验证码：" prop="code">
        <el-input v-model="form.code" placeholder="6位数字动态验证码" name="code" type="text" />
        <div class="help-block" style="color: #999; font-size: 12px">请在输入动态验证码，还剩余：{{ seconds }}s，倒计时结束请重新登录</div>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-button type="primary" style="width: 90%;margin-bottom: 20px" @click="handleBack">重新登录</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width: 90%;margin-bottom: 20px" :disabled="seconds === 0" @click="handleNext">登录</el-button>
        </el-col>
      </el-row>

      <el-alert
        type="warning"
        show-icon
        :closable="false"
      >
        <template slot="title">
          <div class="iconSize">请勿刷新页面，当页面刷新后需要返回登录页重新对账号进行认证</div>
        </template>
      </el-alert>
    </el-form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      src: '',
      seconds: 120,
      redirect: undefined,
      form: {
        code: '',
        token: '',
        username: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入6位数字动态验证码', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        this.form.token = this.$route.params.token
        this.form.username = this.$route.params.username
      },
      immediate: true
    }
  },
  mounted() {
    /* 执行倒计时 */
    const times = setInterval(() => {
      this.seconds--
      if (this.seconds <= 0) {
        clearInterval(times)
      }
    }, 1000)

    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    /* 登录 */
    handleNext() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 合并URL中的query参数（主要是SSO客户端的请求参数同样需要发送到后端）
          const newForm = {
            ...this.form,
            ...this.$route.query
          }

          this.$store.dispatch('user/mfa_auth', newForm).then((res) => {
            // redirect_uri表示SSO客户端在进行单点登录认证，直接跳转至客户回调地址
            if (res.redirect_uri) {
              window.location.href = res.redirect_uri
            }

            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {})
        } else {
          return false
        }
      })
    },

    /* 回车事件 */
    handleKeydown(event) {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.handleNext()
      }
    },

    /* 返回登录页 */
    handleBack() {
      this.$router.push({ path: this.redirect || '/login', query: this.$route.query })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.mfa-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 500px;
    height: 300px;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
}
</style>
