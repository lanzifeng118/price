<template>
  <div class="upload">
    <div class="upload-btns">
      <span v-if="!downloadOnly">
        <label
          v-if="input"
          for="excel"
          class="button button-second"
        >
          <span class="icon icon-excel"></span>导入</label>
        <input
          v-if="input"
          type="file"
          id="excel"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          @change="chooseFile"
        >
        <button
          v-else
          class="button button-second"
        >
          <span class="icon icon-excel"></span>导入</button>
      </span>

      <button
        class="button yellow"
        @click="downloadFile"
      >
        <span class="icon icon-excel"></span>导出</button>
    </div>
    <Pop
      type="warning"
      :text="pop.text"
      v-show="pop.show"
      @confirm="confirmPop"
      @close="closePop"
    ></Pop>
  </div>
</template>

<script>
import { API_domestic } from '../../model/domestic'
import { API_Local } from '../../model/local'
import { API_product } from '../../model/product'
import { log } from 'util';

export default {
  props: {
    downloadOnly: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: '1'
    },
    localType: {
      type: String,
      default: '1'
    },
    download: {
      type: String,
      default: '' 
    }
  },
  data() {
    return {
      input: true,
      file: null,
      // pop
      pop: {
        text: '',
        show: false
      }
    }
  },
  computed: {
    API() {
      let _api
      switch (this.from) {
        case 'local':
          _api = API_Local
          break;
        case 'domestic':
          _api = API_domestic
          break;
        case 'product':
          _api = API_product
          break;
      }
      return _api
    },
    downloadUrl() {
      const PRE = '/binheng/api'
      let url
      switch (this.from) {
        case 'local':
          url = `${PRE}${this.API.downloadUrl}?type=${this.type}`
          break
        case 'domestic':
          url = `${PRE}${this.API.downloadUrl}?type=${this.type}&local_type=${this.localType}`
          break
        case 'product':
          url = `${PRE}${this.API.downloadUrl}`
          break
        case 'lowest':
          url = this.download
          break
      }
      return url
    }
  },
  methods: {
    chooseFile(e) {
      const file = e.target.files[0]
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

      switch (this.from) {
        case 'local':
          formData.append('type', this.type)
          break;
        case 'domestic':
          formData.append('type', this.type)
          formData.append('local_type', this.localType)          
          break;
      }

      this.API.upload(formData)
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
    downloadFile() {
      // console.log(this.API, this.downloadUrl)
      window.location.assign(this.downloadUrl)
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
