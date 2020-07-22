<template>
  <div>
    <el-card>
      <div slot="header">查询条件</div>
      <el-form class="search-form" inline :model="searchForm">
        <el-form-item label="账号">
          <el-input v-model="searchForm.name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="padding-y-16">
      <el-button type="primary" @click="add">添加</el-button>
    </div>
    <el-table border :data="list.data">
      <el-table-column prop="admin_account" label="账号" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column prop="admin_phone" label="手机号码" />
      <el-table-column prop="admin_email" label="邮箱" />
      <el-table-column prop="login_count" label="登录次数" />
      <el-table-column prop="admin_create_time" label="创建时间" />
      <el-table-column prop="admin_update_time" label="更新时间" />
      <el-table-column label="状态" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.admin_status===0">正常</span>
          <span v-else-if="scope.row.admin_status===1">待审核</span>
          <span v-else >停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.admin_id)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.admin_id)">删除</el-button>
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
    <el-dialog
      :title="dialog.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="close"
      :visible="dialog.visible"
    >
      <AddOrEdit
        :id="dialog.id"
        ref="dialogForm"
        :visible.sync="dialog.visible"
        :data="dialog.data"
        @refreshList="getList"
      />
    </el-dialog>
  </div>
</template>
<script>
import AddOrEdit from './add-or-edit'
export default {
  name: 'User',
  components: {
    AddOrEdit
  },
  data() {
    return {
      loading: {
        list: false
      },
      dialog: {
        visible: false,
        title: '',
        id: 0,
        data: {}
      },
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
        url: '/user/index',
        data: {
          ...this.searchForm,
          pageNo: this.list.pageNo,
          pageSize: this.list.pageSize
        }
      })
      this.list.data = result.data
      this.list.total = result.total
    },
    add() {
      this.dialog.visible = true
      this.dialog.title = '添加'
      this.dialog.id = -1
      this.dialog.data = {}
    },
    edit(id) {
      this.dialog.visible = true
      this.dialog.title = '编辑'
      this.dialog.id = id
      this.dialog.data = {}
    },
    del(admin_id) {
      this.$confirm(`是否删除 ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.list = true
          await this.$request({
            url: '/user/delete',
            data: {
              admin_id
            }
          })
          this.getList()
        })
        .catch(() => {})
    },
    close() {
      this.$refs.dialogForm.$refs.form.resetFields()
      this.dialog.visible = false
    }
  }
}
</script>
<style scoped></style>
