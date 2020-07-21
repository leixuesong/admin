<template>
  <div>
    <el-card>
      <div slot="header">查询条件</div>
      <el-form class="search-form" inline :model="searchForm">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.name" clearable />
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
      <el-table-column prop="order_number" label="订单号" />
      <el-table-column prop="agent_up_name" label="上级代理商" />
      <el-table-column prop="agent_name" label="所属代理商" />
      <el-table-column prop="mer_name" label="所属商户" />
      <el-table-column prop="comm_name" label="商品名称" />
      <el-table-column prop="order_amount" label="订单金额" />
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <span v-if="scope.row.order_state===0">已支付</span>
          <span v-if="scope.row.order_state===1">待审核</span>
          <span v-else>已驳回</span>
        </template>
      </el-table-column>
      <el-table-column prop="order_addtime" label="生成时间" />
      <el-table-column prop="order_process_time" label="处理时间" />
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
  name: 'Order',
  data() {
    return {
      searchForm: {
        status:''
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
        url: '/order/index',
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
