<template>
  <div class="p-zone">
    <div class="f-clearfix">
      <a href="javascript: void 0" class="f-right button yellow list-btn-add" @click="addItem">
        <span class="icon icon-round_add"></span>添加地区
      </a>
    </div>
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th>排序</th>
            <th width="11%">地区名称</th>
            <th width="11%">货币符号</th>
            <th width="11%">汇率</th>
            <th width="14%"><span class="icon icon-plane"></span>空运单价</th>
            <th width="14%"><span class="icon icon-plane"></span>空运单价（带电、磁）</th>
            <th width="14%"><span class="icon icon-ship"></span>海运单价</th>
            <th width="13%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :class="{edit: item.type === 2, add: item.type === 3}">
            <!-- sort -->
            <td>
              <div v-if="item.type === 1">
                {{item.sort}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy="item.sort">
              </div>
            </td>
            <!-- name -->
            <td>
              <div v-if="item.type === 1">
                {{item.name}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy="item.name" @change="upperCase(item)">
              </div>
            </td>
            <!-- currency_symbol -->
            <td>
              <div v-if="item.type === 1">
                {{item.currency_symbol}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy="item.currency_symbol">
              </div>
            </td>
            <!-- exchange_rate -->
            <td>
              <div v-if="item.type === 1">
                {{item.exchange_rate}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy.number="item.exchange_rate">
              </div>
            </td>
            <!-- price_air -->
            <td>
              <div v-if="item.type === 1">
                {{item.price_air}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy.number="item.price_air">
              </div>
            </td>
            <!-- price_air_em -->
            <td>
              <div v-if="item.type === 1">
                {{item.price_air_em}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy.number="item.price_air_em">
              </div>
            </td>
            <!-- price_sea -->
            <td>
              <div v-if="item.type === 1">
                {{item.price_sea}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.lazy.number="item.price_sea">
              </div>
            </td>
            <!-- 操作 -->
            <td class="operate">
              <div v-if="item.type === 1">
                <a href="javascript: void 0" @click="editItem(index)">修改</a>
                <span class="icon-cutting_line"></span>
                <a href="javascript: void 0" @click="deleteItem(item)">删除</a>
              </div>
              <div v-else-if="item.type === 2">
                <a href="javascript: void 0" @click="submitEdit(item)">提交</a>
                <span class="icon-cutting_line"></span>
                <a href="javascript: void 0" @click="cancelEdit(index)">取消</a>
              </div>
              <div v-else>
                <a href="javascript: void 0" @click="submitAdd(item)">提交</a>
                <span class="icon-cutting_line"></span>
                <a href="javascript: void 0" @click="cancelAdd">取消</a>
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
      this.axios(api.zone.query()).then(res => {
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
    // add
    addItem() {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      this.items.push({
        type: 3,
        sort: '1',
        name: '',
        currency_symbol: '',
        exchange_rate: '',
        price_air: '',
        price_air_em: '',
        price_sea: ''
      })
    },
    cancelAdd() {
      this.busy = false
      this.items.pop()
    },
    submitAdd(item) {
      this.submitChange(item)
    },
    submitChange(item, type) {
      if (!this.verify(item)) {
        return
      }
      type = type || 'insert'
      let text = type === 'insert' ? '添加' : '修改'
      util.toast.show(this.toast, `正在${text}...`, 'upload')
      this.axios(api.zone[type](item)).then(res => {
        // console.log(res)
        let code = res.data.code
        if (code === 200) {
          this.busy = false
          item.type = 1
          util.toast.fade(this.toast, `${text}成功`, 'appreciate')
          this.getItems()
        } else if (code === 400) {
          util.toast.fade(this.toast, '地区名称已存在', 'close')
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
      this.pop.text = '确定删除[' + item.name + ']'
      this.pop.show = true
      this.deleteIds.push(item.id)
    },
    closePop() {
      this.pop.show = false
    },
    confirmPop() {
      this.pop.show = false
      util.toast.show(this.toast, '正在删除...', 'upload')
      this.axios(api.zone.delete(this.deleteIds)).then(res => {
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
      if (!item.name) {
        util.toast.fade(this.toast, '地区名称不能为空')
        return false
      }
      if (!item.currency_symbol) {
        util.toast.fade(this.toast, '货币符号不能为空')
        return false
      }
      if (!item.exchange_rate) {
        util.toast.fade(this.toast, '汇率不能为空')
        return false
      }
      if (item.sort && !util.isNum(item.sort)) {
        util.toast.fade(this.toast, '顺序必须为整数')
        return false
      }
      item.sort = parseInt(item.sort) || 1
      return true
    },
    isBusy() {
      if (this.busy) {
        util.toast.fade(this.toast, '请先提交编辑中的数据!')
        return true
      }
      return false
    },
    upperCase(item) {
      item.name = item.name.toUpperCase()
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
