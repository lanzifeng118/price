<template>
<div class="nav" :style="{height: height + 'px'}">
  <!-- <div class="nav-avatar">
    <img :src="avatar"/>
  </div> -->
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
      height: 0,
      avatar: './static/images/avatar.png'
    }
  },
  created () {
    this.getHeight()
  },
  mounted () {
    window.addEventListener('resize', this.getHeight)
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
  },
  methods: {
    getHeight() {
      this.height = global.getWinHeigth() - 50
    }
  },
  computed: {
    items() {
      let user = this.$store.state.user
      let navs = [{
        src: '/calculate',
        name: '计算',
        style: 'calculate'
      }, {
        src: '/search',
        name: '查询SKU',
        style: 'barcode-scan'
      }, {
        src: '/product',
        name: '商品信息',
        style: 'cart'
      }, {
        src: '/lowest',
        name: '最低售价',
        style: 'tag'
      }, {
        src: '/zone',
        name: '地区信息',
        style: 'map'
      }, {
        src: '/factor',
        name: '公式系数',
        style: 'evaluate'
      }, {
        src: '/domestic',
        name: '国内小包',
        style: 'truck'
      }, {
        src: '/local',
        name: '当地配送',
        style: 'courier'
      }, {
        src: '/config',
        name: '系统设置',
        style: 'config'
      }]
      let order = []
      switch (user) {
        case 'xs002':
          order = [0, 1, 3]
          break
        case 'xs001':
          order = [0, 1, 2, 3, 4]
          break
        case 'wl001':
          order = [4, 5, 6, 7]
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
  position: relative;
  width: 150px;
  float: left;
  overflow: hidden;
  background: #fff;
}
.nav::after {
  content: '';
  display: block;
  width: 1px;
  height: 100%;
  background: #dcdee2;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}
.nav-ul {
  padding-top: 20px;
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
  height: 50px;
  line-height: 50px;
}

.nav-item a {
  display: block;
  color: #515a6e;
  padding-left: 20px;
  transition: all 0.2s;
}
.nav-item a:hover {
  color: #2d8cf0;
}
.nav-item a.active {
  position: relative;
  color: #2d8cf0;
  background: #f0faff;
}

.nav-item a.active::after {
  content: '';
  z-index: 10;
  display: block;
  width: 2px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background: #2d8cf0;
}

</style>
