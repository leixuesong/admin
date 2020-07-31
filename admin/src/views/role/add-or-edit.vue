<template>
  <el-form
    ref="form"
    v-loading="loading.detail"
    :model="formData"
    :rules="rules"
    label-width="100px"
    element-loading-text="加载中"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="formData.name" clearable />
    </el-form-item>
    <el-form-item label="备注" prop="remarks">
      <el-input type="textarea" v-model="formData.remarks" clearable />
    </el-form-item>
    <el-form-item label="节点" prop="node_list">
      <el-tree
        :data="menuList"
        show-checkbox
        default-expand-all
        node-key="node_id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      >
      </el-tree>
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
      defaultProps: {
        children: "children",
        label: "name"
      },
      formData: {
        status: 0
      },
      menuList: []
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
    async init() {
      this.menuList = await this.$request({
        url: "/menu/all"
      });
      if (this.id !== -1) {
        this.formData = await this.$request({
          url: "/role/info",
          data: {
            id: this.id
          }
        });
        this.$refs.tree.setCheckedKeys(this.formData.node_id.split(','))
      }
      
    },
    close() {
      this.$refs.form.resetFields();
      this.$refs.tree.setCheckedKeys([]);
      this.formData = this.$options.data().formData
      this.$emit("update:visible", false);
    },
    async submitForm() {
      let result = {};
      this.$refs.form.validate(async valid => {
        let nodeList = this.$refs.tree.getCheckedNodes().map(item=>item.node_id).join(',')
        if (valid) {
          if (this.id !== -1) {
            result = await this.$request({
              url: "/role/edit",
              data: {
                ...this.formData,
                node_id:nodeList
              }
            });
          } else {
            result = await this.$request({
              url: "/role/add",
              data: {
                ...this.formData,
                node_id:nodeList
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
