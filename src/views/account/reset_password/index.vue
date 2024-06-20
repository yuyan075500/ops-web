<template>
  <div class="reset-password-container">
    <el-form ref="form" class="login-form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="left" label-width="110px">
      <div class="title-container">
        <h3 class="title">密码自助修改</h3>
      </div>

      <el-form-item label="用户名：" prop="username">
        <el-input v-model="form.username" placeholder="请输入登录用户名" name="username" type="text" />
      </el-form-item>

      <el-form-item label="手机号：" prop="phone_number">
        <el-input v-model="form.phone_number" placeholder="请输入绑定手机号" name="phone_number" type="text" />
      </el-form-item>
      <el-form-item label="校验码：" prop="code">
        <el-input v-model="form.code" placeholder="6位校验码" name="code" type="text" style="width: 100px" />
        <el-button type="info" style="margin-left: 15px" :disabled="isActive" @click="handleVerificationCode('form')">{{ buttonText }}</el-button>
      </el-form-item>

      <el-form-item label="新密码：" prop="password">
        <el-input v-model="form.password" show-password placeholder="请输入新密码" name="password" type="password" />
      </el-form-item>
      <el-form-item label="重复新密码：" prop="re_password">
        <el-input v-model="form.re_password" show-password placeholder="请重复输入新密码" name="re_password" type="password" />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="isValidate('form')">{{ value }}</el-button>

      <el-alert
        type="warning"
        show-icon
        :closable="false"
      >
        <template slot="title">
          <div class="iconSize">密码复杂度要求如下：</div>
          <div class="iconSize">1、长度不少于10位</div>
          <div class="iconSize">2、必须包含大小写字母、数字和特殊符号，且每种类型字符的长度不小于2</div>
        </template>
      </el-alert>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getVerificationCode, resetPasswordSelf } from '@/api/user/user'

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      buttonText: '获取校验码',
      totalTime: 60,
      isActive: false,
      loading: false,
      value: '提 交',
      form: {
        username: '',
        phone_number: '',
        code: '',
        password: '',
        re_password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        phone_number: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: validatePhone, trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入校验码', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'change' }
        ],
        re_password: [
          { required: true, message: '请重复输入新密码', trigger: 'change' },
          { validator: checkPassword, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    /* 表单校验 */
    isValidate(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.value = '修改中'
          this.loading = true
          this.handleSubmit()
        } else {
          return false
        }
      })
    },

    /* 获取短信校验码 */
    handleVerificationCode(formData) {
      // 对用户名校验（必填）
      this.$refs[formData].validateField(['username'], async(valid) => {
        if (valid) {
          return false
        } else {
          // 对手机号校验（必填）
          this.$refs[formData].validateField(['phone_number'], async(valid) => {
            if (valid) {
              return false
            } else {
              // 将当前输入的校验码清空
              this.form.code = ''
              // 获取新的校验码
              getVerificationCode(this.form).then((res) => {
                // 禁用按钮
                this.isActive = true
                // 更改按钮提示
                this.buttonText = this.totalTime + 's后可重新发送'
                // 执行倒计时
                const clock = window.setInterval(() => {
                  this.totalTime--
                  this.buttonText = this.totalTime + 's后可重新发送'
                  if (this.totalTime < 0) {
                    window.clearInterval(clock)
                    this.totalTime = 60
                    this.buttonText = '重新获取验证码'
                    this.isActive = false
                  }
                }, 1000)
                if (res.code === 0) {
                  Message({
                    message: res.msg,
                    type: 'success',
                    duration: 1000
                  })
                }
              })
            }
          })
        }
      })
    },

    /* 表单提交 */
    handleSubmit() {
      resetPasswordSelf(this.form).then((res) => {
        if (res.code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 5000,
            showClose: true
          })
          this.value = '提 交'
          this.loading = false
          this.form = {
            username: '',
            phone_number: '',
            code: '',
            password: '',
            re_password: ''
          }
          // 清空校验规则
          this.$refs.form.resetFields()
        }
      }, () => {
        this.value = '提 交'
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.reset-password-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;

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
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
    }
  }
}
</style>
