<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column show-overflow-tooltip prop="name" label="任务名称" min-width="4%" />
    <el-table-column prop="cron_expr" label="执行表达式" min-width="4%" />
    <el-table-column prop="type" label="任务类型" min-width="3%">
      <template slot-scope="scope">
        <span v-if="scope.row.type === 1">间隔任务</span>
        <span v-if="scope.row.type === 2">周期任务</span>
      </template>
    </el-table-column>
    <el-table-column :formatter="dateFormat" prop="last_run_at" label="上次执行时间" min-width="4%" />
    <el-table-column prop="last_run_result" label="上次执行结果" min-width="3%" />
    <el-table-column prop="execution_count" label="执行次数" min-width="2%" />
    <el-table-column prop="enabled" label="任务状态" min-width="2%">
      <template slot-scope="scope">
        <el-tag :type="scope.row.enabled ? 'success' : 'danger'" disable-transitions>{{ scope.row.enabled ? '启用' : '停止' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="5%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        <el-button size="mini" type="text" @click="handleLog(scope.row)">日志</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CornListTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {

    /* 编辑 */
    handleEdit(value) {
      this.$emit('edit', value)
    },

    /* 删除 */
    handleDelete(value) {
      this.$emit('delete', value)
    },

    /* 日志 */
    handleLog(value) {
      this.$emit('log', value)
    },

    /* 日期时间格式化 */
    dateFormat: function(row, column) {
      const date = row[column.property]
      if (date === undefined || date === null) {
        return ''
      } else {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>
