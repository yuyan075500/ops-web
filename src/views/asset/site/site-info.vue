<template>
  <div class="app-container">
    <el-form ref="form" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%">
      <el-descriptions title="站点信息" direction="vertical" :column="2" border>
        <template slot="extra">
          <el-button type="primary" size="small" @click="cancel">关闭</el-button>
        </template>
        <el-descriptions-item label="站点名称">{{ form.name }}</el-descriptions-item>
        <el-descriptions-item label="登录地址">{{ form.address }}</el-descriptions-item>
        <el-descriptions-item label="SSO认证">
          <el-tag v-if="form.sso" type="success" size="small">开启</el-tag>
          <el-tag v-else type="danger" size="small">关闭</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="SSO认证类型">
          <span v-if="form.sso_type === 1">CAS3.0</span>
          <span v-if="form.sso_type === 2">OAuth2</span>
          <span v-if="form.sso_type === 3">SAML2</span>
        </el-descriptions-item>
        <el-descriptions-item label="站点描述" span="2">{{ form.description }}</el-descriptions-item>
        <el-descriptions-item label="回调地址" span="2">{{ form.callback_url }}</el-descriptions-item>
        <el-descriptions-item label="Client ID">
          <el-button
            v-clipboard:copy="form.client_id"
            v-clipboard:success="onCopySuccess"
            type="text"
          >
            {{ form.client_id }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="Client Secret">
          <el-button
            v-clipboard:copy="form.client_secret"
            v-clipboard:success="onCopySuccess"
            type="text"
          >
            {{ form.client_secret }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'SiteInfo',
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {

    onCopySuccess() {
      Message({
        message: '复制成功',
        type: 'success',
        duration: 1000
      })
    },

    /* 关闭 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
