<template>
    <div class='popover'>
        <i class="iconfont icon-jiahao" @click='isshow^=1'> </i>
        <transition name='fade'>
            <div class='content' v-show='isshow'>
                <div class='overlay' @click='isshow^=1'></div>
                <div class='item' @click='$router.push("/search")'>
                    <i class='iconfont icon-tianjiahaoyou'></i>
                    <span>添加朋友</span>
                </div>
                <div class='item' >
                    <i class='iconfont icon-saoyisao'></i>
                    <span>扫一扫</span>
                </div>
                 
            </div>
        </transition>
       
    </div>
    
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    let isshow = ref(0);
    return {
      isshow
    };
  }

};
</script>

<style lang='stylus'>
.popover
    right: 20px;
    position: absolute;
    /* float: right; */
    top: 13px;
    display: flex
    flex-direction: column
    .iconfont
        font-size: 20px
    .icon-jiahao
        align-self: flex-end
    .content 
        color white
        background: #444
        padding: 14px 24px 0px 15px;
        border-radius: 5px
        margin-top 10px
        display: flex
        flex-direction: column
        align-items: flex-start
        .iconfont 
            margin-right 4px
        .item 
            margin-bottom 16px
            display: flex
            align-items: center
            z-index 4
        .overlay
            position: fixed
            top 0
            bottom 0 
            left: 0
            right 0
            z-index 3
.fade-enter-active,.fade-leave-active 
    transition:all 0.15s ease
.fade-enter-from,.fade-leave-to 
    transform: scale(0.7)
</style>