<template>
  <div class="site-container">
    <!-- 搜索 -->
    <el-container>
      <el-header class="el-header">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="queryParams.name" class="el-input" placeholder="Search..." size="small" clearable>
              <template slot="append">
                <el-button type="primary" @click="searchList">查询</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <div class="container">
          <div v-for="(group, index) in tableData" :key="group.id">
            <div class="container-header">{{ group.name }}</div>
            <div class="container-body">
              <div v-for="item in tableData[index].sites" :key="item.id" class="item-block">
                <a :href="item.address" target="_blank">
                  <div class="item-top">
                    <div class="item-logo">
                      <img v-if="item.icon !== ''" :src="item.icon">
                      <img v-else src="../../assets/web.jpg" class="logo">
                    </div>
                    <div class="item-body">
                      <span class="title">{{ item.name }}</span>
                      <span class="notice">{{ item.description }}</span>
                    </div>
                  </div>
                </a>
                <div v-if="item.tags.length > 0" class="item-tag">
                  <el-tag v-for="(tag, idx) in item.tags" :key="idx" size="mini">{{ tag }}</el-tag>
                </div>
                <div class="item-bottom">
                  <a href="" target="_blank">
                    <div>官网地址</div>
                  </a>
                  <div class="divider" />
                  <a href="" target="_blank">
                    <div>帮助文档</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getSiteGuideList } from '@/api/asset/site'

export default {
  data() {
    return {
      tableData: [],
      queryParams: {
        name: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* 查找数据 */
    searchList() {
      this.getList()
    },

    /* 获取数据 */
    getList() {
      getSiteGuideList(this.queryParams).then((res) => {
        this.tableData = res.data.items
      })
    }
  }
}
</script>

<style>
/* 搜索框高度 */
.site-container .el-input__inner {
  height: 40px;
}
</style>

<style scoped>
.item-tag {
  display: flex;
  flex-wrap: wrap; /* 允许标签换行 */
  gap: 4px; /* 标签之间的间距 */
  padding: 0px 20px 5px;
}
.site-container{
  /* 搜索页面背景色和边距 */
  background-color: #d0c9c912;
  padding: 20px;
}
.el-header {
  /* 搜索表单左右居中  */
  text-align: center;
}
.el-input {
  /* 搜索框宽度 */
  width: 350px;
  /* 搜索按钮高度 */
  height: 40px;
}

.container {
  background-color: #fff;
}

.container-header {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  height: 40px;
  padding-left: 10px;
}

.container-body {
  display: flex;
  border-top: 1px solid #dfdfdf;
  padding: 20px 10px 0 10px;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100%;
}

.container div div {
  display: flex;
}

.item-block {
  border: 1px solid #dfdfdf;
  flex-direction: column;
  height: 160px;
  /* width: 267px; */
  margin-bottom: 20px;
  margin-right: 10px;
  justify-content: space-between;
  flex: 1 0 267px;
  max-width: 267px;
}

@media (min-width: 534px) { /* 当B标签的个数超过一行时 */
  .container-body {
    justify-content: flex-start; /* 将B标签左对齐 */
  }
  .item-block {
    max-width: calc((100% - 16px) / 2); /* 计算B标签宽度 */
  }
  @media (min-width: 801px) { /* 当B标签的个数超过两行时 */
    .item-block {
      max-width: calc((100% - 32px) / 3); /* 计算B标签宽度 */
    }
    @media (min-width: 1068px) { /* 当B标签的个数超过三行时 */
      .item-block {
        max-width: calc((100% - 48px) / 4); /* 计算B标签宽度 */
      }
      /* 可以根据需要继续添加媒体查询 */
    }
  }
}

a:link {
  /* 超链接正常状态下的样式 */
  color: #000000;
  /* 黑色 */
  text-decoration: none;
  /* 无下划线 */
}

a:visited {
  /* 访问过的超链接 */
  color: #000000;
  /* 黑色 */
  text-decoration: none;
  /* 无下划线 */
}

.item-top {
  height: 80px;
  padding: 20px;
}

.item-logo {
  width: 30%;
  height: 50px;
  margin-right: 20px;
}

.item-logo img {
  width: 55px;
  height: 55px;
}

.item-body {
  flex-direction: column;
  width: 79%;
}

.item-bottom {
  height: 40px;
  justify-content: space-around;
  align-items: center;
  color: #888888;
  background-color: #F7F7F7;
  font-size: 13px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
}

.notice {
  font-size: 12px;
  color: #888;
}
.divider {
  height: 20px;
  width: 1px;
  background-color: #dfdfdf;
}
</style>
