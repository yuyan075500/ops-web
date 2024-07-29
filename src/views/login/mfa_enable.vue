<template>
  <div class="mfa-container">
    <el-form ref="form" class="login-form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="left" label-width="110px">
      <div class="title-container">
        <h3 class="title">MFA认证绑定</h3>
        <h5 class="note">请使用Google身份验证器扫描下方二维码，获取6位数字验证码</h5>
      </div>

      <div class="block" style="text-align: center;margin-bottom: 25px">
        <el-image :src="src" style="width: 200px; height: 200px" />
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
          <el-button type="primary" style="width: 90%;margin-bottom: 20px" :disabled="seconds === 0" @click="handleLogin">登录</el-button>
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
import { getGoogleQrcode } from '@/api/user'

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
    const time = setInterval(() => {
      this.seconds--
      if (this.seconds <= 0) {
        clearInterval(time)
      }
    }, 1000)
    window.addEventListener('keydown', this.handleKeydown)
  },
  created() {
    // 获取MFA二维码
    this.getQrcode()
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    /* 获取MFA二维码 */
    getQrcode() {
      getGoogleQrcode({ token: this.form.token }).then((res) => {
        this.src = 'data:image/jpg;base64,' + res.qrcode
      })
    },

    /* 登录 */
    handleNext() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/mfa_auth', this.form).then((res) => {
            if (res.code === 0) {
              this.$router.push({ path: this.redirect || '/' })
            }
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
    height: 550px;
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
    .note {
      font-size: 14px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
