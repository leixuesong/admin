<template>
  <div>
    <el-card>
      <div slot="header">查询条件</div>
      <el-form class="search-form" inline :model="searchForm">
        <el-form-item label="账号">
          <el-input v-model="searchForm.mer_acc" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable placeholder="">
            <el-option label="全部" value="" />
            <el-option label="正常" :value="0" />
            <el-option label="待审核" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table class="margin-top-16" border :data="list.data">
      <el-table-column prop="mer_acc" label="账号" />
      <el-table-column prop="agent_acc" label="所属代理商" />
      <el-table-column prop="phone" label="手机号码" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="login_count" label="登录次数" />
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column prop="update_time" label="更新时间" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0">正常</span>
          <span v-else-if="scope.row.status===1">待审核</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 2" @click="changeStatus(scope.row.mer_id,0)">开启</el-button>
          <el-button v-if="scope.row.status === 0" @click="changeStatus(scope.row.mer_id,2)">停用</el-button>
          <el-button v-if="scope.row.status === 0" @click="reset(scope.row.mer_id)">重置密码</el-button>
          <el-button v-if="scope.row.status === 0" @click="whiteList(scope.row.mer_id)">设置白名单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-pagination
        background
        layout="->, total, prev, pager, next, sizes, jumper"
        :current-page.sync="list.pageNo"
        :page-size.sync="list.pageSize"
        :total="list.total"
        @current-change="getList"
        @size-change="getList"
      />
    </div>
    <!-- 设置白名单 -->
    <el-dialog
      title="设置白名单"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      :visible.sync="infoDialogVisible"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="130px">
        <el-form-item label="IP白名单" prop="permit_IP">
          <el-input v-model="form.permit_IP" type="textarea" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Merchant',
  data() {
    return {
      infoDialogVisible: false,
      form: {},
      rules: {},
      loading: {
        list: false
      },
      searchForm: {
        status: ''
      },
      list: {
        data: [],
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    searchList() {
      this.list = this.$options.data().list
      this.getList()
    },

    async getList() {
      const result = await this.$request({
        url: '/merchant/index',
        data: {
          ...this.searchForm,
          pageNo: this.list.pageNo,
          pageSize: this.list.pageSize
        }
      })
      this.list.data = result.data
      this.list.total = result.total
    },
    changeStatus(mer_id, status) {
      this.$confirm(`是否${status === 0 ? '开启' : '停用'} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.list = true
          await this.$request({
            url: '/merchant/status',
            data: {
              mer_id,
              status
            }
          })
          this.getList()
        })
    },
    async whiteList(mer_id) {
      this.infoDialogVisible = true
      this.form = await this.$request({
        url: '/merchant/info',
        data: {
          mer_id
        }
      })
    },
    handleClose(done) {
      this.$refs.form.resetFields()
      this.infoDialogVisible = false
      typeof done === 'function' && done()
    },
    async submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          await this.$request({
            url: `/merchant/modify`,
            method: 'post',
            tag: 'list',
            data: this.form
          }).then(data => {
            this.$message({
              showClose: true,
              message: '白名单设置成功！',
              type: 'success'
            })
            this.handleClose()
          })
        } else {
          return false
        }
      })
    },
    reset(mer_id) {
      this.$confirm(`是否重置密码 ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.list = true
          await this.$request({
            url: '/merchant/reset',
            data: {
              mer_id
            }
          })
          this.getList()
        })
    }
  }
}
</script>
<style scoped></style>
