<template>
  <div class="product-list">
    <div class="f-clearfix">
      <button class="f-left button list-btn-add" @click="addItem">
        <span class="icon icon-round_add"></span>添加商品
      </button>
      <upload class="f-right" @update="getItems" apiInKey="inProduct" dowloadUrl="/binheng/api/goods/download" name="商品"></upload>
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
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon"></toast>
    <pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop"></pop>
  </div>
</template>

<script>
import operate from 'components/c-operate/index'
import pop from 'components/pop/pop'
import paging from 'components/c-paging/index'
import toast from 'components/toast/toast'
import util from 'components/tools/util'
import api from 'components/tools/api'
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
  computed: {
    categoryMap() {
      return this.$store.state.categoryMap
    },
    category() {
      return this.$store.state.category
    },
    localMap() {
      return this.$store.state.localMap
    },
    local() {
      return this.$store.state.local
    }
  },
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
      this.axios(api.product.query(page)).then(res => {
        let data = res.data
        // console.log(data)
        if (data.code === 200) {
          let list = data.data.list
          if (list.length > 0) {
            this.msg = ''
            list.forEach(v => {
              v.type = 1
            })
            this.items = list
            this.paging.total = data.data.total
          } else {
            this.msg = '还没有相关信息，请添加'
          }
        } else {
          this.msg = '出错了，请稍后再试'
          util.req.queryError(this.toast)
        }
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
      let text = type === 'insert' ? '添加' : '修改'
      util.toast.show(this.toast, `正在${text}...`, 'upload')
      this.axios(api.product[type](item)).then(res => {
        // console.log(res)
        let code = res.data.code
        if (code === 200) {
          this.busy = false
          item.type = 1
          util.toast.fade(this.toast, `${text}成功`, 'appreciate')
          this.getItems()
        } else if (code === 400) {
          util.toast.fade(this.toast, 'SKU已存在', 'close')
        } else {
          util.req.changeError(this.toast)
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
      util.toast.show(this.toast, '正在删除...', 'upload')
      this.axios(api.product.delete(this.deleteIds)).then(res => {
        let data = res.data
        if (data.code === 200) {
          util.toast.fade(this.toast, '删除成功', 'check')
          this.getItems()
        } else {
          util.req.changeError(this.toast)
        }
      })
    },
    verify(item) {
      let verify = util.verifyProduct(item, 2)
      if (verify) {
        util.toast.fade(this.toast, verify)
        return false
      }
      return true
    },
    isBusy() {
      if (this.busy) {
        util.toast.fade(this.toast, '请先提交编辑中的数据!')
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
    toast,
    pop,
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
