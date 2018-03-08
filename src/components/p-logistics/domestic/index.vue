<template>
  <div class="logistics-domestic">
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th>收费分区</th>
            <th width="15%">开始重量段(g)</th>
            <th width="15%">截止重量段(g)</th>
            <th width="15%">价格值</th>
            <th width="15%">单件价格</th>
            <th width="15%">附加处理费</th>
            <th width="15%">操作</th>
          </tr>
        </thead>
        <tbody v-for="(itemS, indexS) in items">
          <tr v-if="itemS.list.length === 0">
            <td class="zone">
              <span class="icon icon-round_add" @click="addItem(indexS)"></span>{{itemS.name}}
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>无数据</td>
          </tr>
          <tr v-else v-for="(item, index) in itemS.list" :class="{edit: item.type === 2, add: item.type === 3}">
            <td v-if="index === 0" :rowspan="itemS.list.length" class="zone">
              <span class="icon icon-round_add" @click="addItem(indexS)"></span>{{itemS.name}}
            </td>
            <!-- start_weight -->
            <td>
              <div v-if="item.type === 1">
                {{item.start_weight || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number="item.start_weight">
              </div>
            </td>
            <!-- end_weight -->
            <td>
              <div v-if="item.type === 1">
                {{item.end_weight || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number="item.end_weight">
              </div>
            </td>
            <!-- total_price -->
            <td>
              <div v-if="item.type === 1">
                {{item.total_price || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number="item.total_price">
              </div>
            </td>
            <!-- unit_price -->
            <td>
              <div v-if="item.type === 1">
                {{item.unit_price || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number="item.unit_price">
              </div>
            </td>
            <!-- extra_charge -->
            <td>
              <div v-if="item.type === 1">
                {{item.extra_charge || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number="item.extra_charge">
              </div>
            </td>
            <!-- 操作 -->
            <td class="operate">
              <div v-if="item.type === 1">
                <a href="javascipt: void 0" @click="editItem(indexS, index)">修改</a>
                <span class="icon-cutting_line"></span>
                <a href="javascipt: void 0" @click="deleteItem(item)">删除</a>
              </div>
              <div v-else-if="item.type === 2">
                <a href="javascipt: void 0" @click="submitEdit(item)">提交</a>
                <span class="icon-cutting_line"></span>
                <a href="javascipt: void 0" @click="cancelEdit(indexS, index)">取消</a>
              </div>
              <div v-else>
                <a href="javascipt: void 0" @click="submitAdd(item)">添加</a>
                <span class="icon-cutting_line"></span>
                <a href="javascipt: void 0" @click="cancelAdd(indexS)">取消</a>
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
      msg: '',
      busy: false,
      deleteIds: [],
      // toast
      toast: {
        show: false,
        text: '',
        icon: ''
      },
      zone: [],
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
    getZone(callback) {
      this.axios(api.zone.query()).then(res => {
        let data = res.data
        if (data.code === 200) {
          let list = data.data.list || []
          callback(list)
        }
      })
    },
    getItems() {
      // ajax
      this.items = []
      this.msg = '加载中...'
      // ajax
      this.axios(api.logistics.query()).then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          this.getZone(zone => {
            zone.forEach(v => {
              let itemsV = data.data[v.name.toLowerCase()]
              this.$set(v, 'list', [])
              v.list = []
              // 排序
              if (itemsV && itemsV.length > 0) {
                this.sort(itemsV)
                itemsV.forEach(v1 => {
                  v1.type = 1
                })
                this.$set(v, 'list', itemsV)
              }
              this.items.push(v)
            })
            this.msg = ''
          })
        } else {
          this.msg = '出错了，请稍后再试'
          util.req.queryError(this.toast)
        }
      })
    },
    // type 1 初始化 2 edit 3 add
    editItem(index1, index2) {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      let item = this.items[index1].list[index2]
      item.type = 2
    },
    submitEdit(item) {
      this.submitChange(item, 'update')
    },
    cancelEdit(index1, index2) {
      this.busy = false
      let item = this.items[index1].list[index2]
      item.type = 1
      this.getItems()
    },
    // add
    addItem(index) {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      console.log(this.items[index])
      let data = this.items[index]
      data.list.push({
        type: 3,
        zone: data.name,
        start_weight: '',
        end_weight: '',
        total_price: '',
        unit_price: '',
        extra_charge: ''
      })
    },
    cancelAdd(index) {
      this.busy = false
      let list = this.items[index].list
      list.pop()
    },
    submitAdd(item) {
      this.busy = false
      this.submitChange(item)
    },
    submitChange(item, type) {
      if (!this.verify(item)) {
        return
      }
      type = type || 'insert'
      let text = type === 'insert' ? '添加' : '修改'
      util.toast.show(this.toast, `正在${text}...`, 'upload')
      this.axios(api.logistics[type](item)).then(res => {
        // console.log(res)
        let code = res.data.code
        if (code === 200) {
          this.busy = false
          item.type = 1
          util.toast.fade(this.toast, `${text}成功`, 'appreciate')
          this.getItems()
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
      let start = item.start_weight || '?'
      let end = item.end_weight || '?'
      let text = `确定删除${item.zone} ${start}g至${end}g 的数据?`
      this.pop.text = text
      this.pop.show = true
      this.deleteIds.push(item.id)
    },
    closePop() {
      this.pop.show = false
    },
    confirmPop() {
      this.pop.show = false
      util.toast.show(this.toast, '正在删除...', 'upload')
      this.axios(api.logistics.delete(this.deleteIds)).then(res => {
        let data = res.data
        if (data.code === 200) {
          util.toast.fade(this.toast, '删除成功', 'check')
          this.getItems()
        } else {
          util.req.changeError(this.toast)
        }
      })
    },
    sort(input) {
      input = input.sort((a, b) => {
        return parseFloat(a.start_weight) - parseFloat(b.start_weight)
      })
    },
    isBusy() {
      if (this.busy) {
        util.toast.fade(this.toast, '请先提交编辑中的数据!')
        return true
      }
      return false
    },
    verify(item) {
      if (!item.total_price && !item.unit_price) {
        util.toast.fade(this.toast, '请填写价格值或单件价格')
        return false
      }
      if (item.start_weight && item.end_weight && parseFloat(item.end_weight) < parseFloat(item.start_weight)) {
        util.toast.fade(this.toast, '截止重量要大于开始重量')
        return false
      }
      return true
    }
  },
  components: {
    toast,
    pop
  }
}
</script>

<style>

</style>
