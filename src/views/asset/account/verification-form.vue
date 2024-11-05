<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%">
    <el-form-item label="验证方式：" prop="validate_type">
      <el-radio-group v-model="form.validate_type" @input="handleChange">
        <el-radio :label="1" class="white-radio">短信验证码</el-radio>
        <el-radio :label="2" class="white-radio">MFA验证码</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="验证码：" prop="code">
      <el-input v-model="form.code" autocomplete="off" placeholder="6位验证码" clearable style="width: 150px" />
      <el-button type="info" style="margin-left: 15px" :disabled="canClick" @click="getSmSCode()">{{ verifyCode }}</el-button>
      <div class="help-block" style="color: #999; font-size: 12px">认证成功后可在10分钟内获取任意密码</div>
    </el-form-item>
    <el-form-item>
      <div>
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="handleSubmit">确 定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { Message } from 'element-ui'
import { getCode } from '@/api/asset/account'

export default {
  name: 'SmsForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          validate_type: 1,
          code: ''
        }
      }
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      verifyCode: '获取验证码',
      totalTime: 60,
      canClick: false,
      clock: null,
      rules: {
        code: [
          { required: true, message: '请输入短信验证码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {

    /* 获取短信验证码 */
    getSmSCode() {
      getCode().then((res) => {
        if (this.canClick) return
        this.canClick = true
        this.verifyCode = this.totalTime + 's后可重新发送'
        this.clock = setInterval(() => {
          this.totalTime--
          this.verifyCode = this.totalTime + 's后可重新发送'
          if (this.totalTime < 0) {
            clearInterval(this.clock)
            this.totalTime = 60
            this.verifyCode = '获取验证码'
            this.canClick = false
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
    },

    /* 单点按钮变化 */
    handleChange(val) {
      this.canClick = val !== 1
    },

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('submit', this.form)
      })
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
