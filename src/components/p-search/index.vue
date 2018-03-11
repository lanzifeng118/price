<template>
  <div class="serach" :class="{'has-result': hasResult}">
    <div class="serach-form">
      <input type="text" class="search-input" v-model="serachText" placeholder="请输入商品sku">
      <span class="search-icon icon-search" @click="submit"></span>
    </div>
    <div class="search-note">{{note}}</div>
    <h3 class="serach-ing">{{searchingText}}</h3>
    <div v-if="hasResult" class="serach-result">
      <h3 class="serach-result-title">查询结果<span>（商品sku：{{factor.product.sku}}）</span></h3>
      <result v-if="factor" :factor="factor"></result>
    </div>
  </div>
</template>

<script>
import api from 'components/tools/api'
import result from 'components/c-result/index'
export default {
  data() {
    return {
      serachText: '',
      searchingText: '',
      hasResult: false,
      note: '',
      factor: null
    }
  },
  mounted () {
    window.addEventListener('keyup', this.enter)
  },
  destroyed () {
    window.removeEventListener('keyup', this.enter)
  },
  methods: {
    enter(e) {
      let code = e.charCode || e.keyCode
      if (code === 13) {
        this.submit()
      }
    },
    submit() {
      this.note = ''
      if (!this.verify()) {
        return
      }
      this.factor = null
      this.hasResult = false
      this.searchingText = '查询中...'
      // ajax
      this.axios(api.search.query(this.serachText.trim())).then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          if (data.data) {
            this.hasResult = true
            this.searchingText = ''
            this.serachText = ''
            this.factor = data.data
          } else {
            this.searchingText = `无商品sku为${this.serachText}的数据`
          }
        } else {
          this.searchingText = '出错了，请稍后再试！'
        }
      })
    },
    verify() {
      let serachText = this.serachText.trim()
      if (!serachText) {
        this.note = '商品sku不能为空'
        return false
      }
      return true
    },
    goBack() {
      this.hasResult = false
    }
  },
  components: {
    result
  }
}
</script>
<style>
.serach {
  padding: 20px 30px;
}

/*search*/
.search-input {
  border-color: #ccc;
  width: 300px;
  padding-right: 30px;
}
.search-input:hover {
  border-color: #aaa;
}
.search-icon {
  cursor: pointer;
  display: inline-block;
  color: #999;
  padding: 0 8px;
  line-height: 29px;
  margin-left: -35px;
}
.search-icon:hover {
  color: #00d0bc;
}
.serach-result {
  margin: 20px 0;
}
.search-note {
  color: #ff1717;
  margin-top: 5px;
}
.serach-ing {
  text-align: center;
  font-size: 20px;
  color: #ccc;
}
/* .has-result */
</style>
