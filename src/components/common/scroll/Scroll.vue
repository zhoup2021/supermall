<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
 
<script>
  import BScroll from 'better-scroll'
  import Pullup from '@better-scroll/pull-up'

  export default {
    name: 'Scroll',
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      BScroll.use(Pullup)
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        observeDOM: true,
        click: true,
        // 是否开启实时监听位置，为了性能考虑，通过父组件调用时动态传入的方式给probeType确定属性值
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动位置
      this.scroll.on('scroll', (position) => {
        this.$emit('scroll', position)
      })

      // 3.监听上拉事件
      this.scroll.on('pullingUp', () => {
        this.$emit('scrollPullUp')
      })
    },
    methods: {
      scrollTo(x, y, time=300) {
        this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll.finishPullUp()
      }
    }
  }
</script>
 
<style scoped>
 
</style>