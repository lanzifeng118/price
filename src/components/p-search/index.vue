<template>
  <div class="serach">
    <div class="serach-form">
      <input type="text" class="" v-model.trim.lazy="serachText" placeholder="请输入商品sku" @keyup.enter="submit">
      <select name="" v-model="a">
        <option disabled value="">选择当地配送类型</option>
        <option disabled value="Ebay">Ebay</option>
      </select>
      <button class="button button-second">查询</button>
      <!-- <span class="search-icon icon-search" @click="submit"></span> -->
    </div>
    <div class="search-note">{{note}}</div>
    <h3 class="serach-ing">{{msg}}</h3>
    <result v-if="info" :product="product" :info="info" :search="true"></result>
  </div>
</template>

<script>
import api from 'components/tools/api'
import util from 'components/tools/util'
import result from 'components/c-result/index'
export default {
  data() {
    return {
      serachText: '',
      msg: '',
      note: '',
      info: null,
      product: null,
      a: 'Ebay'
    }
  },
  methods: {
    enter() {
      this.submit()
    },
    submit() {
      this.note = ''
      if (!this.verify()) {
        return
      }
      this.info = null
      this.msg = '查询中...'
      // ajax
      this.axios(api.product.queryBySku(this.serachText)).then(res => {
        let data = res.data
        // console.log(data)
        if (data.code === 200) {
          if (data.data) {
            let dataD = data.data
            // dataD.product.weight = ''
            let verifyMsg = util.verifyProduct(dataD.product)
            if (verifyMsg) {
              this.msg = `商品参数有误，${verifyMsg}`
              return
            }
            this.msg = ''
            this.product = dataD.product

            this.info = dataD
          } else {
            this.msg = `无商品sku为${this.serachText}的数据`
          }
        } else {
          this.msg = '出错了，请稍后再试！'
        }
      })
    },
    verify() {
      if (!this.serachText) {
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
/* .search-input {
  border-color: #ccc;
  width: 300px;
  padding-right: 30px;
} */
.search-input:hover {
  border-color: #aaa;
}
.search-icon {
  cursor: pointer;
  display: inline-block;
  color: #999;
  padding: 0 8px;
  line-height: 29px;
  margin-left: -35px;
}
.search-icon:hover {
  color: #00d0bc;
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
