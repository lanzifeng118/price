<template>
  <div class="paging">
    <ul class="paging-ul noselect">
      <li :class="{grey: paging.no === 0}" @click="pagingPreClick">
        <span class="icon-back"></span>
      </li>
      <li v-for="(item, i) in items" :class="{active: item === paging.no, grey: item < 0}" @click="pagingChange(item)">
        <span v-if="item >= 0">{{item + 1}}</span>
        <span v-if="item < 0">...</span>
      </li>
      <li :class="{grey: paging.no ===  length - 1}" @click="pagingNextClick">
        <span class="icon-right"></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['paging'],
  data() {
    return {}
  },
  computed: {
    length() {
      let paging = this.paging
      return Math.ceil(paging.total / paging.size)
    },
    items() {
      let items = []
      let paging = this.paging
      let length = this.length
      if (length <= 10) {
        for (let i = 0; i < length; i++) {
          items.push(i)
        }
      } else {
        if (paging.no < 5) {
          for (let i = 0; i < 8; i++) {
            items.push(i)
          }
          let lastArr = [-1, length - 2, length - 1]
          items = items.concat(lastArr)
        } else if (paging.no < length - 6) {
          items = [0, -1]
          for (let i = paging.no - 3; i <= paging.no + 3; i++) {
            items.push(i)
          }
          let lastArr = [-1, length - 2, length - 1]
          items = items.concat(lastArr)
        } else {
          items = [0, -1]

          for (let i = length - 9; i < length; i++) {
            items.push(i)
          }
        }
      }
      return items
    }
  },
  created() {},
  methods: {
    pagingPreClick() {
      if (this.paging.no === 0) {
        return
      }
      this.$emit('pagingPreClick')
    },
    pagingNextClick() {
      if (this.paging.no === this.length - 1) {
        return
      }
      this.$emit('pagingNextClick')
    },
    pagingChange(index) {
      if (index < 0) {
        return
      }
      if (this.paging.no === index) {
        return
      }
      this.$emit('pagingChange', index)
    }
  }
}
</script>

<style>
/*paging*/
.paging {
  margin: 35px 0;
}
.paging-ul {
  text-align: center;
}
.paging-ul li {
  border-radius: 2px;
  display: inline-block;
  border: 1px solid #efefef;
  width: 28px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
  margin: 0 2px;
  color: #666;
  transition: all 0.2s;
}
.paging-ul li:hover {
  color: #00d0bc;
}
.paging-ul li.grey {
  color: #ccc;
  cursor: default;
}
.paging-ul li.active {
  cursor: default;
  background-color: #00d0bc;
  border-color: #00d0bc;
  color: #fff;
}
</style>
