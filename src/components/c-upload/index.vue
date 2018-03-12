<template>
  <div class="upload">
    <div class="upload-btns">
      <label for="excel" class="button button-second">
        <span class="icon icon-excel"></span>导入{{name}}</label>
      <input type="file" id="excel" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="chooseFile">
      <button class="button yellow" @click="download">
        <span class="icon icon-excel"></span>导出{{name}}</button>
    </div>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon"></toast>
    <pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop"></pop>
  </div>
</template>

<script>
import pop from 'components/pop/pop'
import toast from 'components/toast/toast'
import util from 'components/tools/util'
import api from 'components/tools/api'

export default {
  props: {
    apiInKey: {
      type: String,
      required: true
    },
    dowloadUrl: {
      type: String,
      required: true
    },
    name: String
  },
  data() {
    return {
      file: null,
      // toast
      toast: {
        show: false,
        text: '',
        icon: ''
      },
      // pop
      pop: {
        text: '',
        show: false
      }
    }
  },
  methods: {
    chooseFile(e) {
      let file = e.target.files[0]
      // console.log(file)
      this.pop.text = `确认用[${file.name}]覆盖原有数据？`
      this.pop.show = true
      this.file = file
    },
    closePop() {
      this.pop.show = false
    },
    confirmPop() {
      this.pop.show = false
      if (this.file) {
        util.toast.show(this.toast, '正在上传', 'upload')
        this.uploadFile(
          data => {
            console.log(data)
            this.$emit('update')
            util.toast.fade(this.toast, '更新成功', 'appreciate')
          },
          () => {
            util.req.changeError(this.toast)
          }
        )
      }
    },
    uploadFile(success, error) {
      let formData = new FormData()
      formData.append('upload', this.file)
      this.axios(api[this.apiInKey](formData))
        .then((res) => {
          let data = res.data
          if (data.code === 200) {
            success(data)
          } else {
            error()
          }
        }).catch((err) => {
          console.log(err)
          error()
        })
    },
    download() {
      // this.axios({
      //   method: 'get',
      //   url: '',
      //   pr
      // })
      window.location.assign(this.dowloadUrl)
    }
  },
  components: {
    toast,
    pop
  }
}
</script>

<style>
.upload-btns .button {
  width: 125px;
}
</style>
