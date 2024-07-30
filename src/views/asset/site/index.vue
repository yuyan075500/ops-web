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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddGroup">新增分组</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <group-table
      v-loading="loading"
      :table-data="tableData"
      @edit-group="handleEditGroup"
      @edit-site="handleEditSite"
      @open="handleSiteSubmit"
      @delete-group="handleDeleteGroup"
      @delete-site="handleDeleteSite"
      @add="handleAddSite"
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

    <!-- 添加站点分组 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="groupAddDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="500px"
      @closed="handleClose"
    >
      <group-add-form
        ref="form"
        :loading="loading"
        :form="currentValue"
        @close="handleClose"
        @submit="handleGroupSubmit"
      />
    </el-dialog>

    <!-- 添加站点：v-if可以确保Dialog打开时，子组件每次都重新创建 -->
    <el-dialog
      v-if="siteAddDialog"
      :title="formTitle"
      :visible.sync="siteAddDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="810px"
      @closed="handleClose"
    >
      <site-add-form
        ref="form"
        :loading="loading"
        :form="currentValue"
        :group="group"
        @close="handleClose"
        @submit="handleSiteSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getGroupList, deleteGroup, addGroup, changeGroup, addSite, changeSite, deleteSite } from '@/api/asset/site'
import GroupTable from './table'
import GroupAddForm from './form'
import SiteAddForm from './site-form'

export default {
  components: {
    GroupTable,
    GroupAddForm,
    SiteAddForm
  },
  data() {
    return {
      loading: true,
      total: 0,
      formTitle: undefined,
      currentValue: undefined,
      group: NaN,
      tableData: [],
      queryParams: {
        name: '',
        page: 1,
        limit: 15
      },
      groupAddDialog: false,
      siteAddDialog: false
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
    },

    /* 新增站点分组 */
    handleAddGroup() {
      // 打开Dialog
      this.groupAddDialog = true
      // 更改弹框标题
      this.formTitle = '新增站点分组'
    },

    /* 新增站点 */
    handleAddSite(rowData) {
      // 打开Dialog
      this.siteAddDialog = true
      // 更改弹框标题
      this.formTitle = '新增站点'
      // 赋值group
      this.group = rowData.id
    },

    /* 修改站点分组 */
    handleEditGroup(rowData) {
      // 打开Dialog
      this.groupAddDialog = true
      // 更改Dialog标题
      this.formTitle = '修改站点分组'
      // 将当前行数据赋值给currentValue
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 修改站点 */
    handleEditSite(rowData) {
      // 打开Dialog
      this.siteAddDialog = true
      // 更改Dialog标题
      this.formTitle = '修改站点'
      // 将当前行数据赋值给currentValue
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 删除站点分组 */
    handleDeleteGroup(rowData) {
      this.$confirm('点击确认当前站点分组将从系统中永久删除。', '提示', {
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

    /* 删除站点 */
    handleDeleteSite(rowData) {
      this.$confirm('点击确认当前站点将从系统中永久删除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            deleteSite(rowData).then((res) => {
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

    /* 站点组新增与修改 */
    handleGroupSubmit(formData) {
      this.loading = true
      // 对id进行判断，有id表示修改，没有表示新增
      if (formData.id) {
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
    },

    /* 站点新增与修改 */
    handleSiteSubmit(formData) {
      this.loading = true
      // 对id进行判断，有id表示修改，没有表示新增
      if (formData.id) {
        changeSite(formData).then((res) => {
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
        addSite(formData).then((res) => {
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
    },

    /* 表单关闭 */
    handleClose() {
      // 关闭所有Dialog
      this.groupAddDialog = false
      this.siteAddDialog = false
      // 清空表单数据
      this.currentValue = undefined
      this.group = NaN
      // 清空校验规则
      this.$refs.form.$refs.form.resetFields()
      // 获取最新数据
      this.getList()
    }
  }
}
</script>
