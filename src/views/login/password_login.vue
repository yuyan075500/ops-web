<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" auto-complete="on" label-position="left">
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="form.username"
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
          v-model="form.password"
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
    </el-form>
    <!-- 忘记密码和帮助链接 -->
    <div class="helper-links">
      <a class="help-link" href="https://www.idsphere.cn" target="_blank">帮助中心</a>
      <a class="forgot-password" :href="forgotPassword" target="_blank">忘记密码？</a>
    </div>
    <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="handleLogin">登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'PasswordLoginForm',
  props: {
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      // 重置密码链接
      forgotPassword: window.location.protocol + '//' + window.location.hostname + '/reset_password',
      // 用户名密码登录表单数据
      form: {
        username: '',
        password: ''
      },
      // 控制密码表单显示与隐藏
      passwordType: 'password',
      // 用户名密码登录表单验证规则
      rules: {
        username: [{ required: true, trigger: 'change', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'change', message: '请输入用户密码' }]
      }
    }
  },
  methods: {

    /* 提交表单 */
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('submit', this.form)
      })
    },

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
    }
  }
}
</script>
<style lang="scss">
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #fff;
      height: 47px;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: #283443 !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {

  // 表单样式
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 15px
  }

  // 表单左侧图标样式
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  // 密码表单显示与隐藏图标样式
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  // 忘记密码和帮助链接样式
  .helper-links {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    a {
      font-size: 14px;
      color: $dark_gray;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: $light_gray;
      }
    }

    .help-link {
      margin-left: 10px;
      text-align: left;
    }

    .forgot-password {
      text-align: right;
    }
  }
}
</style>
