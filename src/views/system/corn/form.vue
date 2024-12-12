<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" size="small" style="width: 95%">
      <el-row>
        <el-col :span="24">
          <el-form-item label="任务名称：" prop="name">
            <el-input v-model="form.name" autocomplete="off" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item v-if="form.type === 2" label="表达式：" prop="cron_expr">
            <el-input v-model="form.cron_expr" placeholder="分 时 日 月 周" />
            <div class="help-block" style="color: #999; font-size: 12px">计划任务表达式《<el-link type="primary" style="font-size: 12px" :underline="false" @click="openDescribe">填写说明</el-link>》</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="任务类型：" prop="type">
            <el-radio-group v-model="form.type" size="small">
              <el-radio-button :label="1" disabled>调用URL</el-radio-button>
              <el-radio-button :label="2">系统内置方法</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item v-if="form.type === 2" label="内置方法：" prop="built_in_method">
            <el-select v-model="form.built_in_method" placeholder="请输入或选择" allow-create filterable clearable style="width: 100%">
              <el-option v-for="item in methods" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="状态：">
            <el-switch
              v-model="form.enabled"
              active-text="启用"
              inactive-text="禁用"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div>
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button type="primary" size="mini" :loading="loading" @click="handleSubmit">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'CronAddForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          type: 2,
          name: '',
          cron_expr: '',
          built_in_method: '',
          enabled: true
        }
      }
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      // 请务随意更改value，该值用于后端任务执行逻辑判断
      methods: [
        { value: 'password_expire_notify', name: '用户密码过期通知' },
        { value: 'user_sync', name: '用户同步' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'change' }
        ],
        cron_expr: [
          { required: true, message: '请填写计划任务表达式', trigger: 'change' }
        ],
        built_in_method: [
          { required: true, message: '请选择内置方法', trigger: 'change' }
        ]
      }
    }
  },
  methods: {

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('submit', this.form)
      })
    },

    /* 计划任务填写说明 */
    openDescribe() {
      this.$emit('describe')
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
