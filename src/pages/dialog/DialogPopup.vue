<template>
  <nut-popup position="bottom" :style="{ height: '20%' }" :visible="showBottom" @clickOverlay="$emit('update:showBottom',false)">
        <div class="muitiple_function">
            <div class='item' @click="imgFileDom.click()">
                <i class='iconfont icon-xiangce'></i>
                <span class='type'>图片</span>
                <input type="file" v-show = 'false' ref="imgFileDom" @change="upload('img',$event)" multiple accept="image/*">
            </div>
            <div class='item' @click="videoFileDom.click()">
                <i class='iconfont icon-shexiangji'></i>
                <span class='type'>视频</span>
                <input type="file" v-show = 'false' ref="videoFileDom" @change="upload('video',$event)" multiple accept="video/*">
            </div>
            <div class='item' @click="normalFileDom.click()">
                <i class='iconfont icon-wj-wjj'></i>
                <span class='type'>文件</span>
                <input type="file" v-show = 'false' ref="normalFileDom" @change="upload('file',$event)" multiple >
            </div>
        </div>
    </nut-popup>
</template>

<script>
import { reactive, ref } from 'vue';
import dayjs from 'dayjs'
import store from "@/store/index";
import { keepBottom } from "@/js/utils";
import { postMsgFile, postFileFirst } from "@/js/ajax"; // import Worker from '../js/webWorker.js'

let worker = new Worker(process.env.VUE_APP_API_URL + '/webWorker.js');

function getSize(s) {
  if (s < 1024) {
    return s + 'B';
  } else if (s > 1024 && s < 1024 ** 2) {
    return (s / 1024).toFixed(2) + 'KB';
  } else if (s > 1024 ** 2 && s < 1024 ** 3) {
    return (s / 1024 ** 2).toFixed(2) + 'MB';
  }
}

export default {
  props: ['friend', 'showBottom'],
  emits: ['update:showBottom'],

  setup(props, context) {
    let imgFileDom = ref();
    let videoFileDom = ref();
    let normalFileDom = ref();

    function upload(fileType, e) {
      context.emit('update:showBottom', false);
      [].forEach.call(e.target.files, file => {
        //1.计算MD5
        //2.发送get请求，是否已有该资源，有，返回链接;无，构造表单，发送请求
        worker.postMessage({
          file,
          fileType
        });
      });
    }

    function localVisible(url, {
      fileType,
      originName,
      size
    }, isPercent) {
      let obj = reactive({
        userId: props.friend.userId,
        msgWrap: {
          type: 1,
          msg: url,
          time: dayjs().format('YYYY年MM月DD日 HH:mm'),
          fileType,
          percentage: isPercent ? 0 : undefined,
          originName,
          size
        }
      });
      store.commit('changeDialogMsgs', obj);
      keepBottom();
      return obj;
    }

    worker.onmessage = async e => {
      let {
        md5,
        file,
        fileType
      } = e.data;
      let originName = file.name;
      let laterName = md5 + originName.match(/.\w+$/)[0];
      let size = getSize(file.size); //查询是否已经有该文件

      let data = await postFileFirst(props.friend.userId, {
        originName,
        laterName,
        fileType,
        size
      });

      if (data.code == 1) {
        //已有该资源
        localVisible(data.msg, {
          fileType,
          originName,
          size
        });
      } else {
        //3.发送请求
        let form = new FormData();
        form.append('files', file, laterName);
        let obj = localVisible(window.URL.createObjectURL(file), {
          fileType,
          originName,
          size
        }, true);
        let config = {
          onUploadProgress: e => {
            let percentage = Math.floor(e.loaded / e.total * 100);
            obj.msgWrap.percentage = percentage;

            if (percentage == 100) {
              delete obj.msgWrap.percentage;
            }
          }
        }; //提交请求

        postMsgFile(props.friend.userId, form, {
          fileType,
          originName,
          size
        }, config).then(data => {
          obj.msgWrap.msg = data.msg;
          // store.commit('Refresh');
        }).catch(err => {
          obj.msgWrap.percentage = err.message;
          console.log(err);
        });
      }
    };

    return {
      imgFileDom,
      videoFileDom,
      normalFileDom,
      upload
    };
  }

};
</script>

<style>

</style>