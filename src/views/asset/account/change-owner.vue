<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%">
    <el-form-item label="用户" prop="owner_user_id">
      <el-select
        v-model="form.owner_user_id"
        placeholder="输入用户姓名自动查找"
        filterable
        remote
        default-first-option
        style="width:100%"
        :remote-method="handleSearch"
        :loading="loadingSearch"
      >
        <el-option v-for="item in tagOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <div class="help-block" style="color: #999; font-size: 12px">可输入用户姓名查找对应的用户</div>
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
  name: 'ChangeOwnerForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          owner_user_id: ''
        }
      }
    },
    users: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      loadingSearch: false,
      tagOptions: [],
      rules: {
        owner_user_id: [
          { required: true, message: '请选择账号所有者', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const currentUser = this.users.find(user => user.key === this.form.owner_user_id)
    if (currentUser) {
      this.tagOptions = [currentUser]
    }
  },
  methods: {

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('submit', this.form)
      })
    },

    /* 用户过滤 */
    handleSearch(query) {
      if (query !== '') {
        this.loadingSearch = true
        setTimeout(() => {
          this.loadingSearch = false
          this.tagOptions = this.users.filter(item => {
            return item.label.includes(query) || item.key.toString().includes(query)
          })
        }, 200)
      } else {
        this.tagOptions = []
      }
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
