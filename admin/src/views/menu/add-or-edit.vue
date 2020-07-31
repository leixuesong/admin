<template>
  <el-form
    ref="form"
    v-loading="loading.detail"
    :model="formData"
    :rules="rules"
    label-width="100px"
    element-loading-text="加载中"
  >
    <el-form-item label="节点名称" prop="name">
      <el-input v-model="formData.name" clearable />
    </el-form-item>
    <el-form-item label="上级节点" prop="pidList">
      <el-cascader
        ref="cascader"
        v-model="formData.pidList"
        :props="{ checkStrictly: true, label: 'name', value: 'node_id' }"
        :options="menulist"
        @change="handleChange"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="路由控制器" prop="controller">
      <el-input v-model="formData.controller" clearable />
    </el-form-item>
    <el-form-item label="路由方法" prop="method">
      <el-input v-model="formData.method" clearable />
    </el-form-item>
    <el-form-item label="图标" prop="icon">
      <el-input v-model="formData.icon" clearable />
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
        pidList: [0],
        status: 0
      },
      menulist: []
    };
  },
  created() {
    this.$watch(
      () => {
        return [this.id, this.visible];
      },
      (newVal, oldVal) => {
        const [id, visible] = newVal;
        if (visible && id) {
          this.init();
        }
      },
      {
        immediate: true
      }
    );
  },
  methods: {
    handleChange(){
      this.formData.pid= this.formData.pidList[this.formData.pidList.length-1]
    },
    async init() {
      this.menulist = await this.$request({
        url: "/menu/all"
      });
      this.menulist.unshift({ node_id: 0, name: "无" });
      if (this.id !== -1) {
        this.formData = await this.$request({
          url: "/menu/info",
          data: {
            id: this.id
          }
        });
      }
    },
    close() {
      this.formData = this.$options.data().formData
      this.$refs.form.resetFields()
      this.$refs.cascader.focusFirstNode()
      this.$emit("update:visible", false);
    },
    async submitForm() {
      let result = {};
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.id !== -1) {
            result = await this.$request({
              url: "/menu/edit",
              data: {
                ...this.formData
              }
            });
          } else {
            result = await this.$request({
              url: "/menu/add",
              data: {
                ...this.formData
              }
            });
          }
          if (result) {
            this.$message({
              showClose: true,
              message: "保存成功！",
              type: "success"
            });
            this.$emit("refreshList");
            this.close();
          } else {
            this.$message({
              showClose: true,
              message: result.message,
              type: "success"
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped></style>
