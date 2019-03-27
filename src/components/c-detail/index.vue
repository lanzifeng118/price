<template>
  <!-- 计算结果、商品详情 -->
  <div class="detail">
    <div class="detail-back">
      <router-link :to="backUrl">
        <span class="icon-back"></span>返回</router-link>
    </div>
    <div v-if="msg" class="detail-msg">{{msg}}</div>
    <div v-else class="detail-box">
      <button v-if="invoke === 1" class="detail-save yellow button" @click="insert">保存</button>
      <button v-else-if="invoke === 2" class="detail-save yellow button" @click="change">切换为{{item.local === '1' ? 'Amazon' : 'Ebay'}}</button>
      <result v-if="info" :product="item" :info="info" :invoke="invoke"></result>
    </div>
    <pop v-if="invoke === 1" type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop">
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
  props: {
    // 1、计算 2、商品信息
    invoke: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      msg: '正在查询...',
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
    item() {
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
    },
    backUrl() {
      let url = this.invoke === 1 ? 'calculate' : 'product'
      return `/${url}`
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
      let msg = util.verifyProduct(this.item, this.invoke)
      if (msg) {
        this.msg = '参数错误，' + msg
        util.toast.fade(this.toast, '参数错误，' + msg)
        this.goBack()
        return
      }
      this.info = null
      this.msg = '正在查询...'
      let item = this.item
      // ajax
      // 商品种类、当地配送种类
      let sendData = {
        category: item.category,
        local: item.local
      }

      this.axios(api.cal.query(sendData)).then(res => {
        let data = res.data
        // console.log(data)
        this.msg = ''
        if (data.code === 200) {
          this.info = data.data
        } else {
          util.req.queryError(this.toast)
        }
      })
    },
    insert() {
      // console.log(this.item)
      if (!this.item.sku.trim()) {
        util.toast.fade(this.toast, '保存失败，商品sku不能为空')
        return
      }
      this.axios(api.product.insert(this.item)).then(res => {
        let data = res.data
        // console.log(data)
        if (data.code === 200) {
          util.toast.fade(this.toast, '保存成功', 'appreciate')
        } else if (data.code === 400) {
          // 已存在
          this.pop.text = `sku为${this.item.sku}的数据已存在，确定要覆盖吗？`
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
      this.axios(api.product.updateBySku(this.item)).then(res => {
        let data = res.data
        if (data.code === 200) {
          util.toast.fade(this.toast, '保存成功', 'check')
        } else {
          util.toast.fade(this.toast, '保存失败，出错了', 'sad')
        }
        this.closePop()
      })
    },
    goBack() {
      setTimeout(() => {
        this.$router.push(this.backUrl)
      }, 700)
    },
    change() {
      let item = this.item
      item.local === '1' ? (item.local = '2') : (item.local = '1')
      this.$router.push({ path: '/product/detail', query: item })
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
.detail {
  margin-bottom: 20px;
}
.detail-msg {
  font-size: 16px;
  text-align: center;
  color: #ccc;
}
.detail-back {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
.detail-box {
  position: relative;
}
.detail-save {
  position: absolute;
  right: 0;
  top: -11px;
}
/* .has-result */
</style>
