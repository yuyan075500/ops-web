<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right">
      <el-dropdown trigger="click" placement="bottom">
        <div class="right-item">
          <img v-if="avatar !== ''" :src="avatar" class="right-item-img">
          <img v-else src="../../assets/avatar/default.jpg" class="right-item-img">
          <div class="user-name">{{ name }}</div>
          <i class="el-icon-caret-bottom" />
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item>
              <span @click="userInfoDrawer = true">个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <span style="display:block;">注销</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>
    </div>

    <el-drawer
      :visible.sync="userInfoDrawer"
      direction="rtl"
      :show-close="false"
      size="800px"
      @close="userInfoDrawer = false"
    >
      <el-form ref="form" :model="form" :validate-on-rule-change="false" label-position="right" label-width="120px" style="width: 100%;padding-left: 20px;padding-right: 20px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>菜单权限</span>
              </div>
              <!-- 树形菜单 -->
              <div class="down-tree">
                <el-tree
                  ref="tree"
                  default-expand-all
                  node-key="name"
                  :data="newMenus"
                />
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>基础信息</span>
              </div>
              <div class="down-tree">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名：">
                      <span>{{ name }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用户名：">
                      <span>{{ username }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱：">
                      <span>{{ email }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="手机号：">
                      <span>{{ phone_number }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="角色：">
                  <el-tag
                    v-for="(item, index) in roles"
                    :key="index"
                    size="small"
                    style="margin-right: 10px"
                  >
                    {{ item }}
                  </el-tag>
                </el-form-item>
                <el-form-item label="头像：">
                  <el-upload
                    name="avatar"
                    class="avatar-uploader"
                    accept="image/jpeg,image/jpg,image/png"
                    :headers="{ Authorization: `Bearer ${token}` }"
                    :action="uploadUrl"
                    :limit="1"
                    :multiple="false"
                    :auto-upload="true"
                    :file-list="fileList"
                    :show-file-list="false"
                    :on-change="handleChange"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                  >
                    <img v-if="avatarPreview !== undefined" :src="avatarPreview" class="avatar">
                    <img v-else-if="avatar !== ''" :src="avatar" class="avatar">
                    <img v-else src="../../assets/avatar/default.jpg" class="avatar">
                  </el-upload>
                  <div class="help-block" style="color: #999; font-size: 12px; line-height: 0px;">点击图片可进行头像更换</div>
                </el-form-item>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card class="box-card" shadow="hover" style="margin-top: 20px;">
          <div slot="header" class="clearfix">
            <span>接口权限</span>
          </div>
          <div>
            <el-tag
              v-for="(item, index) in permissions"
              :key="index"
              size="small"
              style="margin-bottom: 10px;margin-right: 10px"
            >
              {{ item }}
            </el-tag>
          </div>
        </el-card>
        <!-- <div class="drawer-footer">
          <el-button @click="userInfoDrawer = false">取 消</el-button>
          <el-button type="primary">提 交</el-button>
        </div> -->
      </el-form>
    </el-drawer>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getToken } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userInfoDrawer: false,
      form: {},
      avatarPreview: undefined,
      fileList: [],
      token: getToken(),
      newMenus: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'username',
      'email',
      'menus',
      'roles',
      'permissions',
      'phone_number'
    ]),
    uploadUrl() {
      if (process.env.VUE_APP_BASE_API === '/') {
        return window.location.protocol + '//' + window.location.hostname + '/api/v1/user/avatarUpload'
      } else {
        return process.env.VUE_APP_BASE_API + '/api/v1/user/avatarUpload'
      }
    }
  },
  created() {
    // 根据当前用户的菜单，生成菜单树，用于展示用户当前菜单权限
    for (let i = 0; i < this.menus.length; i++) {
      const item = this.menus[i]
      if (!item.meta || !item.meta.title) {
        continue
      }
      const menu = {
        name: item.name,
        label: item.meta.title
      }
      if (item.children) {
        menu.children = item.children.map(subItem => ({
          name: subItem.name,
          label: subItem.meta.title
        }))
      }
      this.newMenus.push(menu)
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },

    /* 图片发生变化 */
    handleChange(file, fileList) {
      this.avatarPreview = URL.createObjectURL(file.raw)
    },

    /* 图片上传成功回调*/
    handleError(err, file, fileList) {
      // 获取错误消息
      const errorMessage = err.message
      const jsonStr = errorMessage.replace('Error: ', '')
      const errorObj = JSON.parse(jsonStr)
      const msg = errorObj.msg
      Message({
        message: msg,
        type: 'error',
        duration: 2 * 1000
      })
    },

    /* 图片上传成功回调*/
    handleSuccess(res, file, fileList) {
      if (res.code === 0) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 2000
        })
        this.fileList = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
}
// 个人信息页面头像
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .avatar {
      width: 130px;
      height: 130px;
      display: block;
    }
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
}

// 右上角用户头像与用户名
.right {
  flex: 7;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px !important;
  padding-right: 20px;

  .right-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }

    .right-item-img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .user-name {
      margin: 0px 5px;
    }
  }
}
// 个人信息页面按钮
.drawer-footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background-color: white;
}

// 菜单权限和基础信息高度固定
.down-tree{
  height: 360px;
  display: block;
  overflow-y: auto;
}
</style>
