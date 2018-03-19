<template>
  <div class="c-result">
    <h3 class="c-result-title">
      商品sku：{{product.sku}}，
      预设利润率：{{product.profit_rate}}%，
      <span v-if="!search">外币售价：{{product.selling_price}}，</span>
      <span v-if="!limit">采购价：¥{{product.purchase_price}}，</span>
      重量：{{product.weight}}g，
      体积：{{product.bulk  || '?'}}m³，
      种类：{{category[product.category]}}，
      当地配送：{{local[product.local]}}
    </h3>
    <div class="list-table-wrap">
      <table>
        <thead>
          <!-- cn -->
          <tr>
            <th>国家</th>
            <th :width="width">物流方式</th>
            <th v-if="!search" :width="width">售价(当地货币）</th>
            <th v-if="!limit" :width="width">采购成本¥</th>
            <th :width="width">头程成本¥</th>
            <th :width="width">二程成本¥</th>
            <th v-if="!search" :width="width">销售成本¥</th>
            <th v-if="!search" :width="width">总成本¥</th>
            <th v-if="!search" :width="width">毛利润¥</th>
            <th v-if="!search" :width="width">当前利润率</th>
            <th :width="width">{{product.profit_rate}}%利润率售价</th>
            <th :width="width">0%利润率售价</th>
            <th :width="width">5%利润率售价</th>
            <th :width="width">10%利润率售价</th>
            <th :width="width">15%利润率售价</th>
            <th :width="width">20%利润率售价</th>
            <th :width="width">25%利润率售价</th>
            <th :width="width">30%利润率售价</th>
          </tr>
        </thead>
        <tbody v-for="itemZ in items">
          <tr v-for="(item, index) in itemZ.list">
            <td v-if="index === 0" :rowspan="logOrder.length">{{itemZ.name}}</td>
            <!-- 物流方式 -->
            <td>{{item.logType}}</td>
            <!-- 售价 -->
            <td v-if="!search">{{itemZ.currency_symbol}} {{item.sPrice}}</td>
            <!-- 采购成本 -->
            <td v-if="!limit">¥ {{item.pPrice}}</td>
            <!-- 头程成本 -->
            <td>{{item.logFirst ? '¥ ' + item.logFirst : '-'}}</td>
            <!-- 二程成本 -->
            <td>{{item.logSecondRmb ? '¥ ' + item.logSecondRmb : '-'}}</td>
            <!-- 销售成本 -->
            <td v-if="!search">{{item.costSell ? '¥ ' + item.costSell : '-'}}</td>
            <!-- 总成本 -->
            <td v-if="!search">{{item.cost ? '¥ ' + item.cost : '-'}}</td>
            <!-- 毛利润 -->
            <td v-if="!search">{{item.profit ? '¥ ' + item.profit : '-'}}</td>
            <!-- 当前利润率 -->
            <td v-if="!search" :class="[item.earn ? 'ok' : 'warn']">{{item.profitRate ? item.profitRate + '%' : '-'}}</td>
            <!-- 预设利润率售价 -->
            <td>{{item.pRate_defalut ? itemZ.currency_symbol + ' ' + item.pRate_defalut : '-'}}</td>
            <!-- 0% -->
            <td>{{item.pRate_0 ? itemZ.currency_symbol + ' ' + item.pRate_0 : '-'}}</td>
            <td>{{item.pRate_5 ? itemZ.currency_symbol + ' ' + item.pRate_5 : '-'}}</td>
            <td>{{item.pRate_10 ? itemZ.currency_symbol + ' ' + item.pRate_10 : '-'}}</td>
            <td>{{item.pRate_15 ? itemZ.currency_symbol + ' ' + item.pRate_15 : '-'}}</td>
            <td>{{item.pRate_20 ? itemZ.currency_symbol + ' ' + item.pRate_20 : '-'}}</td>
            <td>{{item.pRate_25 ? itemZ.currency_symbol + ' ' + item.pRate_25 : '-'}}</td>
            <td>{{item.pRate_30 ? itemZ.currency_symbol + ' ' + item.pRate_30 : '-'}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import calPrice from 'components/tools/calPrice'
export default {
  props: {
    search: {
      type: Boolean,
      defalut: false
    },
    info: {
      type: Object,
      required: true
    },
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    logOrder() {
      return this.$store.state.logOrder
    },
    limit() {
      return this.search && this.$store.state.user === 'xs002'
    },
    width() {
      // search 13 limit 12
      return this.search ? (this.limit ? '8.3%' : '7.7%') : '5.55%'
    },
    category() {
      return this.$store.state.categoryMap
    },
    local() {
      return this.$store.state.localMap
    },
    items() {
      // console.log(this.search)
      let items = []
      let info = this.info
      let zone = info.zone
      let product = this.product
      items = calPrice.cal(product, zone, info.factor, info.domestic, info.local, 10, false)
      return items
    }
  },
  components: {}
}
</script>
<style>
.c-result-title {
  color: #32b514;
}
.c-result .list-table-wrap td.warn {
  background-color: #d24900;
  color: #fff;
}
.c-result .list-table-wrap td.ok {
  background-color: #32b514;
  color: #fff;
}
.c-result .list-table-wrap td {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
