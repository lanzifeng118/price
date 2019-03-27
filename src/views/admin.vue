<template>
  <div class="admin">
    <v-header></v-header>
    <div class="f-clearfix">
      <v-nav></v-nav>
      <div
        class="content-right"
        :style="{height: height + 'px'}"
      >
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from 'components/header'
import vNav from 'components/c-nav/nav'
import global from 'components/tools/global'

export default {
  data() {
    return {
      height: 0
    }
  },
  created() {
    this.getHeight()
  },
  mounted() {
    window.addEventListener('resize', this.getHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.getHeight)
  },
  methods: {
    getHeight() {
      this.height = global.getWinHeigth() - 50
    }
  },
  components: {
    vHeader,
    vNav
  }
}
</script>

<style>
.content-right {
  overflow: auto;
  /* padding: 30px; */
  background-color: #fff;
  float: left;
  width: calc(100% - 150px);
}
</style>
