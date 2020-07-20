<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="user-container" trigger="click">
        <div class="user-wrapper">
          <span>admin</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item @click.native="infoDialogVisible = true">
              修改密码
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--修改密码-->
    <el-dialog
      append-to-body
      title="修改密码"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      :visible.sync="infoDialogVisible">
      <el-form ref="pwdForm" :rules="rules" :model="pwdForm"  label-width="130px" >
        <el-form-item label="原密码" prop="oldPassword" >
          <el-input clearable v-model="pwdForm.oldPassword" show-password/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input clearable v-model="pwdForm.newPassword" show-password/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmUserPwd">
          <el-input clearable v-model="pwdForm.confirmUserPwd" show-password />
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
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user'
    ])
  },
  data(){
    return {
      infoDialogVisible: false,
      pwdForm: {
        oldPassword: '',
        newPassword: '',
        confirmUserPwd: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmUserPwd: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleClose (done) {
      this.$refs.pwdForm.resetFields()
      this.infoDialogVisible = false
      typeof done === 'function' && done()
    },
    async submitForm () {
      this.$refs.pwdForm.validate(async (valid) => {
        if (valid) {
          let result = await this.$request({
            url: `/user/modify`,
            method: 'post',
            tag: 'list',
            data: this.pwdForm
          })
          if (result) {
            this.$message({
              showClose: true,
              message: '密码修改成功！',
              type: 'success'
            })
            this.handleClose()
          } else {
            this.$message({
              showClose: true,
              message: result.message,
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .user-container {
      margin-right: 30px;

      .user-wrapper {
        margin-top: 5px;
        position: relative;

        .user-user {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>
