<template>
  <div class="tab">
    <ul class="tab-ul">
      <li v-for="item in items" class="tab-item">
        <router-link :to="item.href"><span class="icon" :class="'icon-'+item.icon"></span>{{item.text}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['items']
  }

</script>

<style>
  .tab {
    margin-bottom: 15px;
  }
  .tab-ul {
    padding-left: 30px;
    border-bottom: 1px solid #efefef;
    /* background-color: #f9f9f9; */
  }
  .tab-item {
    display: inline-block;
    margin-right: 30px;
  }
  .tab-item a {
    display: block;
    line-height: 50px;
    border-bottom: 1px solid #fff;
    margin-bottom: -1px;
    transition: all 0.2s;
    border-bottom: 1px solid #efefef;
  }
  .tab-item a.router-link-exact-active {
    color: #00d0bc;
    border-bottom: 1px solid #00d0bc;
  }
  .tab-item a:hover {
    color: #00d0bc;
  }
</style>
