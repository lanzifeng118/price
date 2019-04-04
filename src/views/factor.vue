<template>
  <div class="factor">
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th width="20%"></span>当地配送</th>
            <th width="20%"><span class="icon-nessisary"></span>头程体积重系数</th>
            <th width="20%"><span class="icon-nessisary"></span>二程体积重系数</th>
            <th width="20%"><span class="icon-nessisary"></span>销售成本系数</th>
            <th width="20%" class="list-table-wrap-th-operate">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :class="{edit: item.type === 2, add: item.type === 3}">
            <!-- weight_1 -->
            <td>
              <div>{{localMap[item.localType]}}</div>
            </td>
            <!-- weight_1 -->
            <td>
              <div v-if="item.type === 1">
                {{item.weight_1}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.weight_1">
              </div>
            </td>
            <!-- weight_2 -->
            <td>
              <div v-if="item.type === 1">
                {{item.weight_2}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.weight_2">
              </div>
            </td>
            <!-- sell_cost -->
            <td>
              <div v-if="item.type === 1">
                {{item.sell_cost}}
              </div>
              <div v-else>
                <input type="text" v-model.trim.number.lazy="item.sell_cost">
              </div>
            </td>
            <!-- 操作 -->
            <td>
              <operate 
                :status="item.type" 
                :editOnly="true"
                @editItem="editItem(item)"
                @submitEdit="submitEdit(item)"
                @cancelEdit="cancelEdit(item)"
              ></operate>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { API_factor } from '../model/factor'
import { mapState } from 'vuex'

import operate from 'components/c-operate/index'
import { isNum } from '../libs/util'

export default {
  data() {
    return {
      items: [],
      msg: '',
      busy: false
    }
  },
  computed: mapState(['local', 'localMap']),
  created() {
    this.getItems()
  },
  mounted() {},
  methods: {
    getItems() {
      this.items = []
      this.msg = '加载中...'
      // ajax
      API_factor.query()
        .then(data => {
          // console.log(data, this.local)
          this.msg = ''
          this.local.forEach(val => {
            const item = data[val.type]
            item.type = 1
            item.localType = val.type
            this.items.push(item)
          })
        })
        .catch(err => {
          this.msg = '出错了，请稍后再试'
        })
    },
    // type 1 初始化 2 edit
    editItem(item) {
      if (this.isBusy()) {
        return
      }
      this.busy = true
      item.type = 2
    },
    submitEdit(item) {
      if (!this.verify(item)) {
        return
      }
      API_factor.update(item)
        .then(data => {
          item.type = 1
          this.busy = false
          this.$toast.success(`修改成功`)
          this.getItems()
        })
        .catch(err => {
          this.$toast.error()
        })
    },
    cancelEdit(item) {
      item.type = 1
      this.busy = false
      this.getItems()
    },
    verify(item) {
      if (!item.weight_1) {
        this.$toast.warn('头程体积重系数不能为空')
        return false
      }
      if (!isNum(item.weight_1)) {
        this.$toast.warn('头程体积重系数必须为数字')
        return false
      }
      if (!item.weight_2) {
        this.$toast.warn('二程体积重系数不能为空')
        return false
      }
      if (!isNum(item.weight_2)) {
        this.$toast.warn('二程体积重系数必须为数字')
        return false
      }
      if (!item.sell_cost) {
        this.$toast.warn('销售成本系数系数不能为空')
        return false
      }
      if (!isNum(item.sell_cost)) {
        this.$toast.warn('销售成本系数系数必须为数字')
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
  },
  components: {
    operate
  }
}
</script>

<style>
.factor {
  padding: 20px 30px;
}
</style>
