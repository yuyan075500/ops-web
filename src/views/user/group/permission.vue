<template>
  <div>
    <el-form ref="form" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%" size="small">
      <el-form-item>
        <el-row>
          <el-col :span="8">
            <!-- 树形菜单 -->
            <el-tree
              ref="tree"
              show-checkbox
              default-expand-all
              node-key="name"
              highlight-current
              :check-strictly="checkStrictly"
              :default-checked-keys="form.menus"
              :expand-on-click-node="false"
              :check-on-click-node="true"
              :data="treeData.data"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <div>
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button type="primary" size="mini" :loading="loading" @click="handleSubmit">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddPermissionTree',
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: {
      type: Boolean
    },
    checkStrictly: {
      type: Boolean
    },
    treeData: {
      type: Object,
      default: function() {
        return []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('strictly')
    })
  },
  methods: {

    /* 提交表单 */
    handleSubmit() {
      const data = {
        'id': this.form.id,
        'permissions': this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      }
      this.$emit('submit', data)
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
