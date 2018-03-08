<template>
  <div class="upload">
    <div class="upload-btns">
      <label for="excel" class="button button-second"><span class="icon icon-excel"></span>导入</label>
      <input type="file" id="excel" accept="application/vnd.ms-excel"
      @change="chooseFile">
      <button class="button yellow"><span class="icon icon-excel"></span>导出</button>
    </div>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon"></toast>
    <pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop"></pop>
  </div>
</template>

<script>
import pop from 'components/pop/pop'
import toast from 'components/toast/toast'
import util from 'components/tools/util'

export default {
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
        util.uploadFile(this, this.file, data => {
          console.log(data)
          this.$emit('update')
          util.toast.fade(this.toast, '更新成功', 'appreciate')
        }, () => {
          util.req.changeError(this.toast)
        })
      }
    }
  },
  components: {
    toast,
    pop
  }
}
</script>

<style>
.upload {
  /* position: relative; */
}
.upload-btns {
  position: absolute;
  right: 30px;
  top: 10px;
}
</style>
