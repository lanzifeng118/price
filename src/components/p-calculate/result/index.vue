<template>
  <div class="cal-result">
    <div class="cal-result-back">
      <router-link to="/admin/calculate/input">
        <span class="icon-back"></span>返回</router-link>
    </div>
    <div v-if="msg" class="cal-result-msg">{{msg}}</div>
    <div v-else class="cal-result-box">
      <button class="cal-result-save button" @click="save">保存</button>
      <result v-if="info" :product="input" :info="info"></result>
    </div>
    <pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop">
    </pop>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon">
    </toast>
  </div>
</template>

<script>
import toast from 'components/toast/toast'
import pop from 'components/pop/pop'
import util from 'components/tools/util'
import result from 'components/c-result/index'
import api from 'components/tools/api'
import mock from 'components/tools/mock'

export default {
  data() {
    return {
      msg: '计算中...',
      note: '',
      info: null,
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
  computed: {
    input() {
      let query = this.$route.query
      let item = {
        sku: query.sku || '',
        selling_price: query.selling_price,
        purchase_price: query.purchase_price,
        weight: query.weight,
        bulk: query.bulk,
        category: query.category || '1',
        local: query.local || '1'
      }
      // console.log(item)
      return item
    }
  },
  watch: {
    $route(to, from) {
      this.cal()
    }
  },
  created() {
    this.cal()
  },
  methods: {
    cal() {
      this.info = null
      this.msg = '计算中...'
      let input = this.input
      // ajax
      // 商品种类、当地配送种类
      let sendData = {
        category: input.category,
        local: input.local
      }
      console.log(sendData)

      this.axios(api.cal.query()).then(res => {
        let data = res.data
        // console.log(data)
        this.msg = ''
        if (data.code === 200) {
          let mockCal = mock.cal
          console.log(mockCal)
          this.info = mockCal
        } else {
          util.req.queryError(this.toast)
        }
      })
    },
    save() {
      console.log(this.result)
      if (!this.result.sku.trim()) {
        util.toast.fade(this.toast, '保存失败，商品sku不能为空')
        return
      }
      this.axios(api.cal.save(this.result)).then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          util.toast.fade(this.toast, '保存成功', 'appreciate')
        } else if (data.code === 201) {
          // 已存在
          this.pop.text = `sku为${this.result.sku}的数据已存在，确定要覆盖吗？`
          this.pop.show = true
        } else {
          util.req.queryError(this.toast)
        }
      })
    },
    closePop() {
      this.pop.show = false
    },
    confirmPop() {
      this.axios(api.cal.update(this.result)).then(res => {
        let data = res.data
        if (data.code === 200) {
          util.toast.fade(this.toast, '保存成功', 'check')
        } else {
          util.toast.fade(this.toast, '保存失败，出错了', 'sad')
        }
        this.closePop()
      })
    }
  },
  components: {
    result,
    pop,
    toast
  }
}
</script>
<style>
.cal-result {
  margin-bottom: 20px;
}
.cal-result-msg {
  font-size: 16px;
  text-align: center;
  color: #ccc;
}
.cal-result-back {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
.cal-result-box {
  position: relative;
}
.cal-result-save {
  position: absolute;
  right: 0;
  top: -11px;
  background-color: #efa807;
  border-color: #efa807;
}
/* .has-result */
</style>
