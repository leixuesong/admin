<template>
  <div>
    <el-card>
      <div slot="header">查询条件</div>
      <el-form class="search-form" inline :model="searchForm">
        <el-form-item label="菜单名称">
          <el-input v-model="searchForm.name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="padding-y-16">
      <el-button v-if="$store.getters.buttons.hasOwnProperty($route.name) && this.$store.getters.buttons[$route.name].includes('add')" type="primary" @click="add">添加</el-button>
    </div>
    <el-table
      border
      :data="list.data"
      row-key="node_id"
      :tree-props="{ hasChildren: 'hasChildren', children: 'children' }"
    >
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <span><i :class="scope.row.icon" /> {{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="controller" label="控制器" />
      <el-table-column prop="method" label="方法" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 0 ? "正常" : "停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button v-if="$store.getters.buttons.hasOwnProperty($route.name) && $store.getters.buttons[$route.name].includes('edit')" @click="edit(scope.row.node_id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  name: 'Menu',
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
        data: []
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
        url: '/menu/index',
        data: {
          ...this.searchForm
        }
      })
      this.list.data = result.data
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
      })
        .then(async() => {
          this.loading.list = true
          await this.$request({
            url: '/menu/delete',
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
