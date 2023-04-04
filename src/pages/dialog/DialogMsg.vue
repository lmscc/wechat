<template>
   <div class='msg_wrap' ref='msgWrapDom' >
        <!-- <div id="msg_block" style="height:10px"></div> -->
      <wrap :onPullDown="handlePullDown" :ifEnd="ifEnd">
        <!-- <div style="height:10px"></div> -->
        <!-- v-lazy="[getAvatarUrl(m.type),'avatar']"    -->
        <div class = 'single_msg' v-for='m in dialog' :key="m">
            <span class='time' v-if='m.show'>{{m.time}}</span>
            <div class = 'avatar_content' :class="{'another':m.type }">
                <img class = 'msg_avatar' 
                    v-lazy="[getAvatarUrl(m.type),'avatar']" 
                    @click="jump(m.type)"
                    draggable="false"
                >
                <div v-if='m.fileType == "text"' class = 'msgWrap kuang' :class="{'failed':!m.isSuccess}" v-html='changeCode(m.msg)'>
                </div>
                <div v-else-if='m.fileType == "file"' class="fileWrap kuang" @click="download(m.originName,m.msg)">
                    <div class="left">
                        <div>{{m.originName}}</div>
                        <span class="size">{{m.size}}</span>
                    </div>
                    <i class='right iconfont icon-wj-wjj'></i>
                </div>
                
                <div v-else-if='m.fileType == "img"||m.fileType =="video"' class='imgWrap'>
                    <img v-lazy="[m.msg,'error']" 
                    class='sendImg' 
                    @click.self="goToImg(m.msg)"  
                    v-if='m.fileType == "img"'
                    draggable="false" >
                    <video :src="m.msg" class='sendVideo' controls v-else-if='m.fileType =="video"'></video>
                    <!-- 进度条 -->
                    <div class="mask" v-if='m.percentage != undefined'></div>
                    <nut-circleprogress 
                        v-if='typeof(m.percentage) == "number"' 
                        class='percentage'
                        :progress="m.percentage" 
                        stroke-inner-width='6'
                        :progress-option="progressConfig"> 
                    </nut-circleprogress>
                    <!-- <span class='percentage' v-else>{{m.percentage}}</span> -->
                </div>
            </div>
        </div>
        <div style="height:5px"></div>
      </wrap>
    </div>
</template>

<script>
import { reactive,computed,onMounted,watchEffect,ref,onActivated, onUpdated, onBeforeUpdate } from 'vue';
import store from "@/store/index";
import router from "@/router/index";
// import Wrap from './DialogScrollWrap.vue'
import Wrap from './b.vue'
const loadFailedImg = require('@/assets/failed.svg')
const ONE_TIME_LOAD_NUM = 10
export default {
  props: ['friend', 'selfMsg'],
  name:'DialogMsg',
  components:{
    Wrap
  },
  setup(props) {
    let progressConfig = reactive({
      radius: 30,
      strokeOutWidth: 6,
      progressColor: 'white'
    });

    let begin = ref(0)
    const ifEnd = computed(()=>{
      return begin.value == 0 ? true:false
    })
    watchEffect(()=>{
      console.log('ifEnd',ifEnd.value);
    })
    function initBegin(){
      let length = store.state.dialogMsgs[props.friend.userId].msglist.length
      console.log('初始长度',length);
      if(length <= 20){
        begin.value = 0
      }else{
        begin.value = length - 20
      }
    }
    watchEffect(()=>{
      props.friend;
      initBegin()//重置begin
      store.state.keepBottom && store.state.keepBottom()
    })
    let dialog = computed(() => {
      if (props.friend) {
        let msgList = store.state.dialogMsgs[props.friend.userId].msglist
        return msgList.slice(begin.value);
      }
    });

    //请求数据
    let t   //防抖
    function handlePullDown(refresh){
      clearTimeout(t)
      t = setTimeout(()=>{
        begin.value = begin.value > ONE_TIME_LOAD_NUM ? 
                    begin.value - ONE_TIME_LOAD_NUM: 0
        refresh()
      },200)
      
    }

    //图片
    let imgArray = computed(() => {
      let arr = [];
      dialog.value.forEach((i, index) => {
        if (i.fileType == 'img') {
          arr.push(i.msg);
        }
      });
      return arr;
    });

    function goToImg(url) {
      let index = imgArray.value.indexOf(url);
      store.commit('changeImgConfig', {
        urls: imgArray.value,
        index: index
      });
    }

    function getAvatarUrl(type) {
      return type == 0 ? props.friend.avatar : props.selfMsg.avatar;
    }

    function jump(type) {
      type == 0 ? router.push(`/friendMsg/${props.friend.userId}`) : router.push(`/friendMsg/${props.selfMsg.userId}`);
    }

    function download(name, url) {
      let a = document.createElement('a');
      console.log(url);
      a.download = name;
      a.href = url;
      a.click();
    }
    //防止xss
    function changeCode(str) {
      return str.replace(/ /g, '&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    }

    return {
      progressConfig,
      dialog,
      getAvatarUrl,
      goToImg,
      jump,
      download,
      changeCode,
      loadFailedImg,

      handlePullDown,
      ifEnd
    };
  }

};
</script>

<style lang='stylus'>
.msg_wrap
    flex-grow: 1
    background: rgba(0,0,0,0.04)
    overflow: auto
    .loading
        height: 40px
        width 100%
        object-fit: contain
    .single_msg 
        display: flex
        flex-direction: column
        margin 10px 8px
        .time
            align-self: center
            font-size: 13px
            color: rgba(0,0,0,0.5)
        .avatar_content
            display: flex
            margin-top:5px
            .msg_avatar
                border-radius: 3px
                width: 40px
                height 40px
            .kuang
                border-radius 6px
                border:1px solid rgba(0,0,0,0.1)
                padding: 6px 10px
                margin: 3px 5px
            .msgWrap
                background: white 
                max-width 70%
                word-break: break-all
            .failed
                position relative
                &:after
                    content:''
                    position: absolute
                    left -20px
                    top 8px
                    background: url('../../assets/q.png')  no-repeat
                    background-size: cover;
                    width: 17px
                    height: 17px
            .imgWrap
                width fit-content
                position relative
                margin-left 8px
                .percentage
                    position: absolute
                    left 50%
                    top 50%
                    transform: translate3d(-50%,-50%,0)
                    color white
                .sendImg,.sendVideo
                    max-width: 170px
                    min-width: 40px
                    max-height: 170px
                    // display: block
                    // float: right
                    border-radius: 8px
                    border: 1px solid #ddd
                .mask
                    width:100%
                    height:100%
                    background: rgba(0,0,0,.5)
                    border-radius: 8px
                    position: absolute
            .fileWrap
                width: 60%
                max-width: 400px
                height: 60px
                display: flex
                align-items: center
                border:1px solid rgba(0,0,0,0.1)
                background: #f1f1f1
                .left
                    align-self: flex-start
                    display: flex
                    flex-grow 1
                    flex-direction: column
                    max-width: calc(100% - 40px) 
                    // overflow: hidden
                    // text-overflow: ellipsis
                    >div
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        overflow-wrap: break-word;
                        -webkit-line-clamp: 2
                        -webkit-box-orient: vertical;
                    .size   
                        font-size: 13px
                        color #888
                .right
                    padding-left 10px
                    font-size: 30px

        .another 
            justify-content: flex-end
            .msg_avatar
                order 1
            .msgWrap
                background: #80f252
            .imgWrap
                margin-right 8px
                .sendImg,.sendVideo
                    float: right
</style>