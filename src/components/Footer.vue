<template>
    <div class='navbar'>
        <nut-navbar
            :title="title"
        >
            <template #content>
                <Popover />
            </template>
        </nut-navbar>
    </div>
    <div class='foot_wrap'>
        <nut-tabbar :visible="active">
            <nut-tabbar-item tab-title="消息" icon="message" @click="goToMsgList"></nut-tabbar-item>
            <nut-tabbar-item tab-title="好友" icon="people" @click="goToFriendList"></nut-tabbar-item>
            <nut-tabbar-item tab-title="我的" icon="my" @click="goToSelf"></nut-tabbar-item>
        </nut-tabbar>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { computed } from 'vue';
import Popover from "@/components/Popover.vue";
import router from '@/router';
export default {
  components: {
    Popover
  },

  setup() {
    let title = ref('微聊');

    function goToMsgList() {
      title.value = '微聊';
      router.replace('msgList');
    }

    function goToFriendList() {
      title.value = '通讯录';
      router.replace('friendList');
    }

    function goToSelf() {
      title.value = '我的';
      router.replace('self');
    }

    let active = computed(() => {
      let path = router.currentRoute.value.fullPath;
      if (path == '/msgList') return 0;else if (path == '/friendList') return 1;else return 2;
    });
    return {
      title,
      goToMsgList,
      goToFriendList,
      goToSelf,
      active
    };
  }

};
</script>

<style lang='stylus'>
// .navbar
//     position: fixed
//     top 0
.nut-navbar
    overflow:visible  !important

.foot_wrap
    position: absolute
    bottom: 0
    width: 100%
</style>