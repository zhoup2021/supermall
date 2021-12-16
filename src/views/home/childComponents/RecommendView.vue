<template>
  <div class="recommends">
    <div v-for="(item, index) in recommends" :key='index' class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>
 
<script>
  export default {
    name: 'RecommendView',
    props: {
      recommends: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>
 
<style scoped>
  .recommends {
    display: flex;
    width: 100%;
    text-align: center;
    font-size: 12px;

    padding: 10px 0 20px;
    border-bottom: solid 10px #eee;
  }
  .recommend-item {
    flex: 1
  }
  .recommend-item img {
    width: 70px;
    margin-bottom: 4px;
  }
</style>