<template>
  <div class="logistics-domestic">
    <div class="list-table-wrap">
       <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table>
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
          <tr v-for="(item, index) in itemS.list" :class="{edit: item.type === 2, add: item.type === 3}">
            <td v-if="index === 0" :rowspan="itemS.list.length" class="zone uppercase">
              <span class="icon icon-round_add" @click="addItem(indexS)"></span>{{itemS.name}}
            </td>
            <!-- startWeight -->
            <td>
              <div v-if="item.type === 1">
                {{item.startWeight || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model="item.startWeight">
              </div>
            </td>
            <!-- endWeight -->
            <td>
              <div v-if="item.type === 1">
                {{item.endWeight || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model="item.endWeight">
              </div>
            </td>
            <!-- price -->
            <td>
              <div v-if="item.type === 1">
                {{item.price || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model="item.price">
              </div>
            </td>
            <!-- unitPrice -->
            <td>
              <div v-if="item.type === 1">
                {{item.unitPrice || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model="item.unitPrice">
              </div>
            </td>
            <!-- extra -->
            <td>
              <div v-if="item.type === 1">
                {{item.extra || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model="item.extra">
              </div>
            </td>
            <!-- 操作 -->
            <td class="operate">
              <div v-if="item.type === 1">
                <a href="javascipt: void 0" @click="editItem(indexS, index)">修改</a>
                <span class="icon-cutting_line"></span>
                <a href="javascipt: void 0" @click="deleteItem(item.id)">删除</a>
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
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon">
    </toast>
  </div>
</template>

<script>
import toast from 'components/toast/toast'
import util from 'components/tools/util'

export default {
  data() {
    return {
      items: [],
      msg: '',
      busy: false,
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
  mounted() {},
  methods: {
    getItems() {
      // ajax
      let data = {
        us: [
          {
            id: 1,
            zone: 'US',
            startWeight: '',
            endWeight: '',
            price: 71.2,
            extra: 10
          }
        ],
        uk: [
          {
            id: 2,
            zone: 'UK',
            startWeight: '0',
            endWeight: 100,
            price: 87.56,
            extra: '0'
          },
          {
            zone: 'UK',
            startWeight: 100,
            endWeight: 300,
            price: 83.5,
            extra: '0'
          },
          {
            zone: 'UK',
            startWeight: 300,
            endWeight: 3000,
            price: 40,
            extra: 18
          }
        ],
        de: [
          {
            id: 3,
            zone: 'DE',
            startWeight: '0',
            endWeight: 20,
            unitPrice: 2.69,
            price: '',
            extra: '0'
          },
          {
            zone: 'DE',
            startWeight: 300,
            endWeight: 750,
            price: 71.78,
            extra: 5.75
          }
        ]
      }
      let zone = this.$store.state.zone
      zone.forEach(v => {
        let itemsV = data[v.name]
        // 排序
        if (itemsV && itemsV.length > 0) {
          this.sort(itemsV)
          itemsV.forEach(v => {
            v.type = 1
          })
          this.$set(v, 'list', itemsV)
          this.items.push(v)
        }
      })
      console.log(this.items)
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
      this.busy = false
      item.type = 1
      console.log(item)
    },
    cancelEdit(index1, index2) {
      this.busy = false
      let item = this.items[index1].list[index2]
      item.type = 1
    },
    // add
    addItem(index) {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      let data = this.items[index]
      data.list.push({
        type: 3,
        zone: data.name,
        startWeight: '',
        endWeight: '',
        price: '',
        extra: ''
      })
    },
    cancelAdd(index1) {
      this.busy = false
      let list = this.items[index1].list
      list.pop()
    },
    submitAdd(item) {
      this.busy = false
      item.type = 1
      console.log(item)
    },
    // delete
    deleteItem() {
      if (this.isBusy()) {
        return
      }
    },
    sort(input) {
      input = input.sort((a, b) => {
        return a.startWeight - b.startWeight
      })
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
    toast
  }
}
</script>

<style>

</style>
