<template>
  <div>
    <el-card>
      <div slot="header">查询条件</div>
      <el-form class="search-form" inline :model="searchForm">
        <el-form-item label="账号">
          <el-input v-model="searchForm.agent_acc" clearable />
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
      <el-table-column prop="agent_level" label="代理商级别" />
      <el-table-column prop="agent_up_level" label="上级代理商" />
      <el-table-column prop="phone" label="手机号码" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="agent_number" label="代理商推广码" />
      <el-table-column prop="login_count" label="登录次数" />
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column prop="update_time" label="更新时间" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0">正常</span>
          <span v-if="scope.row.status===1">待审核</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button @click="changeStatus(scope.row.mer_id,0)">开启</el-button>
          <el-button @click="changeStatus(scope.row.mer_id),2">停用</el-button>
          <el-button @click="whiteList(scope.row.mer_id)">设置白名单</el-button>
          <el-button @click="reset(scope.row.mer_id)">重置密码</el-button>
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

  </div>
</template>
<script>
export default {
  name: 'Agent',
  data() {
    return {
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
        url: '/agent/index',
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
      this.$confirm(`是否${status === 0 ? '停用' : '开启'} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.list = true
          await this.$request({
            url: '/agent/status',
            data: {
              mer_id,
              status
            }
          })
          this.getList()
        })
        .catch(() => {})
    },
    whiteList() {

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
            url: '/agent/reset',
            data: {
              mer_id
            }
          })
          this.getList()
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped></style>
