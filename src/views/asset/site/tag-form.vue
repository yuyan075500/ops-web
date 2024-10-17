<template>
  <el-form ref="form" :model="form" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%">
    <el-form-item label="标签：" prop="tags">
      <el-select
        v-model="form.tags"
        size="medium"
        multiple
        :multiple-limit="5"
        filterable
        remote
        allow-create
        default-first-option
        placeholder="请输入关键词，按回车确认"
        :remote-method="handleSearch"
        :loading="loadingSearch"
      >
        <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.label" />
      </el-select>
      <div class="help-block" style="color: #999; font-size: 12px;">最多可以为站点添加至多5个标签，清除标签仅删除之间的关联关系，并不会实际从数据库删除</div>
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
import { getTags } from '@/api/asset/site'

export default {
  name: 'SiteTagForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          tags: ''
        }
      }
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      loadingSearch: false,
      tagList: [],
      tagOptions: []
    }
  },
  mounted() {
    // 获取标签列表
    getTags().then((res) => {
      this.tagList = res.data.map(item => {
        return { value: `${item.id}`, label: `${item.name}` }
      })
    })
  },
  methods: {

    /* 标签过虑 */
    handleSearch(query) {
      if (query !== '') {
        this.loadingSearch = true
        setTimeout(() => {
          this.loadingSearch = false
          this.tagOptions = this.tagList.filter(item => {
            return item.label.indexOf(query) > -1
          })
        }, 200)
      } else {
        this.tagOptions = []
      }
    },

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        const data = {
          'id': this.form.id,
          'tags': this.form.tags
        }
        this.$emit('submit', data)
      })
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
// 下拉框样式
::v-deep .el-select {
  width: 100%;
  height: 60px;
  .el-input__inner {
    height: 60px;
  }
}
</style>
