<template>
  <div class="lowest-detail">
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th>SKU</th>
            <th v-for="item in titles">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item1 in items">
            <td>{{item1.sku}}</td>
            <td v-for="val in item1.list">{{val || '-'}}</td>
          </tr>
        </tbody>
      </table>
      <paging v-show="items.length > 0" :paging="paging" @pagingNextClick="pagingNextClick"   @pagingPreClick="pagingPreClick" @pagingChange="pagingChange">
      </paging>
    </div>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon"></toast>
  </div>
</template>

<script>
import toast from 'components/toast/toast'
import paging from 'components/c-paging/index'
import calPrice from 'components/tools/calPrice'
import api from 'components/tools/api'

export default {
  props: ['profitRate', 'local'],
  data() {
    return {
      titles: [],
      items: [],
      msg: '',
      deleteIds: [],
      // paging
      paging: {
        size: 20,
        no: 0,
        total: 0
      },
      // toast
      toast: {
        show: false,
        text: '',
        icon: ''
      }
    }
  },
  created() {
    this.getItems()
  },
  computed: {
    logOrder() {
      return this.$store.state.logOrder
    }
  },
  methods: {
    getItems() {
      this.items = []
      this.titles = []
      this.msg = '加载中...'
      // ajax
      let page = {
        page_size: this.paging.size,
        page_no: this.paging.no,
        local: this.local
      }
      this.axios(api.product.queryForCalculate(page)).then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          this.msg = ''
          let product = data.data.product
          let zone = data.data.zone
          let factor = data.data.factor
          let local = data.data.local
          zone.forEach(v => {
            this.logOrder.forEach(vL => {
              this.titles.push(v.name + '-' + vL.slice(0, 2))
            })
          })
          product.list.forEach(v => {
            let item = {}
            item.sku = v.sku
            console.log(`domestic_${v.category}`)
            let domestic = data.data[`domestic_${v.category}`]
            item.list = calPrice.cal(v, zone, factor, domestic, local, this.profitRate)
            this.items.push(item)
          })
          console.log(this.items)
          this.paging.total = product.total
        } else {
          this.msg = '出错了，请稍后再试'
        }
      })
    },
    pagingPreClick() {
      this.paging.no--
      this.getItems()
    },
    pagingNextClick() {
      this.paging.no++
      this.getItems()
    },
    pagingChange(index) {
      this.paging.no = index
      this.getItems()
    }
  },
  components: {
    paging,
    toast
  }
}
</script>

<style>
</style>
