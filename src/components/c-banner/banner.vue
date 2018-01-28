<template>
  <div class="banner">
    <div class="f-clearfix banner-top">
      <router-link :to="editUrl" class="f-right button" >
        <span class="icon icon-edit"></span>{{eidtText}}
      </router-link>
    </div>
    <div class="display-table-wrap">
      <table>
        <tbody>
          <!-- link -->
          <tr>
            <td width="100">{{LinkText}}<span class="separate"></span></td>
            <td><a :href="item.link" target="_blank">{{item.link}}</a></td>
          </tr>
          <!-- img -->
          <tr>
            <td width="100" class="vertical-top">{{BannerText}}<span class="separate"></span></td>
            <td><img v-if="item.img" :src="item.img" alt=""></td>
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
  import api from 'components/tools/api'
  import apiEn from 'components/tools/api-en'
  import util from 'components/tools/util'

  export default {
    props: {
      page: String,
      lang: {
        type: String,
        default: 'cn'
      }
    },
    data() {
      return {
        // items
        item: {},
        // toast
        toast: {
          show: false,
          text: '',
          icon: ''
        }
      }
    },
    computed: {
      editUrl() {
        let url = '/admin/' + this.page +'/banneredit'
        if (this.lang === 'en') {
          url += 'en'
        }
        return url
      },
      apiCal() {
        let key = this.page + 'Banner'
        let apiCal = null
        if (this.lang === 'en') {
          apiCal = apiEn[key]
        } else {
          apiCal = api[key]
        }
        return apiCal
      },
      eidtText() {
        if (this.lang === 'en') {
          return 'Edit'
        } else {
          return '编辑'
        }
      },
      LinkText() {
        if (this.lang === 'en') {
          return 'Link'
        } else {
          return '链接'
        }
      },
      BannerText() {
        if (this.lang === 'en') {
          return 'Banner'
        } else {
          return '广告图'
        }
      }
    },
    created() {
      this.getItems()
    },
    methods: {
      getItems() {
        let _this = this
        this.axios(this.apiCal.query()).then((res) => {
          let data = res.data
          if (data.code === '200') {
            _this.item = data.data
          } else {
            util.req.queryError(this.toast)
          }
        }).catch((err) => {
          if (err) {
            util.req.queryError(this.toast)
          }
        })
      }
    },
    components: {
      toast
    }
  }
</script>

<style>
.banner-top {
  margin-bottom: 20px;
}
.banner img {
  max-width: 800px;
  max-height: 180px;
}
</style>
