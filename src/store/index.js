import { createStore, storeKey } from 'vuex';
import state from "@/store/state";
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import RelativeTime from 'dayjs/plugin/relativeTime.js';
import { clearStore } from './handleStore';
dayjs.extend(CustomParseFormat);
dayjs.extend(RelativeTime);
function getLastElement(arr) {
  return arr[arr.length - 1];
}



let store = createStore({
  state: {
    ...JSON.parse(JSON.stringify(state)),
    getFriend(userId) {
      console.log('this', this);
      return store.state.friendList.find(item => item.userId === userId)
    }
  },
  mutations: {
    changeSelfMsg(state, data) {
      state.selfMsg = data;
    },

    changeSearch(state, data) {
      state.search = data;
    },

    changeNewFriends(state, data) {
      state.newFriends.unshift(data);
    },

    updateSelfMsg(state, {
      key,
      value
    }) {
      //当selfdata改变的时候,修改一下friend list
      state.selfMsg[key] = value;
      store.commit("changeFriendList", state.friendList.map(item => {
        if (item.userId === state.selfMsg.userId) {
          item.name = state.selfMsg.name
          item.avatar = state.selfMsg.avatar
        }
        return item
      }))
    },

    changeFriendList(state, data) {
      state.friendList = data;
    },

    changeDialogMsgs(state, {
      userId,
      msgWrap
    }) {
      let {
        time
      } = msgWrap;
      {
        let isLengthNotZero;
        let earlyTime = (isLengthNotZero = state.dialogMsgs[userId].msglist.length) == 0 ? time : getLastElement(state.dialogMsgs[userId].msglist).time;
        earlyTime = dayjs(earlyTime, 'YYYY年MM月DD日 HH:mm');
        let lateTime = dayjs(time, 'YYYY年MM月DD日 HH:mm');
        let length = lateTime.diff(earlyTime, 'minute');
        msgWrap.show = length > 10 || isLengthNotZero == false ? true : false;
      }
      state.dialogMsgs[userId].msglist.push(msgWrap); // }

      store.commit('changeMessageList', userId);
    },

    changeMessageList(state, userId) {
      let list = state.messageList;
      let index = list.indexOf(userId);

      if (index == -1) {
        list.unshift(userId);
      } else {
        let id = list.splice(index, 1)[0];
        list.unshift(id);
      }
    },

    changeImgConfig(state, {
      urls,
      index
    }) {
      state.imageConfig.urls = urls, state.imageConfig.index = index;
    },

    getNewMsg(state, {
      userId,
      value
    }) {
      state.dialogMsgs[userId].hasNewMsg = value;
    },
  },
  getters: {

  },
  actions: {
    try() { }

  },
  modules: {},
  plugins: []
});



export default store;