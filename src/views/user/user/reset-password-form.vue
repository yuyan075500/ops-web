<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" size="mini" style="width: 95%;padding-top: 20px;">
    <el-form-item label="新密码" prop="password">
      <el-input v-model="form.password" type="password" show-password autocomplete="off" clearable />
      <div class="help-block" style="color: #999; font-size: 12px"><el-link type="primary" @click="handleGeneratePassword">点击生成随机密码</el-link></div>
    </el-form-item>
    <el-form-item label="重复新密码" prop="re_password">
      <el-input v-model="form.re_password" type="password" show-password autocomplete="off" clearable />
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
import { generatePassword } from '@/utils/generate-password'

export default {
  name: 'ResetUserPasswordForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          password: '',
          re_password: ''
        }
      }
    },
    userId: {
      type: Number,
      default: NaN
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    const checkPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
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

    /* 生成随机密码 */
    handleGeneratePassword() {
      let str = ''
      while (str.length < 12 || !(/[a-z]/.test(str) && /[A-Z]/.test(str) && /[0-9]/.test(str) && /[^a-zA-Z0-9]/.test(str))) {
        str = generatePassword()
      }
      this.form.password = str
      this.form.re_password = str
    },

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        const data = {
          'id': this.userId,
          'password': this.form.password,
          're_password': this.form.re_password
        }
        this.$emit('submit', data)
      })
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
