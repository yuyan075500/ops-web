<template>
  <section ref="container" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import Watermark from '@/utils/watermark'

export default {
  name: 'AppMain',
  computed: {
    ...mapGetters([
      'name'
    ]),
    key() {
      return this.$route.path
    }
  },
  mounted: function() {
    // 水印的内容（这里获取的登录用户姓名）
    const name = this.name
    // 获取容器（这里是右侧内容显示区域）
    Watermark.set(name, this.$refs.container)
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
