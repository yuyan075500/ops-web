<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="name" label="账号名称" min-width="8%" />
    <el-table-column show-overflow-tooltip prop="username" label="用户名" min-width="5%" />
    <el-table-column show-overflow-tooltip prop="login_address" label="登录地址" min-width="10%" />
    <el-table-column prop="app" label="登录方式" min-width="5%" />
    <el-table-column show-overflow-tooltip prop="account_owner.name" label="所有者" min-width="5%" />
    <el-table-column show-overflow-tooltip prop="note" label="备注" min-width="10%" />
    <el-table-column prop="password" label="密码" min-width="5%" align="center">
      <template slot-scope="scope">
        <el-button v-if="scope.row.password === undefined" type="text" size="small" @click="handleGetPassword(scope.row)">获取密码</el-button>
        <span v-else>{{ scope.row.password }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="10%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        <el-dropdown style="margin-left: 10px" trigger="click">
          <el-button size="mini" type="text">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text" @click="handleSetPassword(scope.row)">修改密码</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text" @click="handleAccountShare(scope.row)">账号分享</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text" @click="handleChangeOwner(scope.row)">账号移交</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'AccountTable',
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
    },

    /* 重置密码按钮 */
    handleSetPassword(value) {
      this.$emit('set-password', value)
    },

    /* 获取密码按钮 */
    handleGetPassword(value) {
      this.$emit('get-password', value)
    },

    /* 账号分享 */
    handleAccountShare(value) {
      this.$emit('account-share', value)
    },

    /* 所有权转移 */
    handleChangeOwner(value) {
      this.$emit('change-owner', value)
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
