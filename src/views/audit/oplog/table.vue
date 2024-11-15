<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column prop="username" label="用户名" min-width="2%" />
    <el-table-column show-overflow-tooltip prop="endpoint" label="接口" min-width="4%" />
    <el-table-column prop="method" label="请求方法" min-width="2%" />
    <el-table-column prop="client_ip" label="客户端IP" min-width="3%" />
    <el-table-column :formatter="dateFormat" prop="CreatedAt" label="请求时间" min-width="3%" />
    <el-table-column show-overflow-tooltip prop="request_params" label="请求参数" min-width="3%" />
    <el-table-column show-overflow-tooltip prop="response_data" label="返回数据" min-width="3%" />
    <el-table-column show-overflow-tooltip prop="user_agent" label="UserAgent" min-width="6%" />
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'OplogListTable',
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
