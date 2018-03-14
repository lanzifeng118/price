<template>
  <div class="cal-result">
    <div class="cal-result-back">
      <router-link to="/admin/calculate/input">
        <span class="icon-back"></span>返回</router-link>
    </div>
    <div v-if="msg" class="cal-result-msg">{{msg}}</div>
    <div v-else class="cal-result-box">
      <button class="cal-result-save button" @click="insert">保存</button>
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
        profit_rate: query.profit_rate,
        selling_price: query.selling_price,
        purchase_price: query.purchase_price,
        weight: query.weight,
        bulk: query.bulk,
        category: query.category,
        local: query.local
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
      if (!this.verify()) {
        util.toast.fade(this.toast, '参数错误')
        this.goBack()
        return
      }
      this.info = null
      this.msg = '计算中...'
      let input = this.input
      // ajax
      // 商品种类、当地配送种类
      let sendData = {
        category: input.category,
        local: input.local
      }

      this.axios(api.cal.query(sendData)).then(res => {
        let data = res.data
        console.log(data)
        this.msg = ''
        if (data.code === 200) {
          this.info = data.data
        } else {
          util.req.queryError(this.toast)
        }
      })
    },
    insert() {
      console.log(this.input)
      if (!this.input.sku.trim()) {
        util.toast.fade(this.toast, '保存失败，商品sku不能为空')
        return
      }
      this.axios(api.product.insert(this.input)).then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          util.toast.fade(this.toast, '保存成功', 'appreciate')
        } else if (data.code === 400) {
          // 已存在
          this.pop.text = `sku为${this.input.sku}的数据已存在，确定要覆盖吗？`
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
      this.axios(api.product.updateBySku(this.input)).then(res => {
        let data = res.data
        if (data.code === 200) {
          util.toast.fade(this.toast, '保存成功', 'check')
        } else {
          util.toast.fade(this.toast, '保存失败，出错了', 'sad')
        }
        this.closePop()
      })
    },
    verify() {
      // 参数不合格
      let input = this.input
      let l = input.local
      let c = input.category
      return (l === '1' || l === '2') &&
        (c === '1' || c === '2' || c === '3' || c === '4') &&
        util.isNum(input.weight) &&
        (!input.bulk || input.bulk && util.isNum(input.bulk)) &&
        util.isNum(input.purchase_price) &&
        util.isNum(input.selling_price) &&
        util.isNumAll(input.profit_rate)
    },
    goBack() {
      setTimeout(() => {
        this.$router.push('/admin/calculate')
      }, 700)
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
