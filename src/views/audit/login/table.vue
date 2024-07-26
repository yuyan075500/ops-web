<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column prop="username" label="登录用户名" min-width="3%" />
    <el-table-column :formatter="dateFormat" prop="CreatedAt" label="登录时间" min-width="4%" />
    <el-table-column prop="source_ip" label="客户端IP" min-width="3%" />
    <el-table-column prop="city" label="城市" min-width="3%" />
    <el-table-column show-overflow-tooltip prop="user_agent" label="客户端Agent" min-width="7%" />
    <el-table-column prop="auth_method" label="认证方法" min-width="3%" />
    <el-table-column prop="status" label="状态" min-width="3%" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status === 1" type="success" size="small">成功</el-tag>
        <el-tag v-else type="danger" size="small">失败</el-tag>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="failed_reason" label="失败原因" min-width="5%" />
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'LoginListTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {

    /* 日期时间格式化 */
    dateFormat: function(row, column) {
      const date = row[column.property]
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
