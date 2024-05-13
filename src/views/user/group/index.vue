<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="分组名">
        <el-input v-model="queryParams.name" placeholder="分组名称" size="small" prefix-icon="el-icon-search" clearable style="width: 320px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddGroup">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格组件 -->
    <group-list-table
      v-loading="loading"
      :table-data="tableData"
      @edit="handleEditGroup"
      @delete="handleDelete"
      @active="handleSubmit"
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

    <!-- 新增修改分组 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="groupAddDialog"
      :show-close="false"
      width="800px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- 表单组件 -->
      <group-add-form
        ref="form"
        :form="currentValue"
        :loading="loading"
        @close="handleClose"
        @submit="handleSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getGroupList, addGroup, changeGroup, deleteGroup } from '@/api/user/group'
import GroupListTable from './table'
import GroupAddForm from './form'

export default {
  components: {
    GroupListTable,
    GroupAddForm
  },
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      formTitle: undefined,
      currentValue: undefined,
      queryParams: {
        name: '',
        page: 1,
        limit: 15
      },
      groupAddDialog: false
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
      getGroupList(this.queryParams).then((res) => {
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
    },

    /* 新增分组 */
    handleAddGroup() {
      // 打开Dialog
      this.groupAddDialog = true
      // 更改Dialog标题
      this.formTitle = '新增分组'
    },

    /* 编辑分组 */
    handleEditGroup(rowData) {
      // 打开Dialog
      this.groupAddDialog = true
      // 更改Dialog标题
      this.formTitle = '修改分组'
      // 将当前行数据赋值给currentValue
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 表单关闭 */
    handleClose() {
      // 关闭所有Dialog
      this.groupAddDialog = false
      // 清空表单数据
      this.currentValue = undefined
      // 清空校验规则
      this.$refs.form.$refs.form.resetFields()
      // 获取最新数据
      this.getList()
    },

    /* 删除分组 */
    handleDelete(rowData) {
      this.$confirm('点击确认当前分组将从系统中永久删除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            deleteGroup(rowData).then((res) => {
              if (res.code === 0) {
                Message({
                  message: res.msg,
                  type: 'success',
                  duration: 1000
                })
                instance.confirmButtonLoading = false
                done()
                // 获取最新数据
                this.getList()
              }
            }).finally(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      }).then(() => {}).catch(() => {})
    },

    /* 表单提交 */
    handleSubmit(formData) {
      this.loading = true
      // 使用id进行判断，有id表示修改，没有表示新增
      if (formData.id) {
        // 更新分组信息
        changeGroup(formData).then((res) => {
          if (res.code === 0) {
            Message({
              message: res.msg,
              type: 'success',
              duration: 1000
            })
            this.loading = false
            this.handleClose()
          }
        }, () => {
          this.loading = false
        })
      } else {
        // 添加分组
        addGroup(formData).then((res) => {
          if (res.code === 0) {
            Message({
              message: res.msg,
              type: 'success',
              duration: 1000
            })
            this.loading = false
            this.handleClose()
          }
        }, () => {
          this.loading = false
        })
      }
    }
  }
}
</script>
