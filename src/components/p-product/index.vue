<template>
  <div class="p-zone">
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th>SKU</th>
            <th width="12.5%">外币售价</th>
            <th width="12.5%">采购价</th>
            <th width="12.5%">重量 g</th>
            <th width="12.5%">体积 m³</th>
            <th width="12.5%">商品种类</th>
            <th width="12.5%">当地配送</th>
            <th width="12.5%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :class="{edit: item.type === 2, add: item.type === 3}">
            <!-- sku -->
            <td>
              <div v-if="item.type === 1">
                {{item.sku}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy="item.sku">
              </div>
            </td>
            <!-- selling_price -->
            <td>
              <div v-if="item.type === 1">
                {{item.selling_price}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.selling_price">
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
                <input type="text" v-model.trim.number.lazy.number="item.weight">
              </div>
            </td>
            <!-- bulk -->
            <td>
              <div v-if="item.type === 1">
                {{item.bulk}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy.number="item.bulk">
              </div>
            </td>
            <!-- category -->
            <td>
              <div v-if="item.type === 1">
                {{category[item.category]}}
              </div>
              <div v-else>
                <select v-model="item.category">
                  <option disabled value="">选择种类</option>
                  <option value="1">普通</option>
                  <option value="2">带电</option>
                  <option value="3">带磁</option>
                  <option value="4">超尺寸</option>
                </select>
              </div>
            </td>
            <!-- local -->
            <td>
              <div v-if="item.type === 1">
                {{local[item.local]}}
              </div>
              <div v-else>
                <select v-model="item.local">
                  <option disabled value="">选择类型</option>
                  <option value="1">Ebay</option>
                  <option value="2">Amazon</option>
                </select>
              </div>
            </td>
            <!-- 操作 -->
            <td class="operate">
              <div v-if="item.type === 1">
                <a href="javascript: void 0" @click="editItem(index)">修改</a>
                <span class="icon-cutting_line"></span>
                <a href="javascript: void 0" @click="deleteItem(item)">删除</a>
              </div>
              <div v-else>
                <a href="javascript: void 0" @click="submitEdit(item)">提交</a>
                <span class="icon-cutting_line"></span>
                <a href="javascript: void 0" @click="cancelEdit(index)">取消</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon"></toast>
    <pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop"></pop>
  </div>
</template>

<script>
import pop from 'components/pop/pop'
import toast from 'components/toast/toast'
import util from 'components/tools/util'
import api from 'components/tools/api'

export default {
  data() {
    return {
      items: [],
      category: {
        '1': '普通',
        '2': '带电',
        '3': '带磁',
        '4': '超尺寸'
      },
      local: {
        '1': 'Ebay',
        '2': 'Amazon'
      },
      busy: false,
      msg: '',
      deleteIds: [],
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
  created() {
    this.getItems()
  },
  mounted() {},
  methods: {
    getItems() {
      this.items = []
      this.msg = '加载中...'
      // ajax
      this.axios(api.product.query()).then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          let list = data.data.list
          if (list.length > 0) {
            this.msg = ''
            list.forEach(v => {
              v.type = 1
            })
            this.items = list
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
    editItem(index) {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      let item = this.items[index]
      item.type = 2
    },
    submitEdit(item) {
      this.submitChange(item, 'update')
    },
    cancelEdit(index) {
      this.busy = false
      this.items[index].type = 1
      this.getItems()
    },
    submitChange(item, type) {
      if (!this.verify(item)) {
        return
      }
      type = type || 'insert'
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
      let sku = item.sku
      if (!sku) {
        util.toast.fade(this.toast, 'SKU不能为空')
        return false
      }
      let sellingPrice = item.selling_price
      if (!sellingPrice) {
        util.toast.fade(this.toast, '外币售价不能为空')
        return false
      }
      if (!util.isNum(sellingPrice)) {
        util.toast.fade(this.toast, '外币售价必须为数字')
        return false
      }

      let purchasePrice = item.purchase_price
      if (!purchasePrice) {
        util.toast.fade(this.toast, '采购价不能为空')
        return false
      }
      if (!util.isNum(purchasePrice)) {
        util.toast.fade(this.toast, '采购价必须为数字')
        return false
      }

      let weight = item.weight
      if (!weight) {
        util.toast.fade(this.toast, '重量不能为空')
        return false
      }
      if (!util.isNum(weight)) {
        util.toast.fade(this.toast, '重量必须为数字')
        return false
      }

      let bulk = item.bulk
      if (bulk && !util.isNum(bulk)) {
        util.toast.fade(this.toast, '体积必须为数字')
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
    }
  },
  components: {
    toast,
    pop
  }
}
</script>

<style>
.p-zone {
  padding: 20px 30px;
}
</style>
