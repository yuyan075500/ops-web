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
        <el-col :span="10">
          <el-form-item label="任务类型：" prop="type">
            <el-radio-group v-model="form.type" size="small">
              <el-radio-button :label="1" disabled>间隔任务</el-radio-button>
              <el-radio-button :label="2">周期任务</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <!-- <el-form-item v-if="form.type === 0" label="执行时间：">
            <el-row>
              每隔
              <el-input-number
                v-model="form.interval.every"
                :min="0"
                style="margin: 0 5px 0 5px;width: 150px;"
              />
              <el-select v-model="form.interval.period" style="width: 129px">
                <el-option
                  v-for="item in intervalList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-row>
          </el-form-item> -->
          <el-form-item v-if="form.type === 2" label="表达式：" prop="cron_expr">
            <el-input v-model="form.cron_expr" placeholder="分 时 日 月 周" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="执行方式：" prop="method">
            <el-radio-group v-model="form.method" size="small">
              <el-radio-button :label="1" disabled>调用URL</el-radio-button>
              <el-radio-button :label="2">系统内置方法</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <!-- <el-form-item v-if="form.url === 0" label="URL地址：">
            <el-input v-model="form.url" autocomplete="off" clearable />
          </el-form-item> -->
          <el-form-item v-if="form.method === 2" label="内置方法：" prop="built_in_method">
            <el-select v-model="form.built_in_method" placeholder="请输入或选择" allow-create filterable clearable style="width: 100%">
              <el-option v-for="(item, index) in methods" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="10">
          <el-form-item label="一次性任务：">
            <el-switch
              v-model="form.one_off"
              active-text="是"
              inactive-text="否"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
            <div class="help-block" style="color: #999; font-size: 12px">开启此选项则该任务只执行一次</div>
          </el-form-item>
        </el-col> -->
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
          <el-button type="primary" size="mini" @click="handleSubmit">确 定</el-button>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'CornAddForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          type: 2,
          method: 2,
          name: '',
          cron_expr: '',
          built_in_method: '',
          enabled: true
        }
      }
    }
  },
  data() {
    return {
      methods: ['用户密码过期提醒', 'OpenLDAP用户同步', 'Windows AD用户同步'],
      // intervalList: [
      //   { id: 'days', name: '天' },
      //   { id: 'hours', name: '小时' },
      //   { id: 'minutes', name: '分钟' },
      //   { id: 'seconds', name: '秒' }
      // ],
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

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
