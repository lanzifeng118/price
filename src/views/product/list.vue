<template>
  <div class="product-list">
    <div class="f-clearfix">
      <button class="f-left button list-btn-add" @click="addItem">
        <span class="icon icon-round_add"></span>添加商品
      </button>
      <upload class="f-right" @update="getItems" from="product"></upload>
    </div>
    <div class="product-list-tips">商品种类：<b>普通</b>、<b>带电</b>、<b>带磁</b>、<b>超尺寸</b>，不合格数据将被过滤</div>
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th><span class="icon-nessisary"></span>SKU</th>
            <th width="14.2%"><span class="icon-nessisary"></span>预设利润率</th>
            <th width="14.2%"><span class="icon-nessisary"></span>采购价</th>
            <th width="14.2%"><span class="icon-nessisary"></span>重量 g</th>
            <th width="14.2%">体积 cm³</th>
            <th width="14.2%"><span class="icon-nessisary"></span>商品种类</th>
            <th width="14.2%" class="list-table-wrap-th-operate">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :class="{edit: item.type === 2, add: item.type === 3}">
            <!-- sku -->
            <td>
              <div v-if="item.type === 1" class="product-list-sku" @click="forDetail(item)">
                {{item.sku}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy="item.sku">
              </div>
            </td>
            <!-- profit_rate -->
            <td>
              <div v-if="item.type === 1">
                {{item.profit_rate}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.profit_rate">
              </div>
            </td>
            <!-- purchase_price -->
            <td>
              <div v-if="item.type === 1">
                {{item.purchase_price}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.purchase_price">
              </div>
            </td>
            <!-- weight -->
            <td>
              <div v-if="item.type === 1">
                {{item.weight}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.weight">
              </div>
            </td>
            <!-- bulk -->
            <td>
              <div v-if="item.type === 1">
                {{item.bulk}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.bulk">
              </div>
            </td>
            <!-- category -->
            <td>
              <div v-if="item.type === 1">
                {{categoryMap[item.category]}}
              </div>
              <div v-else>
                <select v-model="item.category">
                  <option disabled value="">选择种类</option>
                  <option v-for="item in category" :value="item.type">{{item.name}}</option>
                </select>
              </div>
            </td>
            <!-- 操作 -->
            <td>
              <operate 
                :status="item.type" 
                @editItem="editItem(item)"
                @deleteItem="deleteItem(item)"
                @submitEdit="submitEdit(item)"
                @cancelEdit="cancelEdit(item)"
                @submitAdd="submitAdd(item)"
                @cancelAdd="cancelAdd"
              ></operate>
            </td>
          </tr>
        </tbody>
      </table>
      <paging v-show="items.length > 0" :paging="paging" @pagingNextClick="pagingNextClick"   @pagingPreClick="pagingPreClick" @pagingChange="pagingChange">
      </paging>
    </div>
    <Pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop"></Pop>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { API_product } from '../../model/product'
import verifyProduct from '../../libs/verifyProduct'

import operate from 'components/c-operate/index'
import paging from 'components/c-paging/index'
import upload from 'components/c-upload/index'

export default {
  data() {
    return {
      items: [],
      busy: false,
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
      },
      // pop
      pop: {
        text: '',
        show: false
      }
    }
  },
  computed: mapState(['categoryMap', 'category', 'localMap', 'local']),
  created() {
    this.getItems()
  },
  mounted() {},
  methods: {
    getItems() {
      this.items = []
      this.msg = '加载中...'
      // ajax
      let page = {
        page_size: this.paging.size,
        page_no: this.paging.no
      }
      API_product.query(page)
        .then(data => {
          const { list, total }  = data
          if (list.length > 0) {
            this.msg = ''
            list.forEach(v => {
              v.type = 1
            })
            this.items = list
            this.paging.total = total
          } else {
            this.msg = '还没有相关信息，请添加'
          }
        })
        .catch(err => {
          console.warn(err)
          this.msg = '出错了，请稍后再试'
          this.$toast.error()   
        })
    },
    // type 1 初始化 2 edit 3 add
    editItem(item) {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      item.type = 2
    },
    submitEdit(item) {
      this.submitChange(item, 'update')
    },
    cancelEdit(item) {
      this.busy = false
      item.type = 1
      this.getItems()
    },
     // add
    addItem() {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      this.items.unshift({
        type: 3,
        sku: '',
        profit_rate: '',
        purchase_price: '',
        selling_price: '',
        weight: '',
        bulk: '',
        category: '1',
        local: '1'
      })
    },
    cancelAdd() {
      this.busy = false
      this.items.shift()
    },
    submitAdd(item) {
      this.submitChange(item)
    },
    submitChange(item, type = 'insert') {
      if (!this.verify(item)) {
        return
      }
      const text = type === 'insert' ? '添加' : '修改'

      API_product[type](item)
        .then(data => {
          this.busy = false
          item.type = 1
          this.$toast.success(`${text}成功`)
          this.getItems()
        })
        .catch(({ code }) => {
          if (code === 400) {
            this.$toast.error('SKU已存在')
          } else {
            this.$toast.error()
          }
        })
    },
    // delete
    deleteItem(item) {
      if (this.isBusy()) {
        return
      }
      this.deleteIds = []
      this.pop.text = '确定删除[' + item.sku + ']'
      this.pop.show = true
      this.deleteIds.push(item.id)
    },
    closePop() {
      this.pop.show = false
    },
    confirmPop() {
      this.pop.show = false
      API_product.delete({ ids: this.deleteIds.toString() })
        .then(data => {
          this.$toast.success('删除成功')
          this.getItems()
        })
        .catch(err => {
          this.$toast.error()
        })
    },
    verify(item) {
      let verify = verifyProduct(item, 2)
      if (verify) {
        this.$toast.warn(verify)
        return false
      }
      return true
    },
    isBusy() {
      if (this.busy) {
        this.$toast.warn('请先提交编辑中的数据')
        return true
      }
      return false
    },
    forDetail(item) {
      item.local = '1'
      this.$router.push({path: '/product/detail', query: item})
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
    operate,
    upload,
    paging
  }
}
</script>

<style>
.product-list-tips {
  margin-top: 10px;
  text-align: right;
  font-size: 12px;
  color: #aaa;
}
.product-list-tips b {
  font-weight: bold;
}
.product-list-sku {
  transform: color .2s;
  text-decoration: underline;
  cursor: pointer;
}
.product-list-sku:hover {
  color: #2d8cf0;
}
</style>
