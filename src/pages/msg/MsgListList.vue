<template>
      <div v-for='f in list' :key="f.userId" class='list_item' @click='pushDialogOrMsg(f.userId)'>
            <img v-lazy="[f.avatar,'avatar']" class='avatar' />
            <div :class="{ 'dot':$store.state.dialogMsgs[f.userId].hasNewMsg }"></div>
            <div class='name_sentence'>
                <div class='name_time'>
                    <div class='name'>{{f.remark?f.remark:f.name}}</div>
                    <div class='time' v-show='/msgList/.test($router.currentRoute.value.fullPath)'>{{f.lastSentenceTime}}</div>
                </div>
                <div class='sentence' >{{f.lastSentence||f.msg}}</div>
            </div>
      </div>
</template>

<script>
import router from "@/router";
export default {
  props: {
    list: Array
  },

  setup(props) {
    function pushDialogOrMsg(userId) {
      router.push('/dialog/' + userId);
    }

    return {
      pushDialogOrMsg
    };
  }

};
</script>

<style lang='stylus' scoped>
.list_item
    height: 50px
    width: 100%
    display: flex
    align-items: center
    margin-top 5px
    position relative
    .avatar
        height: 45px
        width : 45px
        margin-left 10px
        border-radius: 5px
         
    .dot
        position absolute
        left: 49px
        top 0px
        width 10px
        height:10px
        border-radius: 100%
        background-color #ff3838

    .name_sentence
        display: flex
        flex-direction: column
        margin-left 13px
        width 75%
        .name_time
            display: flex
            .name
                font-size 16px
                flex-grow 1
            .time
                font-size: 12px
                color: #999
        .sentence 
            color: rgba(0,0,0,0.7)
            font-size: 12px
            white-space nowrap
            overflow: hidden
            calc(100% - 90px)
            text-overflow: ellipsis
</style>