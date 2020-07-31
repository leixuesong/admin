<template>
  <div>
    <el-card>
      <div slot="header">查询条件</div>
      <el-form class="search-form" inline :model="searchForm">
        <el-form-item label="名称">
          <el-input v-model="searchForm.comm_name" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable placeholder="">
            <el-option label="全部" value="" />
            <el-option label="正常" :value="0" />
            <el-option label="停用" :value="1" />
            <el-option label="待审核" :value="2" />
          </el-select>
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
      <el-table-column prop="comm_name" label="名称" >
        <template slot-scope="scope">
          <span><i :class="scope.row.icon"></i> {{scope.row.comm_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" >
         <template slot-scope="scope">
           <img :src="$ImagePath + scope.row.comm_img" width="64" height="64" v-if="scope.row.comm_img" />
         </template>
      </el-table-column>
      <el-table-column prop="comm_note" label="说明" />
      <el-table-column prop="comm_amount" label="金额" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0">正常</span>
          <span v-else-if="scope.row.status===1">停用</span>
          <span v-else>待审核</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" >
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.comm_id)">编辑</el-button>
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
  name: 'Product',
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
        url: '/product/index',
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
    del(id) {
      this.$confirm(`是否删除 ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.loading.list = true
          await this.$request({
            url: '/product/delete',
            data: {
              id
            }
          })
          this.getList()
        })
        .catch(() => {})
    },
    close() {
      this.$refs.dialogForm.close()
    }
  }
}
</script>
<style scoped></style>
