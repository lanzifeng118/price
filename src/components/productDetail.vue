<template>
  <!-- 计算结果、商品详情 -->
  <div class="detail">
    <div class="detail-back">
      <router-link :to="backUrl">
        <span class="icon-back"></span>返回</router-link>
    </div>
    <div
      v-if="msg"
      class="detail-msg"
    >{{msg}}</div>
    <div
      v-else
      class="detail-box"
    >
      <button
        v-if="invoke === 1"
        class="detail-save yellow button"
        @click="insert"
      >保存</button>
      <!-- <button
        v-else-if="invoke === 2"
        class="detail-save yellow button"
        @click="change"
      >切换为{{item.local === '1' ? 'Amazon' : 'Ebay'}}</button> -->
      <select
        v-else-if="invoke === 2"
        class="detail-save"
        v-model="searchLocal"
        @change="change"
      >
        <option
          disabled
          value=""
        >选择当地配送</option>
        <option
          v-for="item in local"
          :value="item.type"
        >{{item.name}}</option>
      </select>
      <result
        v-if="info"
        :localType="item.local"
        :product="item"
        :info="info"
        :invoke="invoke"
      ></result>
    </div>
    <Pop
      v-if="invoke === 1"
      type="warning"
      :text="pop.text"
      v-show="pop.show"
      @confirm="confirmPop"
      @close="closePop"
    >
    </Pop>
  </div>
</template>

<script>
import result from 'components/productResult'
import { API_calculation } from '../model/calculation'
import { API_product } from '../model/product'
import { mapState } from 'vuex'
import verifyProduct from '../libs/verifyProduct'

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
      searchLocal: '1',
      // pop
      pop: {
        text: '',
        show: false
      }
    }
  },
  computed: {
    item() {
      const { sku, profit_rate, selling_price, purchase_price, bulk, category, local, weight } = this.$route.query
      // console.log(category, this.categoryMap)
      const item = {
        sku: sku || '',
        profit_rate,
        selling_price,
        purchase_price,
        weight,
        bulk,
        category: this.categoryMap[category] ? category : this.category[0].type,
        local: this.localMap[local] ? local : this.local[0].type
      }
      this.searchLocal = item.local
      // console.log(item)
      return item
    },
    backUrl() {
      const url = this.invoke === 1 ? 'calculate' : 'product'
      return `/${url}`
    },
    ...mapState(['local', 'localMap', 'category', 'categoryMap'])
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
      const msg = verifyProduct(this.item, this.invoke)
      if (msg) {
        this.msg = `参数错误，${msg}`
        this.$toast.warn(this.msg)
        this.goBack()
        return
      }
      this.info = null
      this.msg = '正在查询...'
      // 商品种类、当地配送种类
      const { category, local } = this.item

      API_calculation.query({ category, local })
        .then(data => {
          this.msg = ''
          this.info = data
        })
        .catch(err => {
          this.msg = '出错了...'  
          this.$toast.error()
        })
    },
    insert() {
      // console.log(this.item)
      if (!this.item.sku.trim()) {
        return this.$toast.error('保存失败，商品sku不能为空')
      }
      API_product.insert(this.item)
        .then(data => {
          this.$toast.success('保存成功')
        })
        .catch(({ code, message }) => {
          if (code === 400) {
            this.pop.text = `sku为${this.item.sku}的数据已存在，确定要覆盖吗？`
            this.pop.show = true
          } else {
            this.$toast.error()
          }
        }) 
    },
    closePop() {
      this.pop.show = false
    },
    confirmPop() {
      API_product.updateBySku(this.item)
        .then(data => {
          this.closePop()
          this.$toast.success('保存成功')
        })
        .catch(err => {
          this.$toast.error('保存失败，出错了')
          this.closePop()
        })
    },
    goBack() {
      setTimeout(() => {
        this.$router.push(this.backUrl)
      }, 700)
    },
    change() {
      const { item, searchLocal } = this
      item.local = searchLocal
      this.$router.push({ path: '/product/detail', query: item })
    }
  },
  components: {
    result
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
</style>
