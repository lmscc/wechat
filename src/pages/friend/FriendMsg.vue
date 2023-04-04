<template>
    <div class='main_part_2'>
        <nut-navbar
            @on-click-back="$router.back()"
        ></nut-navbar>
        <div class='card' v-if='friend'>
          <img v-lazy="[friend.avatar,'avatar']" class='avatar'>
          <div class='msg' >
              <div class='name'>{{friend.remark?friend.remark:friend.name}}</div>
              <div class='small_msg' v-if='friend.remark'>昵称:{{friend.name}}</div>
              <div class='small_msg'>微聊号:{{friend.userId}}</div>
          </div>
      </div>
        <div class='send' v-if='isNotFriend' @click='$router.push(`/addFriend/${friend.userId}`)'>
            <span>添加好友</span>
        </div>
        <template v-else>
            <div class='item_card' @click="$router.push(`/postForm/remark/${friend.userId}`)" v-if="!isSelf">
                <div class='title' >设置备注</div>
                <nut-icon name='arrow-right'></nut-icon>
            </div>
            <div class='send'  @click="$router.replace(`/dialog/${friend.userId}`)">
                <i class='iconfont icon-xiaoxizhongxin'></i>
                <span>发消息</span>
            </div>
            <div class='send' v-if="!isSelf">
                <i class="iconfont icon-shexiangji"></i>
                <span>音视频通话</span>
            </div>
      </template>
        <!-- <PostForm v-show='postShow' :userId="userId" type='remark'/> -->
    </div>
   
</template>

<script>
import { computed, ref } from 'vue';
import store from "@/store";
import PostForm from "@/components/PostForm.vue";
export default {
  props: ['userId'],
  name: 'FriendMsg',
  components: {
    PostForm
  },

  setup(props) {
    //    let route = useRoute()
    let search = computed(() => store.state.search);
    let isSelf = computed(() => store.state.selfMsg.userId == props.userId);
    let isNotFriend = computed(() => props.userId == 'search' && !store.state.friendList.find(f => f.userId == search.value.userId));
    let friend = computed(() => {
      return isNotFriend.value ? 
              search.value : 
              store.state.friendList.find(
                item => item.userId === (search.value?.userId ?? props.userId)
              ) ;
    });
    let postShow = ref(false);
    return {
      friend,
      postShow,
      isSelf,
      isNotFriend,
      search
    };
  }

};
</script>

<style lang='stylus'>
.card .avatar
    width 60px
    height 60px
    object-fit: cover
.item_card
    display: flex
    align-items: center
    padding: 15px 17px
    background: #fff
    border-bottom: 1px solid rgba(0,0,0,0.06)
    .title
        flex-grow 1
.send
    display: flex
    justify-content: center
    align-items: center
    border-bottom: 1px solid rgba(0,0,0,0.06)
    padding 12px 0
    .iconfont
        font-size: 18px
        margin-right 5px

</style>