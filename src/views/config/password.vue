<template>
<div class="config-password">
  <table class="config-password-table">
    <tbody>
      <!-- password -->
      <tr>
        <td width="120"><span class="icon-nessisary"></span>用户名</td>
        <td>
          <select v-model="item.id">
            <option disabled value="">选择用户名</option>
            <option v-for="val in users" :value="val.id">{{val.username}}</option>
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
</div>
</template>

<script>
import { API_user } from '../../model/user'

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
        id: '',
        new: '',
        newComfirm: ''
      },
      users: []
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      this.users = []
      // ajax
      API_user.query().then(data => {
        if (data.length > 0) {
          this.users = data
        }
      }).catch(err => {
        this.$toast.error()
        this.goback()
      })
    },
    submit() {
      // this.$toast.upload('正在提交')
      if (!this.verify()) {
        return
      }
      this.update()
    },
    verify() {
      let item = this.item
      if (!item.id) {
        this.$toast.warn('请选择用户名')        
        return false
      }
      if (!item.new) {
        this.$toast.warn('新密码不能为空')        
        return false
      }
      if (item.new !== item.newComfirm) {
        this.$toast.warn('新密码两次输入不一致')        
        return false
      }
      return true
    },
    update() {
      const { id, new: password } = this.item
      API_user.update({ id, password })
        .then(res => {
          this.showSuccess()
        }).catch(err => {
          this.$toast.error()
        })
    },
    showSuccess() {
      this.$toast.success('修改成功！')
      this.goback()
    },
    goback() {
      setTimeout(() => {
        this.$router.push('/config')
      }, 700)
    }
  },
  components: {
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
