<template>
    <div class='main_part_2'>
        <nut-navbar
            title="新的朋友"
            @on-click-back="$router.back()"
        ></nut-navbar>
        <div class='list'>
            <div v-for='f in newFriends' @click='jump(f)'>
                <div class='time'>{{f.time}}</div>
                <div class='list_item'>
                    <img :src="f.avatar" class='avatar'>
                    <div class='name_msg'>
                        <div class='name'>{{f.name}}</div>
                        <div class='msg'>{{f.msg}}</div>
                    </div>
                    <div class='btn accepted' 
                        v-if='$store.state.friendList.find((friend)=>friend.userId == f.userId)'>
                        已接受
                    </div>
                    <div class='btn accept' @click="accept(f.userId,f.avatar,f.name,f.msg,f.time)" v-else>
                        接受
                    </div>
                </div>
                
            </div>
             
        </div>
       
    </div>
</template>

<script>
import { computed } from 'vue';
import { acceptFriend } from "@/js/ajax";
import dayjs from 'dayjs'
import store from "@/store";
import router from "@/router";
export default {
  setup() {
    let newFriends = computed(() => store.state.newFriends);

    function jump(friend) {
      store.commit('changeSearch', friend);
      router.push({
        name: 'friendMsg',
        params: {
          userId: 'search'
        }
      });
    }

    function accept(userId, avatar, name, msg, time) {
      acceptFriend(userId).then(data => {
        if (data.code == 1) {
          store.state.friendList.push({
            userId,
            avatar,
            name
          });
          store.commit('changeFriendList', store.state.friendList);
          setTimeout(() => {
            store.commit('changeDialogMsgs', {
              userId,
              msgWrap: {
                type: 0,
                //发送的
                msg,
                time: dayjs().format('YYYY年MM月DD日 HH:mm'),
                fileType: 'text',
                time
              }
            });
          });
        }

        router.back();
        router.back();
        router.push('/dialog/' + userId);
      });
    }

    return {
      newFriends,
      jump,
      accept
    };
  }

};
</script>

<style lang='stylus' scoped>
.list 
    padding-top 7px
    .time 
        margin 2px 10px
        font-size: 12px
        color #888
    .list_item
        height: 50px
        width: 100%
        display: flex
        align-items: center
        margin-top 5px
        box-sizing: border-box
        padding 0 10px
        position relative
        .avatar
            height: 45px
            width : 45px
            border-radius: 5px
        .name_msg
            display: flex
            flex-direction: column
            margin-left 10px
            flex-grow 1
            .name 
                font-size: 18px
            .msg
                color: rgba(0,0,0,0.7)
                font-size: 12px
                white-space nowrap
                overflow: hidden
                calc(100% - 90px)
                text-overflow: ellipsis
        .btn
            font-size: 14px
            padding: 4px 7px
            border-radius: 3px
            margin-right 6px
        .accept
            background-color: #ef6a27
            color white
        .accepted
            background: #eee
            color: #999
</style>