<template>
  <el-form
    ref="form"
    v-loading="loading.detail"
    :model="formData"
    :rules="rules"
    label-width="100px"
    element-loading-text="加载中"
  >
    <el-form-item label="商品名称" prop="comm_name">
      <el-input v-model="formData.comm_name" clearable />
    </el-form-item>
    <el-form-item label="商品图片" prop="comm_img">
      <el-upload
        class="avatar-uploader"
        action="../api/merchant/login/upload"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="商品说明" prop="comm_note">
      <el-input type="textarea" v-model="formData.comm_note" clearable />
    </el-form-item>
    <el-form-item label="金额" prop="comm_amount">
      <el-input v-model="formData.comm_amount" clearable />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="formData.status" placeholder="请选择">
        <el-option label="正常" :value="0" />
        <el-option label="停用" :value="1" />
        <el-option label="待审核" :value="2" />
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
      imageUrl: '',
      loading: {
        detail: false
      },
      rules: {},
      formData: {
        comm_name:'',
        comm_img:'',
        comm_note:'',
        status: 0
      }
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
    handleSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.formData.comm_img = res.data.path
      },
      beforeUpload(file) {
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImage) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isImage && isLt2M;
      },
    async init() {
      if (this.id !== -1) {
        this.formData = await this.$request({
          url: '/product/info',
          data: {
            id: this.id
          }
        })
        this.imageUrl = this.$ImagePath + this.formData.comm_img
      }
    },
    close() {
      this.$refs.form.resetFields()
      this.formData=this.$options.data().formData
      this.formData.comm_img = ''
      this.$emit('update:visible', false)
    },
    async submitForm() {
      let result = {}
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.id !== -1) {
            result = await this.$request({
              url: '/product/edit',
              data: {
                ...this.formData
              }
            })
          } else {
            result = await this.$request({
              url: '/product/add',
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
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
