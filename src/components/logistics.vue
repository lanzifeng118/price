<template>
  <div class="logistics">
    <upload @update="update" :apiInKey="uploadApiInKey" :dowloadUrl="dowloadUrl" :name="uploadName"></upload>
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead v-if="apiKey === 'local'">
            <tr>
              <th rowspan="2">收费分区</th>
              <th colspan="2">重量段（Kg）</th>
              <th colspan="4">单价</th>
              <th colspan="2">附加处理费</th>
              <th rowspan="2" width="12%" class="list-table-wrap-th-operate">操作</th>
            </tr>    
            <tr>
              <th width="10%">开始</th>
              <th width="10%">截止</th>
              <th width="10%">重量／¥</th>
              <th width="10%">重量</th>
              <th width="10%">件／¥</th>
              <th width="10%">件</th>
              <th width="10%">国内／¥</th>
              <th width="10%">当地</th>
            </tr>
        </thead>
        <thead v-else>
          <tr>
            <th rowspan="2">收费分区</th>
            <th colspan="2">重量段（Kg）</th>
            <th colspan="2">单价／¥</th>
            <th rowspan="2" width="15%">附加处理费</th>
            <th rowspan="2" width="15%" class="list-table-wrap-th-operate">操作</th>
          </tr>
          <tr>
            <th width="15%">开始</th>
            <th width="15%">截止</th>
            <th width="15%">重量</th>
            <th width="15%">件</th>
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
            <td v-if="apiKey === 'local'">-</td>
            <td v-if="apiKey === 'local'">-</td>
            <td v-if="apiKey === 'local'">-</td>
            <td>无数据</td>
          </tr>
          <tr v-else v-for="(item, index) in itemS.list" :class="{edit: item.doType === 2, add: item.doType === 3}">
            <td v-if="index === 0" :rowspan="itemS.list.length" class="zone">
              <span class="icon icon-round_add" @click="addItem(indexS)"></span>{{itemS.name}}
            </td>
            <!-- start_weight -->
            <td>
              <div v-if="!item.doType || item.doType === 1">
                {{item.start_weight || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.start_weight">
              </div>
            </td>
            <!-- end_weight -->
            <td>
              <div v-if="!item.doType || item.doType === 1">
                {{item.end_weight || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.end_weight">
              </div>
            </td>
            <!-- price_weight 人民币 -->
            <td v-if="apiKey === 'local'">
              {{ item.price_weight_rmb ? '¥ ' + item.price_weight_rmb : '-'}}
            </td>
            <!-- price_weight -->
            <td>
              <div v-if="!item.doType || item.doType === 1">
                {{ item.price_weight || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.price_weight">
              </div>
            </td>
            <!-- price_unit 人民币 -->
            <td v-if="apiKey === 'local'">
              {{ item.price_unit_rmb ? '¥ ' + item.price_unit_rmb : '-'}}
            </td>
            <!-- price_unit -->
            <td>
              <div v-if="!item.doType || item.doType === 1">
                {{item.price_unit || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.price_unit">
              </div>
            </td>
            <!-- extra_charge 人民币 -->
            <td v-if="apiKey === 'local'">
              {{ item.extra_charge_rmb ? '¥ ' + item.extra_charge_rmb : '-'}}
            </td>
            <!-- extra_charge -->
            <td>
              <div v-if="!item.doType || item.doType === 1">
                {{item.extra_charge || '-'}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.extra_charge">
              </div>
            </td>
            <!-- 操作 -->
            <td>
              <operate 
                :status="item.doType" 
                @editItem="editItem(item)"
                @deleteItem="deleteItem(item)"
                @submitEdit="submitEdit(item)"
                @cancelEdit="cancelEdit(item)"
                @submitAdd="submitAdd(item)"
                @cancelAdd="cancelAdd(indexS)"
              ></operate>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="test" v-if="items.length > 0">
      <select v-model="test.zone">
        <option disabled value="">选择地区</option>
        <option v-for="(item, index) in items" :value="index">{{item.name}}</option>
      </select>
      <input placeholder="重量" type="text" v-model.trim.number.lazy="test.weight">
      <i>kg</i>
      <input placeholder="体积" type="text" v-model.trim.number.lazy="test.bulk">
      <i>cm³</i>
      <button class="button" @click="calTest">计算邮费</button>
      <div v-if="test.result.ok">
        <p>实重：{{test.result.weight}}kg {{test.result.symbol}} 体积重：{{test.result.bulkWeight}}kg</p>
        <p>邮费：{{test.result.total}}</p>
      </div>
    </div>
    <pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop"></pop>
  </div>
</template>

<script>
import { API_logistics } from '../model/logistics'

import operate from 'components/c-operate/index'
import upload from 'components/c-upload/index'
import pop from 'components/pop/pop'

export default {
  props: {
    apiKey: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    uploadApiInKey: {
      type: String,
      required: true
    },
    dowloadUrl: {
      type: String,
      required: true
    },
    uploadName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: [],
      msg: '',
      busy: false,
      deleteIds: [],
      // pop
      pop: {
        text: '',
        show: false
      },
      test: {
        zone: '',
        weight: '',
        bulk: '',
        result: {
          ok: false,
          bulkWeight: '',
          weight: '',
          symbol: '',
          total: null
        }
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
      this.items = []
      this.msg = '加载中...'
      // ajax
      API_logistics[this.apiKey].query({ type: this.type })
        .then(data => {
          if (this.apiKey === 'local') {
            const DIGITS = 3
            data.forEach(v => {
              console.log(v)
              v.list.forEach(vL => {
                const priceU = parseFloat(vL.price_unit)
                vL.price_unit_rmb = priceU
                  ? (priceU * v.exchange_rate).toFixed(DIGITS)
                  : ''

                const priceW = parseFloat(vL.price_weight)
                vL.price_weight_rmb = priceW
                  ? (priceW * v.exchange_rate).toFixed(DIGITS)
                  : ''

                const extraC = parseFloat(vL.extra_charge)
                vL.extra_charge_rmb = extraC
                  ? (extraC * v.exchange_rate).toFixed(DIGITS)
                  : ''
              })
            })
          }
          this.items = data
          this.msg = ''
        })
        .catch(err => {
          this.msg = '出错了，请稍后再试'
        })
    },
    update() {
      this.getItems()
    },
    // type 1 初始化 2 edit 3 add
    editItem(item) {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      this.$set(item, 'doType', 2)
    },
    submitEdit(item) {
      this.submitChange(item, 'update')
    },
    cancelEdit(item) {
      this.busy = false
      this.$set(item, 'doType', 1)
      this.getItems()
    },
    // add
    addItem(index) {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      // console.log(this.items[index])
      let data = this.items[index]
      data.list.push({
        type: this.type,
        doType: 3,
        zone: data.name,
        start_weight: '',
        end_weight: '',
        price_weight: '',
        price_unit: '',
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
    submitChange(item, type = 'insert') {
      if (!this.verify(item)) {
        return
      }
      const text = type === 'insert' ? '添加' : '修改'
      API_logistics[this.apiKey][type](item)
        .then(data => {
          this.busy = false
          this.$set(item, 'doType', 1)
          this.$toast.success(`${text}成功`)
          this.getItems()
        })
        .catch(err => {
          this.$toast.error()
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
      API_logistics[this.apiKey].delete({ ids: this.deleteIds.toString() })
        .then(data => {
          this.$toast.success('删除成功')
          this.getItems()
        })
        .catch(err => {
          this.$toast.error()
        })
    },
    isBusy() {
      if (this.busy) {
        this.$toast.warn('请先提交编辑中的数据')
        return true
      }
      return false
    },
    verify(item) {
      if (!item.price_weight && !item.price_unit) {
        this.$toast.warn('请填写价格值或单件价格')
        return false
      }
      if (
        item.start_weight &&
        item.end_weight &&
        parseFloat(item.end_weight) < parseFloat(item.start_weight)
      ) {
        this.$toast.warn('截止重量要大于开始重量')
        return false
      }
      return true
    },
    calTest() {
      // 实重=重量(g)/1000
      // 体积重=体积（cm³）/6000
      let test = this.test
      let result = test.result
      result.total = null
      result.ok = true
      result.weight = this.test.weight || 0
      result.bulkWeight = this.test.bulk / 6000 || 0
      result.symbol = result.weight >= result.bulkWeight ? '>=' : '<'
      // 物流成本=重量(kg)*87.56 + 附加费
      let zone = this.items[test.zone]
      // console.log('zone')
      // console.log(zone)
      if (!zone) {
        result.total = '请选择区间'
        return
      }
      let list = zone.list
      if (list.length === 0) {
        result.total = '无数据'
        return
      }
      let weight =
        result.weight >= result.bulkWeight ? result.weight : result.bulkWeight
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let sw = parseFloat(item.start_weight) || 0
        let ew = parseFloat(item.end_weight) || Infinity
        if (weight >= sw && weight < ew) {
          // console.log(item)
          let up = parseFloat(item.price_unit)
          let tp = parseFloat(item.price_weight)
          let ec = parseFloat(item.extra_charge) || 0
          if (up) {
            result.total = `${up} + ${ec} = ${up + ec}`
            return
          } else if (tp) {
            result.total = `${weight} * ${tp} + ${ec} = ${weight * tp + ec}`
          } else {
            result.total = '价格有误'
          }
          break
        }
        if (i === list.length - 1) {
          result.total = '不在重量区间内'
        }
      }
    }
  },
  components: {
    operate,
    pop,
    upload
  }
}
</script>

<style>
.logistics {
  position: relative;
}
.logistics .upload {
  position: absolute;
  top: -55px;
  right: 0;
}
.test {
  margin: 20px 0;
}
.test i {
  display: inline-block;
  width: 35px;
  margin-left: -32px;
}
.test p {
  margin-top: 10px;
}
</style>
