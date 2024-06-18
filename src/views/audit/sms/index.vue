<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="手机号：">
        <el-input v-model="queryParams.receiver" placeholder="手机号" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格组件 -->
    <sms-list-table
      v-loading="loading"
      :table-data="tableData"
    />

    <!-- 分页 -->
    <el-pagination
      background
      :current-page="queryParams.page"
      :page-sizes="[10, 15, 20, 30, 40]"
      :page-size="queryParams.limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />

  </div>
</template>

<script>
import { getSMSRecordList } from '@/api/audit/log'
import SmsListTable from './table'

export default {
  components: {
    SmsListTable
  },
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      queryParams: {
        receiver: '',
        page: 1,
        limit: 15
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 查找数据 */
    searchList() {
      this.queryParams.page = 1
      this.loading = true
      this.getList()
    },

    /* 获取数据 */
    getList() {
      getSMSRecordList(this.queryParams).then((res) => {
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      })
    },

    /* page size变化 */
    handlePageSizeChange(newSize) {
      this.queryParams.page_size = newSize
      this.getList()
    },

    /* page number的变化 */
    handlePageChange(newPage) {
      this.queryParams.page = newPage
      this.getList()
    }
  }
}
</script>
