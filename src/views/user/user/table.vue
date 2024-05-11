<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="username" label="登录用户名" min-width="3%" />
    <el-table-column show-overflow-tooltip prop="name" label="姓名" min-width="4%" />
    <el-table-column show-overflow-tooltip prop="email" label="邮箱地址" min-width="6%" />
    <el-table-column prop="phone_number" label="手机号" min-width="4%" />
    <el-table-column prop="is_active" label="激活" min-width="3%">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.is_active"
          :active-value="true"
          :inactive-value="false"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleActive(scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="user_from" label="来源" min-width="3%" />
    <el-table-column :formatter="dateFormat" prop="last_login_at" label="最后登录时间" min-width="5%" />
    <el-table-column label="操作" min-width="6%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        <el-dropdown style="margin-left: 10px" trigger="click">
          <el-button size="mini" type="text">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text" @click="handlePassword(scope.row)">用户密码重置</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button class="el-button-text" size="mini" type="text" @click="handleMFA(scope.row)">MFA验证码重置</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'UserListTable',
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

    /* 禁用与激活 */
    handleActive(value) {
      this.$emit('active', value)
    },

    /* 删除按钮 */
    handleDelete(value) {
      this.$emit('delete', value)
    },

    /* 重置密码按钮 */
    handlePassword(value) {
      this.$emit('reset_password', value)
    },

    /* 重置MFA按钮 */
    handleMFA(value) {
      this.$emit('mfa', value)
    },

    /* 日期时间格式化 */
    dateFormat: function(row, column) {
      const date = row[column.property]
      if (date === undefined || date === null) {
        return '从未登录'
      } else {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
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
