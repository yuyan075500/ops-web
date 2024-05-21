<template>
  <div class="app-container">

    <!-- 表格搜索 -->
    <el-form :inline="true">
      <el-form-item label="分组名：">
        <el-input v-model="queryParams.name" size="small" prefix-icon="el-icon-search" clearable />
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
      @user="handleEditUser"
      @permission="handlePermission"
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
      width="500px"
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

    <!-- 用户管理 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="userDialog"
      :show-close="false"
      width="850px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <add-user-transfer ref="form" :form="currentValue" :transfer-data="transferData" :loading="loading" @close="handleClose" @submit="handleUserSubmit" />
    </el-dialog>

    <!-- 权限管理 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="permissionDialog"
      :show-close="false"
      width="850px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <add-permission-tree ref="form" :tree-data="permissionData" :form="currentValue" :loading="loading" @close="handleClose" @submit="handlePermissionSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getGroupList, addGroup, changeGroup, deleteGroup, changeGroupUser, changeGroupPermission } from '@/api/user/group'
import { getUserListAll } from '@/api/user/user'
import { getMenuListAll } from '@/api/system/menu'
import GroupListTable from './table'
import GroupAddForm from './form'
import AddUserTransfer from './user-transfer'
import AddPermissionTree from './permission'

export default {
  components: {
    GroupListTable,
    GroupAddForm,
    AddUserTransfer,
    AddPermissionTree
  },
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      formTitle: '',
      currentValue: undefined,
      transferData: {
        leftData: [],
        rightData: []
      },
      permissionData: {
        data: [],
        selectData: []
      },
      queryParams: {
        name: '',
        page: 1,
        limit: 15
      },
      groupAddDialog: false,
      userDialog: false,
      permissionDialog: false

    }
  },
  created() {
    this.getList()
    this.getUserList()
    this.getMenuList()
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

    // 获取所有用户
    getUserList() {
      getUserListAll().then((res) => {
        const data = res.data.users
        for (let i = 0; i < data.length; i++) {
          this.transferData.leftData.push({
            label: data[i].name,
            key: data[i].id
          })
        }
      })
    },

    // 获取所有菜单
    getMenuList() {
      getMenuListAll().then((res) => {
        const data = res.data.items
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          const menu = {
            name: item.name,
            label: item.title
          }

          if (item.SubMenus) {
            menu.children = item.SubMenus.map(subItem => ({
              name: subItem.name,
              label: subItem.title
            }))
          }

          this.permissionData.data.push(menu)
        }
      })
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

    /* 管理角色用户 */
    handleEditUser(rowData) {
      // 显示弹框
      this.userDialog = true
      // 更改弹框标题
      this.formTitle = '用户管理'
      // 将当前行数据赋值给currentValue
      this.currentValue = JSON.parse(JSON.stringify(rowData))
      // 定义分组已存在用户列表
      for (let i = 0; i < rowData.users.length; i++) {
        this.transferData.rightData.push(rowData.users[i].id)
      }
    },

    /* 管理角色权限 */
    handlePermission(rowData) {
      // 显示弹框
      this.permissionDialog = true
      // 更改弹框标题
      this.formTitle = '权限管理'
      // 将当前行数据赋值给currentValue
      this.currentValue = JSON.parse(JSON.stringify(rowData))
      // 手动设置勾选的节点，确保选中的节点正确
      this.$nextTick(() => {
        this.$refs.form.$refs.tree.setCheckedKeys(this.currentValue.menus)
      })
    },

    /* 表单关闭 */
    handleClose() {
      // 关闭所有Dialog
      this.groupAddDialog = false
      this.userDialog = false
      this.permissionDialog = false
      // 清空表单及空梭框数据
      this.currentValue = undefined
      this.transferData.rightData = []
      // 关闭loading状态
      this.loading = false
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

    /* 分组用户修改 */
    handleUserSubmit(formData) {
      this.loading = true
      changeGroupUser(formData).then((res) => {
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

    /* 分组权限修改 */
    handlePermissionSubmit(formData) {
      this.loading = true
      changeGroupPermission(formData).then((res) => {
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
