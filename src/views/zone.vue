<template>
  <div class="p-zone">
    <div v-if="user !== 'xs001'" class="f-clearfix">
      <button class="f-left button list-btn-add" @click="addItem">
        <span class="icon icon-round_add"></span>添加地区
      </button>
    </div>
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th rowspan="2">排序</th>
            <th rowspan="2"><span class="icon-nessisary"></span>地区名称</th>
            <th rowspan="2"><span class="icon-nessisary"></span>货币符号</th>
            <th rowspan="2"><span class="icon-nessisary"></span>汇率</th>
            <th colspan="3">外仓单价 / ￥</th>
            <th colspan="3">FBA单价 / ￥</th>
            <th colspan="3">FBW单价 / ￥</th>
            <th v-if="user !== 'xs001'" width="120" rowspan="2"  class="list-table-wrap-th-operate">操作</th>
          </tr>
          <tr>
            <th width="80" colspan="1">空运</th>
            <th width="80" colspan="1">空运-电磁</th>
            <th width="80" colspan="1">海运</th>
            <th width="80" colspan="1">空运</th>
            <th width="80" colspan="1">空运-电磁</th>
            <th width="80" colspan="1">海运</th>
            <th width="80" colspan="1">空运</th>
            <th width="80" colspan="1">空运-电磁</th>
            <th width="80" colspan="1">海运</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :class="{edit: item.type === 2, add: item.type === 3}">
            <!-- sort -->
            <v-edit-td v-for="config in configs" :item="item" :config="config" @change="upperCase"></v-edit-td>
            <!-- 操作 -->
            <td v-if="user !== 'xs001'">
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
    </div>
    <Pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop"></Pop>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { API_zone } from '../model/zone'
import vEditTd from 'components/editTd'
import operate from 'components/c-operate/index'
import { isNum } from '../libs/util'

export default {
  data() {
    return {
      items: [],
      busy: false,
      msg: '',
      deleteIds: [],
      // pop
      pop: {
        text: '',
        show: false
      },
      configs: [
        {
          name: 'sort',
        }, 
        {
          name: 'name',
          input: 'number',
          onChange: true
        },
        {
          name: 'currency_symbol'
        },
        {
          name: 'exchange_rate',
          input: 'number'
        },
        {
          name: 'price_air',
          input: 'number'
        },
        {
          name: 'price_air_em',
          input: 'number'
        },
        {
          name: 'price_sea',
          input: 'number'
        },
        {
          name: 'fba_price_air',
          input: 'number'
        },
        {
          name: 'fba_price_em',
          input: 'number'
        },
        {
          name: 'fba_price_sea',
          input: 'number'
        },
        {
          name: 'fbw_price_air',
          input: 'number'
        },
        {
          name: 'fbw_price_em',
          input: 'number'
        },
        {
          name: 'fbw_price_sea',
          input: 'number'
        }
      ]
    }
  },
  computed: mapState(['user']),
  created() {
    this.getItems()
  },
  methods: {
    getItems() {
      this.items = []
      this.msg = '加载中...'
      // ajax
      API_zone.query()
        .then(data => {
          const { list } = data
          console.log(list)
          if (list.length > 0) {
            this.msg = ''
            list.forEach(v => {
              v.type = 1
            })
            this.items = list
          } else {
            this.msg = '还没有相关信息，请添加'
          }
        })
        .catch(err => {
          this.msg = '出错了，请稍后再试'
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
    submitChange(item, type = 'insert') {
      if (!this.verify(item)) {
        return
      }
      const text = type === 'insert' ? '添加' : '修改'

      API_zone[type](item)
        .then(data => {
          this.busy = false
          item.type = 1
          this.$toast.success(`${text}成功`)
          this.getItems()
        })
        .catch(({ code }) => {
          if (code === 400) {
            this.$toast.error('地区名称已存在')
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
      this.pop.text = '确定删除[' + item.name + ']'
      this.pop.show = true
      this.deleteIds.push(item.id)
    },
    closePop() {
      this.pop.show = false
    },
    confirmPop() {
      this.pop.show = false
      API_zone.delete({ ids: this.deleteIds.toString() })
        .then(data => {
          this.$toast.success('删除成功')
          this.getItems()
        })
        .catch(err => {
          this.$toast.error()
        })
    },
    verify(item) {
      if (!item.name) {
        this.$toast.warn('地区名称不能为空')
        return false
      }
      if (!item.currency_symbol) {
        this.$toast.warn('货币符号不能为空')
        return false
      }
      if (!item.exchange_rate) {
        this.$toast.warn('汇率不能为空')
        return false
      }
      if (item.sort && !isNum(item.sort)) {
        this.$toast.warn('顺序必须为整数')
        return false
      }
      item.sort = parseInt(item.sort) || 1
      return true
    },
    isBusy() {
      if (this.busy) {
        this.$toast.warn('请先提交编辑中的数据')
        return true
      }
      return false
    },
    upperCase(event) {
      const  { name, item } = event
      if (name === 'name') {
        item.name = item.name.toUpperCase()
      } 
    }
  },
  components: {
    operate,
    vEditTd
  }
}
</script>

<style>
.p-zone {
  padding: 20px 30px;
}
</style>
