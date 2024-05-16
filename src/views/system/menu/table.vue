<template>
  <el-table
    ref="table"
    tooltip-effect="dark"
    style="width: 100%; margin-top:10px;"
    size="mini"
    border
    :data="tableData"
    :row-key="row => row.id"
    :expand-row-keys="expandRows"
    @expand-change="handleExpandChange"
  >
    <el-table-column type="expand" width="40">
      <template slot-scope="props">
        <el-table :data="tableData[props.$index].SubMenus" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
          <el-table-column type="selection" width="40" />
          <el-table-column prop="title" label="title" min-width="4%" />
          <el-table-column prop="name" label="name" min-width="6%" />
          <el-table-column prop="icon" label="icon" min-width="5%" />
          <el-table-column prop="path" label="path" min-width="10%" />
          <el-table-column prop="component" label="component" min-width="10%" />
          <el-table-column prop="sort" label="排序" min-width="3%" align="center" />
          <el-table-column label="操作" min-width="10%" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="title" min-width="4%" />
    <el-table-column prop="name" label="name" min-width="4%" />
    <el-table-column prop="icon" label="icon" min-width="5%" />
    <el-table-column prop="path" label="path" min-width="10%" />
    <el-table-column prop="component" label="component" min-width="10%" />
    <el-table-column prop="sort" label="排序" min-width="3%" align="center" />
    <el-table-column label="操作" min-width="10%" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'MenuListTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {

    /* 编辑按钮 */
    handleEdit(value) {
      this.$emit('edit', value)
    },

    /* 删除按钮 */
    handleDelete(value) {
      this.$emit('delete', value)
    },

    /* 确保同时只展开一行 */
    handleExpandChange(row, expandedRows) {
      if (expandedRows.length > 1) {
        this.$refs.table.toggleRowExpansion(expandedRows[0])
      }
    }
  }
}
</script>
