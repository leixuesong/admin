<template>
  <div>
    <el-table border :data="list.data">
      <el-table-column prop="admin_account" label="用户名称" />
      <el-table-column prop="sys_log_ip" label="IP" />
      <el-table-column prop="sys_log_city" label="所在城市" />
      <el-table-column prop="sys_log_note" label="备注" />
      <el-table-column prop="sys_log_time" label="时间" />
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
  name: 'Journal',
  data() {
    return {
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
    async getList() {
      const result = await this.$request({
        url: '/journal/index',
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
