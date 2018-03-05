<template>
  <div class="">
    <div class="f-clearfix">
      <button class="button yellow f-right">添加数据</button>
    </div>
    <div class="list-table-wrap">
      <!-- msg -->
      <!-- <div class="list-table-wrap-none">{{msg}}</div> -->
      <table>
        <thead>
          <tr>
            <th>收费分区/Zone</th>
            <th>开始重量段/StartWeight</th>
            <th>截止重量段/EndWeight</th>
            <th>价格值/Price</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <td v-if="item.rowspan" :rowspan="item.rowspan">{{item.zone}}</td>
            <td>{{item.startWeight}}</td>
            <td>{{item.endWeight}}</td>
            <td>{{item.price}}</td>
            <td>
              <router-link :to="'/admin/logistics/edit/' + item.id">修改</router-link>
              <span class="icon-cutting_line"></span>
              <a href="javascipt: void 0" @click="deleteItem(index)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  created() {
    this.getItems()
  },
  methods: {
    getItems() {
      // ajax
      let data = {
        us: [
          {
            id: 1,
            startWeight: 0,
            endWeight: 0.113,
            price: 2.864
          },
          {
            startWeight: 0.113,
            endWeight: 0.198,
            price: 3.645
          },
          {
            startWeight: 0.198,
            endWeight: 0.283,
            price: 4.006
          },
          {
            startWeight: 0.1,
            endWeight: 0.113,
            price: 2.811
          }
        ],
        uk: [
          {
            id: 2,
            startWeight: 0,
            endWeight: 0.113,
            price: 2.864
          },
          {
            startWeight: 0.113,
            endWeight: 0.198,
            price: 3.645
          },
          {
            startWeight: 0.198,
            endWeight: 0.283,
            price: 4.006
          }
        ]
      }
      let zone = this.$store.state.zone
      zone.forEach(v => {
        let itemsV = data[v]
        if (itemsV && itemsV.length > 0) {
          this.sort(itemsV)
          itemsV[0].rowspan = itemsV.length
          itemsV[0].zone = v.toUpperCase()
          this.items = this.items.concat(itemsV)
        }
      })
    },
    deleteItem() {},
    sort(input) {
      input = input.sort((a, b) => {
        return a.startWeight - b.startWeight
      })
    }
  }
}
</script>

<style>

</style>
