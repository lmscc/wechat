import store from "@/store/index";
import state from "@/store/state";
import createPersistedState from './vuex-persistedstate';
let onlyOnce = function () {
  let a = false;
  return fn => {
    if (a == false) {
      a = true;
      fn();
    }
  };
}();

export function injectPlugin(userId) {
  createPersistedState({
    key: userId,
    storage: window.localStorage,

    reducer(val) {
      onlyOnce(() => {
        for (let key of Object.keys(val.dialogMsgs)) {
          val.dialogMsgs[key].msglist = val.dialogMsgs[key].msglist.filter(i => i.fileType == 'text' || i.fileType != 'text' && !/blob/.test(i.msg));
        }
      });
      return {
        dialogMsgs: val.dialogMsgs,
        messageList: val.messageList,
        newFriends: val.newFriends
      };
    }

  })(store);
}
//去除数据持久化插件
export function clearStore() {
  store._subscribers.forEach((fun, i, arr) => {
    if (fun.name == 'named') {
      arr.splice(i, 1);
    }
  });
  store.replaceState({
    ...JSON.parse(JSON.stringify(state)),
    getFriend(userId) {
      console.log('this', this);
      return store.state.friendList.find(item => item.userId === userId)
    }
  });
}