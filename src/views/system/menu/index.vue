
<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="菜单名称：">
        <el-input v-model="queryParams.title" placeholder="一级菜单名称" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddMenu">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格组件 -->
    <menu-list-table :table-data="tableData" @edit="handleEditMenu" />

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

    <!-- 菜单编辑 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="menuAddDialog"
      :show-close="false"
      width="700px"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <!-- 表单组件 -->
      <menu-add-form
        ref="form"
        :form-title="formTitle"
        :form="currentValue"
        :menus="menus"
        :loading="loading"
        @close="handleClose"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getMenuList } from '@/api/system/menu'
import MenuListTable from './table'
import MenuAddForm from './form'

export default {
  components: {
    MenuListTable,
    MenuAddForm
  },
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      formTitle: '',
      currentValue: undefined,
      menus: [],
      queryParams: {
        title: '',
        page: 1,
        limit: 15
      },
      menuAddDialog: false
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

        //  获取一级菜单列表
        const menus = []
        this.tableData.forEach(function(value, index) {
          menus.push({
            id: value.id,
            title: value.title
          })
        })
        this.menus = menus
      })
    },

    /* page size变化 */
    handlePageSizeChange(newSize) {
      this.queryParams.limit = newSize
      this.getList()
    },

    /* page number的变化 */
    handlePageChange(newPage) {
      this.queryParams.page = newPage
      this.getList()
    },

    /* 新增菜单 */
    handleAddMenu() {
      // 显示弹框
      this.menuAddDialog = true
      // 更改弹框标题
      this.formTitle = '新增菜单'
    },

    /* 编辑菜单 */
    handleEditMenu(rowData) {
      // 打开Dialog
      this.menuAddDialog = true
      // 更改Dialog标题
      this.formTitle = '修改菜单'
      // 将当前行数据赋值给currentValue
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 表单关闭 */
    handleClose() {
      // 关闭所有Dialog
      this.menuAddDialog = false
      // 清空表单及空梭框数据
      this.currentValue = undefined
      // 清空校验规则
      this.$refs.form.$refs.form.resetFields()
      // 获取最新数据
      this.getList()
    }
  }
}
</script>
