<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right">
      <el-dropdown trigger="click" placement="bottom">
        <div class="right-item">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="right-item-img">
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
      title="个人信息"
      :visible.sync="userInfoDrawer"
      direction="rtl"
      :show-close="false"
      size="500px"
      @close="userInfoDrawer = false"
    >
      <el-form ref="form" :model="form" :validate-on-rule-change="false" label-position="right" label-width="120px" style="width: 95%">
        <el-form-item label="姓名：">
          <span>{{ name }}</span>
        </el-form-item>
        <el-form-item label="登录用户名：">
          <span>{{ username }}</span>
        </el-form-item>
        <el-form-item label="邮箱：">
          <span>{{ email }}</span>
        </el-form-item>
        <el-form-item label="手机号：">
          <span>{{ phone_number }}</span>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="userInfoDrawer = false">取 消</el-button>
        <el-button type="primary">提 交</el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userInfoDrawer: false,
      form: {}
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'username',
      'email',
      'phone_number'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
</style>
