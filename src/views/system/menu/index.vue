
<template>
  <div class="app-container">

    <!-- 表格组件 -->
    <menu-list-table :table-data="tableData" />

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
import { getMenuList } from '@/api/system/menu'
import MenuListTable from './table'

export default {
  components: {
    MenuListTable
  },
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      queryParams: {
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
      getMenuList(this.queryParams).then((res) => {
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      })
    },

    /* page size变化 */
    handleSizeChange(newSize) {
      this.queryParams.page_size = newSize
      this.getList()
    },

    /* page number的变化 */
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
      this.getList()
    }
  }
}
</script>
