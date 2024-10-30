<template>
  <div>

    <!-- 表格头 -->
    <el-row :gutter="10" type="flex" justify="end">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="getList">刷新</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
      <el-table-column type="selection" width="40" />
      <el-table-column :formatter="dateFormat" prop="run_at" label="开始时间" min-width="6%" />
      <el-table-column :formatter="dateFormat" prop="finish_at" label="结束时间" min-width="6%" />
      <el-table-column show-overflow-tooltip prop="result" label="执行结果" min-width="10%" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      :current-page="queryParams.page"
      :page-sizes="[10, 15, 20, 30, 40]"
      :page-size="queryParams.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

</template>

<script>
import { getTaskLogList } from '@/api/system/task'
import moment from 'moment'

export default {
  name: 'LogTable',
  props: {
    taskId: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      tableData: [],
      total: 0,
      queryParams: {
        id: this.taskId,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {

    /* 刷新 */
    getList() {
      getTaskLogList(this.queryParams).then((res) => {
        this.tableData = res.data.items
        this.total = res.data.total
      })
    },

    /* 监听page size变化 */
    handleSizeChange(newSize) {
      this.queryParams.limit = newSize
      this.getList()
    },

    /* 监听page number变化 */
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
      this.getList()
    },

    /* 日期时间格式化 */
    dateFormat: function(row, column) {
      const date = row[column.property]
      if (date === undefined) {
        return ''
      } else {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>
