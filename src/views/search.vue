<template>
  <div class="serach">
    <div class="serach-form f-clearfix">
      <select v-model="serach.local" @change="submitSelect">
        <option disabled value="">选择类型</option>
        <option v-for="item in local" :value="item.type">{{item.name}}</option>
      </select>
      <input type="text" v-model.trim.lazy="serach.sku" placeholder="请输入商品sku" @keyup.enter="submit">
      <button class="button primary" @click="submit"><span class="search-icon icon-search"></span></button>
    </div>
    <div class="search-note">{{note}}</div>
    <h3 class="serach-ing">{{msg}}</h3>
    <result v-if="info" :product="product" :info="info" :invoke="3"></result>
  </div>
</template>

<script>
import api from 'components/tools/api'
import util from 'components/tools/util'
import result from 'components/c-result/index'
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
  computed: {
    local() {
      return this.$store.state.local
    }
  },
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
      // ajax
      this.axios(api.product.queryBySku(this.serach)).then(res => {
        let data = res.data
        // console.log(data)
        if (data.code === 200) {
          if (data.data) {
            let dataD = data.data
            // dataD.product.weight = ''
            dataD.product.local = this.serach.local
            // console.log(dataD.product)
            let verifyMsg = util.verifyProduct(dataD.product, 2)
            if (verifyMsg) {
              this.msg = `商品参数有误，${verifyMsg}`
              return
            }
            this.msg = ''
            this.product = dataD.product

            this.info = dataD
          } else {
            this.msg = `无商品sku为${this.serach.sku}的数据`
          }
        } else {
          this.msg = '出错了，请稍后再试！'
        }
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
