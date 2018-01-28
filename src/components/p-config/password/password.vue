<template>
<div class="edit">
  <h2 class="edit-h2">修改登陆密码</h2>
  <router-link to="/admin/config" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- password -->
        <tr>
          <td width="120">原密码</td>
          <td><input type="password" v-model="item.old"></td>
        </tr>
        <!-- password -->
        <tr>
          <td width="120">新密码</td>
          <td><input type="password" v-model="item.new"></td>
        </tr>
        <!-- password -->
        <tr>
          <td width="120">确认新密码</td>
          <td><input type="password" v-model="item.newComfirm"></td>
        </tr>
        <tr>
          <td></td>
          <td><button type="button" class="button" @click="submit">提交</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <toast
    v-show="toast.show"
    :text="toast.text"
    :icon="toast.icon"
  >
  </toast>
</div>
</template>

<script>
import toast from 'components/toast/toast'
import util from 'components/tools/util'
import api from 'components/tools/api'
export default {
  props: {
    page: String,
    lang: {
      type: String,
      default: 'cn'
    }
  },
  data() {
    return {
      item: {
        old: '',
        new: '',
        newComfirm: ''
      },

      toast: {
        show: false,
        text: '',
        icon: ''
      }

    }
  },
  methods: {
    submit() {
      util.toast.show(this.toast, '正在提交', 'upload')
      if (!this.verify()) {
        return
      }
      this.sendData()
    },
    verify() {
      let item = this.item
      if (!item.old) {
        util.toast.fade(this.toast, '原密码不能为空')
        return false
      }
      if (!item.new) {
        util.toast.fade(this.toast, '新密码不能为空')
        return false
      }
      if (item.new !== item.newComfirm) {
        util.toast.fade(this.toast, '新密码两次输入不一致')
        return false
      }
      return true
    },
    sendData() {
      let id = this.$store.state.user.id
      let newPassword = this.item.new
      let oldPassword = this.item.old
      let sendData = {id: id, new_password: newPassword, old_password: oldPassword}
      this.axios(api.user.updateByPassword(sendData)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '300') {
          // 原密码错误，修改失败
          util.toast.fade(this.toast, '原密码不正确', 'close')
        } else {
          this.showError()
        }
      }).catch((err) => {
        if (err) {
          this.showError()
        }
      })
    },
    showError() {
      util.toast.fade(this.toast, '出错了，请稍后再试！', 'sad')
    },
    showSuccess() {
      util.toast.show(this.toast, '修改成功！', 'appreciate')
      this.goback()
    },
    goback() {
      setTimeout(() => {
        this.$router.push('/admin/config')
      }, 700)
    }
  },
  components: {
    toast
  }
}
</script>

<style>

</style>
