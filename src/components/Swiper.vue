<template>
   <div class="swiper_wrap" :style="{width:urlsLength * getWidth+'px'}">
        <div class="swiper_item" v-for='url in urls' :style="{width:getWidth+'px'}">
            <img v-lazy="[url,'error']" class="img">
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { onMounted } from 'vue';
export default {
  props: ['urls', 'index'],
  emits: ['close'],

  setup(props, context) {
    let urlsLength = ref();
    let getWidth = ref();
    onMounted(() => {
      urlsLength.value = props.urls.length;
      getWidth.value = document.querySelector('.imgs_wrap').offsetWidth;
      let wrapX = props.index * -getWidth.value;
      let width = getWidth.value,
          pages = urlsLength.value;
      let wrapClose = false,
          itemClose = true,
          recalc = 0,
          stayOn;
      let scaleArr = new Array(pages).fill(1);
      let xArr = new Array(pages).fill(0);
      let yArr = new Array(pages).fill(0);
      let domArr;

      function initLongImg(index) {
        let el = domArr[index];

        if (el.height > window.innerHeight) {
          yArr[index] = (el.height - window.innerHeight) / 2;
          el.style.transform = `translate3d(0px,${yArr[index]}px,0px)`;
        }
      }

      function clearFun(index) {
        domArr[index].style.transform = '';
        scaleArr[index] = 1;
        xArr[index] = 0;
        yArr[index] = 0;
        initLongImg(index);
      }

      function setTransision(dom) {
        dom.style.transition = 'all ease 0.2s';
        setTimeout(() => {
          dom.style.transition = '';
        }, 200);
      }

      function angle(a) {
        if (a > -15 && a < 15) {
          return 1;
        } else if (a < -165) {
          return 1;
        } else if (a > 165) {
          return 1;
        } else {
          return 0;
        }
      }

      let w = document.querySelector('.swiper_wrap'); //初始化一下位置

      w.style.transform = `translate3d(${wrapX}px,0px,0px)`;
      let hamW = new Hammer(w);
      hamW.on('pan', function (ev) {
        // console.log(ev)
        if (wrapClose) return;
        if (angle(ev.angle) == 0 && ev.eventType !== 4) return;
        let x = wrapX + ev.deltaX - recalc;
        if (x > 0) return;
        if (x < -(pages - 1) * width) return;
        w.style.transform = `translate3d(${x}px,0px,0px)`;

        if (ev.eventType == 4) {
          // console.log('外层移动结束了',new Date())
          let clear = true;

          if (ev.overallVelocityX < -0.6 && wrapX - width >= -(pages - 1) * width) {
            wrapX -= width;
          } else if (ev.overallVelocityX > 0.6 && wrapX - width <= 0) {
            wrapX += width;
          } else {
            let changed = Math.floor((x + width / 2) / width) * width;

            if (changed !== wrapX) {
              wrapX = changed;
            } else if (recalc != 0) {
              wrapClose = true;
              itemClose = false;
              stayOn = true; //避免外层移动触发内层函数

              clear = false;
            }
          }

          recalc = 0;
          w.style.transition = 'all ease 0.2s';
          w.style.transform = `translate3d(${wrapX}px,0px,0px)`;
          setTimeout(() => {
            w.style.transition = '';

            if (clear == true) {
              let index = wrapX / -360;
              if (domArr[index - 1]) clearFun(index - 1);
              if (domArr[index + 1]) clearFun(index + 1);
            }
          }, 300);
        }
      });
      domArr = document.querySelectorAll('.img');
      domArr.forEach((el, domIndex) => {
        let hammertime = new Hammer(el);
        hammertime.get('pan').set({
          direction: Hammer.DIRECTION_ALL
        });
        hammertime.get('pinch').set({
          enable: true
        });
        let counter;
        initLongImg(domIndex);

        let panFun = function (ev) {
          clearInterval(counter);

          if (stayOn == true) {
            stayOn = false;
            return;
          }

          let actualHeight = el.height * scaleArr[domIndex];
          let y = yArr[domIndex];

          if (actualHeight > window.innerHeight) {
            y = ev.deltaY / scaleArr[domIndex] + yArr[domIndex];
            let limit = (scaleArr[domIndex] * el.height - window.innerHeight) / 2 / scaleArr[domIndex];

            if (y > limit) {
              y = yArr[domIndex] = limit;
            } else if (y < -limit) {
              y = yArr[domIndex] = -limit;
            } // if(ev.overallVelocityY < -0.6 || ev.overallVelocityY > 0.6 && el.height > window.innerHeight){
            //     // console.log('设置定时移动')
            //     // el.style.transition = 'all 2s ease'
            //     // yArr[domIndex] += ev.overallVelocityY * 1000
            //     // if(yArr[domIndex] <= -limit){
            //     //     yArr[domIndex] = -limit
            //     // }else if(yArr[domIndex] >= limit){
            //     //     yArr[domIndex] = limit
            //     // }
            //     // el.style.transform = `scale(${scaleArr[domIndex]}) translate3d(${xArr[domIndex]}px,${yArr[domIndex]}px,0px)`
            //     // setTimeout(()=>{
            //     //     el.style.transition = ''
            //     // },200)
            //     let init = ev.overallVelocityY * 10
            //     counter = setInterval(()=>{
            //         init *= 0.99
            //         yArr[domIndex] += init
            //         if(yArr[domIndex] <= -limit || yArr[domIndex] > limit){
            //             clearInterval(counter)
            //         }
            //         el.style.transform = `scale(${scaleArr[domIndex]}) translate3d(${xArr[domIndex]}px,${yArr[domIndex]}px,0px)`
            //     },10)
            // }

          }

          if (ev.eventType == 4) {
            yArr[domIndex] = y;
          }

          let x = xArr[domIndex]; //让y不受到限制，                 

          if (itemClose == false) {
            x = ev.deltaX / scaleArr[domIndex] + xArr[domIndex];
            let limit = (scaleArr[domIndex] - 1) * width / 2 / scaleArr[domIndex]; // console.log('y is',y)

            if (x > limit || x < -limit) {
              // console.log('碰到边了')
              wrapClose = false;
              itemClose = true;
              recalc = ev.deltaX;
              xArr[domIndex] = x = x > limit ? limit : -limit;
              return;
            }

            if (ev.eventType == 4) {
              xArr[domIndex] = x;
            }
          }

          el.style.transform = `scale(${scaleArr[domIndex]}) translate3d(${x}px,${y}px,0px)`;
        };

        hammertime.on('pan', panFun);
        let init;
        hammertime.on('pinch', function (ev) {
          let scale = ev.scale * scaleArr[domIndex];
          if (scale > 3) scale = 3;
          if (scale < 0.3) scale = 0.3; //回中

          if (ev.scale < 1 && scale > 1) {
            if (init == null) {
              init = {
                x: xArr[domIndex],
                y: yArr[domIndex],
                scale: scale
              };
            } else {
              xArr[domIndex] = init.x * (scale - 1) / (init.scale - 1);
              yArr[domIndex] = init.y * (scale - 1) / (init.scale - 1);
            } // xArr[domIndex] *= ev.scale 

          } else {
            init = null;
          }

          if (ev.eventType == 4) {
            if (scale < 1) {
              setTransision(el);
              scale = 1;
            }

            scaleArr[domIndex] = scale;
            hammertime.off('pan', panFun);
            setTimeout(() => {
              hammertime.on('pan', panFun);
            }, 200);

            if (scale > 1) {
              wrapClose = true;
              itemClose = false;
            }
          }

          el.style.transform = `scale(${scale}) translate3d(${xArr[domIndex]}px,${yArr[domIndex]}px,0px)`;
        }); //双击放大缩小

        let flag;
        let time = new Date().getTime();

        el.onclick = function () {
          //物理防抖
          let timelater = new Date().getTime();

          if (timelater - time < 40) {
            return;
          }

          time = timelater;

          if (flag) {
            clearTimeout(flag);
            flag = null;

            if (scaleArr[domIndex] < 2) {
              scaleArr[domIndex] = 2;
              itemClose = false;
              wrapClose = true;
              setTransision(el);
              el.style.transform = `scale(${scaleArr[domIndex]}) translate3d(${xArr[domIndex]}px,${yArr[domIndex]}px,0px)`;
            } else if (scaleArr[domIndex] >= 2) {
              scaleArr[domIndex] = 1;
              xArr[domIndex] = 0;
              yArr[domIndex] = 0;
              itemClose = true;
              wrapClose = false;
              setTransision(el);
              el.style.transform = `scale(${scaleArr[domIndex]}) translate3d(${xArr[domIndex]}px,${yArr[domIndex]}px,0px)`;
            }

            return;
          }

          flag = setTimeout(() => {
            context.emit('close');
          }, 220);
        };
      });
    });
    return {
      urlsLength,
      getWidth
    };
  }

};
</script>

<style lang='stylus'>
.swiper_wrap
    height: 100%;
    display: flex;
    position: absolute;
    .swiper_item
        display: flex;
        align-items: center;
        overflow: hidden;
        .img
            width: 100%
</style>