
<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="名称：">
        <el-input v-model="queryParams.name" placeholder="任务名称" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格组件 -->
    <cron-list-table
      v-loading="loading"
      :table-data="tableData"
      @edit="handleEdit"
      @delete="handleDelete"
      @log="handleLog"
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

    <!-- 新增与编辑 -->
    <el-dialog
      v-if="cronAddDialog"
      :title="formTitle"
      :visible.sync="cronAddDialog"
      :show-close="false"
      width="800px"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <!-- 表单组件 -->
      <cron-add-form
        ref="form"
        :form-title="formTitle"
        :form="currentValue"
        :loading="loading"
        @close="handleClose"
        @submit="handleSubmit"
        @describe="cronDescribeDialog = true"
      />
    </el-dialog>

    <!-- 计划任务填写说明 -->
    <el-dialog
      title="计划任务填写说明"
      :visible.sync="cronDescribeDialog"
      :show-close="true"
      width="700px"
      :close-on-click-modal="true"
    >
      <!-- 表单组件 -->
      <cron-describe />
    </el-dialog>

    <!-- 计划任务执行记录 -->
    <el-dialog
      title="计划任务执行记录"
      :visible.sync="cronLogDialog"
      :show-close="true"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- 表单组件 -->
      <log-table :task-id="taskId" />
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getTaskList, addTask, deleteTask, changeTask } from '@/api/system/task'
import CronListTable from './table'
import CronAddForm from './form'
import CronDescribe from './cron'
import LogTable from './log'

export default {
  components: {
    CronListTable,
    CronAddForm,
    CronDescribe,
    LogTable
  },
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      formTitle: '',
      currentValue: undefined,
      taskId: undefined,
      queryParams: {
        name: '',
        page: 1,
        limit: 15
      },
      cronAddDialog: false,
      cronDescribeDialog: false,
      cronLogDialog: false
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
      getTaskList(this.queryParams).then((res) => {
        this.tableData = res.data.items
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

    /* 新增任务 */
    handleAdd() {
      // 显示弹框
      this.cronAddDialog = true
      // 更改弹框标题
      this.formTitle = '新增任务'
    },

    /* 任务日志 */
    handleLog(rowData) {
      // 显示弹框
      this.cronLogDialog = true
      // 获取任务ID
      this.taskId = rowData.ID
    },

    /* 编辑任务 */
    handleEdit(rowData) {
      // 打开Dialog
      this.cronAddDialog = true
      // 更改Dialog标题
      this.formTitle = '修改任务'
      // 将当前行数据赋值给currentValue
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 删除定时任务 */
    handleDelete(rowData) {
      this.$confirm('点击确认当前任务将从本系统中永久删除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            deleteTask(rowData).then((res) => {
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
      if (formData.ID) {
        changeTask(formData).then((res) => {
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
        addTask(formData).then((res) => {
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
      this.cronAddDialog = false
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
