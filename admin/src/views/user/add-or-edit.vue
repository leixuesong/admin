<template>
  <el-form
    ref="form"
    v-loading="loading.detail"
    :model="formData"
    :rules="rules"
    label-width="100px"
    element-loading-text="加载中"
  >
    <el-form-item label="账号" prop="admin_account">
      <el-input v-model="formData.admin_account" clearable />
    </el-form-item>
    <el-form-item label="密码" prop="admin_password" show-password>
      <el-input v-model="formData.admin_password" clearable />
    </el-form-item>
    <el-form-item label="手机号" prop="admin_phone">
      <el-input v-model="formData.admin_phone" clearable />
    </el-form-item>
    <el-form-item label="邮箱" prop="admin_email">
      <el-input v-model="formData.admin_email" clearable />
    </el-form-item>
    <el-form-item label="备注" prop="admin_remarks">
      <el-input v-model="formData.admin_remarks" clearable />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="formData.status" placeholder="">
        <el-option label="正常" :value="0" />
        <el-option label="停用" :value="1" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loading: {
        detail: false
      },
      rules: {},
      formData: {
        status: 0
      },
      userlist: []
    }
  },
  created() {
    this.$watch(
      () => {
        return [this.id, this.visible]
      },
      (newVal, oldVal) => {
        const [id, visible] = newVal
        !visible && this.$refs['form'].resetFields()
        if (visible && id) {
          this.init()
        }
      },
      {
        immediate: true
      }
    )
  },
  methods: {
    async init() {
      this.userlist = await this.$request({
        url: '/user/all'
      })
      if (this.id !== -1) {
        this.formData = await this.$request({
          url: '/user/info',
          data: {
            id: this.id
          }
        })
      }
    },
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    async submitForm() {
      let result = {}
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.id !== -1) {
            result = await this.$request({
              url: '/user/edit',
              data: {
                ...this.formData
              }
            })
          } else {
            result = await this.$request({
              url: '/user/add',
              data: {
                ...this.formData
              }
            })
          }
          if (result) {
            this.$message({
              showClose: true,
              message: '保存成功！',
              type: 'success'
            })
            this.$emit('refreshList')
            this.close()
          } else {
            this.$message({
              showClose: true,
              message: result.message,
              type: 'success'
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped></style>
