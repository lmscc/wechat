<template>
    <div class="pulldown">
        <div class="pulldown-bswrapper" ref="bsWrapper" @mousedown="cancelMove">
            <div class="pulldown-scroller" ref="scroller" :style="wrapStyle">
                <div class="pulldown-wrapper">
                    <div>
                        <span v-if="ifEnd">The end</span>
                    </div>
                    <!-- <div v-show="!beforePullDown">
                        <div v-show="isPullingDown">
                            <span>Loading...</span>
                        </div>
                        <div v-show="!isPullingDown">
                            <span>Refresh success</span>
                        </div>
                    </div> -->
                </div>

                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import {
    nextTick,
    onActivated,
    onMounted,
    onUpdated,
    reactive,
    ref,
} from "vue";
import store from "@/store";
import loadingGif from "@/assets/loading.gif";
import { keepBottom } from "@/js/utils";
const MAX_REST = 40;
export default {
    props: {
        onPullDown: Function,
        ifEnd: Boolean,
    },
    setup(props, { attrs }) {
        console.log(props, attrs);
        const bsWrapper = ref();
        const scroller = ref();
        let bottom = 0,
            max = 0,
            min;
        const wrapStyle = reactive({
            bottom: 0,
            // transition:`all 1s`
        });
        let ifPan = false;
        //重新计算高度
        const refreshDialogList = (store.state.refreshDialogList = () => {
            min = bsWrapper.value.clientHeight - scroller.value.scrollHeight;
            if (min > 0) {
                ifPan = false;
                wrapStyle.bottom = min + "px";
            } else {
                ifPan = true;
            }
            // console.log(min);
        });
        store.state.keepBottom = () => {
            nextTick(() => {
                wrapStyle.bottom = 0;
                bottom = 0;
            }, 0);
        };
        let moveToken;
        function move(velocityY) {
            if (Math.abs(velocityY) < 0.02) return;
            moveToken = requestAnimationFrame(() => {
                bottom = bottom - velocityY * 10;
                if (min - bottom > 0) {
                    bottom = min;
                    props.onPullDown();
                    // wrapStyle.bottom = bottom + "px";
                    return;
                } else if (bottom - max > 0) {
                    bottom = max;
                    // wrapStyle.bottom = bottom + "px";
                    return;
                }
                wrapStyle.bottom = bottom + "px";
                if (velocityY > 0) {
                    move(velocityY - 0.02);
                } else {
                    move(velocityY + 0.02);
                }
            });
        }
        function cacelMove() {
            cancelAnimationFrame(moveToken);
        }
        onActivated(() => {
            keepBottom();
        });
        onUpdated(() => {
            // console.log('更新了');
            refreshDialogList();
        });
        onMounted(() => {
            refreshDialogList();
            //  console.log(min);
            let hamW = new Hammer(bsWrapper.value);
            hamW.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });
            hamW.on("pan", function (ev) {
                if (!ifPan) return;
                cacelMove();
                let newBottom = bottom - ev.deltaY;
                // console.log(wrapStyle.bottom);
                if (ev.eventType == 4) {
                    if (newBottom < min) {
                        newBottom = min;
                        wrapStyle.transition = `all 0.3s ease`;
                        setTimeout(() => {
                            wrapStyle.transition = ``;
                        }, 300);
                        console.log("请求数据");
                        props.onPullDown();
                    } else if (newBottom > max) {
                        newBottom = max;
                        wrapStyle.transition = `all 0.3s ease`;
                        setTimeout(() => {
                            wrapStyle.transition = ``;
                        }, 300);
                    } else {
                        console.log("惯性滚动");
                        const { velocityY } = ev;
                        move(velocityY);
                    }
                    bottom = newBottom;
                    console.log("结束");
                }
                if (min - newBottom > MAX_REST) {
                    newBottom = min - MAX_REST;
                    props.onPullDown();
                } else if (newBottom - max > MAX_REST) {
                    newBottom = max + MAX_REST;
                }
                wrapStyle.bottom = newBottom + "px";
            });
            window.onresize = () => {
                refreshDialogList();
            };
        });

        return {
            bsWrapper,
            scroller,
            wrapStyle,

            cacelMove,
        };
    },
};
</script>

<style lang="stylus">
.pulldown {
    height: 100%;

    .pulldown-bswrapper {
        height: 100%;
        overflow: hidden;
        position: relative;

        .pulldown-scroller {
            width: 100%;
            position: absolute;
            transform: translateZ(1px);
        }
    }
}

.pulldown-wrapper {
    pointer-events: auto;
    position: absolute;
    width: 100%;
    text-align: center;
    top: -30px;
}
</style>