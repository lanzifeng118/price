<template>
  <div class="upload">
    <div class="upload-btns">
      <span v-if="!downloadOnly">
        <label v-if="input" for="excel" class="button button-second">
          <span class="icon icon-excel"></span>导入{{name}}</label>
        <input v-if="input" type="file" id="excel" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="chooseFile">
        <button v-else class="button button-second">
          <span class="icon icon-excel"></span>导入{{name}}</button>
      </span>

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
    downloadOnly: {
      type: Boolean,
      default: false
    },
    apiInKey: {
      type: String
    },
    dowloadUrl: {
      type: String,
      required: true
    },
    name: String
  },
  data() {
    return {
      input: true,
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
        this.input = false
        util.toast.show(this.toast, '正在上传', 'upload')
        this.uploadFile(
          data => {
            // console.log(data)
            this.$emit('update')
            this.input = true
            util.toast.fade(this.toast, '导入成功', 'appreciate')
          },
          () => {
            this.input = true
            util.toast.fade(this.toast, '导入失败', 'sad')
          }
        )
      }
    },
    uploadFile(success, error) {
      let formData = new FormData()
      formData.append('upload', this.file)
      this.axios(api[this.apiInKey](formData))
        .then(res => {
          let data = res.data
          if (data.code === 200) {
            success(data)
          } else {
            error()
          }
        })
        .catch(err => {
          console.log(err)
          error()
        })
    },
    download() {
      // this.axios.get(this.dowloadUrl, { params: data }).then(res => {
      //   // console.log(res.data)
      //   if (res.status === 200) {
      //     let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      //     console.log(blob)
      //     let fileName = '文件名称.xls'
      //     downFile(blob, fileName)
      //   } else {
      //     console.log('fail')
      //   }
      // })
      // function downFile(blob, fileName) {
      //   if (window.navigator.msSaveOrOpenBlob) {
      //     navigator.msSaveBlob(blob, fileName)
      //   } else {
      //     let link = document.createElement('a')
      //     link.href = window.URL.createObjectURL(blob)
      //     console.log(link.href)
      //     link.download = fileName
      //     link.click()
      //     window.URL.revokeObjectURL(link.href)
      //   }
      // }
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
