<template>
  <div class="list-table-wrap">
    <table>
      <thead>
        <!-- cn -->
        <tr >
          <th width="5%" >国家</th>
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
          <th width="5%">5%利润率售价</th>
          <th width="5%">15%利润率售价</th>
          <th width="5%">20%利润率售价</th>
          <th width="5%">25%利润率售价</th>
          <th width="5%">30%利润率售价</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :class="item.country">
          <td class="country">{{item.country}}</td>
          <td >{{item.logistics}}</td>
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
        'uk': '￡',
        'us': '$',
        'de': '€',
        'au': '$'
      }
      let mapLog = {
        '1': '国内小包',
        '2': '海运小包',
        '3': '空运小包'
      }
      let product = this.factor.product
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
  },
  components: {}
}
</script>
<style>
.list-table-wrap tr.us td,
.list-table-wrap tr.au td {
  background-color: #f1f1f1;
}
.list-table-wrap td.country{
  text-transform: uppercase;
}
</style>
