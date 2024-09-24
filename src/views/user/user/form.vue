<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%" size="small">
    <el-row>
      <el-col :span="12">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="form.username" autocomplete="off" :disabled="form.id !== undefined" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="form.name" autocomplete="off" :disabled="form.id !== undefined" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="邮箱地址：" prop="email">
          <el-input v-model="form.email" autocomplete="off" clearable />
          <div class="help-block" style="color: #999; font-size: 12px">非本地用户不支持更改个人信息</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号：" prop="phone_number">
          <el-input v-model.number="form.phone_number" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item v-if="form.id === undefined" label="用户密码：" prop="password">
          <el-input v-model="form.password" type="password" show-password autocomplete="off" clearable />
          <div class="help-block" style="color: #999; font-size: 12px"><el-link :underline="false" type="primary" @click="handleGeneratePassword">点击生成随机密码</el-link></div>
        </el-form-item>
      </el-col>
    </el-row>
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
  name: 'UserForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          name: '',
          username: '',
          phone_number: '',
          email: '',
          password: ''
        }
      }
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    // 手机号校验规则
    const validatePhone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        phone_number: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
          { validator: validatePhone, trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
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
    },

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }

        // 获取出表单中的数据
        const { id, username, password, phone_number, email, name, is_active } = this.form
        const data = {
          'id': id,
          'username': username,
          'password': password,
          'phone_number': phone_number.toString(),
          'email': email,
          'name': name,
          'is_active': is_active
        }

        // 获取表单数据

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
