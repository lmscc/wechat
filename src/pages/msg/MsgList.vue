<template>
  <div class = 'main_part'>
      <List :list='messageList'/>
  </div>
</template>

<script>
import { computed } from 'vue';
import List from "@/pages/msg/MsgListList.vue";
import store from '@/store';
export default {
  components: {
    List
  },

  setup() {
    let messageList = computed(() => {
      let flist = store.state.friendList;
      if (flist == undefined) return;
      let m = [];
      let mlist = store.state.messageList;
      mlist.forEach((userId, index) => {
        
        let friend = store.state.getFriend(userId);
        let last = getLastSentence(userId);
        if (!last || !friend) return;

        if (last.fileType == 'img') {
          friend.lastSentence = '[图片]';
        } else if (last.fileType == 'video') {
          friend.lastSentence = '[视频]';
        } else if (last.fileType == 'file') {
          friend.lastSentence = '[文件]';
        } else {
          friend.lastSentence = last.msg;
        }

        friend.lastSentenceTime = last.time;
        m.push(friend);
      });
      return m;
    });

    function getLastSentence(userId) {
      let arr = store.state.dialogMsgs[userId].msglist;
      return arr == [] ? undefined : arr[arr.length - 1];
    }

    return {
      messageList
    };
  }

};
</script>

<style>

</style>