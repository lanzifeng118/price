<template>
  <div class="cal" :class="{'has-result': hasResult}">
    <div v-if="!hasResult" class="cal-form">
      <ul class="cal-form-ul f-clearfix">
        <li>
          <span class="cal-form-item-name">商品sku</span><input type="text" class="input" v-model.trim="input.sku">
        </li>
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>外币售价</span><input type="text" class="input" v-model.trim.number="input.selling_price">
        </li> 
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>重量</span><input type="text" class="input" v-model.trim.number="input.weight"><i>克</i>
        </li>
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>采购价</span><input type="text" class="input" v-model.trim.number="input.purchase_price"><i>元</i>
        </li>
        <li>
          <span class="cal-form-item-name">体积</span><input type="text" class="input" v-model.trim.number="input.bulk"><i>m³</i>
        </li>
      </ul>
      <div class="cal-form-btns f-clearfix">
        <p class="cal-form-note">{{note}}</p>
        <button class="button" @click="cal">
          {{calBtnText}}
        </button>
      </div>
    </div>
    <div v-if="hasResult" class="cal-result">
      <div class="edit-h2">
        <a href="javascript: void 0" @click="goBack"><span class="icon-back"></span>返回</a>
      </div>
      <div class="f-clearfix">
        <button class="cal-result-save button f-left" @click="save">保存</button>
        <h3 class="cal-result-title f-left">计算结果<span>（商品sku：{{result.sku}}，重量：{{result.weight}}克，采购价：{{result.purchase_price}}元，体积：{{result.bulk}}m³）</span></h3>
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
      input: {
        sku: '',
        weight: '',
        purchase_price: '',
        selling_price: '',
        bulk: ''
      },
      hasResult: false,
      calBtnText: '计算',
      result: {
        sku: '',
        weight: '',
        purchase_price: '',
        bulk: ''
      },
      note: '',
      factor: null,
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
  mounted () {
    window.addEventListener('keyup', this.enter)
  },
  destroyed () {
    window.removeEventListener('keyup', this.enter)
  },
  methods: {
    enter(e) {
      let code = e.charCode || e.keyCode
      if (code === 13) {
        this.cal()
      }
    },
    cal() {
      this.note = ''
      if (!this.verify()) {
        return
      }
      this.hasResult = false
      this.factor = null
      this.calBtnText = '计算中...'
      // ajax
      this.axios(api.cal.query()).then(res => {
        let data = res.data
        console.log(data)
        this.calBtnText = '计算'
        if (data.code === 200) {
          let input = this.input
          let result = this.result
          result.sku = input.sku
          result.weight = input.weight
          result.purchase_price = input.purchase_price
          result.selling_price = input.selling_price
          result.bulk = input.bulk
          for (let key in input) {
            input[key] = ''
          }
          this.factor = {
            product: result,
            logistics: data.data.logistics
          }
          this.hasResult = true
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
    },
    goBack() {
      this.hasResult = false
    },
    verify() {
      let input = this.input
      let sellingPrice = input.selling_price
      if (!sellingPrice) {
        this.note = '外币售价不能为空'
        return false
      }
      if (!util.isNum(sellingPrice)) {
        this.note = '外币售价必须为数字'
        return false
      }

      let weight = input.weight
      if (!weight) {
        this.note = '重量不能为空'
        return false
      }
      if (!util.isInteger(weight)) {
        this.note = '重量必须为整数'
        return false
      }

      let purchasePrice = input.purchase_price
      if (!purchasePrice) {
        this.note = '采购价不能为空'
        return false
      }
      if (!util.isNum(purchasePrice)) {
        this.note = '采购价必须为数字'
        return false
      }

      let bulk = input.bulk
      if (bulk && !util.isNum(bulk)) {
        this.note = '体积必须为数字'
        return false
      }
      return true
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
.cal {
  padding: 30px;
}
.cal-form {
  position: relative;
  left: 50%;
  width: 400px;
  margin-top: 80px;
  margin-left: -276px;
  /* transition: all 0.2s; */
  padding: 30px 50px 30px 30px;
  background-color: #eee;
  border-radius: 2px;
}
.cal-form-ul {
}
.cal-form-ul li {
  position: relative;
  width: 320px;
  margin-bottom: 15px;
}
.cal-form-item-name {
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: 10px;
}
.cal-form-ul li > input {
  width: calc(100% - 95px);
  padding-right: 24px;
}
.cal-form-ul li > i {
  position: absolute;
  top: 12px;
  font-size: 12px;
  color: #999;
  right: 15px;
}
.cal-form-btns {
  margin-top: 5px;
  padding-left: 15px;
}
.cal-form-btns button {
  width: 100%;
  line-height: 30px
}
.cal-form-note {
  margin-bottom: 5px;
  color: #ff1717;
}
.cal-result {
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
