<template>
  <div>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
      <el-table-column type="selection" width="40" />
      <el-table-column prop="title" label="title" min-width="4%" />
      <el-table-column prop="name" label="name" min-width="6%" />
      <el-table-column prop="icon" label="icon" min-width="5%" />
      <el-table-column prop="path" label="path" min-width="10%" />
      <el-table-column prop="component" label="component" min-width="10%" />
      <el-table-column prop="sort" label="排序" min-width="3%" align="center" />
      <el-table-column label="操作" min-width="10%" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="text" @click="handlePath(scope.row)">查看接口</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 接口 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="menuPathDialog"
      :show-close="true"
      width="700px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <sub-menu-path-list-table
        v-loading="loading"
        :form-title="formTitle"
        :table-data="pathList"
        @close="handleClose"
      />
      <!-- 分页 -->
      <el-pagination
        background
        :current-page="queryParams.page"
        :page-sizes="[5, 10, 15, 20, 30]"
        :page-size="queryParams.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getPathList } from '@/api/system/path'
import SubMenuPathListTable from './menu-path'

export default {
  name: 'SubMenuListTable',
  components: {
    SubMenuPathListTable
  },
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
      loading: true,
      formTitle: '',
      pathList: [],
      total: 0,
      queryParams: {
        menu_name: null,
        page: 1,
        limit: 5
      },
      menuPathDialog: false
    }
  },
  methods: {

    /* 编辑按钮 */
    handleEdit(value) {
      this.$emit('edit', value)
    },

    /* 删除按钮 */
    handleDelete(value) {
      this.$emit('delete', value)
    },

    /* 获取数据 */
    getList() {
      getPathList(this.queryParams).then((res) => {
        this.pathList = res.data.items
        this.total = res.data.total
        this.loading = false
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

    /* 查看接口按钮列表 */
    handlePath(value) {
      // 显示弹框
      this.menuPathDialog = true
      // 更改弹框标题
      this.formTitle = value.title + '接口列表'
      // 将当前行数据赋值给pathList
      this.queryParams.menu_name = value.name
      this.getList()
    },

    handleClose() {
      // 关闭所有Dialog
      this.menuPathDialog = false
      // 清空相关数据
      this.pathList = []
      this.queryParams = {
        page: 1,
        limit: 5
      }
    }
  }
}
</script>

