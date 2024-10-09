<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="用户名：">
        <el-input v-model="queryParams.name" placeholder="用户名、用户姓名、邮箱和手机号" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddUser">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="handleUserSync">LDAP账号同步</el-button>
      </el-col>
    </el-row>

    <!-- 表格组件 -->
    <user-list-table
      v-loading="loading"
      :table-data="tableData"
      @edit="handleEditUser"
      @delete="handleDelete"
      @active="handleSubmit"
      @mfa="handleMFA"
      @reset_password="handleResetUserPassword"
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

    <!-- 新增修改用户 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="userAddDialog"
      :show-close="false"
      width="810px"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <!-- 表单组件 -->
      <user-add-form
        ref="form"
        :form="currentValue"
        :loading="loading"
        @close="handleClose"
        @submit="handleSubmit"
      />
    </el-dialog>

    <!-- 重置用户密码 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="resetPasswordDialog"
      :show-close="false"
      width="500px"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <el-alert
        type="warning"
        show-icon
        :closable="false"
      >
        <template slot="title">
          <div class="iconSize">密码复杂度要求如下：</div>
          <div class="iconSize">1、长度不少于10位</div>
          <div class="iconSize">2、必须包含大小写字母、数字和特殊符号，且每种类型字符的长度不小于2</div>
        </template>
      </el-alert>
      <!-- 表单组件 -->
      <reset-user-password-form
        ref="form"
        :form="currentValue"
        :user-id="userId"
        :loading="loading"
        @close="handleClose"
        @submit="handleSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getUserList, addUser, changeUser, resetPassword, deleteUser, resetMFA, userSync } from '@/api/user/user'
import UserListTable from './table'
import UserAddForm from './form'
import ResetUserPasswordForm from './reset-password-form'

export default {
  components: {
    UserListTable,
    UserAddForm,
    ResetUserPasswordForm
  },
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      formTitle: undefined,
      currentValue: undefined,
      userId: undefined,
      queryParams: {
        name: '',
        page: 1,
        limit: 15
      },
      userAddDialog: false,
      resetPasswordDialog: false
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
      getUserList(this.queryParams).then((res) => {
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

    /* 新增用户 */
    handleAddUser() {
      // 打开Dialog
      this.userAddDialog = true
      // 更改Dialog标题
      this.formTitle = '新增用户'
    },

    /* 编辑用户 */
    handleEditUser(rowData) {
      // 打开Dialog
      this.userAddDialog = true
      // 更改Dialog标题
      this.formTitle = '修改用户'
      // 将当前行数据赋值给currentValue
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 重置用户密码 */
    handleResetUserPassword(rowData) {
      // 打开Dialog
      this.resetPasswordDialog = true
      // 更改弹框标题
      this.formTitle = '重置用户密码'
      // 将当前行数据赋值给currentValue
      this.currentValue = {
        'password': '',
        're_password': ''
      }
      this.userId = rowData.id
    },

    /* 表单关闭 */
    handleClose() {
      // 关闭所有Dialog
      this.userAddDialog = false
      this.resetPasswordDialog = false
      this.wwBindDialog = false
      // 清空表单数据
      this.currentValue = undefined
      this.userId = undefined
      // 清空校验规则
      this.$refs.form.$refs.form.resetFields()
      // 获取最新数据
      this.getList()
    },

    /* AD域用户同步 */
    handleUserSync() {
      this.$confirm('点击确认将从LDAP中同步用户信息，你还可以了解更详细的同步规则。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '同步中...'
            userSync().then((res) => {
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

    /* 打开用户同步规则 */
    handleRuleDetails() {
      console.log(1111)
    },

    /* 删除用户 */
    handleDelete(rowData) {
      this.$confirm('点击确认当前用户将从本系统中永久删除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            deleteUser(rowData).then((res) => {
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

    /* 重置用户MFA */
    handleMFA(rowData) {
      this.$confirm('点击确认当前用户的MFA将会被重置，用户下次登录时需要重新绑定。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '重置中...'
            resetMFA(rowData).then((res) => {
              if (res.code === 0) {
                Message({
                  message: res.msg,
                  type: 'success',
                  duration: 1000
                })
                instance.confirmButtonLoading = false
                done()
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
        if (formData.password && formData.re_password) {
          // 重置密码
          resetPassword(formData).then((res) => {
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
          // 更新用户信息
          changeUser(formData).then((res) => {
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
      } else {
        // 添加用户
        addUser(formData).then((res) => {
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
