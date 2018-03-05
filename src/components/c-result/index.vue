<template>
  <div class="list-table-wrap">
    <table>
      <thead>
        <!-- cn -->
        <tr>
          <th width="5%">国家</th>
          <th width="8%">物流方式</th>
          <th width="5%">售价(当地货币）</th>
          <th width="5%">重量(g）</th>
          <th width="5%">采购成本¥</th>
          <th width="5%">头程成本¥</th>
          <th width="5%">二程成本(当地货币)</th>
          <th width="5%">二程成本¥</th>
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
      <tbody>
        <tr v-for="item in items" :class="item.country">
          <td class="country">{{item.country}}</td>
          <td>{{item.logistics}}</td>
          <td>{{item.money}}{{item.selling_price}}</td>
          <td>{{item.weight}}g</td>
          <td>¥{{item.purchase_price}}</td>
          <td>¥0</td>
          <td>{{item.money}}0.3</td>
          <td>¥2.5</td>
          <td>¥1.5</td>
          <td>¥5.0</td>
          <td>3.3</td>
          <td>40.0%</td>
          <td>{{item.money}}0.5</td>
          <td>{{item.money}}0.6</td>
          <td>{{item.money}}0.6</td>
          <td>{{item.money}}0.6</td>
          <td>{{item.money}}0.7</td>
          <td>{{item.money}}0.7</td>
          <td>{{item.money}}0.8</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['factor'],
  data() {
    return {}
  },
  computed: {
    items() {
      // 1.国内小包 2.海运小包 3.空运小包
      let items = []
      let area = ['uk', 'us', 'de', 'au']
      let logOrder = ['1', '2', '3']
      let mapMoney = {
        uk: '￡',
        us: '$',
        de: '€',
        au: '$'
      }
      let mapLog = {
        '1': '国内小包',
        '2': '海运小包',
        '3': '空运小包'
      }
      let product = this.factor.product
      console.log(product)
      // let logistics = this.factor.logistics
      console.log(this.factor)
      area.forEach(v => {
        logOrder.forEach(vL => {
          let item = {}
          item.country = v
          item.money = mapMoney[v]
          item.bulk = product.bulk
          item.weight = product.weight
          item.purchase_price = product.purchase_price
          item.selling_price = product.selling_price
          item.logistics = mapLog[vL]
          items.push(item)
        })
      })
      // console.log(items)
      return items
    }
  },
  methods: {
    // 国内小包
    domesticUS() {
      // 物流成本=重量(g)*71.2/1000+10 若重量不足50g，取50g计算
      let weight = this.factor.product.weight
      if (weight < 50) {
        weight = 50
      }
      return weight * 71.2 / 1000 + 10
    },
    domesticUK() {
      // 当[重量＜100g]，物流成本=重量(g)*87.56/1000
      // 当[100g≤重量＜300g]，物流成本=重量(g)*83.5/1000
      // 当[300g≤重量＜3000g]，物流成本=重量(g)*40/1000+18
    },
    domesticAU() {
      // 当[重量＜100g]，物流成本=重量(g)*90.37/1000
      // 当[100g≤重量＜300g]，物流成本=重量(g)*84.75/1000
      // 当[300g≤重量＜750g]，物流成本=重量(g)*71.78/1000+5.72
      // 当[750g≤重量＜3000g]，物流成本=重量(g)*93*/1000+15
    },
    domesticDE() {
      // 当[重量＜100g]，物流成本=重量(g)*90.37/1000
      // 当[100g≤重量＜300g]，物流成本=重量(g)*85.37
      // 当[300g≤重量＜3000g]，物流成本=重量(g)*50/1000+20
    },
    // 国外小包（空运）：物流成本=空运头程+当地派送费
    // 实重=重量(g)/1000
    // 体积重=体积（cm³）/6000
    // 当实重≥体积重，则空运头程和海运头程均=实重*单价
    // 当实重＜体积重，则空运头程和海运头程均=体积重*单价
    air() {
      // 空运头程：当实重≥体积重，
      // UK头程=重量(g)/1000*38
      // US头程=重量(g)/1000*32
      // DE头程=重量(g)/1000*38.5
      // AU头程=重量(g)/1000*33
      // 当实重＜体积重，
      // UK头程=体积/6000*38
      // US头程=体积/6000*32
      // DE头程=体积/6000*38.5
      // AU头程=体积/6000*33
    }
  },
  components: {}
}
</script>
<style>
.list-table-wrap tr.us td,
.list-table-wrap tr.au td {
  background-color: #f1f1f1;
}
.list-table-wrap td.country {
  text-transform: uppercase;
}
</style>
