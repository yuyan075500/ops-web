<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column :formatter="dateFormat" prop="CreatedAt" label="发送时间" min-width="4%" />
    <el-table-column show-overflow-tooltip prop="receiver" label="接收手机号" min-width="3%" />
    <el-table-column prop="note" label="短信类型" min-width="3%" />
    <el-table-column show-overflow-tooltip prop="signature" label="签名" min-width="3%" />
    <el-table-column show-overflow-tooltip prop="template_id" label="模板ID" min-width="6%" />
    <el-table-column prop="status" label="状态" min-width="3%" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status === '发送失败'" type="danger" size="small">{{ scope.row.status }}</el-tag>
        <el-tag v-else-if="scope.row.status === '接收成功'" type="success" size="small">{{ scope.row.status }}</el-tag>
        <el-tag v-else type="info" size="small">{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="error_code" label="错误码" min-width="3%" />
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'SmsListTable',
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
