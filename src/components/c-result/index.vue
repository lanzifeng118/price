<template>
  <div class="c-result">
    <h3 class="c-result-title">计算结果
      <span>（商品sku：{{product.sku}}，外币售价：{{product.selling_price}}，采购价：¥{{product.purchase_price}}，重量：{{product.weight}}g，体积：{{product.bulk}}m³，种类：{{category[product.category]}}，当地配送：{{local[product.local]}}）</span>
    </h3>
    <div class="list-table-wrap">
      <table>
        <thead>
          <!-- cn -->
          <tr>
            <th width="5%">国家</th>
            <th width="8%">物流方式</th>
            <th width="5%">售价(当地货币）</th>
            <th width="5%">头程成本¥</th>
            <th width="5%">二程成本¥</th>
            <th width="5%">二程成本(当地货币)</th>
            <th width="5%">销售成本¥</th>
            <th width="5%">总成本¥</th>
            <th width="5%">毛利润¥</th>
            <th width="7%">当前利润率</th>
            <th width="5%">0%利润率售价</th>
            <th width="5%">5%利润率售价</th>
            <th width="5%">10%利润率售价</th>
            <th width="5%">15%利润率售价</th>
            <th width="5%">20%利润率售价</th>
            <th width="5%">25%利润率售价</th>
            <th width="5%">30%利润率售价</th>
          </tr>
        </thead>
        <tbody v-for="itemZ in items">
          <tr v-for="(item, index) in itemZ.list">
            <td v-if="index === 0" :rowspan="logOrder.length">{{itemZ.name}}</td>
            <!-- 物流方式 -->
            <td>{{item.logType}}</td>
            <!-- 售价 -->
            <td>{{itemZ.currency_symbol}} {{product.selling_price}}</td>
            <!-- 头程成本 -->
            <td>¥ {{item.logFirst}}</td>
            <!-- 二程成本 -->
            <td>¥ {{item.logSecondRmb}}</td>
            <!-- 二程成本(当地货币) -->
            <td>{{itemZ.currency_symbol}} {{item.logSecond}}</td>
            <!-- 销售成本 -->
            <td>¥ {{item.costSell}}</td>
            <!-- 总成本 -->
            <td>¥ {{item.cost}}</td>
            <!-- 毛利润 -->
            <td>¥ {{item.profit}}</td>
            <!-- 当前利润率 -->
            <td>{{item.profitRate}}%</td>
            <!-- 0% -->
            <td>{{itemZ.currency_symbol}} {{item.profitRate_0}}</td>
            <td>{{itemZ.currency_symbol}} {{item.profitRate_5}}</td>
            <td>{{itemZ.currency_symbol}} {{item.profitRate_10}}</td>
            <td>{{itemZ.currency_symbol}} {{item.profitRate_15}}</td>
            <td>{{itemZ.currency_symbol}} {{item.profitRate_20}}</td>
            <td>{{itemZ.currency_symbol}} {{item.profitRate_25}}</td>
            <td>{{itemZ.currency_symbol}} {{item.profitRate_30}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
      logOrder: ['国内小包', '海运小包', '空运小包'],
      category: {
        '1': '普通',
        '2': '带电',
        '3': '带磁',
        '4': '超尺寸'
      },
      local: {
        '1': 'Ebay',
        '2': 'Amazon'
      }
    }
  },
  computed: {
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
      console.log('this.info')
      console.log('weight---' + this.weight)
      console.log('weightLocal---' + this.weightLocal)
      console.log(this.product)
      /**
       * logFirst 头程成本
       * logSecond 二程成本(当地货币)
       * logSecondRmb 二程成本(人民币）
       * costSell 销售成本 = 售价 * 汇率 * 因子
       * cost 总成本 = 采购成本 + 物流成本 + 销售成本
       * profit 毛利润 = 销售成本 - 总成本
       * profitRate 当前利润率 = 毛利润 / 总成本
       * （采购成本+物流成本）/汇率/(1 - 0.18 - 0.1)
       */
      zone.forEach(v => {
        v.list = []
        let zoneLow = v.name.toLowerCase()
        let exRate = v.exchange_rate
        let pPrice = parseFloat(product.purchase_price) || 0
        let sPrice = parseFloat(product.selling_price) || 0

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
              item.logFirst = v.price_sea * this.weight
            } else if (iL === 2) {
              // 空运小包
              let category = product.category
              if (category === '2' || category === '3') {
                // 带电带磁
                item.logFirst = v.price_air_em * this.weight
              } else {
                item.logFirst = v.price_air * this.weight
              }
            }
            item.logSecond = this.calLog(this.weightLocal, info.local[zoneLow])
          }
          let factorSC = info.factor.sell_cost

          // 二程成本(人民币）
          item.logSecondRmb = item.logSecond * exRate || 0
          // sPriceRmb售价
          item.sPriceRmb = sPrice * exRate
          // 销售成本
          item.costSell = item.sPriceRmb * factorSC
          // 总成本
          item.cost = pPrice + item.costSell + item.logFirst + item.logSecondRmb
          // 毛利润
          item.profit = item.sPriceRmb - item.cost
          // 当前利润
          item.profitRate = item.profit / item.cost * 100
          // 10%利润

          for (let k = 0; k <= 30; k += 5) {
            item[`profitRate_${k}`] = calProfitRate(k / 100)
          }

          let keys = [
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
            item[v] = item[v].toFixed(DIGITS)
          })

          v.list.push(item)

          function calProfitRate(rate) {
            let f = item.logFirst
            let s = item.logSecondRmb
            let result = (f + s) / exRate / (1 - factorSC - rate)
            return result.toFixed(DIGITS)
          }
        })
        items.push(v)
      })
      console.log(items)
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
          // console.log('calLog-----')
          // console.log(item)
          let priceUnit = parseFloat(item.price_unit)
          let priceWeight = parseFloat(item.price_weight)
          let extraCharge = parseFloat(item.extra_charge) || 0
          if (priceUnit) {
            total = priceUnit + extraCharge
          } else if (priceWeight) {
            total = weight * priceWeight + extraCharge
          } else {
            // result.total = '价格有误'
            total = '-'
          }
          break
        }
        if (i === list.length - 1) {
          total = '~'
        }
      }
      return total
    }
  },
  components: {}
}
</script>
<style>
.c-result-title span {
  font-weight: normal;
  color: #999;
}
</style>
