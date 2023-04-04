<template>
  <div class="pulldown">
    <div
      class="pulldown-bswrapper"
      ref="bsWrapper"
    >
      <div class="pulldown-scroller">
        <div class="pulldown-wrapper">
          <div v-show="beforePullDown">
            <span>Pull Down and refresh</span>
          </div>
          <div v-show="!beforePullDown">
            <div v-show="isPullingDown">
              <span>Loading...</span>
            </div>
            <div v-show="!isPullingDown">
              <span>Refresh success</span>
            </div>
          </div>
        </div>

        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'

BScroll.use(PullDown)

const TIME_BOUNCE = 800
const THRESHOLD = 70
const STOP = 56

export default {
  props:{
    onPullDown:Function
  },
  data() {
    return {
      beforePullDown: true,
      isPullingDown: false,
    }
  },
  mounted() {
    this.initBscroll()
    
  },
  methods: {
    initBscroll() {
      this.bscroll = new BScroll(this.$refs.bsWrapper, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        click: true,
        useTransition: false,
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP
        }
      })
      window.bscroll = this.bscroll

      this.bscroll.on('pullingDown', this.pullingDownHandler)
      // this.bscroll.on('scroll', this.scrollHandler)
      this.bscroll.on('scrollEnd', e => {
        console.log('scrollEnd')
      })
    },
    // scrollHandler(pos) {
    //   console.log(pos.y)
    // },
    pullingDownHandler() {
      console.log('trigger pullDown')
      this.beforePullDown = false
      this.isPullingDown = true

      this.onPullDown()

      this.isPullingDown = false
      this.finishPullDown()
    },
    async finishPullDown() {
      this.bscroll.finishPullDown()
      setTimeout(() => {
        this.beforePullDown = true
        this.bscroll.refresh()
      }, TIME_BOUNCE + 100)
    },
  }
}
</script>
<style lang="stylus" scoped>
.pulldown
    height:100%
    .pulldown-bswrapper
        height: 100%;
        overflow: hidden;
        position: relative;
        .pulldown-scroller
            width: 100%;
            position: absolute;
            translateZ(1px);
.pulldown-wrapper
    pointer-events: auto;
    position: absolute;
    width: 100%;
    text-align: center;
    top: -30px
</style>
