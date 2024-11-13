<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="账号信息">
        <el-input v-model="queryParams.name" placeholder="请输入账号相关信息" size="small" prefix-icon="el-icon-search" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格头 -->
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="primary" plain icon="el-icon-thumb" size="mini" @click="handleMove">移交</el-button>
        <el-button type="primary" plain icon="el-icon-upload2" size="mini" @click="handleUpload">导入</el-button>
        <el-button type="primary" plain icon="el-icon-download" size="mini" @click="handleDownload">下载</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <account-table
      v-loading="loading"
      :table-data="tableData"
      @edit="handleEdit"
      @account-share="handleShare"
      @change-owner="handleChangeOwner"
      @delete="handleDelete"
      @set-password="handleSetPassword"
      @get-password="handleGetPassword"
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

    <!-- 表格行编辑 -->
    <el-dialog
      v-if="accountAddDialog"
      :title="formTitle"
      :visible.sync="accountAddDialog"
      :show-close="false"
      width="500px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- 表单组件 -->
      <account-add-form
        ref="form"
        :form="currentValue"
        @close="handleClose"
        @submit="handleSubmit"
      />
    </el-dialog>

    <!-- 重置用户密码 -->
    <el-dialog
      v-if="passwordDialog"
      :title="formTitle"
      :visible.sync="passwordDialog"
      :show-close="false"
      width="500px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- 表单组件 -->
      <set-password-form
        ref="form"
        :user="currentValue"
        @close="handleClose"
        @submit="handlePasswordSubmit"
      />
    </el-dialog>

    <!-- 获取验证码表单 -->
    <el-dialog
      v-if="getCodeDialog"
      :title="formTitle"
      :visible.sync="getCodeDialog"
      :show-close="false"
      width="500px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- 表单组件 -->
      <sms-form
        ref="form"
        :form="currentValue"
        @close="getCodeDialog = false"
        @submit="handleCodeVerification"
      />
    </el-dialog>

    <!-- 账号分享 -->
    <el-dialog
      v-if="accountShareDialog"
      :title="formTitle"
      :visible.sync="accountShareDialog"
      :show-close="false"
      width="700px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <user-transfer
        ref="form"
        :transfer-data="transferData"
        @close="accountShareDialog = false"
        @submit="handleShareSubmit"
      />
    </el-dialog>

    <!-- 所有者更改 -->
    <el-dialog
      v-if="ownerChangeDialog"
      :title="formTitle"
      :visible.sync="ownerChangeDialog"
      :show-close="false"
      width="500px"
      :close-on-click-modal="false"
    >
      <!-- 表单组件 -->
      <change-owner-form
        ref="form"
        :form="currentValue"
        :users="users"
        @close="ownerChangeDialog = false"
        @submit="handleSubmit"
      />
    </el-dialog>

    <!-- 导入账号列表 -->
    <el-dialog
      v-if="accountUploadDialog"
      :title="formTitle"
      :visible.sync="accountUploadDialog"
      :show-close="false"
      width="500px"
      :close-on-click-modal="false"
    >
      <!-- 表单组件 -->
      <upload-form
        ref="form"
        :form="currentValue"
        :users="users"
        @close="accountUploadDialog = false"
        @table="handleOpenTable"
        @submit="handleBatchCreate"
      />
    </el-dialog>

    <!-- 账号解析结果 -->
    <el-dialog
      v-if="accountUploadTableDialog"
      title="待导入账号缓存列表"
      :visible.sync="accountUploadTableDialog"
      :show-close="true"
      width="800px"
      :close-on-click-modal="true"
    >
      <!-- 表单组件 -->
      <upload-table :table-data="currentValue" />
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getAccountList, deleteAccount, changeAccount, addAccount, getAccountPassword, codeVerification, shareAccount, changeAccountPassword, addAccounts } from '@/api/asset/account'
import { getUserListAll } from '@/api/user/user'
import AccountTable from './table'
import AccountAddForm from './form'
import SetPasswordForm from './password-form'
import SmsForm from './verification-form'
import UserTransfer from './user-transfer'
import ChangeOwnerForm from './change-owner'
import UploadForm from './upload-form'
import UploadTable from './upload-table'

export default {
  components: {
    AccountTable,
    AccountAddForm,
    SetPasswordForm,
    SmsForm,
    UserTransfer,
    UploadForm,
    UploadTable,
    ChangeOwnerForm
  },
  data() {
    return {
      loading: true,
      total: 0,
      formTitle: undefined,
      currentValue: undefined,
      tableData: [],
      queryParams: {
        name: '',
        page: 1,
        limit: 15
      },
      users: [],
      transferData: {
        optionalUser: [],
        existUser: [],
        id: ''
      },
      accountAddDialog: false,
      passwordDialog: false,
      getCodeDialog: false,
      accountShareDialog: false,
      ownerChangeDialog: false,
      accountUploadTableDialog: false,
      accountUploadDialog: false
    }
  },
  created() {
    this.getList()
    this.getUsers()
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
      getAccountList(this.queryParams).then((res) => {
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

    /* page number的变化 */
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
      this.getList()
    },

    /* 获取用户列表 */
    getUsers() {
      getUserListAll().then((res) => {
        const data = res.data.users
        for (var key in data) {
          this.users.push({ key: data[key].id, label: data[key].name })
        }
      })
    },

    /* 新增账号 */
    handleAdd() {
      // 打开Dialog
      this.accountAddDialog = true
      // 更改Dialog标题
      this.formTitle = '新增'
    },

    /* 转移账号 */
    handleMove() {},

    /* 上传账号 */
    handleUpload() {
      // 打开Dialog
      this.accountUploadDialog = true
      // 更改Dialog标题
      this.formTitle = '批量导入账号'
    },

    handleOpenTable(tableData) {
      // 打开Dialog
      this.accountUploadTableDialog = true
      // 将数据赋值给表格
      this.currentValue = tableData
    },

    /* 导出账号 */
    handleDownload() {},

    /* 修改账号 */
    handleEdit(rowData) {
      // 显示弹框
      this.accountAddDialog = true
      // 更改弹框标题
      this.formTitle = '修改'
      // 将行数据赋值给表单
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 重置账号密码 */
    handleSetPassword(rowData) {
      // 更改弹框标题
      this.formTitle = '密码重置'
      // 显示弹框
      this.passwordDialog = true
      // 将行数据赋值给表单
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 账号所有权转移 */
    handleChangeOwner(rowData) {
      // 显示弹框
      this.ownerChangeDialog = true
      // 更改弹框标题
      this.formTitle = '所有权转移'
      // 将行数据赋值给表单
      // rowData['owner_user_id'] = rowData.owner.name
      this.currentValue = JSON.parse(JSON.stringify(rowData))
    },

    /* 账号分享 */
    handleShare(rowData) {
      // 显示弹框
      this.accountShareDialog = true
      // 更改弹框标题
      this.formTitle = '账号分享'
      // 获取当前id
      this.transferData.id = rowData.id
      // 获取所有用户
      this.transferData.optionalUser = this.users
      // 定义已存储用户列表
      if (rowData.users !== null) {
        this.transferData.existUser = rowData.users.map(user => user.id)
      }
    },

    /* 删除账号 */
    handleDelete(rowData) {
      this.$confirm('点击确认当前账号将从系统中永久删除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false
      }).then(() => {
        deleteAccount(rowData).then((res) => {
          if (res.code === 0) {
            Message({
              message: res.msg,
              type: 'success',
              duration: 1000
            })
            if (this.tableData.length === 1 && this.queryParams.page !== 1) {
              this.queryParams.page--
            }
            this.getList()
          }
        })
      }).catch(() => {})
    },

    /* 获取密码 */
    handleGetPassword(rowData) {
      getAccountPassword(rowData).then((res) => {
        if (res.code === 0 && res.data !== null) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 1000
          })
          // 更新表格中的密码
          this.$set(rowData, 'password', res.data)
        } else {
          this.getCodeDialog = true
          this.formTitle = '短信验证'
        }
      })
    },

    /* 验证码校验 */
    handleCodeVerification(rowData) {
      codeVerification(rowData).then((res) => {
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
    },

    /* 分享账号 */
    handleShareSubmit(formData) {
      shareAccount(formData).then((res) => {
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
    },

    /* 更改密码 */
    handlePasswordSubmit(formData) {
      changeAccountPassword(formData).then((res) => {
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
    },

    /* 批量新增 */
    handleBatchCreate(formData) {
      addAccounts(formData).then((res) => {
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
    },

    /* 新增修改 */
    handleSubmit(formData) {
      // 对id进行判断，有id表示修改，没有表示新增
      if (formData.id) {
        changeAccount(formData).then((res) => {
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
        addAccount(formData).then((res) => {
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
      this.accountAddDialog = false
      this.passwordDialog = false
      this.accountShareDialog = false
      this.getCodeDialog = false
      this.ownerChangeDialog = false
      this.accountUploadDialog = false
      // 清空表单数据
      this.currentValue = undefined
      // 清空校验规则
      this.$refs.form.$refs.form.resetFields()
      // 获取最新数据
      this.getList()
    }
  }
}
</script>
