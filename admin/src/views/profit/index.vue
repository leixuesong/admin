<template>
  <div>
    <el-card>
      <div slot="header">查询条件</div>
      <el-form class="search-form" inline :model="searchForm">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table class="margin-top-16" border :data="list.data">
      <el-table-column prop="order_number" label="订单号" />
      <el-table-column prop="order_amount" label="订单金额" />
      <el-table-column prop="agent_name" label="所属代理商" />
      <el-table-column prop="share_amount" label="分润金额" />
      <el-table-column prop="share_time" label="时间" />
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
  name: 'Profit',
  data() {
    return {
      searchForm: {},
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
        url: '/profit/index',
        data: {
          pageNo: this.list.pageNo,
          pageSize: this.list.pageSize
        }
      })
      this.list.data = result.data
      this.list.total = result.total
    }
  }
}
</script>
<style scoped></style>
