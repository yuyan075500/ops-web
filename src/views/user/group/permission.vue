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
    treeData: {
      type: Object,
      default: function() {
        return []
      }
    }
  },
  methods: {

    /* 提交表单 */
    handleSubmit() {
      // 所有选中子节点的key
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 所有选中子节点的父节点key
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 节点key合并
      const data = {
        'id': this.form.id,
        'permissions': checkedKeys.concat(halfCheckedKeys)
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
