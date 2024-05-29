<template>
  <div>
    <el-form ref="form" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%" size="small">
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>菜单权限</span>
              </div>
              <!-- 树形菜单 -->
              <div class="down-tree">
                <el-tree
                  ref="tree"
                  show-checkbox
                  default-expand-all
                  node-key="name"
                  highlight-current
                  :check-strictly="checkStrictly"
                  :default-checked-keys="form.menus"
                  :expand-on-click-node="false"
                  :check-on-click-node="true"
                  :data="menuData"
                />
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>接口权限</span>
              </div>
              <div class="down-tree">
                <ul class="item">
                  <li v-for="(item, index) in checkData" :key="index">
                    <el-checkbox v-model="item.flag" :indeterminate="isIndeterminate(item)" @change="(val) => handleCheckAll(val, item)">{{ item.menu_name }}</el-checkbox>
                    <el-checkbox-group v-model="form.paths" class="checkbox-group" @change="handleChange(item)">
                      <el-checkbox v-for="path in item.paths" :key="path.id" :label="path.name" class="checkbox-group-item">{{ path.description }}</el-checkbox>
                    </el-checkbox-group>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form-item>
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
import { getPathListAll } from '@/api/system/path'
import { getMenuListAll } from '@/api/system/menu'

export default {
  name: 'AddPermissionTree',
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
    checkStrictly: {
      type: Boolean
    }
  },
  data() {
    return {
      checkData: [],
      menuData: []
    }
  },
  created() {
    this.getMenuList()
    this.getList()
  },
  methods: {

    /* 获取接口权限 */
    getList() {
      getPathListAll().then((res) => {
        this.checkData = res.data
      })
    },

    // 获取所有菜单
    getMenuList() {
      getMenuListAll().then((res) => {
        const data = res.data.items
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          const menu = {
            name: item.name,
            label: item.title
          }

          if (item.SubMenus) {
            menu.children = item.SubMenus.map(subItem => ({
              name: subItem.name,
              label: subItem.title
            }))
          }
          this.menuData.push(menu)
        }

        this.$nextTick(() => {
          // 设置选中的菜单
          this.$refs.tree.setCheckedKeys(this.form.menus)
          // 设置父子菜单关联关系
          this.$emit('strictly')
        })
      })
    },

    // 全选&&全部取消
    handleCheckAll(val, item) {
      // 过滤掉没有选中的数据，item.child中不包含v时返回-1
      const next = item.paths.map(item => item.name)
      const filterArr = this.form.paths.filter(
        (v) => next.indexOf(v) === -1
      )
      this.form.paths = val ? filterArr.concat(next) : filterArr
    },

    // 筛选框勾选时状态变化
    handleChange(val) {
      const infoLists = val.paths.map(ite => ite.name)
      infoLists.every((v) => {
        if (this.form.paths.indexOf(v) > -1) {
          val.flag = true
        } else {
          val.flag = false
        }
      })
    },

    // 判断是否为全选状态
    isIndeterminate(item) {
      const infoLists = item.paths.map(ite => ite.name)
      return (
        infoLists.some((v) => this.form.paths.indexOf(v) > -1) &&
        !infoLists.every((v) => this.form.paths.indexOf(v) > -1)
      )
    },

    /* 提交表单 */
    handleSubmit() {
      const data = {
        'id': this.form.id,
        'menu_permissions': this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys()),
        'path_permissions': this.form.paths
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

<style scoped>
.down-tree{
  height: 300px;
  display: block;
  overflow-y: auto;
}
.item{
  list-style-type: none; /* 不显示圆点 */
  padding-left: 20px;
}
.checkbox-group{
  /* 指定分组中元素缩进像素 */
  padding-left: 30px;
}
.checkbox-group-item{
  /* 指定分组中每个筛选框的宽度 */
  width: 150px;
}
</style>
