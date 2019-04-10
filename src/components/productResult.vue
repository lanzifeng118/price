<template>
  <div class="c-result">
    <h3 class="c-result-title">
      商品sku：{{product.sku}}，
      预设利润率：{{product.profit_rate}}%，
      <span v-if="!lack">外币售价：{{product.selling_price}}，</span>
      <span>采购价：¥{{product.purchase_price}}，</span>
      重量：{{product.weight}}g，
      体积：{{product.bulk  || '?'}}cm³，
      种类：{{categoryMap[product.category]}}，
      当地配送：{{localMapAll[product.local].name}}
    </h3>
    <div class="list-table-wrap">
      <table>
        <thead>
          <!-- cn -->
          <tr>
            <th rowspan="2">国家</th>
            <th :width="width" rowspan="2">物流方式</th>
            <th v-if="!lack" rowspan="2" :width="width">售价(当地货币）</th>
            <th :colspan="lack ? 3 : 5">成本</th>
            <th v-if="!lack" rowspan="2" :width="width">毛利润</th>
            <th v-if="!lack" rowspan="2" :width="width">当前利润率</th>
            <th colspan="8">利润率售价</th>
          </tr>
          <tr>
            <th :width="width">采购</th>
            <th :width="width">头程</th>
            <th :width="width">二程</th>
            <th v-if="!lack" :width="width">销售</th>
            <th v-if="!lack" :width="width">总成本</th>
            <th :width="width">{{product.profit_rate}}%</th>
            <th :width="width">0%</th>
            <th :width="width">5%</th>
            <th :width="width">10%</th>
            <th :width="width">15%</th>
            <th :width="width">20%</th>
            <th :width="width">25%</th>
            <th :width="width">30%</th>
          </tr>
        </thead>
        <tbody v-for="itemZ in items">
          <tr v-for="(item, index) in itemZ.list">
            <!-- 国家 -->
            <td v-if="index === 0" :rowspan="localMapAll[product.local].logistics.length">{{itemZ.name}}</td>
            <!-- 物流方式 -->
            <td>{{item.logName}}</td>
            <!-- 售价 -->
            <td v-if="!lack">{{itemZ.currency_symbol}} {{item.sPrice}}</td>
            <!-- 采购成本 -->
            <td>¥ {{item.pPrice}}</td>
            <!-- 头程成本 -->
            <td>{{item.logFirst ? '¥ ' + item.logFirst : '-'}}</td>
            <!-- 二程成本 -->
            <td>{{item.logSecondRmb ? '¥ ' + item.logSecondRmb : '-'}}</td>
            <!-- 销售成本 -->
            <td v-if="!lack">{{item.costSell ? '¥ ' + item.costSell : '-'}}</td>
            <!-- 总成本 -->
            <td v-if="!lack">{{item.cost ? '¥ ' + item.cost : '-'}}</td>
            <!-- 毛利润 -->
            <td v-if="!lack">{{item.profit ? '¥ ' + item.profit : '-'}}</td>
            <!-- 当前利润率 -->
            <td v-if="!lack" :class="[item.earn ? 'ok' : 'warn']">{{item.profitRate ? item.profitRate + '%' : '-'}}</td>
            <!-- 预设利润率售价 -->
            <td :class="{ok: lack }">{{item.pRate_defalut ? item.symbol + ' ' + item.pRate_defalut : '-'}}</td>
            <!-- 0% -->
            <td>{{item.pRate_0 ? item.symbol + ' ' + item.pRate_0 : '-'}}</td>
            <td>{{item.pRate_5 ? item.symbol + ' ' + item.pRate_5 : '-'}}</td>
            <td>{{item.pRate_10 ? item.symbol + ' ' + item.pRate_10 : '-'}}</td>
            <td>{{item.pRate_15 ? item.symbol + ' ' + item.pRate_15 : '-'}}</td>
            <td>{{item.pRate_20 ? item.symbol + ' ' + item.pRate_20 : '-'}}</td>
            <td>{{item.pRate_25 ? item.symbol + ' ' + item.pRate_25 : '-'}}</td>
            <td>{{item.pRate_30 ? item.symbol + ' ' + item.pRate_30 : '-'}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import calPrice from '../libs/calPrice'
export default {
  props: {
    // 1、计算 2、商品信息 3、查询 权限限制
    invoke: {
      type: Number,
      defalut: 1
    },
    zoneShow: {
      type: String,
      defalut: ''
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
    lack() {
      return this.invoke === 2 || this.invoke === 3
    },
    limit() {
      return this.invoke === 3 && this.user === 'xs002'
    },
    width() {
      // search 13 limit 12
      return this.lack ? '7.7%' : '5.55%'
    },
    items() {
      const { info, product, zoneShow } = this
      // console.log(product)
      const { zone, factor, domestic, local } = info
      const items = calPrice.cal(product, zone, factor, domestic, local, product.profit_rate, false)
      return zoneShow ? items.filter(val => val.name === zoneShow) : items
    },
    ...mapState(['user', 'categoryMap', 'localMapAll', 'logistics'])
  },
  components: {}
}
</script>
<style>
.c-result-title {
  padding-right: 180px;
  line-height: 1.2;
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
