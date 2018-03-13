<template>
  <div class="cal-input">
    <div class="cal-form">
      <ul class="cal-form-ul f-clearfix">
        <li>
          <span class="cal-form-item-name">商品sku</span><input type="text" class="input" v-model.trim="item.sku">
        </li>
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>外币售价</span><input type="text" class="input" v-model.trim.number="item.selling_price">
        </li> 
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>采购价</span><input type="text" class="input" v-model.trim.number="item.purchase_price"><i>元</i>
        </li>
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>重量</span><input type="text" class="input" v-model.trim.number="item.weight"><i>克</i>
        </li>
        <li>
          <span class="cal-form-item-name">体积</span><input type="text" class="input" v-model.trim.number="item.bulk"><i>m³</i>
        </li>
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>商品种类</span>
          <select v-model="item.category">
            <option disabled value="">选择种类</option>
            <option value="1">普通</option>
            <option value="2">带电</option>
            <option value="3">带磁</option>
            <option value="4">超尺寸</option>
          </select>
        </li>
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>当地配送</span>
          <select v-model="item.local">
            <option disabled value="">选择类型</option>
            <option value="1">Ebay</option>
            <option value="2">Amazon</option>
          </select>
        </li>
      </ul>
      <div class="cal-form-btns f-clearfix">
        <p class="cal-form-note">{{note}}</p>
        <button class="button" @click="cal">计算</button>
      </div>
    </div>
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
import util from 'components/tools/util'

export default {
  data() {
    return {
      item: {
        sku: '',
        weight: '',
        purchase_price: '',
        selling_price: '',
        bulk: '',
        category: '1',
        local: '1'
      },
      note: '',
      // toast
      toast: {
        show: false,
        text: '',
        icon: ''
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
      let url = '/admin/calculate/result?'
      for (const key in this.item) {
        url += `${key}=${this.item[key]}&`
      }
      this.$router.push(url)
    },
    verify() {
      let item = this.item
      let sellingPrice = item.selling_price
      if (!sellingPrice) {
        this.note = '外币售价不能为空'
        return false
      }
      if (!util.isNum(sellingPrice)) {
        this.note = '外币售价必须为数字'
        return false
      }

      let purchasePrice = item.purchase_price
      if (!purchasePrice) {
        this.note = '采购价不能为空'
        return false
      }
      if (!util.isNum(purchasePrice)) {
        this.note = '采购价必须为数字'
        return false
      }

      let weight = item.weight
      if (!weight) {
        this.note = '重量不能为空'
        return false
      }
      if (!util.isInteger(weight)) {
        this.note = '重量必须为整数'
        return false
      }

      let bulk = item.bulk
      if (bulk && !util.isNum(bulk)) {
        this.note = '体积必须为数字'
        return false
      }

      return true
    }
  },
  components: {
    toast
  }
}
</script>
<style>
.cal-form {
  position: relative;
  left: 50%;
  width: 400px;
  margin-top: 50px;
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
.cal-form-ul li > input,
.cal-form-ul li > select {
  background-color: #fff;
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
</style>
