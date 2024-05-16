<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%">
    <el-form-item label="菜单类型：" prop="type">
      <el-radio-group v-model="form.type" size="small" :disabled="form.id !== undefined">
        <el-radio-button :label="0">一级菜单</el-radio-button>
        <el-radio-button :label="1">二级菜单</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="form.type === 1" label="一级菜单：" prop="menu_id">
      <el-select v-model="form.menu_id" placeholder="请选择一级菜单" style="width:100%" filterable>
        <el-option v-for="item in menus" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="form.title" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="PATH路径：" prop="path">
          <el-input v-model="form.path" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="form.sort" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Icon名称：" prop="icon">
      <el-input v-model="form.icon" autocomplete="off" clearable />
      <div class="help-block" style="color: #999; font-size: 12px">此名称的图标需要在前端项目的<b>src/icons/svg</b>目录中存在</div>
    </el-form-item>
    <el-form-item label="组件：" prop="component">
      <el-input v-model="form.component" autocomplete="off" clearable />
      <div class="help-block" style="color: #999; font-size: 12px">组件的路径，需要在前端项目中的<b>src/views</b>目录中存在，如果包含子菜单则此处为Layout</div>
    </el-form-item>
    <el-form-item>
      <div>
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleSubmit">确 定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'MenuAddForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          title: '',
          name: '',
          icon: '',
          path: '',
          component: 'Layout',
          sort: '',
          type: 0
        }
      }
    },
    menus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入菜单显示名称', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'change' }
        ],
        icon: [
          { required: true, message: '请输入菜单的Icon图标名称', trigger: 'change' }
        ],
        path: [
          { required: true, message: '请输入菜单的Path路径', trigger: 'change' }
        ],
        component: [
          { required: true, message: '请输入菜单的组件路径', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入菜单的顺序', trigger: 'change' }
        ],
        menu_id: [
          { required: true, message: '请选择一级菜单', trigger: 'change' }
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
