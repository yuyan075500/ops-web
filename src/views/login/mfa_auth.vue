<template>
  <div class="mfa-container">
    <el-form ref="formData" class="login-form" :model="formData" :rules="rules" validate-on-rule-change="false" label-position="left" label-width="110px">

      <div class="title-container">
        <h3 class="title">MFA认证</h3>
      </div>

      <el-form-item label="动态验证码：" prop="mfa.code">
        <el-input v-model="formData.mfa.code" placeholder="6位数字动态验证码" name="code" type="text" />
        <div class="help-block" style="color: #999; font-size: 12px">请在输入动态验证码，您还剩余：{{ seconds }}s，倒计时结束请重新登录</div>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-button type="primary" style="width: 90%;margin-bottom: 20px" @click="handleBack()">重新登录</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width: 90%;margin-bottom: 20px" :disabled="seconds === 0" @click="handleNext('formData')">登录</el-button>
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
      seconds: 300,
      redirect: undefined,
      formData: {
        mfa: {
          code: '',
          user_token_key: '',
          mfa_secret: ''
        }
      },
      rules: {
        mfa: {
          code: [
            { required: true, message: '请输入6位数字动态验证码', trigger: 'change' }
          ]
        }
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
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
  },
  created() {
    // 获取用户密码认证完成后返回的Token，页面刷新后会丢失（不能刷新页面）
    this.formData.mfa.user_token_key = this.$route.params.user_token_key
  },
  methods: {
    /* 登录 */
    handleNext(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/mfa_login', this.formData.mfa).then((res) => {
            if (res.code === 0) {
              if (res.data.redirect_url) {
                window.location.href = res.data.redirect_url
              }
              this.$router.push({ path: this.redirect || '/' })
            }
          }).catch(() => {})
        } else {
          return false
        }
      })
    },

    /* 返回登录页 */
    handleBack() {
      this.$router.push({ path: this.redirect || '/login' })
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
