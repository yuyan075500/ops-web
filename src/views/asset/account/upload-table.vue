<template>
  <div>
    <!-- 提示信息 -->
    <el-alert
      type="info"
      title="点击删除按钮可以将该条数据从缓存中删除，影响最终提交的结果，不会从实际Excel表格中删除。"
      show-icon
      style="margin-bottom: 20px;"
    />

    <el-table
      :data="tableData.slice((queryParams.page-1) * queryParams.limit, queryParams.page * queryParams.limit)"
      tooltip-effect="dark"
      style="width: 100%; margin-top:10px;"
      size="mini"
      border
    >
      <el-table-column type="selection" width="40" />
      <el-table-column show-overflow-tooltip prop="name" label="账号名称" min-width="6%" />
      <el-table-column show-overflow-tooltip prop="username" label="用户名" min-width="6%" />
      <el-table-column show-overflow-tooltip prop="login_address" label="登录地址" min-width="10%" />
      <el-table-column show-overflow-tooltip prop="login_method" label="登录方式" min-width="6%" />
      <el-table-column show-overflow-tooltip prop="password" label="密码" min-width="8%" />
      <el-table-column show-overflow-tooltip prop="note" label="备注" min-width="10%" />
      <el-table-column label="操作" min-width="5%" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
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
export default {
  name: 'UploadTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      total: 0,
      queryParams: {
        page: 1,
        limit: 10
      }
    }
  },
  watch: {
    tableData(newData) {
      this.total = newData.length
    }
  },
  created() {
    this.total = this.tableData.length
  },
  methods: {
    /* 监听page size变化 */
    handleSizeChange(newSize) {
      this.queryParams.limit = newSize
    },

    /* 监听page number变化 */
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
    },

    /* 删除当前行数据 */
    handleDelete(row) {
      const index = this.tableData.indexOf(row)
      if (index !== -1) {
        this.tableData.splice(index, 1)
        this.total = this.tableData.length
      }
    }
  }
}
</script>
