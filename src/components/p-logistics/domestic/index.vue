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
            <th>收费分区</th>
            <th>开始重量段(g)</th>
            <th>截止重量段(g)</th>
            <th>价格值</th>
            <th>单件价格</th>
            <th>附加处理费</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :class="item.className">
            <td v-if="item.rowspan" :rowspan="item.rowspan">{{item.zone}}</td>
            <td>{{item.startWeight || '-'}}</td>
            <td>{{item.endWeight || '-'}}</td>
            <td>{{item.price || '-'}}</td>
            <td>{{item.unitPrice || '-'}}</td>
            <td>{{item.extra || '-'}}</td>
            <td>
              <div v-if="!item.noData"> 
                <router-link :to="'/admin/logistics/edit/' + item.id">修改</router-link>
                <span class="icon-cutting_line"></span>
                <a href="javascipt: void 0" @click="deleteItem(index)">删除</a>
              </div>
              <div v-else>-</div>
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
  mounted() {
  },
  methods: {
    getItems() {
      // ajax
      let data = {
        us: [
          {
            id: 1,
            startWeight: '',
            endWeight: '',
            price: 71.2,
            extra: 10
          }
        ],
        uk: [
          {
            id: 2,
            startWeight: '0',
            endWeight: 100,
            price: 87.56,
            extra: '0'
          },
          {
            startWeight: 100,
            endWeight: 300,
            price: 83.5,
            extra: '0'
          },
          {
            startWeight: 300,
            endWeight: 3000,
            price: 40,
            extra: 18
          }
        ],
        de: [
          {
            id: 3,
            startWeight: '0',
            endWeight: 20,
            unitPrice: 2.69,
            price: '',
            extra: '0'
          },
          {
            startWeight: 300,
            endWeight: 750,
            price: 71.78,
            extra: 5.75
          }
        ]
      }
      let zone = this.$store.state.zone
      let counter = 0
      zone.forEach(v => {
        counter = counter + 1
        let itemsV = data[v.name]
        itemsV = itemsV && itemsV.length > 0 ? itemsV : [{noData: true}]
        // 排序
        this.sort(itemsV)
        itemsV.forEach((vL, iL) => {
          if (iL === 0) {
            vL.rowspan = itemsV.length
            vL.zone = v.name.toUpperCase()
          }
          vL.className = counter % 2 === 0 ? 'grey' : ''
        })
        this.items = this.items.concat(itemsV)
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
