<template>
  <el-form ref="transferData" :model="transferData">
    <el-form-item>
      <el-transfer
        v-model="transferData.existUser"
        style="text-align: left; display: inline-block"
        filterable
        filter-placeholder="请输入用户姓名"
        :titles="['可选用户', '已分享用户']"
        :button-texts="['移除', '加入']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :data="transferData.optionalUser"
      >
      </el-transfer>
    </el-form-item>
    <div class="btn">
      <el-button size="mini" @click="cancel">取 消</el-button>
      <el-button type="primary" size="mini" @click="handleSubmit">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'UserTransfer',
  props: {
    transferData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {

    /* 提交 */
    handleSubmit() {
      const { id, existUser } = this.transferData
      const data = { 'id': id, 'users': existUser }
      console.log(data)
      this.$emit('submit', data)
    },

    /* 关闭 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
  .btn {
    display: flex;
    justify-content: center;
  }
</style>
