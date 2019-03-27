<template>
  <div class="cal-input">
    <div class="cal-form">
      <ul class="cal-form-ul f-clearfix">
        <li>
          <span class="cal-form-item-name">商品sku</span><input type="text" class="input" v-model.trim="item.sku">
        </li>
        <li>
          <span class="cal-form-item-name"><span class="icon-nessisary"></span>预设利润率</span><input type="text" class="input" v-model.trim.number="item.profit_rate">
          <i>%</i>
        </li>
        <li>
          <span class="cal-form-item-name">
            <span class="icon-nessisary"></span>外币售价</span><input type="text" class="input" v-model.trim.number="item.selling_price">
        </li>
        <li>
          <span class="cal-form-item-name">
            <span class="icon-nessisary"></span>采购价</span><input type="text" class="input" v-model.trim.number="item.purchase_price">
          <i>元</i>
        </li>
        <li>
          <span class="cal-form-item-name">
            <span class="icon-nessisary"></span>重量</span><input type="text" class="input" v-model.trim.number="item.weight">
          <i>克</i>
        </li>
        <li>
          <span class="cal-form-item-name">体积</span><input type="text" class="input" v-model.trim.number="item.bulk">
          <i>cm³</i>
        </li>
        <li>
          <span class="cal-form-item-name">
            <span class="icon-nessisary"></span>商品种类</span>
          <select v-model="item.category">
            <option disabled value="">选择种类</option>
            <option v-for="item in category" :value="item.type">{{item.name}}</option>
          </select>
        </li>
        <li>
          <span class="cal-form-item-name">
            <span class="icon-nessisary"></span>当地配送</span>
          <select v-model="item.local">
            <option disabled value="">选择类型</option>
            <option v-for="item in local" :value="item.type">{{item.name}}</option>
          </select>
        </li>
      </ul>
      <div class="cal-form-btns f-clearfix">
        <p class="cal-form-note">{{note}}</p>
        <button class="button" @click="cal">计算</button>
      </div>
    </div>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon">
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
        profit_rate: '',
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
  computed: {
    category() {
      return this.$store.state.category
    },
    local() {
      return this.$store.state.local
    }
  },
  mounted() {
    window.addEventListener('keyup', this.enter)
  },
  destroyed() {
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
      this.$router.push({path: '/calculate/result', query: this.item})
    },
    verify() {
      let verify = util.verifyProduct(this.item)
      if (verify) {
        this.note = verify
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
  width: 400px;
  /* transition: all 0.2s; */
  padding: 30px 50px 30px 30px;
  /* background-color: #eee; */
  margin: 0 auto;
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
  width: 85px;
  text-align: right;
  margin-right: 10px;
}
.cal-form-ul li > input,
.cal-form-ul li > select {
  background-color: #fff;
  width: calc(100% - 100px);
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
  padding-left: 15px;
}
.cal-form-btns button {
  width: 100%;
  line-height: 30px;
}
.cal-form-note {
  height: 14px;
  margin-bottom: 5px;
  color: #ff1717;
}
</style>
