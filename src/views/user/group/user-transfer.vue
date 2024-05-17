<template>
  <el-form ref="form" :model="form" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%" size="small">
    <el-form-item>
      <el-transfer
        v-model="transferData.rightData"
        style="text-align: left;display: inline-block"
        filterable
        filter-placeholder="可输入用户姓名搜索"
        :titles="['可选用户', '已选用户']"
        :button-texts="['移除', '加入']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :data="transferData.leftData"
      />
    </el-form-item>
    <el-form-item>
      <div>
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="handleSubmit">确 定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AddUserTransfer',
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: {
      type: Boolean
    },
    // 穿梭框数据
    transferData: {
      type: Object,
      default() {
        return {}
      }
    }

  },
  methods: {

    /* 提交表单 */
    handleSubmit() {
      const data = {
        'id': this.form.id,
        'users': this.transferData.rightData
      }
      this.$emit('submit', data)
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
