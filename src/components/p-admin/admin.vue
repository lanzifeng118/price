<template>
<div class="admin">
  <v-header></v-header>
  <div class="f-clearfix">
    <v-nav></v-nav>
    <div class="content-right" :style="{height: height + 'px'}">
      <router-view></router-view>
    </div>
  </div>
  <toast
    v-show="toast.show"
    :text="toast.text"
    :icon="toast.icon"
  >
  </toast>
</div>
</template>

<script>
import vHeader from 'components/c-header/header'
import vNav from 'components/c-nav/nav'
import toast from 'components/toast/toast'
// import util from 'components/tools/util'
// import api from 'components/tools/api'
import { winHeigth } from 'components/tools/global'

export default {
  data() {
    return {
      // toast
      toast: {
        show: false,
        text: '',
        icon: ''
      },
      height: winHeigth - 50
    }
  },
  created() {
    this.getItems()
  },
  methods: {
    getItems() {
      // this.axios(api.user.query()).then((res) => {
      //   let data = res.data
      //   if (data.code === '200') {
      //     this.$store.state.user = data.data
      //   } else {
      //     util.req.queryError(this.toast)
      //   }
      // }).catch((err) => {
      //   if (err) {
      //     util.req.queryError(this.toast)
      //   }
      // })
    }
  },
  components: {
    vHeader,
    vNav,
    toast
  }
}
</script>

<style>

.content-right {
  overflow: auto;
  padding: 30px;
  background-color: #fff;
  float: left;
  width: calc(100% - 150px);
}
</style>
