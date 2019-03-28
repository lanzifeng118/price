<template>
  <div class="serach">
    <div class="serach-form f-clearfix">
      <select
        v-model="serach.local"
        @change="submitSelect"
      >
        <option
          disabled
          value=""
        >选择类型</option>
        <option
          v-for="item in local"
          :value="item.type"
        >{{item.name}}</option>
      </select>
      <input
        type="text"
        v-model.trim.lazy="serach.sku"
        placeholder="请输入商品sku"
        @keyup.enter="submit"
      >
      <button
        class="button primary"
        @click="submit"
      ><span class="search-icon icon-search"></span></button>
    </div>
    <div class="search-note">{{note}}</div>
    <h3 class="serach-ing">{{msg}}</h3>
    <result
      v-if="info"
      :product="product"
      :info="info"
      :invoke="3"
    ></result>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { API_product } from '../model/product'
import result from 'components/productResult'
import verifyProduct from '../libs/verifyProduct'

export default {
  data() {
    return {
      serach: {
        sku: '',
        local: '1'
      },
      msg: '',
      note: '',
      info: null,
      product: null
    }
  },
  computed: mapState(['local']),
  methods: {
    submitSelect() {
      if (this.serach.sku) {
        this.submit()
      }
    },
    submit() {
      this.note = ''
      this.info = null
      if (!this.verify()) {
        return
      }
      this.msg = '查询中...'
      API_product.queryBySku(this.serach)
        .then(data => {
          if (data) {
            data.product.local = this.serach.local
            // console.log(data.product)
            let verifyMsg = verifyProduct(data.product, 2)
            if (verifyMsg) {
              this.msg = `商品参数有误，${verifyMsg}`
              return
            }
            this.msg = ''
            this.product = data.product
            this.info = data
          } else {
            this.msg = `无商品sku为${this.serach.sku}的数据`
          }
        })
        .catch(err => {
          this.msg = '出错了，请稍后再试！'
        })
    },
    verify() {
      if (!this.serach.sku) {
        this.note = '商品sku不能为空'
        return false
      }
      return true
    }
  },
  components: {
    result
  }
}
</script>
<style>
.serach {
  padding: 20px 30px;
}

/*search*/
.serach-form {
  margin-bottom: 25px;
}
.serach-form input,
.serach-form button,
.serach-form select {
  float: left;
  margin-right: 5px;
}
.serach-form select {
  width: 100px;
}
.serach-form button {
  line-height: 30px;
  width: 50px;
  min-width: 50px;
}

.serach-result {
  margin: 20px 0;
}
.search-note {
  color: #ff1717;
  margin-top: 5px;
}
.serach-ing {
  text-align: center;
  font-size: 20px;
  color: #ccc;
}
/* .has-result */
</style>
