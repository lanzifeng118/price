<template>
  <div class="lowest-detail">
   <upload from="lowest" :dowload="dowloadUrl" :downloadOnly="true"></upload>
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th v-for="item in titles">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item1 in items">
            <td v-for="val in item1">{{val}}</td>
          </tr>
        </tbody>
      </table>
      <paging v-show="items.length > 0" :paging="paging" @pagingNextClick="pagingNextClick" @pagingPreClick="pagingPreClick" @pagingChange="pagingChange">
      </paging>
    </div>
  </div>
</template>

<script>
import { API_product } from '../../../model/product'

import paging from 'components/c-paging/index'
import upload from 'components/c-upload/index'
import calPrice from '../../../libs/calPrice'

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
      }
    }
  },
  created() {
    this.getItems()
  },
  computed: {
    dowloadUrl() {
      return `/binheng/api/goods/download/calresult?local=${this.local}&profitRate=${this.profitRate}`
    }
  },
  methods: {
    getItems() {
      this.items = []
      this.titles = []
      this.msg = '加载中...'
      // ajax
      const page = {
        page_size: this.paging.size,
        page_no: this.paging.no,
        local: this.local
      }

      API_product.queryForCalculate(page)
        .then(data => {
          this.msg = ''
          let result = calPrice.lowest(data, this.profitRate, false)
          this.titles = result.titles
          this.items = result.items
          this.paging.total = data.product.total
        })
        .catch(err => {
          this.msg = '出错了，请稍后再试'
        })
    },
    download() {
      // 1
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
    upload
  }
}
</script>

<style>
.lowest-detail {
  position: relative;
}
.lowest-detail .upload {
  position: absolute;
  top: -55px;
  right: 0;
}

</style>
