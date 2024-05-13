<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%" size="small">
    <el-form-item label="分组名称：" prop="name">
      <el-input v-model="form.name" autocomplete="off" clearable />
    </el-form-item>
    <el-form-item label="角色分组：" prop="is_role_group">
      <el-switch
        v-model="form.is_role_group"
        active-text="是"
        inactive-text="否"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
      <div class="help-block" style="color: #999; font-size: 12px">仅角色分组支持角色权限分配，创建后不允许修改</div>
    </el-form-item>
    <el-form-item v-if="form.is_role_group == true" label="分组用户：">
      <el-transfer
        v-model="form.users"
        style="text-align: left;display: inline-block"
        filterable
        filter-placeholder="请输入用户姓名"
        :titles="['可选用户', '已选用户']"
        :button-texts="['移除', '加入']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :data="userList"
      />
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
  name: 'GroupAddForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          name: '',
          is_role_group: false,
          users: [] // 已选用户列表
        }
      }
    },
    loading: {
      type: Boolean
    },
    // 可选用户列表
    groupList: {
      type: Array,
      default() {
        return {}
      }
    }

  },
  data() {
    return {
      users: '',
      rules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'change' }
        ],
        is_role_group: [
          { required: true, message: '请选择是否为角色分组', trigger: 'change' }
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
