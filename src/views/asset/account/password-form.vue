<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%;padding-top: 20px;">
    <el-form-item label="新密码" prop="password">
      <el-input v-model="form.password" type="password" show-password autocomplete="off" clearable />
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
export default {
  name: 'SetPasswordForm',
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
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
      form: {
        id: '',
        password: '',
        re_password: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入用户密码', trigger: 'change' }
        ],
        re_password: [
          { required: true, message: '请重复输入新密码', trigger: 'change' },
          { validator: checkPassword, trigger: 'change' }
        ]
      }
    }
  },
  methods: {

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.form.id = this.user.id
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
