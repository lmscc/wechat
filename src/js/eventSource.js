import { Notify } from "@nutui/nutui";
import router from "@/router";
import store from "@/store";
import { clearStore } from "@/store/handleStore";
import { keepBottom } from "@/js/utils";
import { nextTick } from "vue";
export default function (e) {
  let data = JSON.parse(e.data);
  console.log(data);

  if (data.isServer == true) {
    if (data.type == 'logout') {
      Notify.danger(data.msg);
      router.replace('/login');
      nextTick(()=>{
        clearStore(); //收到好友请求
      })
    } else if (data.type == 'requestFriend') {
      console.log(data);

      if (store.state.newFriends.find(f => f.userId == data.userId) == undefined) {
        data.isServer = undefined;
        data.type = undefined;
        store.commit('changeNewFriends', data);
      } //对方同意，向好友列表推入

    } else if (data.type == 'addFriend') {
      let {
        from,
        isServer,
        ...rest
      } = data;
      store.state.friendList.push({ ...rest
      });
      store.commit('changeFriendList', store.state.friendList);
    }
  } else {
    let {
      from,
      isServer,
      type,
      ...rest
    } = data;
    store.commit('changeDialogMsgs', {
      userId: from,
      msgWrap: {
        type: 0,
        //接收到的
        fileType: type,
        ...rest,
        isSuccess:true
      }
    });
    store.commit('getNewMsg', {
      userId: data.from,
      value: true
    });
  }

  keepBottom(); // store.state.dialogMsgs[data.from].push(data.msg)
}