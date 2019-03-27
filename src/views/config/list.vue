<template>
  <div class="config-list">
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th width="18%">
              </span>用户类型</th>
            <th width="18%">账号</th>
            <th>权限</th>
            <th width="18%">上次登陆时间</th>
            <th width="18%">登陆次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <!-- 类型 -->
            <td>{{item.role}}</td>
            <!-- name -->
            <td>{{item.username}}</td>
            <!-- 权限 -->
            <td>{{item.permission}}</td>
            <!-- 上次登陆时间 -->
            <td>{{item.last_login_time}}</td>
            <!-- 登陆次数 -->
            <td>{{item.login_count}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { API_user } from '../../model/user'

export default {
  data() {
    return {
      items: [],
      msg: ''
    }
  },
  computed: {},
  created() {
    this.getItems()
  },
  methods: {
    getItems() {
      this.items = []
      this.msg = '加载中...'
      // ajax
      API_user.query()
        .then(data => {
          if (data.length > 0) {
            this.msg = ''
            this.items = data
          } else {
            this.msg = '无相关信息'
          }
        })
        .catch(err => {
          console.warn(err)
          this.msg = '出错了，请稍后再试'
        })
    }
  },
  components: {}
}
</script>

<style>
</style>
