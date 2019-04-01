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
    <Pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop"></Pop>
  </div>
</template>

<script>
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
        this.$toast.upload('正在上传')
        this.uploadFile(
          data => {
            // console.log(data)
            this.$emit('update')
            this.input = true
            this.$toast.success('导入成功')
          },
          () => {
            this.input = true
            this.$toast.error('导入失败')
          }
        )
      }
    },
    uploadFile(success, error) {
      const formData = new FormData()
      formData.append('upload', this.file)
      console.log(formData)
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
      window.location.assign(this.dowloadUrl)
    }
  },
  components: {}
}
</script>

<style>
.upload-btns .button {
  width: 125px;
}
</style>
