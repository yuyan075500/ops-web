<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="150px" style="width: 95%" size="small">
    <el-row>
      <el-col :span="10">
        <el-form-item label="站点名称：" prop="name">
          <el-input v-model="form.name" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="登录地址：" prop="address">
          <el-input v-model="form.address" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="SSO 认证：" prop="sso">
          <el-switch v-model="form.sso" />
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="认证类似：" prop="sso_type">
          <el-radio-group v-model="form.sso_type">
            <el-radio :label="1">CAS3.0</el-radio>
            <el-radio :label="2">OAuth2</el-radio>
            <el-radio :label="3">SAML2</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="站点描述：" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item v-if="form.sso_type !== 3" label="回调地址：" prop="callback_url">
          <el-input v-model="form.callback_url" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item v-else label="SP EntityID：" prop="entity_id">
          <el-input v-model="form.entity_id" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20">
        <el-form-item label="SP Metadata URL：">
          <el-input v-model="form.sp_metadata_url" autocomplete="off" clearable />
          <div class="help-block" style="color: #999; font-size: 12px;">输入SP Metadata URL可以获取到 SP 的证书和 EntityID</div>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label-width="0px">
          <el-button type="primary" size="mini" :loading="loading" :disabled="form.sso_type !== 3 || form.sso === false" @click="handleMetadata">获 取</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="SP 证书：" prop="certificate">
          <el-input v-model="form.certificate" type="textarea" :rows="3" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="站点图标：">
      <el-upload
        ref="upload"
        name="icon"
        class="logo-uploader"
        accept="image/jpeg,image/jpg,image/png"
        :headers="{ Authorization: `Bearer ${token}` }"
        :action="uploadUrl"
        :limit="1"
        :multiple="false"
        :auto-upload="true"
        :file-list="fileList"
        :show-file-list="false"
        :on-success="handleSuccess"
      >
        <img v-if="logoPreview !== undefined" :src="logoPreview" class="logo">
        <img v-else-if="form.icon !== ''" :src="form.icon" class="logo">
        <img v-else src="../../../assets/web.jpg" class="logo">
      </el-upload>
      <div class="help-block" style="color: #999; font-size: 12px; line-height: 0px;">点击图片可更换图标</div>
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
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { ParseSPMetadata } from '@/api/sso/saml'

export default {
  name: 'SiteAddForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          name: '',
          icon: '',
          address: '',
          site_group_id: null,
          description: '',
          callback_url: null,
          entity_id: null,
          certificate: null,
          sp_metadata_url: null,
          sso_type: null,
          sso: false
        }
      }
    },
    group: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      fileList: [],
      logoPreview: undefined,
      token: getToken(),
      rules: {
        name: [
          { required: true, message: '请输入站点名称', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入站点登录地址', trigger: 'change' }
        ],
        sso: [
          { required: true, trigger: 'change' }
        ],
        callback_url: [
          { required: false, message: '请输入站点回调地址', trigger: 'change' }
        ],
        entity_id: [
          { required: false, message: '请输入 SP 的 EntityID', trigger: 'change' }
        ],
        certificate: [
          { required: false, message: '请输入 SP 的证书', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入站点描述信息', trigger: 'change' }
        ],
        sso_type: [
          { required: false, message: '请选择 SSO 认证类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    uploadUrl() {
      if (process.env.VUE_APP_BASE_API === '/') {
        return window.location.protocol + '//' + window.location.hostname + '/api/v1/site/logoUpload'
      } else {
        return process.env.VUE_APP_BASE_API + '/api/v1/site/logoUpload'
      }
    }
  },
  watch: {
    // 监听form.sso的值，如果为true，则sso_type和callback_url必填
    // 如果为false，则sso_type和callback_url不必填
    'form.sso'(val) {
      if (val) {
        this.rules.sso_type[0].required = true
        this.rules.callback_url[0].required = true
        if (this.form.sso_type === 3) {
          this.rules.entity_id[0].required = true
          this.rules.certificate[0].required = true
        }
      } else {
        this.rules.sso_type[0].required = false
        this.rules.callback_url[0].required = false
        this.rules.entity_id[0].required = false
        this.rules.certificate[0].required = false
        this.$refs.form.clearValidate()
      }
    },
    'form.sso_type'(val) {
      if (val === 3 && this.form.sso === true) {
        this.rules.entity_id[0].required = true
        this.rules.certificate[0].required = true
      } else {
        this.rules.entity_id[0].required = false
        this.rules.certificate[0].required = false
        this.$refs.form.clearValidate()
      }
    }
  },
  created() {
    // 初始化logoPreview为默认图片
    this.logoPreview = undefined

    // 设置必选
    if (this.form.sso === true) {
      this.rules.sso_type[0].required = true
      this.rules.callback_url[0].required = true
      if (this.form.sso_type === 3) {
        this.rules.entity_id[0].required = true
        this.rules.certificate[0].required = true
      }
    }

    if (this.form.id !== undefined && this.form.icon !== '') {
      this.logoPreview = this.form.icon
      this.form.icon = ''
    }
  },
  methods: {

    /* 图片上传成功回调*/
    handleSuccess(res, file, fileList) {
      if (res.code === 0) {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1000
        })
        // 获取logo存储路径
        this.form.icon = res.path
        // 预览新的图片
        this.logoPreview = URL.createObjectURL(file.raw)
      } else {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
      }
      // 清空fileList，否则无法更改图片
      this.$refs.upload.clearFiles()
    },

    /* 解析SP Metadata */
    handleMetadata() {
      ParseSPMetadata({ 'sp_metadata_url': this.form.sp_metadata_url }).then((res) => {
        if (res.code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 1000
          })
          this.form.certificate = res.data.certificate
          this.form.entity_id = res.data.entity_id
        }
      })
    },

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }

        // 如果为新增，则需要给定分组的ID
        if (this.form.id === undefined) {
          this.form.site_group_id = this.group
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

<style lang="scss" scoped>

.logo-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .logo {
      width: 108px;
      height: 108px;
      display: block;
    }
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
}
</style>
