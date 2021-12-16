<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <scroll class="content" 
            ref="scroll" 
            :probe-type='3' 
            @scroll='contentScroll' 
            :pull-up-load='true'
            @scrollPullUp = 'loadMore'>
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control
        :titles="['流行', '新款', '精选']"
        class="tab-control"
        @tabClick="tabClick">
      </tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 使用.native修饰符使组件能像原生元素一样可以被点击 -->
    <!-- 此处之所以不需要使用子组件监听再向父组件传递是因为子组件BackTop中只有这一个div，
            只需要实现这一个功能，所以可以在父组件中直接监听子组件点击事件，更简单 -->
    <back-top @click.native='backClick' v-show="isShowBackTop"></back-top>
  </div>
</template>
 
<script>
import HomeSwiper from "./childComponents/HomeSwiper";
import RecommendView from "./childComponents/RecommendView";
import FeatureView from "./childComponents/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import { getHomeMultidata, getHomeGoods } from "network/home";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  // 生命周期函数
  created() {
    // 1.请求多个数据
    // 此处用了this前缀，调用的是methods中定义的函数
    this.getHomeMultidata();

    // 2.请求商品数据
    // 此处用了this前缀，调用的是methods中定义的函数
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  methods: {
    // 事件监听相关
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
    },
    backClick() {
      // 通过this.$refs.scroll访问ref属性为scroll的子组件，即scroll组件，
      //    而该子组件中的data数据中有scroll，所以可以通过this.$refs.scroll.scroll
      //    访问到该数据，而scroll中又有一个方法scrollTo，所以可以通过
      //    this.$refs.scroll.scroll.scrollTo(0,0)实现回到顶部的功能
      // scrollTo可传入第三个参数毫秒值，控制回到顶部的速度
      // 方法一：可读性差
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500)

      // 方法二：在Scroll组件中将scrollTo方法封装到methods中，通过组件直接调用其方法
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      this.isShowBackTop = position.y <= -1000
    },
    loadMore() {
      this.getHomeGoods(this.currentType)

      // 解决betterscroll与异步加载图片产生高度冲突的问题
      this.$refs.scroll.scroll.refresh()
    },
    // 网络请求相关
    getHomeMultidata() {
      // 此处函数名与外层相同，但是由于没有加this前缀，所以调用的是从network/home导入的同名函数
      getHomeMultidata().then((res) => {
        // 使用data中定义的数据保存结果，否则函数结束后，结果会被回收
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      // 将当前要某类型的商品已存储页码加1，即为本次请求的商品页码。
      //    如：流行当前页码为0，第一次默认请求数据时，0+1=1，则请求流行的第一页数据。并且将流行的page属性改为1
      const page = this.goods[type].page + 1;
      // 此处函数名与外层相同，但是由于没有加this前缀，所以调用的是从network/home导入的同名函数
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp()
      });
    },
  },
};
</script>
 
<style scoped>
#home {
  padding-top: 44px;
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
.tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
}

  /* 设置滚动区域高度，方案一：使用定位position */
.content {
  /* height: 300px; */
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/* 设置滚动区域高度，方案一：使用计算函数calc() */
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>