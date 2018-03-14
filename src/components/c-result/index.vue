<template>
  <div class="c-result">
    <h3 class="c-result-title">
      商品sku：{{product.sku}}，预设利润率：{{product.profit_rate}}%，外币售价：{{product.selling_price}}，<span v-if="!limit">采购价：¥{{product.purchase_price}}，</span>重量：{{product.weight}}g，体积：{{product.bulk  || '?'}}m³，种类：{{category[product.category]}}，当地配送：{{local[product.local]}}
    </h3>
    <div class="list-table-wrap">
      <table>
        <thead>
          <!-- cn -->
          <tr>
            <th :width="width">国家</th>
            <th width="7%">物流方式</th>
            <th :width="width">售价(当地货币）</th>
            <th v-if="!limit" :width="width">采购成本¥</th>
            <th :width="width">头程成本¥</th>
            <th :width="width">二程成本¥</th>
            <th :width="width">销售成本¥</th>
            <th :width="width">总成本¥</th>
            <th :width="width">毛利润¥</th>
            <th>当前利润率</th>
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
            <td>{{itemZ.currency_symbol}} {{item.sPrice}}</td>
            <!-- 采购成本 -->
            <td v-if="!limit">¥ {{item.pPrice}}</td>
            <!-- 头程成本 -->
            <td>{{item.logFirst ? '¥ ' + item.logFirst : '-'}}</td>
            <!-- 二程成本 -->
            <td>{{item.logSecondRmb ? '¥ ' + item.logSecondRmb : '-'}}</td>
            <!-- 销售成本 -->
            <td>{{item.costSell ? '¥ ' + item.costSell : '-'}}</td>
            <!-- 总成本 -->
            <td>{{item.cost ? '¥ ' + item.cost : '-'}}</td>
            <!-- 毛利润 -->
            <td>{{item.profit ? '¥ ' + item.profit : '-'}}</td>
            <!-- 当前利润率 -->
            <td :class="[item.earn ? 'ok' : 'warn']">{{item.profitRate ? item.profitRate + '%' : '-'}}</td>
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
    return {
      logOrder: ['国内小包', '海运小包', '空运小包']
    }
  },
  computed: {
    limit() {
      return this.search && this.$store.state.user === 'xs002'
    },
    width() {
      return this.limit ? '5.7%' : '5.4%'
    },
    category() {
      return this.$store.state.categoryMap
    },
    local() {
      return this.$store.state.localMap
    },
    weight() {
      let product = this.product
      let factorW = this.info.factor.weight_1
      return this.calWeight(product.weight, product.bulk, factorW)
    },
    weightLocal() {
      let product = this.product
      let factorW = this.info.factor.weight_2
      return this.calWeight(product.weight, product.bulk, factorW)
    },
    items() {
      let items = []
      let info = this.info
      let zone = info.zone
      let product = this.product
      const DIGITS = 2
      // console.log('this.info')
      // console.log('weight---' + this.weight)
      // console.log('weightLocal---' + this.weightLocal)
      // console.log(this.product)
      /**
       * logFirst 头程成本
       * logSecond 二程成本(当地货币)
       * logSecondRmb 二程成本(人民币）
       * costSell 销售成本 = 售价 * 汇率 * 因子
       * cost 总成本 = 采购成本 + 物流成本 + 销售成本
       * profit 毛利润 = 销售价格 - 总成本
       * profitRate 利润率 = 毛利润 / 销售价格
       * 售价 =（采购成本+物流成本）/汇率/(1 - 0.18 - 0.1)
       */
      zone.forEach(v => {
        v.list = []
        let zoneLow = v.name.toLowerCase()
        let exRate = parseFloat(v.exchange_rate)
        let pPrice = parseFloat(product.purchase_price)
        let sPrice = parseFloat(product.selling_price)
        let priceSea = parseFloat(v.price_sea)
        let priceAir = parseFloat(v.price_air)
        let priceAirEm = parseFloat(v.price_air_em)

        this.logOrder.forEach((vL, iL) => {
          let item = {}
          item.logType = vL
          if (iL === 0) {
            // 国内小包
            item.logFirst = this.calLog(this.weight, info.domestic[zoneLow])
            item.logSecond = 0
          } else {
            if (iL === 1) {
              // 海运小包
              item.logFirst = priceSea * this.weight
            } else if (iL === 2) {
              // 空运小包
              let category = product.category
              if (category === '2' || category === '3') {
                // 带电带磁
                item.logFirst = priceAirEm * this.weight
              } else {
                item.logFirst = priceAir * this.weight
              }
            }
            item.logSecond = this.calLog(this.weightLocal, info.local[zoneLow])
          }
          let factorSC = info.factor.sell_cost
          // 售价
          item.sPrice = sPrice
          // 采购成本
          item.pPrice = pPrice
          // 售价 人民币
          item.sPriceRmb = sPrice * exRate
          // 二程成本(人民币）
          item.logSecondRmb = item.logSecond * exRate
          // 销售成本
          item.costSell = item.sPriceRmb * factorSC
          // 总成本
          item.cost = pPrice + item.costSell + item.logFirst + item.logSecondRmb
          // 毛利润
          item.profit = item.sPriceRmb - item.cost
          // 是否盈利
          item.earn = item.profit > 0
          // 当前利润
          item.profitRate = item.profit / item.sPriceRmb * 100
          // 预设利润
          item.pRate_defalut = calProfitRate(product.profit_rate / 100)

          for (let k = 0; k <= 30; k += 5) {
            item[`pRate_${k}`] = calProfitRate(k / 100)
          }

          let keys = [
            'pPrice',
            'sPrice',
            'logFirst',
            'sPriceRmb',
            'logSecond',
            'logSecondRmb',
            'costSell',
            'cost',
            'profit',
            'profitRate'
          ]

          keys.forEach(v => {
            let val = item[v]
            if (!isNaN(val)) {
              item[v] = val.toFixed(DIGITS)
            }
          })

          v.list.push(item)

          function calProfitRate(rate) {
            let f = item.logFirst
            let s = item.logSecondRmb
            let result = (pPrice + f + s) / exRate / (1 - factorSC - rate)
            result = isNaN(result) ? result : result.toFixed(DIGITS)
            return result
          }
        })
        items.push(v)
      })
      // console.log(items)
      return items
    }
  },
  methods: {
    calWeight(weight, bulk, rate) {
      let weightReal = weight / 1000 || 0
      let weightBulk = bulk / rate || 0
      return Math.round(Math.max(weightReal, weightBulk) * 100000) / 100000
    },
    calLog(weight, list) {
      weight = parseFloat(weight) || 0
      let total = 0
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let sw = parseFloat(item.start_weight) || 0
        let ew = parseFloat(item.end_weight) || Infinity
        if (weight >= sw && weight < ew) {
          let priceUnit = parseFloat(item.price_unit)
          let priceWeight = parseFloat(item.price_weight)
          let extraCharge = parseFloat(item.extra_charge) || 0
          if (priceUnit) {
            total = priceUnit + extraCharge
          } else if (priceWeight) {
            total = weight * priceWeight + extraCharge
          } else {
            // 价格有误
            total = NaN
          }
          break
        }
        // 不在区间
        if (i === list.length - 1) {
          total = NaN
        }
      }
      return total
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
</style>
