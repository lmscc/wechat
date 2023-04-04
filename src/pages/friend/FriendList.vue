<template>
    <div class = 'main_part'>
        <div class="af" @click="$router.push('/newFriends')">
            <img src="@/assets/add.jpg" >
            <span>新的朋友</span>
        </div>
        <nut-elevator :index-list="dataList" :height="height"  @click-item="clickItem" />
    </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import store from "@/store";
import router from "@/router"; //生成msgList

import changeList from "@/js/suoyin";
export default {
  setup() {
    let dataList = ref();
    watchEffect(() => {
      dataList.value = changeList(store.state.friendList);
    }); // watch(()=>store.state.friendList,(friendList)=>{
    //     dataList.value = changeList(friendList)
    // })
    console.log(dataList);
    const height = ref(document.querySelector('#app').offsetHeight - 44 - 52 - 50 - 10)
    console.log(height.value)
    function clickItem(key, item) {
      router.push(`/friendMsg/${item.id}`);
    }

    return {
      dataList,
      clickItem,height
    };
  }

};
</script>

<style lang='stylus'>
.af 
    display: flex
    align-items: center
    margin 5px
    position: relative
    &:after
        position: absolute
        bottom: -7px
        left 5%
        content: ' '
        width: 90%
        height: 1px
        background: #ccc
        transform:scaleY(0.5)
    img 
        width: 40px
        height 40px
        border-radius: 3px
        margin-left 10px
    span 
        margin-left 10px
.nut-navbar
    margin-bottom 0px !important
.nut-elevator,.nut-elevator__list
    // height: fit-content  !important
 
    .nut-elevator__list__item__code
        line-height: 26px
        padding-left 15px !important
        &:after
            width: 0 !important
    .nut-elevator__list__item__name
        height: 50px !important
        padding-left 15px !important
        .one 
            display: flex
            align-items: center
            margin 10px 0 10px 0
            img 
                width 40px 
                height 40px
                border-radius: 4px
                 
            span 
                font-size: 16px
                margin-left 10px
    
</style>