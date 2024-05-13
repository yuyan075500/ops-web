<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column prop="name" label="姓名" min-width="4%" />
    <el-table-column prop="is_role_group" label="分组类型" min-width="4%">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.is_role_group === true" type="success" size="small">角色分组</el-tag>
        <el-tag v-else type="info" size="small">普通分组</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="2%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        <el-dropdown style="margin-left: 10px" trigger="click">
          <el-button size="mini" type="text">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text">用户管理</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text">权限管理</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'GroupListTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    /* 编辑按钮 */
    handleEdit(value) {
      this.$emit('edit', value)
    },

    /* 删除按钮 */
    handleDelete(value) {
      this.$emit('delete', value)
    }
  }
}
</script>

<style scoped>
.el-button-text {
    border-color: transparent;
    color: #606266;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
}
</style>
