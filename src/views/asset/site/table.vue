<template>
  <el-table
    ref="tableList"
    :data="tableData"
    :row-key="row => row.id"
    :expand-row-keys="expandRows"
    tooltip-effect="dark"
    style="width: 100%; margin-top:10px;"
    size="mini"
    border
    @expand-change="handleExpandChange"
  >
    <el-table-column type="expand" width="40">
      <template slot-scope="props">
        <el-table :data="tableData[props.$index].sites" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
          <el-table-column type="selection" width="40" />
          <el-table-column prop="name" label="站点名称" min-width="7%" />
          <el-table-column prop="icon" label="图标" min-width="2%" align="center">
            <template slot-scope="scope">
              <div class="site-icon">
                <img :src="scope.row.icon">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sso" label="统一认证" min-width="4%" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.sso" size="small">{{ scope.row.sso_type }}</el-tag>
              <el-tag v-else type="danger" size="small">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="all_open" label="允许所有用户访问" min-width="4%">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.all_open" @change="handleAllOpen(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="description" label="站点描述" min-width="10%" />
          <el-table-column label="操作" min-width="10%" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleSiteEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleSiteDelete(scope.row)">删除</el-button>
              <el-dropdown style="margin-left: 10px" trigger="click">
                <el-button size="mini" type="text">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button class="el-button-text" size="mini" type="text" @click="handleUser(scope.row)">用户授权</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button class="el-button-text" size="mini" type="text" @click="handleDetail(scope.row)">站点详情</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="分组名称" min-width="20%" />
    <el-table-column label="操作" min-width="10%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleGroupEdit(scope.row)">编辑</el-button>
        <el-button size="mini" type="text" @click="handleGroupDelete(scope.row)">删除</el-button>
        <el-button size="mini" type="text" @click="handleAddSite(scope.row)">新增站点</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'GroupTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      server: window.location.protocol + '//' + window.location.host,
      expandRows: []
    }
  },
  methods: {
    /* 编辑分组按钮 */
    handleGroupEdit(value) {
      this.$emit('edit', value)
    },

    /* 编辑站点按钮 */
    handleSiteEdit(value) {
      this.$emit('edit', value)
    },

    /* 显示站点详情 */
    handleDetail(value) {
      this.$emit('detail', value)
    },

    /* 删除分组按钮 */
    handleGroupDelete(value) {
      this.$emit('delete', value)
    },

    /* 删除站点按钮 */
    handleSiteDelete(value) {
      this.$emit('delete', value)
    },

    /* 新增站点 */
    handleAddSite(value) {
      this.$emit('add', value)
    },

    /* 开放所有用户访问权限 */
    handleAllOpen(value) {
      this.$emit('open', value)
    },

    /* 站点用户管理 */
    handleUser(value) {
      this.$emit('user', value)
    },

    /* 确保同时只能展示一个分组 */
    handleExpandChange(row, expandedRows) {
      if (expandedRows.length > 1) {
        this.$refs.tableList.toggleRowExpansion(expandedRows[0])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button-text {
    border-color: transparent;
    color: #606266;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
}
.site-icon {
  display: flex;
  justify-content: center;

  img {
    width: 25px;
    height: 25px;
    display: block;
  }
}
</style>
