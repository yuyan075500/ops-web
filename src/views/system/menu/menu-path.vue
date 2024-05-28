<template>
  <el-table :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:10px;" size="mini" border>
    <el-table-column type="selection" width="40" />
    <el-table-column prop="description" label="接口名称" min-width="4%" />
    <el-table-column prop="path" label="接口地址" min-width="6%" />
    <el-table-column prop="method" label="请求方法" min-width="5%" />
  </el-table>
</template>

<script>
export default {
  name: 'SubMenuPathListTable',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>

