<template>
  <div class="factor">
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th width="25%"><span class="icon-nessisary"></span>头程体积重系数</th>
            <th width="25%"><span class="icon-nessisary"></span>二程体积重系数</th>
            <th width="25%"><span class="icon-nessisary"></span>销售成本系数</th>
            <th width="25%" class="list-table-wrap-th-operate">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :class="{edit: item.type === 2, add: item.type === 3}">
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

import operate from 'components/c-operate/index'
import { isNum } from '../libs/util'

export default {
  data() {
    return {
      items: [],
      msg: '',
      deleteIds: []
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
      API_factor.query()
        .then(data => {
          this.msg = ''
          let factor = data
          factor.type = 1
          this.items.push(factor)
        })
        .catch(err => {
          this.msg = '出错了，请稍后再试'
        })
    },
    // type 1 初始化 2 edit
    editItem(item) {
      item.type = 2
    },
    submitEdit(item) {
      if (!this.verify(item)) {
        return
      }
      API_factor.update(item)
        .then(data => {
          item.type = 1
          this.$toast.success(`修改成功`)
          this.getItems()
        })
        .catch(err => {
          this.$toast.error()
        })
    },
    cancelEdit(item) {
      item.type = 1
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
    }
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
