<template>
    <div class='imgs_wrap' v-if='isShow' @click='clickOverlay'>
        <Swiper :urls='urls' :index='index' @close="clear"/>
    </div>
</template>

<script>
import { computed, watchEffect } from 'vue';
import { useStore } from 'vuex';
import Swiper from "@/components/Swiper.vue";
export default {
  components: {
    Swiper
  },

  setup() {
    let store = useStore();
    let urls = computed(() => {
      return store.state.imageConfig.urls;
    });
    let index = computed(() => {
      return store.state.imageConfig.index;
    });
    let isShow = computed(() => {
      return urls.value.length > 0;
    });

    function clear() {
      store.commit('changeImgConfig', {
        urls: [],
        index: null
      });
    }

    function clickOverlay(e) {
      if (e.target.tagName !== 'IMG') clear();
    }

    console.log('pushpush');
    watchEffect(() => {
      if (isShow.value == true && window.location.href.indexOf('showimgs') == -1) {
        window.history.pushState({}, "title", "#/showimgs"); //点击消失
      } else if (isShow.value == false && window.location.href.indexOf('showimgs') > 0) {
        window.history.back();
      }
    }); //返回消失

    window.addEventListener('hashchange', e => {
      if (e.oldURL.indexOf('showimgs') >= 0) {
        clear();
      }
    });
    return {
      urls,
      index,
      isShow,
      clear,
      clickOverlay
    };
  }

};
</script>

<style lang='stylus'>
.imgs_wrap
    background: rgba(0,0,0,0.9)
    position: absolute
    top 0
    bottom:  0
    width 100%
    z-index 5
    overflow: hidden
    // .nut-swiper,.nut-swiper-inner
    //     height 100% !important
    // .nut-swiper-item
    //     display: flex
    //     justify-content: center
    //     align-items: center
    //     overflow: hidden
    //     .content
    //         width 100%
.close 
    position: absolute
    right: 20px
    top 20px
    color white 
    font-size: 40px
    z-index 6
    color #ccc
</style>