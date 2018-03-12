<template>
  <div class="cal-result">
    <div class="cal-result-back">
      <router-link to="/admin/calculate/input"><span class="icon-back"></span>返回</router-link>
    </div>
    <div v-if="msg" class="cal-result-msg">{{msg}}</div>
    <div v-else>
      <div class="f-clearfix">
        <button class="cal-result-save button f-right" @click="save">保存</button>
        <h3 class="cal-result-title f-left">计算结果<span>（商品sku：{{input.sku}}，外币售价：{{input.selling_price}}，采购价：{{input.purchase_price}}元，重量：{{input.weight}}克，体积：{{input.bulk}}m³，种类：{{category[input.category]}}，当地配送：{{local[input.local]}}）</span></h3>
      </div>
      <result v-if="factor" :factor="factor"></result>
    </div>
    <pop
      type="warning"
      :text="pop.text"
      v-show="pop.show"
      @confirm="confirmPop"
      @close="closePop"
    >
    </pop>
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
import pop from 'components/pop/pop'
import util from 'components/tools/util'
import result from 'components/c-result/index'
import api from 'components/tools/api'

export default {
  data() {
    return {
      msg: '计算中...',
      note: '',
      factor: null,
      category: {
        '1': '普通',
        '2': '带电',
        '3': '带磁',
        '4': '超尺寸'
      },
      local: {
        '1': 'Ebay',
        '2': 'Amazon'
      },
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
        selling_price: parseFloat(query.selling_price) || 0,
        purchase_price: parseFloat(query.purchase_price) || 0,
        weight: parseFloat(query.weight) || 0,
        bulk: parseFloat(query.bulk) || 0,
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
  created () {
    this.cal()
  },
  methods: {
    cal() {
      this.factor = null
      this.msg = '计算中...'
      let input = this.input
      // ajax
      // 重量、当体配送重量、商品种类、当地配送种类
      let weightReal = input.weight / 1000
      let weightBulk = input.bulk / 6000
      let weightBulkLocal = input.bulk / 7000

      let weight = weightReal >= weightBulk ? weightReal : weightBulk
      let weightLocal = weightReal >= weightBulkLocal ? weight : weightBulkLocal

      let sendData = {
        weight: weight.toFixed(5),
        weight_local: weightLocal.toFixed(5),
        category: input.category,
        local: input.local
      }
      console.log(sendData)

      this.axios(api.cal.query()).then(res => {
        let data = res.data
        console.log(data)
        this.msg = ''
        if (data.code === 200) {
          // let  = [

          // ]
          this.factor = {
            product: input,
            logistics: data.data.logistics
          }
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
      this.axios(api.cal.update(this.result)).then((res) => {
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
.cal-result-title {
  margin-left: 10px;
  padding-top: 10px;
  font-weight: bold;
}
.cal-result-title span {
  font-weight: normal;
  color: #999;
}
.cal-result-save {
  background-color: #efa807;
  border-color: #efa807;
}
/* .has-result */
</style>
