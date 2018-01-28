<template>
<div class="edit">
  <h2 class="edit-h2">编辑系统配置</h2>
  <router-link to="/admin/config" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td width="100">账号</td>
          <td>{{item.username}}</td>
        </tr>
        <tr>
          <td class="vertical-top">头像<span class="separate"></span></td>
          <td>
          </td>
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
  data() {
    return {
      // file
      file: null,
      img: '',
      toast: {
        show: false,
        text: '',
        icon: ''
      }

    }
  },
  watch: {
    item() {
      this.img = this.item.avatar
    }
  },
  computed: {
    item() {
      return this.$store.state.user
    }
  },
  created() {
    this.img = this.item.avatar
  },
  methods: {
    chooseImg(e) {
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        this.img = result
      })
    },
    deleteImg() {
      this.img = ''
      this.file = null
    },
    submit() {
      // 如果上传了图片
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendImg()
    },
    sendImg() {
      if (this.file) {
        util.uploadFile(this, this.file, (url) => {
          this.img = url
          this.sendData()
        }, () => {
          this.showError()
        })
      } else {
        this.sendData()
      }
    },
    sendData() {
      this.item.avatar = this.img
      this.axios(api.user.update(this.item)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else {
          this.showError()
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
          this.showError()
        }
      })
    },
    showError() {
      util.toast.fade(this.toast, '出错了，请稍后再试！', 'sad')
    },
    showSuccess() {
      util.toast.show(this.toast, '提交成功！', 'appreciate')
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
