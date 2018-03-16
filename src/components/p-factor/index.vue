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
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon"></toast>
  </div>
</template>

<script>
import operate from 'components/c-operate/index'
import toast from 'components/toast/toast'
import util from 'components/tools/util'
import api from 'components/tools/api'

export default {
  data() {
    return {
      items: [],
      msg: '',
      deleteIds: [],
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
      this.items = []
      this.msg = '加载中...'
      // ajax
      this.axios(api.factor.query()).then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          this.msg = ''
          let factor = data.data
          factor.type = 1
          this.items.push(factor)
        } else {
          this.msg = '出错了，请稍后再试'
        }
      })
    },
    // type 1 初始化 2 edit
    editItem(item) {
      item.type = 2
    },
    submitEdit(item) {
      this.submitChange(item, 'update')
    },
    cancelEdit(item) {
      item.type = 1
      this.getItems()
    },
    submitChange(item, type) {
      if (!this.verify(item)) {
        return
      }
      type = type || 'insert'
      let text = type === 'insert' ? '添加' : '修改'
      util.toast.show(this.toast, `正在${text}...`, 'upload')
      this.axios(api.factor[type](item)).then(res => {
        // console.log(res)
        let code = res.data.code
        if (code === 200) {
          item.type = 1
          util.toast.fade(this.toast, `${text}成功`, 'appreciate')
          this.getItems()
        } else {
          util.req.changeError(this.toast)
        }
      })
    },
    verify(item) {
      if (!item.weight_1) {
        util.toast.fade(this.toast, '头程体积重系数不能为空')
        return false
      }
      if (!util.isNum(item.weight_1)) {
        util.toast.fade(this.toast, '头程体积重系数必须为数字')
        return false
      }
      if (!item.weight_2) {
        util.toast.fade(this.toast, '二程体积重系数不能为空')
        return false
      }
      if (!util.isNum(item.weight_2)) {
        util.toast.fade(this.toast, '二程体积重系数必须为数字')
        return false
      }
      if (!item.sell_cost) {
        util.toast.fade(this.toast, '销售成本系数系数不能为空')
        return false
      }
      if (!util.isNum(item.sell_cost)) {
        util.toast.fade(this.toast, '销售成本系数系数必须为数字')
        return false
      }
      return true
    }
  },
  components: {
    operate,
    toast
  }
}
</script>

<style>
.factor {
  padding: 20px 30px;
}
</style>
