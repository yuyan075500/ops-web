<template>
  <div class="mfa-container">
    <el-form ref="form" class="login-form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="left" label-width="110px">
      <div class="title-container">
        <h3 class="title">MFA认证绑定</h3>
        <h5 class="note">
          请使用<!--
          --><a href="https://baike.baidu.com/item/Google%20Authenticator/58350750" target="_blank" rel="noopener noreferrer">Google身份验器APP</a>、<!--
          --><a href="https://promotion.aliyun.com/ntms/mobile.html" target="_blank" rel="noopener noreferrer">阿里云APP</a><!--
          -->或<a href="https://www.huaweicloud.com/mobile_app/hwapp.html" target="_blank" rel="noopener noreferrer">华为云APP</a>
          扫描下方二维码
        </h5>
      </div>

      <div class="block" style="text-align: center;margin-bottom: 25px">
        <el-image :src="src" style="width: 200px; height: 200px" />
      </div>

      <el-form-item label="动态验证码：" prop="code">
        <el-input v-model="form.code" placeholder="验证码" name="code" type="text" />
        <div class="help-block" style="color: #999; font-size: 12px">请输入6位数字动态验证码，还剩余：{{ seconds }}s，倒计时结束请重新登录</div>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-button type="primary" style="width: 90%;margin-bottom: 20px" @click="handleBack">返回重新登录</el-button>
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
          <div class="iconSize">请勿刷新页面，否则需要返回登录页重新认证后操作</div>
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
          // 合并URL中的query参数（主要是SSO客户端的请求参数同样需要发送到后端）
          const newForm = {
            ...this.form,
            ...this.$route.query
          }

          this.$store.dispatch('user/mfa_auth', newForm).then((res) => {
            // redirect_uri表示SSO客户端在进行单点登录认证，直接跳转至客户回调地址
            if (res.redirect_uri) {
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

      a {
        color: $light_gray;
        text-decoration: none;

        &:hover {
          color: #0056b3; /* 鼠标悬停时的颜色 */
        }
      }
    }
  }
}
</style>
