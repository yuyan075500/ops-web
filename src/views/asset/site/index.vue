<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="查找关键字">
        <el-input v-model="queryParams.name" placeholder="请输入站名称" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <group-table
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
import { getGroupList } from '@/api/asset/site'
import GroupTable from './table'

export default {
  components: {
    GroupTable
  },
  data() {
    return {
      loading: true,
      total: 0,
      formTitle: '',
      tableData: [],
      queryParams: {
        name: '',
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
      this.getList()
    },

    /* 获取表格数据 */
    getList() {
      this.loading = true
      getGroupList(this.queryParams).then((res) => {
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      })
    },

    /* 监听page size变化 */
    handlePageSizeChange(newSize) {
      this.queryParams.limit = newSize
      this.getList()
    },

    /* 监听page number的变化 */
    handlePageChange(newPage) {
      this.queryParams.page = newPage
      this.getList()
    }
  }
}
</script>
