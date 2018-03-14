<template>
<div class="nav" :style="{height: height + 'px'}">
  <div class="nav-avatar">
    <img :src="avatar"/>
  </div>
  <ul class="nav-ul">
    <li
      class="nav-item"
      v-for="item in items"
    >
      <router-link :to="item.src">
        <span
          class="icon"
          :class="'icon-' + item.style"
        >
        </span>{{item.name}}
      </router-link>
    </li>
  </ul>
</div>
</template>

<script>
import global from 'components/tools/global'

export default {
  data() {
    return {
      height: global.winHeigth - 50,
      avatar: './static/images/avatar.png'
    }
  },
  computed: {
    items() {
      let user = this.$store.state.user
      let navs = [{
        src: '/admin/calculate',
        name: '计算',
        style: 'calculate'
      }, {
        src: '/admin/search',
        name: '查询SKU',
        style: 'barcode-scan'
      }, {
        src: '/admin/product',
        name: '商品信息',
        style: 'cart'
      }, {
        src: '/admin/zone',
        name: '地区信息',
        style: 'map'
      }, {
        src: '/admin/factor',
        name: '公式系数',
        style: 'evaluate'
      }, {
        src: '/admin/domestic',
        name: '国内小包',
        style: 'truck'
      }, {
        src: '/admin/local',
        name: '当地配送',
        style: 'courier'
      }, {
        src: '/admin/config',
        name: '系统设置',
        style: 'config'
      }]
      let order = []
      switch (user) {
        case 'xs002':
          order = [0, 1]
          break
        case 'xs001':
          order = [0, 1, 2, 3]
          break
        case 'w1001':
          order = [3, 4, 5, 6]
          break
        default:
          break
      }
      let items = []
      if (user !== 'admin') {
        order.forEach(v => {
          items.push(navs[v])
        })
      } else {
        items = navs
      }
      return items
    }
  }
}
</script>

<style>
.nav {
  width: 150px;
  float: left;
  overflow: hidden;
  background-color: #363f46;
}
.nav .icon {
  margin-right: 10px;
}
.nav-avatar {
  font-size: 0;
  width: 150px;
  height: 150px;
  overflow: hidden;
}
.nav-avatar img {
  max-width: 150px;
  max-height: 150px;
}
.nav-item {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #4a4a4a;
}

.nav-item a {
  display: block;
  color: #fff;
  padding-left: 20px;
  transition: all 0.2s;
}
.nav-item a:hover {
  color: #07efd9;
}
.nav-item a.active {
  background: #07efd9;
  color: #363f46;
}
</style>
