<template>
<div class="config-password">
  <table class="config-password-table">
    <tbody>
      <!-- password -->
      <tr>
        <td width="120"><span class="icon-nessisary"></span>用户名</td>
        <td>
          <select v-model="item.username">
            <option disabled value="">选择用户名</option>
            <option v-for="val in user" :value="val.username">{{val.username}}</option>
          </select>
        </td>
      </tr>
      <!-- password -->
      <tr>
        <td><span class="icon-nessisary"></span>新密码</td>
        <td><input type="password" v-model="item.new"></td>
      </tr>
      <!-- password -->
      <tr>
        <td><span class="icon-nessisary"></span>确认新密码</td>
        <td><input type="password" v-model="item.newComfirm"></td>
      </tr>
      <tr>
        <td></td>
        <td><button type="button" class="button" @click="submit">提交</button></td>
      </tr>
    </tbody>
  </table>
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
import mock from 'components/tools/mock'
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
        username: '',
        new: '',
        newComfirm: ''
      },

      toast: {
        show: false,
        text: '',
        icon: ''
      },
      user: mock.user
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
      let sendData = {
        username: this.item.username,
        new_password: this.item.new
      }
      this.axios(api.user.updateByPassword(sendData)).then(res => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else {
          util.req.changeError(this.toast)
        }
      }).catch(err => {
        if (err) {
          util.req.changeError(this.toast)
        }
      })
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
.config-password-table {
  margin-top: 50px;
}
.config-password-table td {
  padding-bottom: 15px;

}
.config-password-table td:first-child {
  text-align: right;
  padding-right: 15px;
}
.config-password-table input {
  width: 180px;
}
</style>
