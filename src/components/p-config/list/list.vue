<template>
<div class="config-list">
  <div class="f-clearfix">
    <router-link to="/admin/config/edit" class="f-right button">
      <span class="icon icon-edit"></span>编辑
    </router-link>
  </div>
  <div class="display-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="90">账号<span class="separate"></span></td>
          <td>{{item.username}}</td>
        </tr>
        <tr>
          <td class="vertical-top">头像<span class="separate"></span></td>
          <td class="avatar"><img v-if="item.avatar" :src="item.avatar"></td>
        </tr>
      </tbody>
    </table>
    <toast
      v-show="toast.show"
      :text="toast.text"
      :icon="toast.icon"
    >
    </toast>
  </div>

</div>
</template>

<script>
import toast from 'components/toast/toast'

export default {
  data() {
    return {
      toast: {
        show: false,
        text: '',
        icon: ''
      }
    }
  },
  computed: {
    item() {
      return this.$store.state.user
    }
  },
  components: {
    toast
  }
}
</script>

<style>
.config-list .display-table-wrap {
  margin-top: 25px;
}
.config-list td.avatar img {
  max-height: 120px;
  max-width: 120px;
}
</style>
