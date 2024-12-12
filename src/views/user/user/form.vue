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
          <div class="help-block" style="color: #999; font-size: 12px">仅本地用户支持更改个人信息</div>
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
          <div class="help-block" style="color: #999; font-size: 12px"><el-link :underline="false" type="primary" style="font-size: 12px" @click="handleGeneratePassword">点击生成随机密码</el-link></div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="有效期至：">
          <el-date-picker
            v-model="form.password_expired_at"
            align="right"
            type="datetime"
            size="small"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            style="width: 100%;"
          />
          <div class="help-block" style="color: #999; font-size: 12px">如果日期为空则表示永不过期</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="企业微信ID" prop="ww_id">
          <el-input v-model="form.ww_id" autocomplete="off" clearable />
          <div class="help-block" style="color: #999; font-size: 12px">需要登录《<el-link :underline="false" type="primary" href="https://work.weixin.qq.com" target="_blank" style="font-size: 12px">企业微信管理后台</el-link>》，在通讯录中获取</div>
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
          password: '',
          ww_id: '',
          password_expired_at: null
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
      pickerOptions: {
        shortcuts: [
          {
            text: '30天后',
            onClick(picker) {
              const date = new Date()
              date.setDate(date.getDate() + 30)
              picker.$emit('pick', date)
            }
          },
          {
            text: '60天后',
            onClick(picker) {
              const date = new Date()
              date.setDate(date.getDate() + 60)
              picker.$emit('pick', date)
            }
          },
          {
            text: '90天后',
            onClick(picker) {
              const date = new Date()
              date.setDate(date.getDate() + 90)
              picker.$emit('pick', date)
            }
          },
          {
            text: '120天后',
            onClick(picker) {
              const date = new Date()
              date.setDate(date.getDate() + 120)
              picker.$emit('pick', date)
            }
          },
          {
            text: '180天后',
            onClick(picker) {
              const date = new Date()
              date.setDate(date.getDate() + 180)
              picker.$emit('pick', date)
            }
          }
        ]
      },
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
        const { id, username, password, phone_number, email, name, is_active, ww_id, password_expired_at } = this.form
        const data = {
          'id': id,
          'username': username,
          'password': password,
          'phone_number': phone_number.toString(),
          'email': email,
          'name': name,
          'ww_id': ww_id,
          'is_active': is_active,
          'password_expired_at': password_expired_at
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
