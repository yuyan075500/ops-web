<template>
  <div class="form-container">
    <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false">
      <el-form-item>
        <el-upload
          class="upload-demo"
          drag
          action="#"
          accept=".xlsx, .xls"
          :limit="1"
          :show-file-list="true"
          :auto-upload="false"
          :multiple="false"
          :on-change="handleFileChange"
          :on-preview="handlePreview"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip">点击《<a href="javascript:;" style="color: #66b1ff;" @click="handleDownloadTemplate">获取模板</a>》填写账号信息，解析成功后点击确定添加</div>
        </el-upload>
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
import * as XLSX from 'xlsx'

export default {
  name: 'UploadForm',
  props: {
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        accounts: []
      },
      rules: {
        accounts: [
          { required: true, message: '请上传数据', trigger: 'change' }
        ]
      }
    }
  },
  methods: {

    /* 文件解析 */
    async handleFileChange(file) {
      const requiredFields = ['name', 'login_address', 'login_method', 'username', 'password', 'note']

      try {
        const data = await file.raw.arrayBuffer()
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // 检查表头是否正确
        const headers = jsonData[0]
        const missingFields = requiredFields.filter(field => !headers.includes(field))

        if (missingFields.length > 0) {
          this.$message.error(`缺少字段：${missingFields.join(', ')}`)
          return
        }

        // 解析并保存数据
        const accounts = jsonData.slice(1).map(row => {
          const account = {}
          headers.forEach((header, index) => {
            account[header] = row[index]
          })
          // 检查是否为非空行（至少有一个字段有数据）
          if (Object.values(account).some(value => value !== undefined && value !== null && value !== '')) {
            return account
          } else {
            return null
          }
        }).filter(account => account !== null)

        // 更新表单数据
        this.form.accounts = accounts
        this.$emit('table', this.form.accounts)
      } catch (error) {
        this.$message.error('文件解析失败，请检查文件格式')
      }
    },

    /* 提交的数据预览 */
    handlePreview() {
      this.$emit('table', this.form.accounts)
    },

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('submit', this.form)
      })
    },

    /* 下载模板文件 */
    handleDownloadTemplate() {
      const fileUrl = '/upload-account-list.xlsx'
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = 'upload-account-list.xlsx'
      link.click()
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
}
</style>
